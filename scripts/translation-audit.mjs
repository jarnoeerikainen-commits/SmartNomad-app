#!/usr/bin/env node
/**
 * Translation Audit & Auto-Fill Tool
 *
 * Reads src/contexts/LanguageContext.tsx, audits per-language completeness,
 * and (with --fill) calls the Lovable AI Gateway to translate missing keys.
 *
 * Usage:
 *   node scripts/translation-audit.mjs              # report only
 *   node scripts/translation-audit.mjs --fill       # translate missing keys
 *   node scripts/translation-audit.mjs --fill --lang fr,de,es
 *
 * Requires LOVABLE_API_KEY in env when --fill is used.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LANG_FILE = path.join(ROOT, 'src/contexts/LanguageContext.tsx');
const REPORT_DIR = path.join(ROOT, 'translation-reports');

const args = process.argv.slice(2);
const FILL = args.includes('--fill');
const LANG_FILTER = (() => {
  const idx = args.indexOf('--lang');
  if (idx === -1) return null;
  return args[idx + 1].split(',').map(s => s.trim());
})();
const DRY_RUN = args.includes('--dry-run');

const LANG_NAMES = {
  en: 'English', es: 'Spanish', pt: 'Portuguese', zh: 'Chinese (Simplified)',
  fr: 'French', de: 'German', ar: 'Arabic', ja: 'Japanese',
  it: 'Italian', ko: 'Korean', hi: 'Hindi', ru: 'Russian', tr: 'Turkish',
};

// ─── Parse the translations object from LanguageContext.tsx ───
function parseTranslations(source) {
  // Find: const translations: Record<...> = { ... };
  const startMatch = source.match(/const\s+translations\s*:[^=]*=\s*\{/);
  if (!startMatch) throw new Error('Could not locate translations object');
  const startIdx = startMatch.index + startMatch[0].length - 1; // at the opening {

  // Find matching closing brace
  let depth = 0, i = startIdx, inStr = false, strCh = '';
  for (; i < source.length; i++) {
    const c = source[i], prev = source[i - 1];
    if (inStr) {
      if (c === strCh && prev !== '\\') inStr = false;
      continue;
    }
    if (c === "'" || c === '"' || c === '`') { inStr = true; strCh = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  const body = source.slice(startIdx, i);

  // Now extract per-language sub-objects:  en: { ... },  es: { ... },
  const result = {};
  const langRe = /(\b[a-z]{2}\b)\s*:\s*\{/g;
  let m;
  while ((m = langRe.exec(body))) {
    const code = m[1];
    let d = 0, j = m.index + m[0].length - 1, s = false, sc = '';
    for (; j < body.length; j++) {
      const c = body[j], p = body[j - 1];
      if (s) { if (c === sc && p !== '\\') s = false; continue; }
      if (c === "'" || c === '"' || c === '`') { s = true; sc = c; continue; }
      if (c === '{') d++;
      else if (c === '}') { d--; if (d === 0) { j++; break; } }
    }
    const langBody = body.slice(m.index + m[0].length, j - 1);
    result[code] = parseKeys(langBody);
  }
  return result;
}

function parseKeys(body) {
  const out = {};
  // 'key': 'value',   or   "key": "value",
  // value may contain escaped quotes
  const re = /['"]([\w.\-:]+)['"]\s*:\s*(['"`])((?:\\.|(?!\2).)*)\2\s*,?/g;
  let m;
  while ((m = re.exec(body))) {
    const key = m[1];
    let val = m[3]
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\');
    out[key] = val;
  }
  return out;
}

// ─── Audit ───
function audit(translations) {
  const enKeys = Object.keys(translations.en || {});
  const enSet = new Set(enKeys);
  const report = { sourceKeys: enKeys.length, languages: [] };

  for (const code of Object.keys(translations)) {
    if (code === 'en') continue;
    const tKeys = Object.keys(translations[code] || {});
    const tSet = new Set(tKeys);
    const missing = enKeys.filter(k => !tSet.has(k));
    const extras = tKeys.filter(k => !enSet.has(k));
    report.languages.push({
      code,
      name: LANG_NAMES[code] || code,
      total: enKeys.length,
      translated: enKeys.length - missing.length,
      completion: Math.round(((enKeys.length - missing.length) / enKeys.length) * 100),
      missing,
      extras,
    });
  }
  return report;
}

// ─── AI Translation ───
async function translateBatch(targetCode, targetName, items) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error('LOVABLE_API_KEY not set');

  const system = `You are a professional UI/UX translator for SuperNomad — a premium global living app for high-net-worth digital nomads.
Translate the provided English UI strings to ${targetName}.
Rules:
- Preserve placeholders like {name}, {count}, %s exactly as-is.
- Keep brand names ("SuperNomad", "Snomad", product names) untranslated.
- Match tone: premium, clear, concise, modern.
- For ${targetName}: use natural everyday phrasing a native speaker would use, not literal word-for-word.
- Return ONLY the JSON object via the tool call. No extra text.`;

  const tool = {
    type: 'function',
    function: {
      name: 'submit_translations',
      description: `Submit ${targetName} translations`,
      parameters: {
        type: 'object',
        properties: {
          translations: {
            type: 'object',
            description: 'Map of key → translated value',
            additionalProperties: { type: 'string' },
          },
        },
        required: ['translations'],
        additionalProperties: false,
      },
    },
  };

  const userPayload = items.map(([k, v]) => `${k} :: ${v}`).join('\n');

  const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: `Translate to ${targetName} (return as JSON map of key → translation):\n\n${userPayload}` },
      ],
      tools: [tool],
      tool_choice: { type: 'function', function: { name: 'submit_translations' } },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Gateway ${resp.status}: ${text.slice(0, 300)}`);
  }
  const data = await resp.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call) throw new Error('No tool call in response: ' + JSON.stringify(data).slice(0, 300));
  const parsed = JSON.parse(call.function.arguments);
  return parsed.translations || {};
}

async function fillMissing(translations, report) {
  const filled = {};
  const BATCH = 40;
  const langs = report.languages.filter(l =>
    l.missing.length > 0 && (!LANG_FILTER || LANG_FILTER.includes(l.code))
  );

  for (const lang of langs) {
    console.log(`\n🌐 ${lang.name} (${lang.code}) — ${lang.missing.length} missing`);
    const items = lang.missing.map(k => [k, translations.en[k]]);
    filled[lang.code] = {};
    for (let i = 0; i < items.length; i += BATCH) {
      const batch = items.slice(i, i + BATCH);
      process.stdout.write(`   Batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(items.length / BATCH)}...`);
      try {
        const out = await translateBatch(lang.code, lang.name, batch);
        Object.assign(filled[lang.code], out);
        console.log(` ✓ ${Object.keys(out).length} keys`);
        await new Promise(r => setTimeout(r, 800)); // rate-limit friendly
      } catch (e) {
        console.log(` ✗ ${e.message}`);
      }
    }
  }
  return filled;
}

// ─── Splice translated keys back into LanguageContext.tsx ───
function injectTranslations(source, filledByLang) {
  let out = source;
  for (const [code, kv] of Object.entries(filledByLang)) {
    if (!Object.keys(kv).length) continue;
    // Locate `  <code>: {` block start
    const re = new RegExp(`(\\b${code}\\s*:\\s*\\{)`);
    const m = out.match(re);
    if (!m) { console.warn(`! could not find block for ${code}`); continue; }
    const startIdx = m.index + m[0].length;
    // Walk to matching brace
    let depth = 1, i = startIdx, s = false, sc = '';
    for (; i < out.length; i++) {
      const c = out[i], p = out[i - 1];
      if (s) { if (c === sc && p !== '\\') s = false; continue; }
      if (c === "'" || c === '"' || c === '`') { s = true; sc = c; continue; }
      if (c === '{') depth++;
      else if (c === '}') { depth--; if (depth === 0) break; }
    }
    // Insert before closing brace
    const lines = Object.entries(kv).map(([k, v]) => {
      const esc = v.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
      return `    '${k}': '${esc}',`;
    }).join('\n');
    const insertion = `\n    // ─── auto-translated ${new Date().toISOString().slice(0, 10)} ───\n${lines}\n  `;
    out = out.slice(0, i) + insertion + out.slice(i);
  }
  return out;
}

// ─── Main ───
async function main() {
  console.log('📖 Reading LanguageContext.tsx...');
  const source = fs.readFileSync(LANG_FILE, 'utf8');
  const translations = parseTranslations(source);
  console.log(`   Found languages: ${Object.keys(translations).join(', ')}`);
  console.log(`   English keys: ${Object.keys(translations.en).length}`);

  const report = audit(translations);

  console.log('\n📊 COMPLETENESS REPORT');
  console.log('─'.repeat(60));
  console.log('Lang  Name              Translated   %    Missing  Extras');
  console.log('─'.repeat(60));
  for (const l of report.languages) {
    const bar = `${l.translated}/${l.total}`.padEnd(12);
    const pct = `${l.completion}%`.padStart(4);
    console.log(`${l.code.padEnd(5)} ${l.name.padEnd(17)} ${bar} ${pct}   ${String(l.missing.length).padStart(5)}    ${String(l.extras.length).padStart(5)}`);
  }
  console.log('─'.repeat(60));

  // Write report
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const reportPath = path.join(REPORT_DIR, `audit-${new Date().toISOString().slice(0, 10)}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📝 Detailed report → ${path.relative(ROOT, reportPath)}`);

  if (!FILL) {
    console.log('\nℹ️  Run with --fill to auto-translate missing keys via Lovable AI.');
    return;
  }

  console.log('\n🤖 Auto-filling missing translations via Lovable AI Gateway...');
  const filled = await fillMissing(translations, report);

  const totalFilled = Object.values(filled).reduce((sum, kv) => sum + Object.keys(kv).length, 0);
  console.log(`\n✅ Translated ${totalFilled} keys across ${Object.keys(filled).length} languages.`);

  if (DRY_RUN) {
    const dryPath = path.join(REPORT_DIR, `filled-${Date.now()}.json`);
    fs.writeFileSync(dryPath, JSON.stringify(filled, null, 2));
    console.log(`💾 Dry-run output → ${path.relative(ROOT, dryPath)}`);
    return;
  }

  console.log('\n💉 Injecting into LanguageContext.tsx...');
  const updated = injectTranslations(source, filled);
  fs.writeFileSync(LANG_FILE, updated);
  console.log(`✅ Updated ${path.relative(ROOT, LANG_FILE)}`);
  console.log('\n🎉 Done. Review the diff and run the app.');
}

main().catch(e => {
  console.error('💥', e.message);
  process.exit(1);
});
