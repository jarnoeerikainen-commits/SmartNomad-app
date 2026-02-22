// Demo Persona Data — Meghan (Business Woman) & John (Expat Man)

export interface DemoCalendarEvent {
  date: string; // ISO date
  time: string;
  title: string;
  type: 'meeting' | 'sport' | 'travel' | 'personal' | 'family' | 'legal' | 'wellness';
  location?: string;
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
  };
  travel: {
    style: string;
    flightClass: string;
    averageTravelDays: number;
    frequentDestinations: string[];
    vacationDestinations: string[];
    upcomingTrips: { destination: string; dates: string; purpose: string }[];
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
    children: { age: number; name: string }[];
    pets: string[];
  };
  calendar: DemoCalendarEvent[];
  aiContext: string; // Rich text summary for the AI system prompt
}

const generateMeghanCalendar = (): DemoCalendarEvent[] => {
  const events: DemoCalendarEvent[] = [];
  const base = new Date(2026, 1, 22); // Feb 22, 2026

  // This week & next weeks
  const meghanEvents: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '06:30', title: 'Morning Yoga', type: 'sport', location: 'Equinox London' },
    { time: '08:00', title: 'Exec Team Standup', type: 'meeting', location: 'Zoom' },
    { time: '09:30', title: 'Q1 Campaign Review', type: 'meeting', location: 'Office' },
    { time: '12:00', title: 'Lunch — Sushi Samba', type: 'personal', location: 'London' },
    { time: '14:00', title: 'Client Presentation — APAC Strategy', type: 'meeting', location: 'Office' },
    { time: '17:00', title: 'Gym — Strength Training', type: 'sport', location: 'Equinox London' },
    { time: '19:30', title: 'Facial & Skin Treatment', type: 'wellness', location: 'Dr. Barbara Sturm Clinic' },
  ];

  // Fill 3 weeks of packed schedule
  for (let w = 0; w < 21; w++) {
    const d = new Date(base);
    d.setDate(d.getDate() + w);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) continue; // Sunday off

    const dateStr = d.toISOString().split('T')[0];
    const dayEvents = dayOfWeek === 6
      ? [
          { time: '07:00', title: '10K Run — Hyde Park', type: 'sport' as const, location: 'London' },
          { time: '10:00', title: 'Deep Tissue Massage', type: 'wellness' as const, location: 'Spa' },
          { time: '14:00', title: 'Shopping & Self-care', type: 'personal' as const, location: 'Mayfair' },
        ]
      : meghanEvents.slice(0, 5 + (w % 3));

    dayEvents.forEach(ev => events.push({ ...ev, date: dateStr }));
  }

  // Upcoming trips
  events.push(
    { date: '2026-03-02', time: '07:00', title: '✈️ Flight to Singapore — BA15 Business', type: 'travel', location: 'LHR → SIN' },
    { date: '2026-03-03', time: '09:00', title: 'Client Workshop — Marina Bay Sands', type: 'meeting', location: 'Singapore' },
    { date: '2026-03-05', time: '14:00', title: '✈️ Flight to Hong Kong — CX734', type: 'travel', location: 'SIN → HKG' },
    { date: '2026-03-08', time: '09:00', title: 'F1 Testing Weekend', type: 'personal', location: 'Bahrain' },
    { date: '2026-03-15', time: '08:00', title: '✈️ Flight to New York — BA117 Business', type: 'travel', location: 'LHR → JFK' },
    { date: '2026-03-16', time: '10:00', title: 'NY Office — Brand Summit', type: 'meeting', location: 'New York' },
    { date: '2026-03-22', time: '06:00', title: '✈️ Flight to Dubai — EK2 Business', type: 'travel', location: 'LHR → DXB' },
    { date: '2026-03-23', time: '09:00', title: 'Dubai Media Partners Meeting', type: 'meeting', location: 'Dubai' },
    { date: '2026-04-05', time: '08:00', title: '✈️ Maldives Vacation — 7 days', type: 'travel', location: 'LHR → MLE' },
    { date: '2026-05-10', time: '07:00', title: '✈️ Safari Trip — Kenya', type: 'travel', location: 'LHR → NBO' },
    { date: '2026-06-14', time: '10:00', title: 'F1 Grand Prix — Silverstone', type: 'personal', location: 'UK' },
    { date: '2026-07-01', time: '08:00', title: '✈️ Oslo — Nordic Strategy Week', type: 'travel', location: 'LHR → OSL' },
  );

  return events;
};

const generateJohnCalendar = (): DemoCalendarEvent[] => {
  const events: DemoCalendarEvent[] = [];
  const base = new Date(2026, 1, 22);

  const johnWeekday: Omit<DemoCalendarEvent, 'date'>[] = [
    { time: '05:30', title: 'Swim Training — 3km', type: 'sport', location: 'OCBC Aquatic Centre' },
    { time: '07:30', title: 'Family Breakfast', type: 'family', location: 'Home' },
    { time: '08:30', title: 'School Drop-off — Emma (14)', type: 'family', location: 'UWC Dover' },
    { time: '09:00', title: 'Executive Standup — APAC Team', type: 'meeting', location: 'Office' },
    { time: '10:00', title: 'Product Roadmap Review', type: 'meeting', location: 'Office' },
    { time: '12:30', title: 'Lunch — CUT by Wolfgang Puck', type: 'personal', location: 'Marina Bay Sands' },
    { time: '14:00', title: 'Board Strategy Call — US HQ', type: 'meeting', location: 'Zoom' },
    { time: '16:00', title: 'Immigration Lawyer — EP Status', type: 'legal', location: 'Raffles Place' },
    { time: '17:30', title: 'Run — 8km Marina Bay', type: 'sport', location: 'Singapore' },
    { time: '19:00', title: 'Family Dinner — Burnt Ends', type: 'family', location: 'Singapore' },
  ];

  for (let w = 0; w < 21; w++) {
    const d = new Date(base);
    d.setDate(d.getDate() + w);
    const dayOfWeek = d.getDay();
    if (dayOfWeek === 0) {
      events.push(
        { date: d.toISOString().split('T')[0], time: '07:00', title: 'Long Bike Ride — 60km', type: 'sport', location: 'East Coast Park' },
        { date: d.toISOString().split('T')[0], time: '10:00', title: 'Family Brunch', type: 'family', location: 'Dempsey Hill' },
        { date: d.toISOString().split('T')[0], time: '15:00', title: 'Leo (4) — Swimming Class', type: 'family', location: 'Tanglin Club' },
      );
      continue;
    }
    if (dayOfWeek === 6) {
      events.push(
        { date: d.toISOString().split('T')[0], time: '06:00', title: 'Triathlon Brick Session (Swim+Run)', type: 'sport', location: 'East Coast' },
        { date: d.toISOString().split('T')[0], time: '10:00', title: 'Emma — Piano Lesson', type: 'family', location: 'Tanglin' },
        { date: d.toISOString().split('T')[0], time: '12:00', title: 'Family Lunch — Haidilao Hot Pot', type: 'family', location: 'Singapore' },
        { date: d.toISOString().split('T')[0], time: '15:00', title: 'Sports Massage', type: 'wellness', location: 'Spa' },
      );
      continue;
    }
    const dateStr = d.toISOString().split('T')[0];
    johnWeekday.slice(0, 7 + (w % 3)).forEach(ev => events.push({ ...ev, date: dateStr }));
  }

  // Upcoming trips & key events
  events.push(
    { date: '2026-03-01', time: '09:00', title: 'Visa Processing — Dependent Pass (Wife)', type: 'legal', location: 'MOM Singapore' },
    { date: '2026-03-03', time: '08:00', title: '✈️ Flight to San Francisco — SQ32 Business', type: 'travel', location: 'SIN → SFO' },
    { date: '2026-03-04', time: '09:00', title: 'US Board Meeting', type: 'meeting', location: 'San Francisco' },
    { date: '2026-03-06', time: '07:00', title: '✈️ Flight to São Paulo — UA862', type: 'travel', location: 'SFO → GRU' },
    { date: '2026-03-09', time: '10:00', title: 'Brazil Partner Launch', type: 'meeting', location: 'São Paulo' },
    { date: '2026-03-15', time: '08:00', title: '✈️ Flight to London — SQ322 Business', type: 'travel', location: 'SIN → LHR' },
    { date: '2026-03-16', time: '09:00', title: 'UK Office — Quarterly Review', type: 'meeting', location: 'London' },
    { date: '2026-03-18', time: '07:00', title: '✈️ Flight to Munich — LH2479', type: 'travel', location: 'LHR → MUC' },
    { date: '2026-03-19', time: '09:00', title: 'Germany Partner Meeting', type: 'meeting', location: 'Munich' },
    { date: '2026-03-20', time: '14:00', title: '✈️ Train to Zürich', type: 'travel', location: 'MUC → ZRH' },
    { date: '2026-03-21', time: '09:00', title: 'Swiss Banking & Tax Meeting', type: 'meeting', location: 'Zürich' },
    { date: '2026-03-25', time: '09:00', title: 'International School Interview — Leo', type: 'family', location: 'Singapore' },
    { date: '2026-04-04', time: '06:00', title: '🏊 Ironman 70.3 — Bintan', type: 'sport', location: 'Indonesia' },
    { date: '2026-04-18', time: '07:00', title: '⛷️ Family Ski Trip — Verbier', type: 'travel', location: 'Switzerland' },
    { date: '2026-06-20', time: '06:00', title: '🏊 Triathlon Race — Challenge Roth', type: 'sport', location: 'Germany' },
    { date: '2026-08-01', time: '07:00', title: '⛷️ Family Ski Trip — Zermatt', type: 'travel', location: 'Switzerland' },
    { date: '2026-03-10', time: '14:00', title: 'Suit Fitting — Bespoke Tailor', type: 'personal', location: 'Singapore' },
    { date: '2026-03-12', time: '10:00', title: 'Laundry Service Pickup — Suits', type: 'personal', location: 'Singapore' },
  );

  return events;
};

export const DEMO_PERSONAS: Record<string, DemoPersona> = {
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
      bio: 'Marketing Director with 100+ travel days per year. Wellness enthusiast, F1 fanatic, and dedicated foodie.',
    },
    travel: {
      style: 'business',
      flightClass: 'Business Class',
      averageTravelDays: 120,
      frequentDestinations: ['Singapore', 'New York', 'Dubai', 'Hong Kong', 'Oslo'],
      vacationDestinations: ['Maldives', 'Kenya', 'Tanzania', 'Brazil'],
      upcomingTrips: [
        { destination: 'Singapore', dates: 'Mar 2-4, 2026', purpose: 'Client workshop' },
        { destination: 'Hong Kong', dates: 'Mar 5-7, 2026', purpose: 'APAC meetings' },
        { destination: 'New York', dates: 'Mar 15-19, 2026', purpose: 'Brand Summit' },
        { destination: 'Dubai', dates: 'Mar 22-25, 2026', purpose: 'Media partners' },
        { destination: 'Maldives', dates: 'Apr 5-12, 2026', purpose: 'Vacation' },
        { destination: 'Kenya', dates: 'May 10-17, 2026', purpose: 'Safari' },
        { destination: 'Oslo', dates: 'Jul 1-5, 2026', purpose: 'Nordic strategy' },
      ],
    },
    lifestyle: {
      sports: ['yoga', 'gym', 'running'],
      spectatorSports: ['formula1'],
      hobbies: ['skincare', 'wellness', 'fine-dining', 'photography'],
      dietary: 'Healthy eating, fish-focused, pescatarian-leaning',
      favoriteCuisines: ['Japanese', 'Mediterranean', 'Peruvian', 'French'],
      alcoholPreference: 'Non-alcoholic drinks preferred — mocktails, kombucha, sparkling water',
      cookingHabits: 'Orders food delivery frequently — both to home and hotel rooms',
      shoppingStyle: 'Luxury brands, skincare products',
    },
    accommodation: {
      type: 'Luxury hotels & boutique hotels',
      mustHave: ['gym', 'sauna', 'spa', 'room-service', 'laundry-service'],
      preferredChains: ['Four Seasons', 'Mandarin Oriental', 'Aman', 'The Edition'],
    },
    services: {
      usesFrequently: ['Laundry & dry cleaning', 'Massage & spa', 'Skincare treatments', 'Food delivery', 'Room service'],
      transportation: ['Uber (primary)', 'Business class flights', 'Airport lounge access'],
    },
    family: {
      status: 'Single',
      children: [],
      pets: [],
    },
    calendar: generateMeghanCalendar(),
    aiContext: `ACTIVE DEMO PERSONA: Meghan Clarke, 42, British, lives in London. Marketing Director at Global Brands Corp with 120+ travel days/year. Single, no family.

TRAVEL: Flies business class exclusively. Frequent cities: Singapore, New York, Dubai, Hong Kong, Oslo. Vacations: Maldives, Africa safaris, Brazil nature. Next trips: Singapore (Mar 2), Hong Kong (Mar 5), New York (Mar 15), Dubai (Mar 22), Maldives vacation (Apr 5), Kenya safari (May 10), Oslo (Jul 1).

LIFESTYLE: Yoga every morning, gym daily, runs 10K on weekends. Watches F1 from trackside — Silverstone in June. Heavy skincare routine, frequent massage/spa. Eats mainly fish and healthy food, loves Japanese, Mediterranean, Peruvian, French cuisines. Prefers non-alcoholic drinks (mocktails, kombucha). Orders food delivery constantly — to home and hotel rooms via Uber Eats.

ACCOMMODATION: Must have gym and sauna. Uses laundry services extensively. Prefers Four Seasons, Mandarin Oriental, Aman, The Edition. Always needs room service.

TRANSPORT: Uses Uber constantly for everything. Business class flights only. Airport lounges always.

CALENDAR: Extremely busy — back-to-back meetings, workouts, spa appointments, travel. Almost no free time. Needs proactive booking assistance.

PERSONALITY: Efficient, direct, appreciates proactive suggestions. Doesn't waste time. Values quality and convenience above all.`,
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
      bio: 'VP Engineering, just relocated family to Singapore. Triathlete, meat lover, suit wearer. Managing global teams across US, Europe & APAC.',
    },
    travel: {
      style: 'business + family',
      flightClass: 'Business Class',
      averageTravelDays: 90,
      frequentDestinations: ['San Francisco', 'São Paulo', 'London', 'Munich', 'Zürich'],
      vacationDestinations: ['Verbier (skiing)', 'Zermatt (skiing)', 'Bali', 'Japan'],
      upcomingTrips: [
        { destination: 'San Francisco', dates: 'Mar 3-5, 2026', purpose: 'Board meeting' },
        { destination: 'São Paulo', dates: 'Mar 6-9, 2026', purpose: 'Partner launch' },
        { destination: 'London', dates: 'Mar 15-17, 2026', purpose: 'Quarterly review' },
        { destination: 'Munich', dates: 'Mar 18-19, 2026', purpose: 'Partner meeting' },
        { destination: 'Zürich', dates: 'Mar 20-22, 2026', purpose: 'Banking & tax' },
        { destination: 'Bintan', dates: 'Apr 4, 2026', purpose: 'Ironman 70.3 race' },
        { destination: 'Verbier', dates: 'Apr 18-25, 2026', purpose: 'Family ski trip' },
      ],
    },
    lifestyle: {
      sports: ['swimming', 'cycling', 'running', 'triathlon', 'skiing'],
      spectatorSports: [],
      hobbies: ['triathlon training', 'fine dining', 'wine'],
      dietary: 'Meat lover — premium steaks, good restaurants',
      favoriteCuisines: ['American', 'Japanese', 'Italian', 'Singaporean', 'Brazilian'],
      alcoholPreference: 'Wine and craft beer — social drinker',
      cookingHabits: 'Eats out constantly — fine dining restaurants',
      shoppingStyle: 'Bespoke suits, sports gear',
    },
    accommodation: {
      type: 'Business hotels with full amenities',
      mustHave: ['gym', 'sauna', 'pool', 'laundry-service', 'business-center'],
      preferredChains: ['Ritz-Carlton', 'JW Marriott', 'Shangri-La', 'Park Hyatt'],
    },
    services: {
      usesFrequently: ['Laundry & dry cleaning (suits daily)', 'Sports massage', 'Bespoke tailoring', 'Restaurant reservations'],
      transportation: ['Business class flights', 'Grab/Uber', 'Airport lounges'],
    },
    family: {
      status: 'Married',
      children: [
        { age: 14, name: 'Emma' },
        { age: 4, name: 'Leo' },
      ],
      pets: [],
    },
    calendar: generateJohnCalendar(),
    aiContext: `ACTIVE DEMO PERSONA: John Mitchell, 46, American, just moved to Singapore with family. VP of Engineering at TechScale Global. Wife and 2 children: Emma (14) and Leo (4). Family still settling in — visa processing, school enrollment, home setup all in progress.

TRAVEL: Flies business class. Frequent cities: San Francisco, São Paulo, London, Munich, Zürich. Next trips: SF (Mar 3), Brazil (Mar 6), London (Mar 15), Munich (Mar 18), Zürich (Mar 20). Family ski trips to Alps (Verbier Apr, Zermatt Aug). Ironman 70.3 in Bintan (Apr 4).

LIFESTYLE: Serious triathlete — swims, bikes, runs daily. Races multiple times a year (Ironman 70.3, Challenge Roth). Loves premium steaks and fine dining. Eats out constantly at top restaurants. Social drinker — wine and craft beer. Always wears bespoke suits, needs daily laundry/dry cleaning service.

FAMILY NEEDS: Emma (14) — international school (UWC Dover), piano lessons, needs teen activities. Leo (4) — swimming classes, playgroups, needs childcare/nanny options. Wife — settling in, needs local services, social connections, family activities. All family visas being processed.

ACCOMMODATION: Must have gym, sauna, pool. Uses Ritz-Carlton, JW Marriott, Shangri-La, Park Hyatt.

CALENDAR: Packed with meetings, sports training, children's activities, lawyer appointments, visa processing, travel. Very little free time. Needs serious logistical support.

PERSONALITY: Action-oriented, values efficiency, family-first when not working. Needs help coordinating family logistics alongside heavy business travel. Appreciates proactive suggestions about children's activities, family restaurants, relocation services.`,
  },
};
