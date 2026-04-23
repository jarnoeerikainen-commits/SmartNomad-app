#!/usr/bin/env node
/**
 * SuperNomad demo seed
 * --------------------
 * Populates the dev/staging database with realistic demo personas
 * (Meghan, John, Akira, Priya) so a new engineer can `pnpm seed:demo`
 * and immediately see the full UX.
 *
 * Usage:
 *   pnpm seed:demo                  # idempotent: skips if data exists
 *   pnpm seed:demo --reset          # wipe demo personas first
 *   pnpm seed:demo --persona=meghan # only one persona
 *
 * Reads VITE_SUPABASE_URL + a SERVICE_ROLE key from .env.local.
 * Never commits the service-role key.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const env = parseEnvFile('.env.local') ?? parseEnvFile('.env') ?? {};
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (.env.local).');
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const RESET = args.has('--reset');
const ONLY  = [...args].find(a => a.startsWith('--persona='))?.split('=')[1];

const sb = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const PERSONAS = [
  {
    slug: 'meghan',
    email: 'meghan.demo@supernomad.app',
    first: 'Meghan', last: 'Sterling',
    deviceId: 'dev_demo_meghan',
    travel: ['PT', 'AE', 'SG', 'CH'],
    memories: [
      ['Prefers Le Labo Santal 33 in hotel rooms', 'preferences', 0.92, 8],
      ['Allergic to shellfish', 'medical', 0.99, 10],
      ['Holds Portuguese D7 visa, expires 2027-06-12', 'compliance', 0.97, 9],
      ['Loyalty: SkyTeam Elite Plus, Marriott Ambassador', 'loyalty', 0.95, 7],
    ],
  },
  {
    slug: 'john',
    email: 'john.demo@supernomad.app',
    first: 'John', last: 'Whitfield',
    deviceId: 'dev_demo_john',
    travel: ['US', 'JP', 'KR', 'AU'],
    memories: [
      ['CTO of fintech startup, raises Series B Q4', 'work', 0.93, 8],
      ['Vegan, gluten-free', 'preferences', 0.99, 9],
      ['UAE Golden Visa applicant', 'compliance', 0.88, 8],
    ],
  },
  {
    slug: 'akira',
    email: 'akira.demo@supernomad.app',
    first: 'Akira', last: 'Tanaka',
    deviceId: 'dev_demo_akira',
    travel: ['JP', 'TW', 'TH', 'VN'],
    memories: [
      ['Speaks Japanese, English, basic Mandarin', 'preferences', 0.95, 6],
      ['Photography hobby — prefers boutique hotels with rooftop access', 'preferences', 0.85, 6],
    ],
  },
  {
    slug: 'priya',
    email: 'priya.demo@supernomad.app',
    first: 'Priya', last: 'Iyer',
    deviceId: 'dev_demo_priya',
    travel: ['IN', 'AE', 'GB', 'DE'],
    memories: [
      ['UK Skilled Worker visa, sponsor change pending', 'compliance', 0.91, 9],
      ['Prefers female drivers when possible', 'preferences', 0.98, 9],
    ],
  },
];

const targetPersonas = ONLY ? PERSONAS.filter(p => p.slug === ONLY) : PERSONAS;
if (!targetPersonas.length) { console.error(`Unknown persona "${ONLY}".`); process.exit(1); }

(async () => {
  if (RESET) {
    console.log('🧹  Removing existing demo personas …');
    for (const p of targetPersonas) {
      await sb.from('ai_memories').delete().eq('device_id', p.deviceId);
      await sb.from('travel_history').delete().eq('device_id', p.deviceId);
      await sb.from('device_sessions').delete().eq('device_id', p.deviceId);
    }
  }

  for (const p of targetPersonas) {
    console.log(`\n👤  ${p.first} ${p.last}`);
    await ensureDevice(p);
    await ensureTravel(p);
    await ensureMemories(p);
  }

  console.log('\n✅  Demo seed complete.');
})().catch(err => { console.error(err); process.exit(1); });

async function ensureDevice(p) {
  const { error } = await sb.from('device_sessions').upsert({
    device_id: p.deviceId,
    metadata: { persona: p.slug, seed: true, name: `${p.first} ${p.last}` },
    last_seen_at: new Date().toISOString(),
  }, { onConflict: 'device_id' });
  if (error) throw error;
  console.log('   • device session ready');
}

async function ensureTravel(p) {
  const today = new Date();
  const rows = p.travel.map((cc, i) => ({
    device_id: p.deviceId,
    country_code: cc,
    entry_date: new Date(today.getTime() - (i + 1) * 30 * 86400000).toISOString().slice(0, 10),
    exit_date: new Date(today.getTime() - i * 30 * 86400000).toISOString().slice(0, 10),
    metadata: { source: 'seed' },
  }));
  const { error } = await sb.from('travel_history').upsert(rows, { onConflict: 'device_id,country_code,entry_date' });
  if (error) console.warn('   ! travel skipped:', error.message);
  else console.log(`   • ${rows.length} travel records`);
}

async function ensureMemories(p) {
  const rows = p.memories.map(([fact, category, confidence, importance]) => ({
    device_id: p.deviceId,
    fact, category, confidence, importance,
    semantic_tags: [category, p.slug],
    durability: 'durable',
  }));
  const { error } = await sb.from('ai_memories').insert(rows);
  if (error && !/duplicate/i.test(error.message)) console.warn('   ! memories skipped:', error.message);
  else console.log(`   • ${rows.length} memories`);
}

function parseEnvFile(rel) {
  try {
    const text = readFileSync(resolve(process.cwd(), rel), 'utf8');
    const out = {};
    for (const line of text.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m) out[m[1]] = m[2].replace(/^"|"$/g, '');
    }
    return out;
  } catch { return null; }
}
