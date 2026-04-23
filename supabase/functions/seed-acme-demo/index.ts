// Re-runnable Acme Global Inc. demo seed.
// Inserts 35 employees, ~106 trips, and ~355 expenses.
// Idempotent (uses deterministic UUIDs + ON CONFLICT DO NOTHING).
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ORG_ID = 'c62a78d0-d655-4f15-96a8-47b32adae8c8';

// SHA-1 deterministic UUID v5-ish (web-crypto)
async function uuidFrom(seed: string): Promise<string> {
  const data = new TextEncoder().encode('acme:' + seed);
  const buf = new Uint8Array(await crypto.subtle.digest('SHA-1', data));
  const h = Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    '5' + h.slice(13, 16),
    ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + h.slice(18, 20),
    h.slice(20, 32),
  ].join('-');
}
async function md5Float(seed: string): Promise<number> {
  // crypto.subtle has no md5; fake with sha256 first 4 bytes
  const buf = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(seed)));
  return ((buf[0] << 24 >>> 0) + (buf[1] << 16) + (buf[2] << 8) + buf[3]) / 0xffffffff;
}
async function intBetween(lo: number, hi: number, seed: string) {
  return Math.floor((await md5Float(seed)) * (hi - lo + 1)) + lo;
}
async function pick<T>(arr: T[], seed: string): Promise<T> {
  return arr[Math.floor((await md5Float(seed)) * arr.length)];
}
function dateAdd(d: Date | string, days: number) {
  const x = new Date(d); x.setUTCDate(x.getUTCDate() + days);
  return x.toISOString().slice(0, 10);
}

const PEOPLE: Array<[string, string, string, string, string]> = [
  ['Sarah','Chen','Senior Partner','Strategy & Operations','SF'],
  ['Marcus','Johnson','Managing Partner','Executive','NYC'],
  ['Priya','Patel','Principal Consultant','Digital Transformation','LON'],
  ['James',"O'Brien",'Engagement Manager','Financial Services','LON'],
  ['Yuki','Tanaka','Senior Manager','APAC Strategy','TYO'],
  ['Sofia','Rodriguez','Partner','LATAM Practice','MEX'],
  ['David','Kim','Principal','Technology Advisory','SEA'],
  ['Amelia','Watson','Manager','Healthcare Practice','BOS'],
  ['Rajesh','Sharma','Senior Manager','Operations Excellence','BLR'],
  ['Charlotte','Lefevre','Principal','M&A Advisory','PAR'],
  ['Mohammed','Al-Rashid','Senior Partner','MENA Practice','DXB'],
  ['Linnea','Bergstrom','Manager','Sustainability','STO'],
  ['Carlos','Mendes','Senior Consultant','Energy Sector','SAO'],
  ['Elena','Volkov','Principal','Industrial Practice','BER'],
  ['Tobias','Müller','Engagement Manager','Automotive','MUC'],
  ['Aisha','Nkomo','Senior Consultant','African Markets','JNB'],
  ['Henry','Whitfield','Partner','Public Sector','WAS'],
  ['Mei-Lin','Wong','Manager','Consumer Goods','HKG'],
  ['Thomas','Andersen','Senior Manager','Logistics','CPH'],
  ['Beatrice','Romano','Principal','Luxury & Retail','MIL'],
  ['Daniel','Goldstein','Manager','Private Equity','NYC'],
  ['Hiroshi','Sato','Senior Consultant','Manufacturing','OSA'],
  ['Olivia','Bennett','Engagement Manager','TMT','LON'],
  ['Pablo','Garcia','Senior Manager','Banking','MAD'],
  ['Ingrid','Hansen','Manager','Insurance','OSL'],
  ['Wei','Zhang','Principal','China Practice','SHA'],
  ['Natasha','Ivanova','Senior Consultant','Pharma','ZUR'],
  ['Lucas','Dubois','Manager','Aerospace','TLS'],
  ['Aaliyah','Robinson','Engagement Manager','Education','CHI'],
  ['Felix','Schneider','Senior Consultant','Cybersecurity','BER'],
  ['Sanjay','Iyer','Manager','Tech Strategy','SIN'],
  ['Camila','Silva','Senior Consultant','Media','RIO'],
  ['Jasper','Williams','Partner','Energy & Utilities','HOU'],
  ['Zara','Khan','Manager','Real Estate','DXB'],
  ['Kenji','Nakamura','Principal','Robotics & AI','TYO'],
];

const ROUTES = [
  { city: 'London',     country: 'GB', flight: [950, 4200],  hotel: [320, 620],  carDay: [85, 160], taxiPerDay: [40, 90],  mealsPerDay: [110, 220] },
  { city: 'Singapore',  country: 'SG', flight: [2400, 7800], hotel: [280, 540],  carDay: [70, 140], taxiPerDay: [25, 60],  mealsPerDay: [90, 180] },
  { city: 'Tokyo',      country: 'JP', flight: [2100, 6900], hotel: [310, 580],  carDay: [120, 220],taxiPerDay: [45, 110], mealsPerDay: [110, 240] },
  { city: 'Dubai',      country: 'AE', flight: [1500, 5400], hotel: [380, 780],  carDay: [95, 180], taxiPerDay: [30, 70],  mealsPerDay: [120, 260] },
  { city: 'Frankfurt',  country: 'DE', flight: [890, 3800],  hotel: [240, 460],  carDay: [85, 150], taxiPerDay: [35, 80],  mealsPerDay: [95, 190] },
  { city: 'Paris',      country: 'FR', flight: [820, 3700],  hotel: [310, 620],  carDay: [90, 170], taxiPerDay: [40, 95],  mealsPerDay: [120, 240] },
  { city: 'New York',   country: 'US', flight: [380, 2900],  hotel: [340, 720],  carDay: [110, 220],taxiPerDay: [55, 130], mealsPerDay: [110, 230] },
  { city: 'San Francisco', country: 'US', flight: [320, 2400], hotel: [330, 690], carDay: [110, 210], taxiPerDay: [50, 120], mealsPerDay: [110, 230] },
  { city: 'São Paulo',  country: 'BR', flight: [1100, 4800], hotel: [180, 420],  carDay: [75, 150], taxiPerDay: [30, 70],  mealsPerDay: [70, 160] },
  { city: 'Mumbai',     country: 'IN', flight: [1400, 5200], hotel: [180, 380],  carDay: [55, 120], taxiPerDay: [20, 55],  mealsPerDay: [60, 140] },
  { city: 'Sydney',     country: 'AU', flight: [2900, 8400], hotel: [260, 520],  carDay: [95, 180], taxiPerDay: [40, 95],  mealsPerDay: [100, 200] },
  { city: 'Hong Kong',  country: 'HK', flight: [2000, 6700], hotel: [290, 560],  carDay: [85, 170], taxiPerDay: [30, 75],  mealsPerDay: [100, 220] },
  { city: 'Zurich',     country: 'CH', flight: [780, 3400],  hotel: [380, 740],  carDay: [110, 200],taxiPerDay: [55, 120], mealsPerDay: [140, 280] },
  { city: 'Riyadh',     country: 'SA', flight: [1700, 5800], hotel: [260, 540],  carDay: [80, 160], taxiPerDay: [25, 65],  mealsPerDay: [90, 200] },
  { city: 'Toronto',    country: 'CA', flight: [420, 2700],  hotel: [240, 480],  carDay: [85, 170], taxiPerDay: [40, 95],  mealsPerDay: [90, 190] },
  { city: 'Berlin',     country: 'DE', flight: [780, 3500],  hotel: [220, 440],  carDay: [80, 150], taxiPerDay: [35, 80],  mealsPerDay: [90, 180] },
  { city: 'Mexico City',country: 'MX', flight: [780, 3400],  hotel: [180, 380],  carDay: [70, 140], taxiPerDay: [25, 60],  mealsPerDay: [70, 160] },
  { city: 'Seoul',      country: 'KR', flight: [2300, 7400], hotel: [240, 480],  carDay: [85, 160], taxiPerDay: [30, 75],  mealsPerDay: [90, 190] },
];
const ORIGINS  = ['New York','London','Singapore','San Francisco','Frankfurt','Tokyo','Dubai','Paris'];
const PURPOSES = ['Client engagement kickoff','Strategy workshop','Steering committee meeting','Diligence interviews','Operating model review','Executive offsite','Industry conference','Partner retreat','On-site assessment','Pitch presentation','Final report delivery','Post-merger integration sprint','Vendor evaluation','Capability deep-dive','Quarterly business review'];
const VENDORS = {
  flight: ['British Airways','Lufthansa','Singapore Airlines','Emirates','United','Delta','Air France','ANA','Cathay Pacific','Qatar Airways'],
  hotel:  ['Marriott','Hyatt Regency','Four Seasons','The Peninsula','Mandarin Oriental','Hilton','Park Hyatt','InterContinental','The Ritz-Carlton','Conrad'],
  car_rental: ['Hertz','Avis','Sixt','Enterprise','Europcar'],
  taxi:   ['Uber','Lyft','Bolt','Grab','City Taxi','Black Cab'],
  meals:  ['Nobu','Le Bernardin','Sushi Saito','The Ledbury','Le Cinq','Gaggan','Daniel','Ristorante Cracco','Hawksworth',"Tetsuya's"],
  entertainment: ['Royal Opera House','MoMA','Lincoln Center','Suntory Hall','Cirque du Soleil'],
} as Record<string, string[]>;

function roleFor(title: string): 'owner' | 'admin' | 'manager' | 'employee' {
  if (/Managing Partner|Executive/.test(title)) return 'owner';
  if (/Partner/.test(title)) return 'admin';
  if (/Principal|Senior Manager|Engagement Manager|Manager/.test(title)) return 'manager';
  return 'employee';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

  try {
    const sb = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false } },
    );

    const today = new Date('2026-04-23T00:00:00Z');

    const members: any[] = [];
    const trips: any[]   = [];
    const expenses: any[] = [];

    for (let idx = 0; idx < PEOPLE.length; idx++) {
      const p = PEOPLE[idx];
      const userId   = await uuidFrom('user:' + idx);
      const memberId = await uuidFrom('mem:'  + idx);
      members.push({
        id: memberId, organization_id: ORG_ID, user_id: userId,
        role: roleFor(p[2]),
        department: p[3], job_title: p[2], employee_id: 'ACM-' + (1001 + idx),
        cost_center: 'CC-' + ['EMEA','APAC','AMER','MENA','LATAM'][idx % 5],
        is_active: true,
        metadata: { home_office: p[4], first_name: p[0], last_name: p[1], demo: true },
      });

      const tripsCount = await intBetween(2, 4, 'tc:' + idx);
      for (let t = 0; t < tripsCount; t++) {
        const tripSeed = `trip:${idx}:${t}`;
        const route   = await pick(ROUTES, tripSeed + ':route');
        const origin  = await pick(ORIGINS, tripSeed + ':origin');
        const purpose = await pick(PURPOSES, tripSeed + ':purpose');
        const offset  = await intBetween(-220, 110, tripSeed + ':offset');
        const start   = dateAdd(today, offset);
        const len     = await intBetween(2, 6, tripSeed + ':len');
        const end     = dateAdd(start, len);

        let status: string;
        if (offset < -10) status = 'completed';
        else if (offset < 0) status = 'booked';
        else if (offset < 30) status = await pick(['approved','submitted','booked'], tripSeed + ':st');
        else status = await pick(['draft','submitted'], tripSeed + ':stf');

        const flight = await intBetween(route.flight[0], route.flight[1], tripSeed + ':fl');
        const hotelN = await intBetween(route.hotel[0], route.hotel[1], tripSeed + ':ht');
        const carN   = await intBetween(route.carDay[0], route.carDay[1], tripSeed + ':cr');
        const taxiN  = await intBetween(route.taxiPerDay[0], route.taxiPerDay[1], tripSeed + ':tx');
        const mealN  = await intBetween(route.mealsPerDay[0], route.mealsPerDay[1], tripSeed + ':ml');
        const ent    = (await md5Float(tripSeed+':ent')) > 0.6 ? await intBetween(120, 480, tripSeed+':entv') : 0;

        const hotelTotal = hotelN * len;
        const carTotal   = carN * Math.max(1, len-1);
        const taxiTotal  = taxiN * len;
        const mealsTotal = mealN * len;
        const total      = flight + hotelTotal + carTotal + taxiTotal + mealsTotal + ent;
        const actual     = (status === 'completed' || status === 'booked') ? total : 0;
        const estimated  = Math.round(total * (1 + ((await md5Float(tripSeed+':est')) * 0.15 - 0.05)));

        const tripId = await uuidFrom('trip:' + idx + ':' + t);
        trips.push({
          id: tripId, organization_id: ORG_ID, member_id: memberId, user_id: userId,
          trip_code: 'TR-' + (10000 + idx*10 + t),
          purpose, destination_city: route.city, destination_country: route.country,
          origin_city: origin, start_date: start, end_date: end,
          estimated_cost: estimated, actual_cost: actual, currency: 'USD', status,
        });

        if (status !== 'completed') continue;
        const items: Array<[string, number, string, string, string]> = [
          ['flight',     flight,     await pick(VENDORS.flight, tripSeed+':fv'), `Round-trip economy ${origin}↔${route.city}`, dateAdd(start, -3)],
          ['hotel',      hotelTotal, await pick(VENDORS.hotel, tripSeed+':hv'),  `${len} nights · ${route.city}`, end],
          ['car_rental', carTotal,   await pick(VENDORS.car_rental, tripSeed+':cv'), `Compact car · ${len-1} days`, end],
          ['taxi',       taxiTotal,  await pick(VENDORS.taxi, tripSeed+':tv'),   'Airport transfers & local rides', end],
          ['meals',      mealsTotal, await pick(VENDORS.meals, tripSeed+':mv'),  'Client dinners & per-diem meals', dateAdd(start, Math.floor(len/2))],
        ];
        if (ent > 0) items.push(['entertainment', ent, await pick(VENDORS.entertainment, tripSeed+':ev'), 'Client hospitality event', dateAdd(start, Math.floor(len/2))]);

        for (let i = 0; i < items.length; i++) {
          const [cat, amt, vendor, desc, date] = items[i];
          expenses.push({
            id: await uuidFrom('exp:' + idx + ':' + t + ':' + i),
            organization_id: ORG_ID, trip_id: tripId, user_id: userId,
            category: cat, amount: amt, amount_base: amt, currency: 'USD',
            vendor, description: desc, expense_date: date,
            payment_method: 'corporate_card', is_billable: true, is_reimbursable: false,
          });
        }
      }
    }

    const { error: e1 } = await sb.from('organization_members').upsert(members, { onConflict: 'organization_id,user_id' });
    if (e1) throw new Error('members: ' + e1.message);

    // Insert in chunks to stay under PostgREST limits
    async function chunkInsert(table: string, rows: any[], chunkSize = 100) {
      for (let i = 0; i < rows.length; i += chunkSize) {
        const slice = rows.slice(i, i + chunkSize);
        const { error } = await sb.from(table).upsert(slice, { onConflict: 'id' });
        if (error) throw new Error(`${table}[${i}]: ${error.message}`);
      }
    }
    await chunkInsert('business_trips', trips);
    await chunkInsert('business_trip_expenses', expenses);

    return new Response(JSON.stringify({
      ok: true,
      members: members.length,
      trips: trips.length,
      expenses: expenses.length,
    }), { headers: { ...cors, 'content-type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String((err as Error).message ?? err) }), {
      status: 500,
      headers: { ...cors, 'content-type': 'application/json' },
    });
  }
});
