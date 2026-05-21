// ═══════════════════════════════════════════════════════════════
// tax-law-refresh — pings every official source URL listed in the
// tax residency registry and reports staleness / 4xx / 5xx so the
// app can warn the user before relying on a rule.
//
// Schedule via pg_cron once a day. No DB writes — pure verification.
// ═══════════════════════════════════════════════════════════════

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Inline mirror of taxResidencyRules.ts source URLs.
// Keep in sync (covered by a CI lint in tests/governance-check).
const SOURCES: Array<{ country: string; url: string; lastVerified: string }> = [
  { country: 'US', url: 'https://www.irs.gov/individuals/international-taxpayers/substantial-presence-test', lastVerified: '2026-05-15' },
  { country: 'UK', url: 'https://www.gov.uk/hmrc-internal-manuals/residence-domicile-and-remittance-basis/rdrm11000', lastVerified: '2026-05-15' },
  { country: 'DE', url: 'https://www.gesetze-im-internet.de/ao_1977/__9.html', lastVerified: '2026-05-15' },
  { country: 'FR', url: 'https://bofip.impots.gouv.fr/bofip/2008-PGP.html/identifiant=BOI-IR-CHAMP-10', lastVerified: '2026-05-15' },
  { country: 'ES', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764', lastVerified: '2026-05-15' },
  { country: 'PT', url: 'https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs16.aspx', lastVerified: '2026-05-15' },
  { country: 'CA', url: 'https://www.canada.ca/en/revenue-agency/services/tax/technical-information/income-tax/income-tax-folios-index/series-5-international-residency/folio-1-residency/income-tax-folio-s5-f1-c1-determining-individual-s-residence-status.html', lastVerified: '2026-05-15' },
  { country: 'AU', url: 'https://www.ato.gov.au/individuals-and-families/coming-to-australia-or-going-overseas/work-out-your-tax-residency', lastVerified: '2026-05-15' },
  { country: 'SG', url: 'https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/working-out-your-tax-residency', lastVerified: '2026-05-15' },
  { country: 'AE', url: 'https://mof.gov.ae/wp-content/uploads/2022/09/Cabinet-Decision-No.-85-of-2022.pdf', lastVerified: '2026-05-15' },
  { country: 'CH', url: 'https://www.fedlex.admin.ch/eli/cc/1991/1184_1184_1184/de#art_3', lastVerified: '2026-05-15' },
  { country: 'NL', url: 'https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/internationaal/woonplaats/', lastVerified: '2026-05-15' },
  { country: 'IE', url: 'https://www.revenue.ie/en/jobs-and-pensions/tax-residence/index.aspx', lastVerified: '2026-05-15' },
  { country: 'IT', url: 'https://www.agenziaentrate.gov.it/portale/web/guest/schede/agevolazioni/residenza-fiscale', lastVerified: '2026-05-15' },
  { country: 'SCHENGEN', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016R0399', lastVerified: '2026-05-15' },
];

const STALE_DAYS = 180;

async function probe(url: string) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    // HEAD first (light); some gov portals reject HEAD → fallback GET
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal });
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal });
    }
    clearTimeout(timer);
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: (e as Error).message };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const results = await Promise.all(
    SOURCES.map(async (s) => {
      const probeResult = await probe(s.url);
      const ageDays = Math.floor((Date.now() - new Date(s.lastVerified).getTime()) / 86_400_000);
      return {
        country: s.country,
        url: s.url,
        reachable: probeResult.ok,
        httpStatus: probeResult.status,
        ageDays,
        stale: ageDays > STALE_DAYS,
        error: (probeResult as { error?: string }).error,
      };
    }),
  );

  const summary = {
    checkedAt: new Date().toISOString(),
    total: results.length,
    unreachable: results.filter((r) => !r.reachable).length,
    stale: results.filter((r) => r.stale).length,
    results,
  };

  return new Response(JSON.stringify(summary, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
});
