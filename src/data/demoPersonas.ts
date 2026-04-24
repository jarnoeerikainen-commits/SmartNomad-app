// Demo Persona Data — Meghan (Business Woman) & John (Expat Man)

export interface DemoCalendarEvent {
  date: string; // ISO date
  time: string;
  title: string;
  type: 'meeting' | 'sport' | 'travel' | 'personal' | 'family' | 'legal' | 'wellness' | 'social' | 'holiday' | 'birthday' | 'gala' | 'dining';
  location?: string;
}

export interface FavouriteSeat {
  airline: string;
  aircraft: string;
  seatNumber: string;
  class: string;
  notes: string;
}

export interface FavouriteRestaurant {
  name: string;
  city: string;
  cuisine: string;
  michelinStars?: number;
  occasion: string;
}

export interface AnnualEvent {
  name: string;
  date: string;
  type: 'birthday' | 'holiday' | 'gala' | 'anniversary' | 'tradition';
  notes: string;
}

export interface RewardStrategy {
  goal: string;
  programsInvolved: string[];
  pointsNeeded: number;
  currentProgress: number;
  notes: string;
}

export interface DemoPersona {
  id: 'meghan' | 'john';
  label: string;
  buttonLabel: string;
  icon: string; // emoji
  profile: {
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    nationality: string;
    occupation: string;
    company: string;
    industry: string;
    incomeBracket: string;
    bio: string;
    birthday: string;
  };
  travel: {
    style: string;
    flightClass: string;
    averageTravelDays: number;
    frequentDestinations: string[];
    vacationDestinations: string[];
    upcomingTrips: { destination: string; dates: string; purpose: string }[];
  };
  aviation: {
    favouriteAirlines: { name: string; reason: string; alliance: string }[];
    favouriteSeats: FavouriteSeat[];
    loungePreferences: string[];
    alwaysBooks: string; // e.g. "window", "aisle"
    mealPreference: string;
  };
  hotels: {
    favouriteChains: { name: string; tier: string; reason: string }[];
    roomPreferences: string[];
    specialRequests: string[];
  };
  rewards: {
    strategies: RewardStrategy[];
    awardWalletConnected: boolean;
    preferredTransferPartners: string[];
    targetRedemptions: string[];
  };
  dining: {
    favouriteRestaurants: FavouriteRestaurant[];
    diningStyle: string;
    reservationApps: string[];
  };
  events: {
    annualEvents: AnnualEvent[];
    galaAndSocial: string[];
    traditions: string[];
  };
  lifestyle: {
    sports: string[];
    spectatorSports: string[];
    hobbies: string[];
    dietary: string;
    favoriteCuisines: string[];
    alcoholPreference: string;
    cookingHabits: string;
    shoppingStyle: string;
  };
  accommodation: {
    type: string;
    mustHave: string[];
    preferredChains: string[];
  };
  services: {
    usesFrequently: string[];
    transportation: string[];
  };
  family: {
    status: string;
    children: { age: number; name: string; birthday?: string }[];
    pets: string[];
    partnerName?: string;
    partnerBirthday?: string;
  };
  calendar: DemoCalendarEvent[];
  aiContext: string;
}

// ───────────────────────────────────────────────────────────────
// DYNAMIC CALENDAR GENERATORS
// All events are generated relative to TODAY so the calendar
// always looks fresh, busy and forward-looking, no matter when
// the demo persona is loaded.
// ───────────────────────────────────────────────────────────────

const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const addDays = (base: Date, n: number): Date => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

/** Shift a "Month-Day" anchor (e.g. birthday) to the next occurrence on/after today. */
const nextOccurrence = (today: Date, month: number, day: number): Date => {
  const candidate = new Date(today.getFullYear(), month - 1, day);
  if (candidate < today) candidate.setFullYear(today.getFullYear() + 1);
  return candidate;
};

// Format helpers used by the dynamic AI context builder
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const formatShort = (d: Date) => `${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
const formatLong = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const formatRange = (start: Date, days: number) => {
  const end = addDays(start, Math.max(0, days - 1));
  if (start.getMonth() === end.getMonth()) return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()}-${end.getDate()}`;
  return `${formatShort(start)} – ${formatShort(end)}`;
};

const generateMeghanCalendar = (): DemoCalendarEvent[] => {
  const events: DemoCalendarEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekdayMorning: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '06:30', title: 'Morning Yoga — Vinyasa Flow', type: 'sport', location: 'Equinox Kensington' },
    { time: '07:45', title: 'Skincare & Espresso Routine', type: 'wellness', location: 'Home' },
    { time: '08:00', title: 'Exec Team Standup', type: 'meeting', location: 'Zoom' },
  ];
  const weekdayCore: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '09:30', title: 'Q1 Campaign Review', type: 'meeting', location: 'Office — Soho' },
    { time: '11:00', title: '1:1 with Head of Brand', type: 'meeting', location: 'Office' },
    { time: '12:30', title: 'Lunch — Sushi Samba (Heron Tower)', type: 'dining', location: 'London' },
    { time: '14:00', title: 'Client Presentation — APAC Strategy', type: 'meeting', location: 'Office' },
    { time: '15:30', title: 'Creative Review — New TVC', type: 'meeting', location: 'Office' },
    { time: '17:00', title: 'Strength Training — PT Session', type: 'sport', location: 'Equinox Kensington' },
    { time: '19:30', title: 'Facial — Dr. Barbara Sturm Clinic', type: 'wellness', location: 'Mayfair' },
    { time: '20:30', title: 'Dinner — Chiltern Firehouse (drinks with friends)', type: 'social', location: 'Marylebone' },
  ];
  const saturday: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '07:00', title: '10K Run — Hyde Park Loop', type: 'sport', location: 'London' },
    { time: '09:30', title: 'Brunch — The Wolseley', type: 'dining', location: 'Piccadilly' },
    { time: '11:00', title: 'Deep Tissue Massage', type: 'wellness', location: 'Bamford Haybarn Spa' },
    { time: '13:30', title: 'Personal Shopping — New Bond St', type: 'personal', location: 'Mayfair' },
    { time: '16:00', title: 'Art Gallery Visit — White Cube', type: 'social', location: 'Bermondsey' },
    { time: '19:30', title: 'Dinner with Sarah — Sketch', type: 'dining', location: 'Mayfair' },
  ];
  const sunday: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '08:30', title: 'Pilates Reformer Class', type: 'sport', location: 'Heartcore Notting Hill' },
    { time: '10:30', title: 'Sunday Roast — The Hawksmoor', type: 'dining', location: 'Knightsbridge' },
    { time: '13:00', title: 'Spa Day — Bulgari Hotel London', type: 'wellness', location: 'Knightsbridge' },
    { time: '17:00', title: 'Meal Prep / Self-care Reset', type: 'personal', location: 'Home' },
  ];

  for (let i = 0; i < 120; i++) {
    const d = addDays(today, i);
    const dow = d.getDay();
    const dateStr = toISODate(d);
    const list =
      dow === 0 ? sunday :
      dow === 6 ? saturday :
      [...weekdayMorning, ...weekdayCore].slice(0, 7 + (i % 4));
    list.forEach(ev => events.push({ ...ev, date: dateStr }));
  }

  const trips: Array<{ offset: number; time: string; title: string; type: DemoCalendarEvent['type']; location: string }> = [
    { offset: 6,  time: '07:00', title: '✈️ BA15 Business Class to Singapore (Seat 14A)', type: 'travel',  location: 'LHR → SIN' },
    { offset: 7,  time: '09:00', title: 'Client Workshop — Marina Bay Sands',              type: 'meeting', location: 'Singapore' },
    { offset: 7,  time: '19:30', title: '🍽️ Dinner — Odette (3 Michelin ⭐)',               type: 'dining',  location: 'Singapore' },
    { offset: 8,  time: '10:00', title: 'APAC Brand Steering Committee',                    type: 'meeting', location: 'Singapore' },
    { offset: 9,  time: '14:00', title: '✈️ CX734 Business to Hong Kong (Seat 11K)',       type: 'travel',  location: 'SIN → HKG' },
    { offset: 9,  time: '20:00', title: '🍽️ Dinner — Lung King Heen (3 Michelin ⭐)',       type: 'dining',  location: 'Four Seasons HK' },
    { offset: 10, time: '09:00', title: 'HK Investor Roadshow',                             type: 'meeting', location: 'Hong Kong' },
    { offset: 11, time: '12:00', title: '✈️ BA32 Business back to London',                  type: 'travel',  location: 'HKG → LHR' },
    { offset: 18, time: '08:00', title: '✈️ BA117 Business to New York (1A — Club Suite)',  type: 'travel',  location: 'LHR → JFK' },
    { offset: 18, time: '20:00', title: '🍽️ Dinner — Eleven Madison Park',                  type: 'dining',  location: 'New York' },
    { offset: 19, time: '10:00', title: 'NY Office — Brand Summit',                          type: 'meeting', location: 'New York' },
    { offset: 19, time: '19:00', title: '🎭 Global Advertising Awards — Black Tie Gala',     type: 'gala',    location: 'New York' },
    { offset: 20, time: '19:00', title: '🍽️ Dinner — Le Bernardin (3 Michelin ⭐)',          type: 'dining',  location: 'New York' },
    { offset: 21, time: '21:00', title: '✈️ BA178 Business back to London',                  type: 'travel',  location: 'JFK → LHR' },
    { offset: 28, time: '06:00', title: '✈️ EK2 to Dubai (1A — Game Changer)',              type: 'travel',  location: 'LHR → DXB' },
    { offset: 28, time: '20:30', title: '🍽️ Dinner — NOBU Dubai',                            type: 'dining',  location: 'Atlantis, The Royal' },
    { offset: 29, time: '09:00', title: 'Dubai Media Partners Meeting',                      type: 'meeting', location: 'Dubai' },
    { offset: 30, time: '15:00', title: 'Hammam & Spa — Talise Ottoman',                     type: 'wellness',location: 'Dubai' },
    { offset: 31, time: '23:00', title: '✈️ EK1 First Class back to London',                 type: 'travel',  location: 'DXB → LHR' },
    { offset: 42, time: '08:00', title: '✈️ BA2043 Business to Maldives (7 days)',           type: 'travel',  location: 'LHR → MLE — Soneva Fushi' },
    { offset: 43, time: '10:00', title: '🏝️ Spa Day — Soneva Fushi Wellness Centre',         type: 'wellness',location: 'Maldives' },
    { offset: 45, time: '08:00', title: '🧘 Sunrise Yoga on the Beach',                      type: 'sport',   location: 'Maldives' },
    { offset: 47, time: '19:00', title: '🌅 Private Sunset Cruise',                          type: 'social',  location: 'Maldives' },
    { offset: 49, time: '12:00', title: '✈️ Return from Maldives',                           type: 'travel',  location: 'MLE → LHR' },
    { offset: 58, time: '07:00', title: '✈️ BA346 Business to Nice — Cannes Lions',          type: 'travel',  location: 'LHR → NCE' },
    { offset: 58, time: '19:00', title: '🎭 Cannes Lions Festival — Opening Night Gala',     type: 'gala',    location: 'Cannes, France' },
    { offset: 59, time: '11:00', title: 'Cannes Lions — Brand Keynote Panel',                type: 'meeting', location: 'Cannes' },
    { offset: 60, time: '20:00', title: '🛥️ Yacht Party — Hôtel du Cap-Eden-Roc',            type: 'social',  location: 'Antibes' },
    { offset: 61, time: '14:00', title: '✈️ Return to London',                               type: 'travel',  location: 'NCE → LHR' },
    { offset: 68, time: '11:00', title: '🐎 Royal Ascot — VIP Royal Enclosure',              type: 'social',  location: 'Ascot, UK' },
    { offset: 80, time: '14:00', title: '🎾 Wimbledon Finals — Centre Court Box',            type: 'social',  location: 'London' },
    { offset: 90, time: '07:00', title: '✈️ BA65 Business to Nairobi — Private Safari',      type: 'travel',  location: 'LHR → NBO' },
    { offset: 91, time: '06:00', title: '🦁 Masai Mara — Game Drive (private guide)',        type: 'personal',location: 'Kenya' },
    { offset: 93, time: '06:30', title: '🎈 Hot Air Balloon Safari at Sunrise',              type: 'personal',location: 'Kenya' },
    { offset: 96, time: '10:00', title: '✈️ Return from Nairobi',                            type: 'travel',  location: 'NBO → LHR' },
    { offset: 105,time: '19:30', title: '🎭 Frieze Art Fair — VIP Preview & Dinner',         type: 'social',  location: 'Regent\'s Park' },
    { offset: 115,time: '19:00', title: '🎭 Annual Company Awards Gala — The Dorchester',    type: 'gala',    location: 'London' },
  ];

  trips.forEach(t => {
    const d = addDays(today, t.offset);
    events.push({ date: toISODate(d), time: t.time, title: t.title, type: t.type, location: t.location });
  });

  const birthdays: Array<{ month: number; day: number; time: string; title: string; type: DemoCalendarEvent['type']; location: string }> = [
    { month: 6,  day: 18, time: '19:00', title: '🎂 Meghan\'s Birthday — Private Dining at The Ritz', type: 'birthday', location: 'London' },
    { month: 6,  day: 18, time: '14:00', title: '💐 Birthday Spa — Claridge\'s Spa',                  type: 'wellness', location: 'London' },
    { month: 9,  day: 15, time: '19:30', title: '🎂 Mum\'s Birthday Dinner — The Wolseley',           type: 'birthday', location: 'London' },
    { month: 11, day: 8,  time: '19:00', title: '🎂 Sarah\'s Birthday — Chiltern Firehouse',          type: 'birthday', location: 'London' },
    { month: 12, day: 25, time: '10:00', title: '🎄 Christmas Day Brunch — Burj Al Arab',             type: 'holiday',  location: 'Dubai' },
    { month: 12, day: 31, time: '20:00', title: '🎆 New Year\'s Eve Gala — Armani Hotel Dubai',       type: 'gala',     location: 'Dubai' },
  ];
  birthdays.forEach(b => {
    const d = nextOccurrence(today, b.month, b.day);
    events.push({ date: toISODate(d), time: b.time, title: b.title, type: b.type, location: b.location });
  });

  return events;
};

const generateJohnCalendar = (): DemoCalendarEvent[] => {
  const events: DemoCalendarEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekday: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '05:30', title: 'Swim Training — 3km',                 type: 'sport',   location: 'OCBC Aquatic Centre' },
    { time: '07:00', title: 'Family Breakfast',                    type: 'family',  location: 'Home — Bukit Timah' },
    { time: '07:45', title: 'School Drop-off — Emma',              type: 'family',  location: 'UWC Dover' },
    { time: '08:30', title: 'Daycare Drop-off — Leo',              type: 'family',  location: 'Tanglin Trust' },
    { time: '09:00', title: 'Executive Standup — APAC Team',       type: 'meeting', location: 'Office — CBD' },
    { time: '10:00', title: 'Product Roadmap Review',              type: 'meeting', location: 'Office' },
    { time: '12:30', title: 'Lunch — CUT by Wolfgang Puck',        type: 'dining',  location: 'Marina Bay Sands' },
    { time: '14:00', title: 'Board Strategy Call — US HQ',         type: 'meeting', location: 'Zoom' },
    { time: '16:00', title: 'Immigration Lawyer — EP / DP Status', type: 'legal',   location: 'Raffles Place' },
    { time: '17:30', title: 'Run — 8km Marina Bay Loop',           type: 'sport',   location: 'Singapore' },
    { time: '19:00', title: 'Family Dinner — Burnt Ends',          type: 'dining',  location: 'Singapore' },
    { time: '20:30', title: 'Bedtime story with Leo',              type: 'family',  location: 'Home' },
  ];
  const saturday: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '06:00', title: 'Triathlon Brick Session (Bike + Run)', type: 'sport',  location: 'East Coast Park' },
    { time: '09:30', title: 'Emma — Piano Lesson',                  type: 'family', location: 'Tanglin' },
    { time: '10:30', title: 'Leo — Swim Class',                     type: 'family', location: 'Tanglin Club' },
    { time: '12:00', title: 'Family Lunch — Haidilao Hot Pot',      type: 'dining', location: 'Singapore' },
    { time: '15:00', title: 'Sports Massage',                       type: 'wellness',location: 'Spa Esprit' },
    { time: '17:00', title: 'Wine tasting at home',                 type: 'social', location: 'Home' },
    { time: '19:30', title: 'Date Night — Les Amis',                type: 'dining', location: 'Singapore' },
  ];
  const sunday: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '06:30', title: 'Long Bike Ride — 80km',                type: 'sport',  location: 'Mandai Loop' },
    { time: '10:00', title: 'Family Brunch — Dempsey Hill',         type: 'family', location: 'Singapore' },
    { time: '13:00', title: 'Pool & Tanglin Club',                  type: 'family', location: 'Singapore' },
    { time: '16:00', title: 'Leo Playdate — Park',                  type: 'family', location: 'Botanic Gardens' },
    { time: '18:30', title: 'Family Dinner at Home',                type: 'family', location: 'Home' },
  ];

  for (let i = 0; i < 120; i++) {
    const d = addDays(today, i);
    const dow = d.getDay();
    const dateStr = toISODate(d);
    const list =
      dow === 0 ? sunday :
      dow === 6 ? saturday :
      weekday.slice(0, 8 + (i % 4));
    list.forEach(ev => events.push({ ...ev, date: dateStr }));
  }

  const trips: Array<{ offset: number; time: string; title: string; type: DemoCalendarEvent['type']; location: string }> = [
    { offset: 4,  time: '08:00', title: '✈️ SQ32 Business to San Francisco (Seat 11A)',     type: 'travel',  location: 'SIN → SFO' },
    { offset: 5,  time: '09:00', title: 'US Board Meeting — TechScale HQ',                  type: 'meeting', location: 'San Francisco' },
    { offset: 5,  time: '20:00', title: '🍽️ Dinner — Benu (3 Michelin ⭐)',                  type: 'dining',  location: 'San Francisco' },
    { offset: 6,  time: '10:00', title: 'Investor 1:1s — Sand Hill Road',                   type: 'meeting', location: 'Menlo Park' },
    { offset: 7,  time: '07:00', title: '✈️ UA862 Business to São Paulo (6C — Polaris)',    type: 'travel',  location: 'SFO → GRU' },
    { offset: 8,  time: '20:00', title: '🍽️ Dinner — D.O.M. (2 Michelin ⭐)',                type: 'dining',  location: 'São Paulo' },
    { offset: 9,  time: '10:00', title: 'Brazil Partner Launch Event',                      type: 'meeting', location: 'São Paulo' },
    { offset: 10, time: '22:00', title: '✈️ LH507 Business back via FRA → SIN',              type: 'travel',  location: 'GRU → SIN' },
    { offset: 18, time: '08:00', title: '✈️ SQ322 Business to London (12A)',                type: 'travel',  location: 'SIN → LHR' },
    { offset: 18, time: '20:00', title: '🍽️ Dinner — Hawksmoor Seven Dials',                type: 'dining',  location: 'London' },
    { offset: 19, time: '09:00', title: 'UK Office — Quarterly Review',                     type: 'meeting', location: 'London' },
    { offset: 20, time: '07:00', title: '✈️ LH2479 Business to Munich (2A)',                type: 'travel',  location: 'LHR → MUC' },
    { offset: 20, time: '20:00', title: '🍽️ Dinner — Tantris (2 Michelin ⭐)',               type: 'dining',  location: 'Munich' },
    { offset: 21, time: '09:00', title: 'Germany Partner Meeting',                          type: 'meeting', location: 'Munich' },
    { offset: 22, time: '14:00', title: '🚄 First Class Train to Zürich',                   type: 'travel',  location: 'MUC → ZRH' },
    { offset: 23, time: '09:00', title: 'Swiss Banking & Tax Meeting',                      type: 'meeting', location: 'Zürich' },
    { offset: 23, time: '19:30', title: '🍽️ Dinner — The Restaurant (Dolder Grand, 2 ⭐)',   type: 'dining',  location: 'Zürich' },
    { offset: 24, time: '22:00', title: '✈️ SQ345 Business back to Singapore',              type: 'travel',  location: 'ZRH → SIN' },
    { offset: 33, time: '06:00', title: '🏊 Ironman 70.3 Bintan — Race Day',                type: 'sport',   location: 'Bintan, Indonesia' },
    { offset: 34, time: '11:00', title: 'Family Beach Day at Lagoi Bay',                    type: 'family',  location: 'Bintan' },
    { offset: 47, time: '07:00', title: '✈️ SQ346 to Geneva — Family Ski Trip',             type: 'travel',  location: 'SIN → GVA → Verbier' },
    { offset: 48, time: '09:00', title: '⛷️ Ski Day — Verbier (W Hotel)',                   type: 'personal',location: 'Verbier, Switzerland' },
    { offset: 50, time: '10:00', title: '⛷️ Family Ski Lessons — Emma & Leo',                type: 'family',  location: 'Verbier' },
    { offset: 52, time: '14:00', title: '🍷 Fondue Lunch — Cabane Mont-Fort',                type: 'dining',  location: 'Verbier' },
    { offset: 54, time: '12:00', title: '✈️ Return from Verbier',                            type: 'travel',  location: 'GVA → SIN' },
    { offset: 65, time: '08:00', title: '✈️ SQ32 to SFO → Napa Valley wine trip',           type: 'travel',  location: 'SIN → SFO → NAP' },
    { offset: 66, time: '20:00', title: '🍽️ Dinner — French Laundry (3 Michelin ⭐)',        type: 'dining',  location: 'Yountville, Napa' },
    { offset: 67, time: '11:00', title: '🍷 Opus One + Screaming Eagle tasting',             type: 'social',  location: 'Napa' },
    { offset: 78, time: '06:00', title: '🏊 Challenge Roth — Full Triathlon Race Day',      type: 'sport',   location: 'Roth, Germany' },
    { offset: 95, time: '19:00', title: '🎭 Singapore GP — Paddock Party',                  type: 'social',  location: 'Marina Bay' },
    { offset: 96, time: '14:00', title: '🏎️ Singapore GP — Race Day VIP',                   type: 'social',  location: 'Marina Bay' },
    { offset: 38, time: '19:30', title: '🎭 American Chamber of Commerce Gala',             type: 'gala',    location: 'Shangri-La Singapore' },
    { offset: 72, time: '19:30', title: '🎭 TechScale Global Annual Dinner — Black Tie',    type: 'gala',    location: 'San Francisco' },
    { offset: 102,time: '18:00', title: '🎭 UWC International School Fundraiser',           type: 'gala',    location: 'Singapore' },
    { offset: 110,time: '19:00', title: '🎭 Singapore Charity Ball — Ritz-Carlton',         type: 'gala',    location: 'Singapore' },
  ];

  trips.forEach(t => {
    const d = addDays(today, t.offset);
    events.push({ date: toISODate(d), time: t.time, title: t.title, type: t.type, location: t.location });
  });

  const birthdays: Array<{ month: number; day: number; time: string; title: string; type: DemoCalendarEvent['type']; location: string }> = [
    { month: 4,  day: 12, time: '10:00', title: '🎂 Leo\'s Birthday Party — Tanglin Club',                type: 'birthday', location: 'Singapore' },
    { month: 7,  day: 22, time: '11:00', title: '🎂 Emma\'s Birthday — Adventure Cove + Dinner',          type: 'birthday', location: 'Sentosa' },
    { month: 8,  day: 28, time: '19:00', title: '🎂 Sarah\'s Birthday — Private dining at JAAN',          type: 'birthday', location: 'Singapore' },
    { month: 10, day: 5,  time: '19:30', title: '🎂 John\'s Birthday — Dinner at Les Amis (2 ⭐)',         type: 'birthday', location: 'Singapore' },
    { month: 10, day: 18, time: '19:00', title: '🥂 Wedding Anniversary — Dinner at Odette (3 ⭐)',        type: 'birthday', location: 'Singapore' },
    { month: 5,  day: 10, time: '09:00', title: '💐 Mother\'s Day — Flowers to Mom in Boston',            type: 'personal', location: 'Remote' },
    { month: 7,  day: 4,  time: '18:00', title: '🇺🇸 4th of July BBQ — American Club Singapore',          type: 'holiday',  location: 'Singapore' },
    { month: 8,  day: 9,  time: '10:00', title: '🇸🇬 Singapore National Day — Marina Bay Fireworks',      type: 'holiday',  location: 'Singapore' },
    { month: 11, day: 26, time: '12:00', title: '🦃 Thanksgiving Dinner — American Club',                 type: 'holiday',  location: 'Singapore' },
    { month: 12, day: 25, time: '09:00', title: '🎄 Christmas Day — Family Breakfast at Zermatterhof',    type: 'holiday',  location: 'Zermatt' },
    { month: 12, day: 31, time: '20:00', title: '🎆 New Year\'s Eve Gala — The Omnia Zermatt',            type: 'gala',     location: 'Zermatt' },
  ];
  birthdays.forEach(b => {
    const d = nextOccurrence(today, b.month, b.day);
    events.push({ date: toISODate(d), time: b.time, title: b.title, type: b.type, location: b.location });
  });

  return events;
};

const DEMO_PERSONAS_BASE: Record<string, DemoPersona> = {
  meghan: {
    id: 'meghan',
    label: 'Business Woman',
    buttonLabel: '👩‍💼 Meghan',
    icon: '👩‍💼',
    profile: {
      firstName: 'Meghan',
      lastName: 'Clarke',
      age: 42,
      gender: 'female',
      email: 'meghan.clarke@demo.com',
      phone: '+44 7700 900123',
      city: 'London',
      country: 'United Kingdom',
      nationality: 'British',
      occupation: 'Marketing Director',
      company: 'Global Brands Corp',
      industry: 'Marketing & Advertising',
      incomeBracket: '250k+',
      bio: 'Marketing Director with 120+ travel days per year. Wellness enthusiast, F1 fanatic, gala regular, and dedicated foodie who dines at the world\'s best restaurants.',
      birthday: '1984-06-18',
    },
    travel: {
      style: 'business',
      flightClass: 'Business Class',
      averageTravelDays: 120,
      frequentDestinations: ['Singapore', 'New York', 'Dubai', 'Hong Kong', 'Oslo'],
      vacationDestinations: ['Maldives', 'Kenya', 'Tanzania', 'Brazil', 'Cannes'],
      upcomingTrips: [
        { destination: 'Singapore', dates: 'Mar 2-4, 2026', purpose: 'Client workshop' },
        { destination: 'Hong Kong', dates: 'Mar 5-7, 2026', purpose: 'APAC meetings' },
        { destination: 'New York', dates: 'Mar 15-19, 2026', purpose: 'Brand Summit' },
        { destination: 'Dubai', dates: 'Mar 22-25, 2026', purpose: 'Media partners' },
        { destination: 'Maldives', dates: 'Apr 5-12, 2026', purpose: 'Vacation — Soneva Fushi' },
        { destination: 'Kenya', dates: 'May 10-17, 2026', purpose: 'Private Safari' },
        { destination: 'Cannes', dates: 'Jun 1-5, 2026', purpose: 'Cannes Lions Festival' },
        { destination: 'Oslo', dates: 'Jul 1-5, 2026', purpose: 'Nordic strategy' },
        { destination: 'Rio de Janeiro', dates: 'Aug 15-22, 2026', purpose: 'Summer holiday' },
        { destination: 'Dubai', dates: 'Dec 20-Jan 2, 2027', purpose: 'Christmas & NYE' },
      ],
    },
    aviation: {
      favouriteAirlines: [
        { name: 'British Airways', reason: 'Home carrier, Club Suite on A350, Gold Guest List status', alliance: 'Oneworld' },
        { name: 'Emirates', reason: 'Game Changer Business, LHR-DXB route, First Class for holidays', alliance: 'None' },
        { name: 'Singapore Airlines', reason: 'Best Business Class seat, LHR-SIN on A380', alliance: 'Star Alliance' },
        { name: 'Cathay Pacific', reason: 'Excellent Business Class, HKG connections', alliance: 'Oneworld' },
      ],
      favouriteSeats: [
        { airline: 'British Airways', aircraft: 'A350 (Club Suite)', seatNumber: '1A', class: 'Business', notes: 'Window suite with door, maximum privacy. Always pre-selects this.' },
        { airline: 'British Airways', aircraft: 'B777 (Club World)', seatNumber: '14A', class: 'Business', notes: 'Window, forward-facing. Avoids middle seats.' },
        { airline: 'Emirates', aircraft: 'A380 (Game Changer)', seatNumber: '1A', class: 'Business', notes: 'Mini First Class feel, best seat in business.' },
        { airline: 'Emirates', aircraft: 'A380', seatNumber: '2A', class: 'First', notes: 'For holiday upgrades with Skywards miles.' },
        { airline: 'Singapore Airlines', aircraft: 'A380', seatNumber: '11A', class: 'Business', notes: 'Upper deck window, quiet cabin.' },
        { airline: 'Cathay Pacific', aircraft: 'A350', seatNumber: '11K', class: 'Business', notes: 'Window, rear business cabin (quieter).' },
      ],
      loungePreferences: ['BA Galleries First', 'Emirates Business Lounge (DXB)', 'SQ SilverKris Lounge', 'Amex Centurion Lounge (JFK)', 'No1 Lounge (LHR T3)'],
      alwaysBooks: 'window',
      mealPreference: 'Pescatarian, always pre-orders Japanese or seafood option',
    },
    hotels: {
      favouriteChains: [
        { name: 'Four Seasons', tier: 'Preferred Partner', reason: 'Best service globally, favourite for vacations' },
        { name: 'Mandarin Oriental', tier: 'Fans of M.O. Devotee', reason: 'Hong Kong flagship, incredible spas' },
        { name: 'Aman', tier: 'Aman Junkie', reason: 'Ultimate luxury, Maldives & Bali properties' },
        { name: 'The Edition (Marriott)', tier: 'Titanium Elite', reason: 'Design-forward, great bars, earns Bonvoy points' },
        { name: 'Park Hyatt', tier: 'Globalist', reason: 'Best value for points, suite upgrades confirmed' },
      ],
      roomPreferences: ['High floor', 'King bed', 'City/ocean view', 'Away from elevator', 'Quiet side'],
      specialRequests: ['Extra pillows', 'Nespresso machine', 'Fresh flowers', 'Yoga mat in room', 'Non-alcoholic minibar options'],
    },
    rewards: {
      strategies: [
        { goal: 'Emirates First Class LHR→DXB for Christmas', programsInvolved: ['Emirates Skywards', 'Amex MR'], pointsNeeded: 136000, currentProgress: 185000, notes: 'Already have enough! Book 2 months before.' },
        { goal: 'SQ Suites SIN→LHR bucket list', programsInvolved: ['Singapore KrisFlyer', 'Chase UR'], pointsNeeded: 198000, currentProgress: 122000, notes: 'Transfer 76K from Chase UR to KrisFlyer. Wait for Saver availability.' },
        { goal: 'Park Hyatt Maldives 5 nights on points', programsInvolved: ['World of Hyatt', 'Chase UR'], pointsNeeded: 150000, currentProgress: 156000, notes: 'Just enough! Book via Hyatt for Globalist suite upgrade.' },
        { goal: 'Marriott Bonvoy → 5th Night Free at Edition properties', programsInvolved: ['Marriott Bonvoy'], pointsNeeded: 200000, currentProgress: 485000, notes: 'Plenty of points. Use 5th night free for NYC or Dubai.' },
        { goal: 'BA Gold Guest List maintenance — fly 5000 Tier Points', programsInvolved: ['BA Executive Club'], pointsNeeded: 5000, currentProgress: 3200, notes: 'Need 1800 more TP by Dec. Route through BA for remaining trips.' },
      ],
      awardWalletConnected: true,
      preferredTransferPartners: ['Chase UR → Hyatt (1:1)', 'Amex MR → Emirates (1:1)', 'Amex MR → Singapore Airlines (1:1)', 'Chase UR → BA Avios (1:1)'],
      targetRedemptions: [
        'Emirates First Class Christmas holiday',
        'Park Hyatt Maldives suite on points',
        'BA short-haul Avios for Europe trips (Oslo, Cannes)',
        'Hyatt suite upgrades in NYC (Park Hyatt)',
      ],
    },
    dining: {
      favouriteRestaurants: [
        { name: 'Core by Clare Smyth', city: 'London', cuisine: 'British Modern', michelinStars: 3, occasion: 'Special occasions' },
        { name: 'Le Bernardin', city: 'New York', cuisine: 'French Seafood', michelinStars: 3, occasion: 'NYC business trips' },
        { name: 'Odette', city: 'Singapore', cuisine: 'French', michelinStars: 3, occasion: 'Singapore visits' },
        { name: 'Eleven Madison Park', city: 'New York', cuisine: 'American', michelinStars: 3, occasion: 'Celebrations' },
        { name: 'Nobu Dubai', city: 'Dubai', cuisine: 'Japanese Fusion', occasion: 'Dubai trips' },
        { name: 'Sushi Samba', city: 'London', cuisine: 'Japanese-Brazilian', occasion: 'Quick weekday lunch' },
        { name: 'The Wolseley', city: 'London', cuisine: 'European Café', occasion: 'Weekend brunch' },
        { name: 'Chiltern Firehouse', city: 'London', cuisine: 'Modern European', occasion: 'Social dinners' },
        { name: 'Sketch', city: 'London', cuisine: 'French', michelinStars: 2, occasion: 'Date nights' },
        { name: 'Lung King Heen', city: 'Hong Kong', cuisine: 'Cantonese', michelinStars: 3, occasion: 'HK visits' },
      ],
      diningStyle: 'Fine dining 4-5x/week. Orders food delivery to hotel rooms via Uber Eats daily. Never cooks.',
      reservationApps: ['Resy', 'OpenTable', 'SevenRooms', 'Concierge (hotel)'],
    },
    events: {
      annualEvents: [
        { name: 'Meghan\'s Birthday', date: 'June 18', type: 'birthday', notes: 'Private dinner at The Ritz London + spa day' },
        { name: 'Mum\'s Birthday', date: 'September 15', type: 'birthday', notes: 'The Wolseley dinner' },
        { name: 'Best Friend Sarah\'s Birthday', date: 'November 8', type: 'birthday', notes: 'Chiltern Firehouse' },
        { name: 'Christmas', date: 'December 25', type: 'holiday', notes: 'Always travels abroad — Dubai, Maldives, or Caribbean' },
        { name: 'New Year\'s Eve', date: 'December 31', type: 'gala', notes: 'Always attends a gala — Dubai preferred' },
        { name: 'F1 British Grand Prix', date: 'June (varies)', type: 'tradition', notes: 'Silverstone Paddock Club — never misses' },
        { name: 'Royal Ascot', date: 'June (3rd week)', type: 'tradition', notes: 'VIP Royal Enclosure' },
        { name: 'Wimbledon Finals', date: 'July (2nd week)', type: 'tradition', notes: 'Centre Court Box' },
        { name: 'Cannes Lions Festival', date: 'June (1st week)', type: 'tradition', notes: 'Industry event — Opening Night Gala' },
        { name: 'Frieze Art Fair', date: 'October', type: 'tradition', notes: 'VIP Preview + Dinner' },
      ],
      galaAndSocial: [
        'Women in Marketing Awards Gala (The Savoy)',
        'Global Advertising Awards (NYC)',
        'Company Annual Awards (The Dorchester)',
        'Cannes Lions Opening Night',
        'Met Gala Watch Party (Soho House)',
        'Bonfire Night Rooftop Party',
      ],
      traditions: [
        'F1 Silverstone every June',
        'Maldives or Africa safari every spring',
        'Christmas abroad (never in UK)',
        'NYE Gala — always black tie',
        'Royal Ascot + Wimbledon every summer',
      ],
    },
    lifestyle: {
      sports: ['yoga', 'gym', 'running'],
      spectatorSports: ['formula1'],
      hobbies: ['skincare', 'wellness', 'fine-dining', 'photography', 'art galleries', 'wine tasting (non-alcoholic alternatives)'],
      dietary: 'Healthy eating, fish-focused, pescatarian-leaning',
      favoriteCuisines: ['Japanese', 'Mediterranean', 'Peruvian', 'French', 'Cantonese'],
      alcoholPreference: 'Non-alcoholic drinks preferred — mocktails, kombucha, sparkling water',
      cookingHabits: 'Never cooks. Orders food delivery constantly — Uber Eats to home and hotel rooms',
      shoppingStyle: 'Luxury brands (Chanel, Dior), premium skincare (La Mer, Dr. Barbara Sturm)',
    },
    accommodation: {
      type: 'Luxury hotels & boutique hotels',
      mustHave: ['gym', 'sauna', 'spa', 'room-service', 'laundry-service', 'yoga-mat'],
      preferredChains: ['Four Seasons', 'Mandarin Oriental', 'Aman', 'The Edition', 'Park Hyatt'],
    },
    services: {
      usesFrequently: ['Laundry & dry cleaning', 'Massage & spa', 'Skincare treatments', 'Food delivery (Uber Eats)', 'Room service', 'Concierge restaurant bookings'],
      transportation: ['Uber Black (primary)', 'Business class flights', 'Airport lounge access', 'Eurostar Business Premier'],
    },
    family: {
      status: 'Single',
      children: [],
      pets: [],
    },
    calendar: generateMeghanCalendar(),
    aiContext: `ACTIVE DEMO PERSONA: Meghan Clarke, 42, British, lives in London. Marketing Director at Global Brands Corp with 120+ travel days/year. Single, no family. Birthday: June 18.

TRAVEL: Flies business class exclusively. Frequent cities: Singapore, New York, Dubai, Hong Kong, Oslo, Cannes. Vacations: Maldives (Soneva Fushi), Africa safaris, Brazil, Rio de Janeiro. Christmas always abroad (Dubai or Maldives). Next trips: Singapore (Mar 2), Hong Kong (Mar 5), New York (Mar 15), Dubai (Mar 22), Maldives (Apr 5), Kenya safari (May 10), Cannes Lions (Jun 1), Oslo (Jul 1), Rio (Aug 15), Dubai Christmas (Dec 20).

AVIATION PREFERENCES:
- Favourite airlines: British Airways (home carrier, Gold Guest List), Emirates (Game Changer Business/First), Singapore Airlines (A380 Business), Cathay Pacific (HKG routes)
- ALWAYS books WINDOW seats. Pre-selects specific seats:
  • BA A350 Club Suite: Seat 1A (door suite, max privacy)
  • BA B777: Seat 14A (window, forward-facing)
  • Emirates A380: Seat 1A Business (Game Changer) or 2A First
  • SQ A380: Seat 11A (upper deck window)
  • Cathay A350: Seat 11K (rear business, quieter)
- Meal: Always pre-orders pescatarian/Japanese/seafood option
- Lounges: BA Galleries First, Emirates (DXB), SQ SilverKris, Amex Centurion (JFK)

HOTEL PREFERENCES:
- Four Seasons (Preferred Partner), Mandarin Oriental (Devotee), Aman (Junkie), Edition (Titanium), Park Hyatt (Globalist)
- Room: High floor, King bed, city/ocean view, away from elevator
- Special: Extra pillows, Nespresso, fresh flowers, yoga mat in room, non-alcoholic minibar

REWARD STRATEGIES (AwardWallet connected):
- Emirates First Class LHR→DXB for Christmas: HAS 185K Skywards miles (needs 136K). BOOK NOW!
- SQ Suites SIN→LHR: Has 122K KrisFlyer + can transfer 76K from Chase UR. Wait for Saver availability.
- Park Hyatt Maldives: Has 156K Hyatt points. Book 5 nights for Globalist suite upgrade.
- Marriott Edition NYC/Dubai: Has 485K Bonvoy. Use 5th Night Free for 5-night stays.
- BA Gold Guest List: Needs 1800 more Tier Points by Dec. Route remaining trips through BA!
- Transfer partners: Chase UR → Hyatt 1:1 (best value), Amex MR → Emirates 1:1, Amex MR → SQ 1:1
ALWAYS suggest routes that earn BA Tier Points to maintain Gold Guest List status.
ALWAYS suggest using points when better value than cash.

DINING: Fine dining 4-5x/week. Core by Clare Smyth (3⭐ London), Le Bernardin (3⭐ NYC), Odette (3⭐ Singapore), Eleven Madison Park (NYC), Nobu (Dubai), Lung King Heen (3⭐ HK). Books via Resy, OpenTable, SevenRooms. Orders Uber Eats to hotel rooms DAILY.

ANNUAL EVENTS & TRADITIONS:
- Birthday (Jun 18): Private dinner at The Ritz London
- F1 Silverstone (June): Paddock Club — NEVER misses
- Royal Ascot (June): VIP Royal Enclosure
- Wimbledon Finals (July): Centre Court Box
- Cannes Lions (June): Opening Night Gala
- Frieze Art Fair (October): VIP Preview
- Christmas: Always abroad (Dubai or Maldives)
- NYE: Always black-tie gala (Dubai preferred)
- Mum's birthday (Sep 15), Sarah's birthday (Nov 8)

GALA & SOCIAL: Women in Marketing Gala (Savoy), Global Advertising Awards (NYC), Company Awards (Dorchester), Cannes Lions Opening Night, Met Gala Watch Party (Soho House).

LIFESTYLE: Yoga every morning, gym daily, runs 10K on weekends. Watches F1 trackside. Heavy skincare (Dr. Barbara Sturm). Loves Japanese, Mediterranean, Peruvian, French, Cantonese. Non-alcoholic drinks only. Uber Black for everything.

PERSONALITY: Efficient, direct, appreciates proactive suggestions. Doesn't waste time. Values quality, convenience, and privacy. Wants AI to suggest reward point usage, seat selection, lounge access, and restaurant bookings PROACTIVELY.`,
  },

  john: {
    id: 'john',
    label: 'Expat Man',
    buttonLabel: '👨‍💼 John',
    icon: '👨‍💼',
    profile: {
      firstName: 'John',
      lastName: 'Mitchell',
      age: 46,
      gender: 'male',
      email: 'john.mitchell@demo.com',
      phone: '+65 9123 4567',
      city: 'Singapore',
      country: 'Singapore',
      nationality: 'American',
      occupation: 'VP of Engineering',
      company: 'TechScale Global',
      industry: 'Technology / SaaS',
      incomeBracket: '250k+',
      bio: 'VP Engineering, relocated family to Singapore. Serious triathlete (Ironman, Challenge Roth), fine dining enthusiast, suit wearer. Managing global teams across US, Europe & APAC. Family man with packed social calendar.',
      birthday: '1980-10-05',
    },
    travel: {
      style: 'business + family',
      flightClass: 'Business Class',
      averageTravelDays: 90,
      frequentDestinations: ['San Francisco', 'São Paulo', 'London', 'Munich', 'Zürich'],
      vacationDestinations: ['Verbier (skiing)', 'Zermatt (skiing)', 'Bali', 'Japan', 'Napa Valley'],
      upcomingTrips: [
        { destination: 'San Francisco', dates: 'Mar 3-5, 2026', purpose: 'Board meeting' },
        { destination: 'São Paulo', dates: 'Mar 6-9, 2026', purpose: 'Partner launch' },
        { destination: 'London', dates: 'Mar 15-17, 2026', purpose: 'Quarterly review' },
        { destination: 'Munich', dates: 'Mar 18-19, 2026', purpose: 'Partner meeting' },
        { destination: 'Zürich', dates: 'Mar 20-22, 2026', purpose: 'Banking & tax' },
        { destination: 'Bintan', dates: 'Apr 4, 2026', purpose: 'Ironman 70.3 race' },
        { destination: 'Verbier', dates: 'Apr 18-25, 2026', purpose: 'Family ski trip (W Hotel)' },
        { destination: 'Napa Valley', dates: 'Jun 5-8, 2026', purpose: 'Wine trip + French Laundry' },
        { destination: 'Roth, Germany', dates: 'Jun 20, 2026', purpose: 'Challenge Roth triathlon' },
        { destination: 'Zermatt', dates: 'Aug 1-8, 2026', purpose: 'Family ski trip (The Omnia)' },
        { destination: 'Zermatt', dates: 'Dec 20-Jan 2, 2027', purpose: 'Christmas & NYE ski' },
      ],
    },
    aviation: {
      favouriteAirlines: [
        { name: 'Singapore Airlines', reason: 'Home carrier, PPS Club, best Business Class globally', alliance: 'Star Alliance' },
        { name: 'United Airlines', reason: 'SFO hub, Polaris Business, Star Alliance partner', alliance: 'Star Alliance' },
        { name: 'Lufthansa', reason: 'Munich/Zürich routes, Senator status, excellent lounges', alliance: 'Star Alliance' },
        { name: 'SWISS', reason: 'Zürich routes, Senator lounge access, connects to ski resorts', alliance: 'Star Alliance' },
        { name: 'American Airlines', reason: 'Latin America coverage, São Paulo via DFW', alliance: 'Oneworld' },
      ],
      favouriteSeats: [
        { airline: 'Singapore Airlines', aircraft: 'A380 (Business)', seatNumber: '11A', class: 'Business', notes: 'Upper deck window, always pre-selects. Quiet section.' },
        { airline: 'Singapore Airlines', aircraft: 'A350 (Business)', seatNumber: '12A', class: 'Business', notes: 'Window, forward mini-cabin. Pre-books 48hrs before.' },
        { airline: 'Singapore Airlines', aircraft: 'A380 (Suites)', seatNumber: '2A', class: 'First/Suites', notes: 'Target redemption with KrisFlyer miles — double bed suite.' },
        { airline: 'United Airlines', aircraft: 'B777 (Polaris)', seatNumber: '6C', class: 'Business', notes: 'True aisle access in 1-2-1 config. SFO routes.' },
        { airline: 'Lufthansa', aircraft: 'A350 (Business)', seatNumber: '2A', class: 'Business', notes: 'Window, front cabin. Senator boarding first.' },
        { airline: 'SWISS', aircraft: 'A330 (Business)', seatNumber: '3A', class: 'Business', notes: 'Window, throne seat. ZRH routes.' },
        { airline: 'American Airlines', aircraft: 'B787 (Flagship Business)', seatNumber: '5A', class: 'Business', notes: 'Window, São Paulo routes via DFW.' },
      ],
      loungePreferences: ['SQ SilverKris First (Changi)', 'SQ The Private Room (Changi T3)', 'United Polaris Lounge (SFO)', 'Lufthansa Senator Lounge (MUC)', 'Amex Centurion (SFO)', 'SWISS Senator Lounge (ZRH)'],
      alwaysBooks: 'window (solo), aisle (red-eye for bathroom access)',
      mealPreference: 'Western menu, steak option when available. Book-the-Cook on SQ (Wagyu tenderloin).',
    },
    hotels: {
      favouriteChains: [
        { name: 'Ritz-Carlton (Marriott Bonvoy)', tier: 'Ambassador Elite', reason: 'Personal Ambassador service, guaranteed suite upgrades at RC properties' },
        { name: 'Park Hyatt', tier: 'Globalist', reason: 'Best point value, confirmed suite upgrades, family-friendly' },
        { name: 'JW Marriott', tier: 'Ambassador Elite', reason: 'Business hotels, Bonvoy points, consistent quality' },
        { name: 'Shangri-La', tier: 'Diamond', reason: 'Asia properties, Singapore home base, family pools' },
        { name: 'W Hotels (Marriott)', tier: 'Ambassador Elite', reason: 'Ski resorts (W Verbier), earns Bonvoy points' },
      ],
      roomPreferences: ['High floor', 'King bed', 'Pool view (tropical)', 'Mountain view (ski)', 'Connecting room for kids when traveling with family'],
      specialRequests: ['Extra towels for swim training', 'Ironing board', 'Kids amenities for Leo', 'Late checkout (Globalist/Ambassador)', 'Gym access 24/7'],
    },
    rewards: {
      strategies: [
        { goal: 'SQ Suites A380 SIN→LHR (double bed suite)', programsInvolved: ['Singapore KrisFlyer', 'Chase UR'], pointsNeeded: 244000, currentProgress: 310000, notes: 'Has enough KrisFlyer miles! Book Saver award when released 355 days before.' },
        { goal: 'Ritz-Carlton Kyoto — 5 nights on points for family Japan trip', programsInvolved: ['Marriott Bonvoy'], pointsNeeded: 350000, currentProgress: 620000, notes: 'Ambassador Elite = guaranteed suite. Use 5th Night Free = 280K points.' },
        { goal: 'Park Hyatt Zürich on points during ski trips', programsInvolved: ['World of Hyatt', 'Chase UR'], pointsNeeded: 125000, currentProgress: 210000, notes: 'Globalist suite upgrade confirmed. Transfer from Chase UR if needed.' },
        { goal: 'United Polaris upgrade SFO→SIN with miles', programsInvolved: ['United MileagePlus'], pointsNeeded: 120000, currentProgress: 275000, notes: 'Use for last-minute upgrades when SQ not available. GPU certificates as 1K.' },
        { goal: 'AA Business SIN→GRU via DFW for Brazil trips', programsInvolved: ['American AAdvantage', 'Amex MR'], pointsNeeded: 115000, currentProgress: 165000, notes: 'Transfer from Amex MR to top up. Flagship First DFW lounge.' },
        { goal: 'Maintain SQ PPS Club — spend S$25K on SQ flights', programsInvolved: ['Singapore KrisFlyer'], pointsNeeded: 25000, currentProgress: 18000, notes: 'Need S$7K more revenue flights on SQ by Dec. Route London/Europe via SQ.' },
      ],
      awardWalletConnected: true,
      preferredTransferPartners: ['Chase UR → Hyatt (1:1, best value)', 'Chase UR → United (1:1)', 'Amex MR → Singapore Airlines (1:1)', 'Amex MR → ANA (1:1, sweet spots)', 'Amex MR → Delta (variable)'],
      targetRedemptions: [
        'SQ Suites A380 double bed (bucket list)',
        'Ritz-Carlton Kyoto family trip on Bonvoy points',
        'Park Hyatt Zürich suite for ski trips',
        'W Verbier on Bonvoy points for family ski',
        'United Polaris upgrade certificates (1K benefit)',
      ],
    },
    dining: {
      favouriteRestaurants: [
        { name: 'Les Amis', city: 'Singapore', cuisine: 'French', michelinStars: 2, occasion: 'Birthday dinners & celebrations' },
        { name: 'Odette', city: 'Singapore', cuisine: 'French', michelinStars: 3, occasion: 'Anniversary dinner' },
        { name: 'Burnt Ends', city: 'Singapore', cuisine: 'Modern Australian BBQ', michelinStars: 1, occasion: 'Weekend family dinner' },
        { name: 'CUT by Wolfgang Puck', city: 'Singapore', cuisine: 'American Steakhouse', occasion: 'Weekday business lunch' },
        { name: 'Waku Ghin', city: 'Singapore', cuisine: 'Japanese Degustation', michelinStars: 2, occasion: 'Special occasions' },
        { name: 'Zén', city: 'Singapore', cuisine: 'Scandinavian', michelinStars: 3, occasion: 'Fine dining experience' },
        { name: 'Benu', city: 'San Francisco', cuisine: 'Asian-American', michelinStars: 3, occasion: 'SF business trips' },
        { name: 'French Laundry', city: 'Napa Valley', cuisine: 'French-American', michelinStars: 3, occasion: 'Annual wine trip' },
        { name: 'Hawksmoor', city: 'London', cuisine: 'British Steakhouse', occasion: 'London business trips' },
        { name: 'Tantris', city: 'Munich', cuisine: 'German Modern', michelinStars: 2, occasion: 'Munich visits' },
        { name: 'The Restaurant (Dolder Grand)', city: 'Zürich', cuisine: 'European', michelinStars: 2, occasion: 'Zürich banking trips' },
        { name: 'D.O.M.', city: 'São Paulo', cuisine: 'Brazilian Modern', michelinStars: 2, occasion: 'São Paulo business' },
      ],
      diningStyle: 'Fine dining 3-4x/week. Premium steakhouses for business. Michelin-starred for celebrations. Family restaurants on weekends.',
      reservationApps: ['Resy', 'Chope (Singapore)', 'OpenTable', 'Hotel concierge'],
    },
    events: {
      annualEvents: [
        { name: 'John\'s Birthday', date: 'October 5', type: 'birthday', notes: 'Dinner at Les Amis (2 Michelin ⭐) Singapore' },
        { name: 'Sarah\'s (wife) Birthday', date: 'August 28', type: 'birthday', notes: 'Private dining at JAAN, Singapore' },
        { name: 'Emma\'s Birthday', date: 'July 22', type: 'birthday', notes: 'Adventure Cove + dinner — she\'s turning 15' },
        { name: 'Leo\'s Birthday', date: 'April 12', type: 'birthday', notes: 'Kids party at Tanglin Club — turning 5' },
        { name: 'Wedding Anniversary', date: 'October 18', type: 'anniversary', notes: '8th anniversary — Odette (3⭐)' },
        { name: 'Mother\'s Day', date: 'May 10', type: 'tradition', notes: 'Flowers to Mom in Boston' },
        { name: 'Father\'s Day', date: 'June 21', type: 'tradition', notes: 'Video call with Dad in Boston' },
        { name: '4th of July', date: 'July 4', type: 'holiday', notes: 'BBQ at American Club Singapore' },
        { name: 'Thanksgiving', date: 'November (4th Thu)', type: 'holiday', notes: 'Thanksgiving dinner at American Club' },
        { name: 'Christmas', date: 'December 25', type: 'holiday', notes: 'Family ski in Zermatt every year' },
        { name: 'New Year\'s Eve', date: 'December 31', type: 'gala', notes: 'Black tie at The Omnia Zermatt' },
        { name: 'Singapore National Day', date: 'August 9', type: 'holiday', notes: 'Marina Bay fireworks with family' },
        { name: 'Ironman 70.3 Bintan', date: 'April (varies)', type: 'tradition', notes: 'Annual race, family comes to watch' },
        { name: 'Challenge Roth', date: 'June (varies)', type: 'tradition', notes: 'Full triathlon in Germany' },
        { name: 'Singapore Grand Prix', date: 'September', type: 'tradition', notes: 'VIP Paddock access' },
      ],
      galaAndSocial: [
        'Singapore Tech Founders Gala (Capella Sentosa)',
        'American Chamber of Commerce Gala (Shangri-La)',
        'TechScale Global Annual Dinner (SF — Black Tie)',
        'Singapore Charity Ball (Ritz-Carlton)',
        'UWC International School Fundraiser Gala',
        'Ironman Athletes Awards Night',
        'Singapore Grand Prix Paddock Party',
      ],
      traditions: [
        'Family ski in Swiss Alps every Christmas & Easter',
        'Ironman 70.3 Bintan every April',
        'Challenge Roth every June',
        '4th of July BBQ at American Club',
        'Thanksgiving at American Club',
        'Singapore GP every September',
        'Annual Napa Valley wine trip (French Laundry)',
        'Family Sunday brunch at Dempsey Hill',
      ],
    },
    lifestyle: {
      sports: ['swimming', 'cycling', 'running', 'triathlon', 'skiing'],
      spectatorSports: ['formula1 (Singapore GP)'],
      hobbies: ['triathlon training', 'fine dining', 'wine collecting', 'bespoke tailoring', 'travel hacking'],
      dietary: 'Meat lover — premium steaks, wagyu, dry-aged. High protein for training.',
      favoriteCuisines: ['American', 'Japanese', 'Italian', 'Singaporean', 'Brazilian', 'French'],
      alcoholPreference: 'Wine (Napa Cabernet, Burgundy Pinot Noir) and craft beer. Social drinker — 2-3 glasses max.',
      cookingHabits: 'Never cooks. Eats out constantly — fine dining restaurants or hotel F&B.',
      shoppingStyle: 'Bespoke suits (Singapore tailor), premium sports gear (Cervélo bikes, Roka wetsuits)',
    },
    accommodation: {
      type: 'Business hotels with full amenities + family-friendly for vacations',
      mustHave: ['gym (24/7)', 'sauna', 'pool (25m+)', 'laundry-service', 'business-center', 'kids-club (family trips)'],
      preferredChains: ['Ritz-Carlton', 'JW Marriott', 'Shangri-La', 'Park Hyatt', 'W Hotels (ski)'],
    },
    services: {
      usesFrequently: ['Laundry & dry cleaning (suits daily)', 'Sports massage', 'Bespoke tailoring', 'Restaurant reservations (Resy, Chope)', 'Concierge services'],
      transportation: ['Singapore Airlines Business', 'Grab (Singapore)', 'Uber (US/Europe)', 'Sixt car rental (Europe)', 'National car rental (US)'],
    },
    family: {
      status: 'Married',
      children: [
        { age: 14, name: 'Emma', birthday: '2012-07-22' },
        { age: 4, name: 'Leo', birthday: '2022-04-12' },
      ],
      pets: [],
      partnerName: 'Sarah',
      partnerBirthday: '1982-08-28',
    },
    calendar: generateJohnCalendar(),
    aiContext: `ACTIVE DEMO PERSONA: John Mitchell, 46, American, relocated to Singapore with family. VP of Engineering at TechScale Global. Wife Sarah and 2 children: Emma (14, birthday Jul 22) and Leo (4, birthday Apr 12). Birthday: October 5. Wedding anniversary: October 18 (8th year).

TRAVEL: Flies business class. Frequent cities: San Francisco, São Paulo, London, Munich, Zürich, Napa Valley. Next trips: SF (Mar 3), Brazil (Mar 6), London (Mar 15), Munich (Mar 18), Zürich (Mar 20), Ironman Bintan (Apr 4), Verbier ski (Apr 18), Napa/French Laundry (Jun 5), Challenge Roth (Jun 20), Zermatt ski (Aug 1), Christmas Zermatt (Dec 20).

AVIATION PREFERENCES:
- Favourite airlines: Singapore Airlines (PPS Club, home carrier), United (SFO hub, 1K), Lufthansa (Senator, MUC/ZRH), SWISS (ZRH routes), American Airlines (Platinum Pro, Latin America)
- ALWAYS books WINDOW for day flights, AISLE for red-eyes. Pre-selects specific seats:
  • SQ A380 Business: Seat 11A (upper deck window)
  • SQ A350 Business: Seat 12A (window, forward mini-cabin)
  • SQ A380 Suites: Seat 2A (target redemption — double bed suite!)
  • United B777 Polaris: Seat 6C (true aisle, 1-2-1)
  • Lufthansa A350: Seat 2A (window, Senator boarding)
  • SWISS A330: Seat 3A (throne seat)
  • AA B787: Seat 5A (São Paulo routes)
- Meal: Western/steak option. SQ Book-the-Cook: Wagyu tenderloin.
- Lounges: SQ The Private Room (Changi T3), SQ SilverKris First, United Polaris (SFO), LH Senator (MUC), SWISS Senator (ZRH), Amex Centurion (SFO)

HOTEL PREFERENCES:
- Ritz-Carlton (Ambassador Elite — personal ambassador), Park Hyatt (Globalist — suite upgrades), JW Marriott (Ambassador), Shangri-La (Diamond), W Hotels (ski resorts)
- Room: High floor, King, pool/mountain view, connecting room for kids
- Special: Extra towels (swimmer), ironing board, kids amenities for Leo, 24/7 gym, late checkout

REWARD STRATEGIES (AwardWallet connected):
- SQ Suites A380 double bed SIN→LHR: HAS 310K KrisFlyer miles (needs 244K). BOOK when Saver released 355 days before!
- Ritz-Carlton Kyoto family trip: HAS 620K Bonvoy (needs 280K with 5th Night Free). Ambassador suite guaranteed!
- Park Hyatt Zürich for ski trips: HAS 210K Hyatt (needs 125K). Globalist = confirmed suite.
- W Verbier ski on Bonvoy: Use Marriott points for family ski weeks.
- United Polaris upgrade: HAS 275K MileagePlus + GPU certificates as 1K member.
- AA Business to São Paulo: HAS 165K AAdvantage. Transfer Amex MR to top up.
- Maintain SQ PPS Club: Needs S$7K more revenue flights on SQ. ROUTE LONDON/EUROPE VIA SQ!
- Transfer partners: Chase UR → Hyatt 1:1 (best), Chase UR → United 1:1, Amex MR → SQ 1:1, Amex MR → ANA 1:1
ALWAYS suggest SQ-operated routes to maintain PPS Club status.
ALWAYS suggest Marriott properties to earn Bonvoy for Ambassador benefits.

DINING: Fine dining 3-4x/week. Les Amis (2⭐ Singapore — birthdays), Odette (3⭐ — anniversary), Burnt Ends (1⭐ — weekends), CUT (business lunch), Waku Ghin (2⭐), Zén (3⭐), Benu (3⭐ SF), French Laundry (3⭐ Napa), Hawksmoor (London steaks), Tantris (2⭐ Munich), D.O.M. (2⭐ São Paulo). Books via Resy, Chope.

ANNUAL EVENTS & TRADITIONS:
- John's birthday (Oct 5): Les Amis dinner
- Sarah's birthday (Aug 28): JAAN private dining
- Emma's birthday (Jul 22): Adventure Cove + dinner
- Leo's birthday (Apr 12): Tanglin Club kids party
- Wedding anniversary (Oct 18): Odette (3⭐)
- 4th of July: American Club BBQ
- Thanksgiving: American Club dinner
- Christmas: Family ski Zermatt (Grand Hotel Zermatterhof)
- NYE: Black tie gala at The Omnia Zermatt
- Singapore National Day (Aug 9): Marina Bay fireworks
- Ironman 70.3 Bintan (April)
- Challenge Roth (June)
- Singapore GP (September): VIP Paddock
- Annual Napa wine trip (French Laundry)
- Family Sunday brunch: Dempsey Hill

GALA & SOCIAL: Tech Founders Gala (Capella), AmCham Gala (Shangri-La), TechScale Annual Dinner (SF, black tie), Singapore Charity Ball (Ritz-Carlton), UWC Fundraiser, Ironman Awards Night, Singapore GP Paddock Party.

FAMILY NEEDS: Emma (14) — UWC Dover school, piano, teen activities. Leo (4) — Tanglin Club swim class, playgroups. Sarah — settling in, needs local services, social connections. All visas being processed.

LIFESTYLE: Serious triathlete — swims 3km, bikes 60km, runs 8km daily. Races: Ironman 70.3, Challenge Roth. Premium steaks, wagyu, dry-aged. Wine collector (Napa Cab, Burgundy Pinot). Bespoke suits, daily laundry. Cervélo bikes, Roka wetsuits.

PERSONALITY: Action-oriented, values efficiency, family-first when not working. Needs help coordinating family logistics alongside heavy business travel. Appreciates proactive suggestions about reward point usage, seat selection, family restaurants, children's activities, relocation services, and race logistics.`,
  },
};

// ───────────────────────────────────────────────────────────────
// DYNAMIC PERSONA WRAPPER
// Both `calendar` and `aiContext` are derived from TODAY every time
// a persona is read. This guarantees:
//   • The concierge always speaks in future tense (no stale "Mar 2"
//     dates frozen at module load).
//   • Birthdays & annual events roll forward to their next occurrence.
//   • If the user keeps a tab open across midnight, the next read
//     returns a freshly anchored calendar.
// We cache per UTC-day to avoid recomputing on every property read.
// ───────────────────────────────────────────────────────────────

const personaCache = new Map<string, { dayKey: string; persona: DemoPersona }>();

const todayKey = () => {
  const t = new Date();
  return `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
};

// Build dynamic upcomingTrips list from the freshly generated calendar.
const buildUpcomingTrips = (calendar: DemoCalendarEvent[]): DemoPersona['travel']['upcomingTrips'] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const travelEvents = calendar
    .filter((e) => e.type === 'travel' && new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 12);
  return travelEvents.map((e) => {
    // Title looks like: "✈️ BA15 Business Class to Singapore (Seat 14A)"
    const destMatch = e.title.match(/to\s+([A-Z][\w\s.\-']+?)(?:\s*\(|$)/);
    const destination = destMatch ? destMatch[1].trim() : e.location;
    const d = new Date(e.date);
    return {
      destination,
      dates: `${formatShort(d)}, ${d.getFullYear()}`,
      purpose: e.title.replace(/^[✈️🚄\s]+/u, '').slice(0, 80),
    };
  });
};

// Build the dynamic AI brief that gets injected into the concierge prompt.
const buildAiContext = (
  base: DemoPersona,
  calendar: DemoCalendarEvent[],
): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLabel = formatLong(today);

  // Next 8 travel events as concrete future references
  const upcomingTravel = calendar
    .filter((e) => e.type === 'travel' && new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)
    .map((e) => {
      const d = new Date(e.date);
      const destMatch = e.title.match(/to\s+([A-Z][\w\s.\-']+?)(?:\s*\(|$)/);
      const dest = destMatch ? destMatch[1].trim() : e.location;
      return `${dest} (${formatShort(d)})`;
    })
    .join(', ');

  // Next 5 birthdays / annual events
  const upcomingMilestones = calendar
    .filter((e) => ['birthday', 'gala', 'holiday'].includes(e.type) && new Date(e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)
    .map((e) => `${e.title.replace(/^[🎂🎄🎆🎭💐🥂🇺🇸🇸🇬🦃\s]+/u, '').slice(0, 60)} (${formatShort(new Date(e.date))})`)
    .join('; ');

  // Inject a fresh "today" header + dynamic future references in front of
  // the static persona brief, then strip the original "Next trips: ..." line
  // so the AI never sees stale anchor dates.
  const cleaned = base.aiContext
    .replace(/Next trips:[^.]*\./i, '')
    .replace(/\s{2,}/g, ' ');

  return [
    `TODAY IS ${todayLabel}. All dates below are forward-looking — never refer to events in the past tense.`,
    `UPCOMING TRAVEL (next 90 days): ${upcomingTravel || 'No travel scheduled.'}`,
    `UPCOMING MILESTONES: ${upcomingMilestones || 'None in the next 90 days.'}`,
    '',
    cleaned,
  ].join('\n');
};

const buildPersona = (id: string): DemoPersona | undefined => {
  const base = DEMO_PERSONAS_BASE[id];
  if (!base) return undefined;
  // Always regenerate calendar from today — generators are pure, ~O(few hundred items)
  const calendar =
    id === 'meghan' ? generateMeghanCalendar() :
    id === 'john'   ? generateJohnCalendar()   :
    base.calendar;

  return {
    ...base,
    calendar,
    travel: { ...base.travel, upcomingTrips: buildUpcomingTrips(calendar) },
    aiContext: buildAiContext(base, calendar),
  };
};

const getPersona = (id: string): DemoPersona | undefined => {
  const key = todayKey();
  const cached = personaCache.get(id);
  if (cached && cached.dayKey === key) return cached.persona;
  const fresh = buildPersona(id);
  if (fresh) personaCache.set(id, { dayKey: key, persona: fresh });
  return fresh;
};

export const DEMO_PERSONAS: Record<string, DemoPersona> = new Proxy(DEMO_PERSONAS_BASE, {
  get(_target, prop: string) {
    if (typeof prop !== 'string') return undefined;
    return getPersona(prop);
  },
  ownKeys(target) {
    return Reflect.ownKeys(target);
  },
  getOwnPropertyDescriptor(target, prop) {
    if (prop in target) {
      return { enumerable: true, configurable: true, value: getPersona(prop as string) };
    }
    return undefined;
  },
  has(target, prop) {
    return prop in target;
  },
}) as Record<string, DemoPersona>;

/** Force-refresh the cached persona snapshots (e.g. on day rollover). */
export const refreshDemoPersonas = (): void => {
  personaCache.clear();
};
