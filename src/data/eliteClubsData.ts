import { EliteClub, ClubType } from '@/types/eliteClub';

export const ELITE_CLUBS: EliteClub[] = [
  // LONDON
  {
    id: 'LON-001',
    name: "Annabel's",
    type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB],
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    established: 1963,
    membership: {
      type: 'Invitation Only',
      price: { initiation: 2500, annual: 3500, currency: 'USD' },
      waitlist: 12
    },
    amenities: ['Fine Dining', 'Nightclub', 'Garden Terrace', 'Private Events', 'Wellness Spa', 'Cigar Lounge'],
    dressCode: 'Business Formal',
    website: 'https://annabels.co.uk',
    contact: {
      email: 'membership@annabels.co.uk',
      phone: '+44 20 7629 1096',
      address: '46 Berkeley Square, Mayfair, London W1J 5AT'
    },
    description: 'Legendary Mayfair private members club with iconic nightlife, Michelin-quality dining, and exclusive international events.',
    membershipProcess: 'Requires nomination by two existing members, followed by committee review. Average waiting period 12 months.',
    nominationRequired: true,
    rating: 4.9,
    featured: true
  },
  {
    id: 'LON-002',
    name: 'The Arts Club',
    type: [ClubType.ARTS_CLUB, ClubType.SOCIAL_CLUB],
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    established: 1863,
    membership: {
      type: 'Application',
      price: { initiation: 1500, annual: 2800, currency: 'USD' },
      waitlist: 6
    },
    amenities: ['Art Gallery', 'Fine Dining', 'Library', 'Private Events', 'Townhouse Rooms', 'Terrace'],
    dressCode: 'Smart Casual',
    website: 'https://theartsclub.co.uk',
    contact: {
      email: 'membership@theartsclub.co.uk',
      phone: '+44 20 7499 8581',
      address: '40 Dover Street, Mayfair, London W1S 4NP'
    },
    description: 'Historic private members club for artists, creatives, and art enthusiasts in the heart of Mayfair.',
    membershipProcess: 'Application requires creative industry credentials or significant art patronage. Interview with membership committee.',
    nominationRequired: false,
    rating: 4.7,
    featured: true
  },
  {
    id: 'LON-003',
    name: "5 Hertford Street (Loulou's)",
    type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB],
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    established: 2012,
    membership: {
      type: 'Invitation Only',
      price: { initiation: 1800, annual: 2400, currency: 'USD' },
      waitlist: 18
    },
    amenities: ['Restaurant', 'Nightclub', 'Private Dining', 'Events', 'Members Bar'],
    dressCode: 'Formal',
    website: 'https://5hertfordstreet.com',
    contact: {
      email: 'info@5hertfordstreet.com',
      phone: '+44 20 3141 0555',
      address: '5 Hertford Street, Mayfair, London W1J 7RU'
    },
    description: 'Ultra-exclusive Mayfair club favored by celebrities, aristocracy, and international elites.',
    membershipProcess: 'Strictly invitation only. Requires sponsorship from two existing members and personal interview.',
    nominationRequired: true,
    rating: 4.8
  },

  // NEW YORK
  {
    id: 'NYC-001',
    name: 'Soho House New York',
    type: [ClubType.PRIVATE_MEMBERS, ClubType.ARTS_CLUB],
    city: 'New York',
    country: 'United States',
    region: 'North America',
    established: 2003,
    membership: {
      type: 'Application',
      price: { initiation: 1000, annual: 2700, currency: 'USD' },
      waitlist: 8
    },
    amenities: ['Rooftop Pool', 'Gym', 'Screening Room', 'Restaurants', 'Bedrooms', 'Cowshed Spa'],
    dressCode: 'Smart Casual',
    website: 'https://sohohouse.com/houses/soho-house-new-york',
    contact: {
      email: 'newyork@sohohouse.com',
      phone: '+1 212 627 9800',
      address: '29-35 Ninth Avenue, New York, NY 10014'
    },
    description: 'Global private members club for creative professionals with access to 40+ houses worldwide.',
    membershipProcess: 'Application requires working in creative industry. Review process takes 4-8 weeks.',
    nominationRequired: false,
    rating: 4.6,
    featured: true
  },
  {
    id: 'NYC-002',
    name: 'The Core Club',
    type: [ClubType.BUSINESS_CLUB, ClubType.PRIVATE_MEMBERS],
    city: 'New York',
    country: 'United States',
    region: 'North America',
    established: 2005,
    membership: {
      type: 'Invitation Only',
      price: { initiation: 15000, annual: 15000, currency: 'USD' },
      waitlist: 24
    },
    amenities: ['Fine Dining', 'Wine Cellar', 'Library', 'Conference Rooms', 'Art Gallery', 'Private Events'],
    dressCode: 'Business Formal',
    website: 'https://thecoreclub.com',
    contact: {
      email: 'membership@thecoreclub.com',
      phone: '+1 212 223 5100',
      address: '66 East 55th Street, New York, NY 10022'
    },
    description: 'Ultra-exclusive club for top tier business leaders, cultural icons, and influential figures.',
    membershipProcess: 'By invitation only. Requires extensive vetting, multiple references, and personal interviews.',
    nominationRequired: true,
    rating: 4.9,
    featured: true
  },
  {
    id: 'NYC-003',
    name: 'Zero Bond',
    type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB],
    city: 'New York',
    country: 'United States',
    region: 'North America',
    established: 2020,
    membership: {
      type: 'Invitation Only',
      price: { initiation: 5000, annual: 3500, currency: 'USD' },
      waitlist: 15
    },
    amenities: ['Restaurant', 'Bar', 'Wine Lounge', 'Private Dining', 'Events Space'],
    dressCode: 'Casual Elegant',
    website: 'https://zerobond.com',
    contact: {
      email: 'info@zerobond.com',
      phone: '+1 212 555 0100',
      address: '0 Bond Street, New York, NY 10012'
    },
    description: 'Modern members club attracting tech entrepreneurs, creatives, and cultural influencers.',
    membershipProcess: 'Invitation only with emphasis on accomplished individuals under 40. Two member recommendations required.',
    nominationRequired: true,
    rating: 4.7
  },

  // DUBAI
  {
    id: 'DXB-001',
    name: 'The Club Dubai',
    type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB],
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    established: 2010,
    membership: {
      type: 'Corporate',
      price: { initiation: 5000, annual: 8000, currency: 'USD' },
      waitlist: 3
    },
    amenities: ['Business Center', 'Fine Dining', 'Pool', 'Gym', 'Meeting Rooms', 'Events'],
    dressCode: 'Business Formal',
    website: 'https://theclubdubai.com',
    contact: {
      email: 'membership@theclubdubai.com',
      phone: '+971 4 425 0555',
      address: 'Gate Village, DIFC, Dubai'
    },
    description: 'Premier business and social club in Dubai International Financial Centre.',
    membershipProcess: 'Application with business credentials. Corporate memberships available.',
    nominationRequired: false,
    rating: 4.5,
    featured: true
  },
  {
    id: 'DXB-002',
    name: 'Soho Garden',
    type: [ClubType.SOCIAL_CLUB, ClubType.PRIVATE_MEMBERS],
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    established: 2017,
    membership: {
      type: 'Application',
      price: { initiation: 2000, annual: 4500, currency: 'USD' },
      waitlist: 4
    },
    amenities: ['Restaurants', 'Pool', 'Beach Club', 'Events', 'VIP Areas'],
    dressCode: 'Resort',
    website: 'https://sohogardendxb.com',
    contact: {
      email: 'info@sohogardendxb.com',
      phone: '+971 4 244 8844',
      address: 'Meydan, Dubai'
    },
    description: 'Stylish entertainment destination combining dining, nightlife, and social experiences.',
    membershipProcess: 'Application process with focus on lifestyle fit. Fast-track available for corporate groups.',
    nominationRequired: false,
    rating: 4.4
  },

  // PARIS
  {
    id: 'PAR-001',
    name: 'Silencio',
    type: [ClubType.ARTS_CLUB, ClubType.PRIVATE_MEMBERS],
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    established: 2011,
    membership: {
      type: 'Application',
      price: { initiation: 800, annual: 1200, currency: 'USD' },
      waitlist: 6
    },
    amenities: ['Cinema', 'Restaurant', 'Bar', 'Live Music', 'Art Exhibitions', 'Late Night'],
    dressCode: 'Smart Casual',
    website: 'https://silencio-club.com',
    contact: {
      email: 'contact@silencio-club.com',
      phone: '+33 1 40 13 12 33',
      address: '142 Rue Montmartre, 75002 Paris'
    },
    description: 'David Lynch-designed club for artists, musicians, and creative professionals.',
    membershipProcess: 'Application for creatives in film, music, art, or fashion industries.',
    nominationRequired: false,
    rating: 4.6,
    featured: true
  },
  {
    id: 'PAR-002',
    name: 'Cercle de l\'Union Interalliée',
    type: [ClubType.GENTLEMENS_CLUB, ClubType.SOCIAL_CLUB],
    city: 'Paris',
    country: 'France',
    region: 'Europe',
    established: 1917,
    membership: {
      type: 'Invitation Only',
      price: { initiation: 4000, annual: 5000, currency: 'USD' },
      waitlist: 18
    },
    amenities: ['Fine Dining', 'Library', 'Billiards', 'Private Rooms', 'Conference Facilities'],
    dressCode: 'Business Formal',
    website: 'https://cercleinterallie.fr',
    contact: {
      email: 'info@cercleinterallie.fr',
      phone: '+33 1 44 13 50 50',
      address: '33 Rue du Faubourg Saint-Honoré, 75008 Paris'
    },
    description: 'Historic gentleman\'s club in prestigious Faubourg Saint-Honoré, founded post-WWI.',
    membershipProcess: 'Invitation only. Requires three current members as sponsors.',
    nominationRequired: true,
    rating: 4.8
  },

  // HONG KONG
  {
    id: 'HKG-001',
    name: 'The Hong Kong Club',
    type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB],
    city: 'Hong Kong',
    country: 'China',
    region: 'Asia',
    established: 1846,
    membership: {
      type: 'Application',
      price: { initiation: 8000, annual: 6000, currency: 'USD' },
      waitlist: 12
    },
    amenities: ['Fine Dining', 'Sports Facilities', 'Library', 'Business Center', 'Bedrooms'],
    dressCode: 'Business Formal',
    website: 'https://thehongkongclub.hk',
    contact: {
      email: 'membership@hkclub.org.hk',
      phone: '+852 2525 5251',
      address: '1 Jackson Road, Central, Hong Kong'
    },
    description: 'Colonial-era club maintaining traditions while serving modern business elite.',
    membershipProcess: 'Requires nomination by two members, extensive vetting, and committee approval.',
    nominationRequired: true,
    rating: 4.7,
    featured: true
  },
  {
    id: 'HKG-002',
    name: 'The China Club',
    type: [ClubType.BUSINESS_CLUB, ClubType.ARTS_CLUB],
    city: 'Hong Kong',
    country: 'China',
    region: 'Asia',
    established: 1991,
    membership: {
      type: 'Application',
      price: { initiation: 3500, annual: 4200, currency: 'USD' },
      waitlist: 8
    },
    amenities: ['Chinese Restaurant', 'Art Collection', 'Library', 'Private Rooms', 'Events'],
    dressCode: 'Smart Casual',
    website: 'https://chinaclub.com.hk',
    contact: {
      email: 'info@chinaclub.com.hk',
      phone: '+852 2521 8888',
      address: '13-15/F, The Old Bank of China Building, Bank Street, Central'
    },
    description: 'Renowned for spectacular Chinese art collection and refined Cantonese cuisine.',
    membershipProcess: 'Application with focus on business leaders and cultural figures.',
    nominationRequired: false,
    rating: 4.6
  },

  // SINGAPORE
  {
    id: 'SIN-001',
    name: 'The Tanglin Club',
    type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB],
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    established: 1865,
    membership: {
      type: 'Application',
      price: { initiation: 4500, annual: 3800, currency: 'USD' },
      waitlist: 10
    },
    amenities: ['Swimming Pool', 'Tennis Courts', 'Gym', 'Restaurants', 'Library', 'Children Facilities'],
    dressCode: 'Smart Casual',
    website: 'https://www.tanglinclub.org.sg',
    contact: {
      email: 'membership@tanglinclub.org.sg',
      phone: '+65 6737 5550',
      address: '5 Stevens Road, Singapore 257814'
    },
    description: 'Historic social and sporting club with colonial heritage and modern facilities.',
    membershipProcess: 'Application requires two proposers who are existing members.',
    nominationRequired: true,
    rating: 4.5,
    featured: true
  },
  {
    id: 'SIN-002',
    name: '1880',
    type: [ClubType.BUSINESS_CLUB, ClubType.PRIVATE_MEMBERS],
    city: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    established: 2012,
    membership: {
      type: 'Invitation Only',
      price: { initiation: 20000, annual: 18000, currency: 'USD' },
      waitlist: 24
    },
    amenities: ['Fine Dining', 'Cigar Lounge', 'Wine Cellar', 'Private Dining', 'Business Facilities'],
    dressCode: 'Business Formal',
    website: 'https://1880.com.sg',
    contact: {
      email: 'concierge@1880.com.sg',
      phone: '+65 6225 1880',
      address: 'One Fullerton, Singapore 049213'
    },
    description: 'Ultra-exclusive waterfront club for Asia\'s business elite and leaders.',
    membershipProcess: 'Strictly by invitation. Extensive background checks and personal interviews.',
    nominationRequired: true,
    rating: 4.9
  },

  // TOKYO
  {
    id: 'TYO-001',
    name: 'Tokyo American Club',
    type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB],
    city: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    established: 1928,
    membership: {
      type: 'Application',
      price: { initiation: 6000, annual: 7200, currency: 'USD' },
      waitlist: 6
    },
    amenities: ['Pool', 'Gym', 'Tennis Courts', 'Restaurants', 'Library', 'Bowling'],
    dressCode: 'Smart Casual',
    website: 'https://tac-club.org',
    contact: {
      email: 'membership@tac-club.org',
      phone: '+81 3 4588 0670',
      address: '2-1-2 Azabudai, Minato-ku, Tokyo 106-8649'
    },
    description: 'International club serving expatriate and Japanese business communities.',
    membershipProcess: 'Application with two member sponsors. Focus on international professionals.',
    nominationRequired: true,
    rating: 4.5,
    featured: true
  },

  // LOS ANGELES
  {
    id: 'LAX-001',
    name: 'Soho House West Hollywood',
    type: [ClubType.PRIVATE_MEMBERS, ClubType.ARTS_CLUB],
    city: 'Los Angeles',
    country: 'United States',
    region: 'North America',
    established: 2010,
    membership: {
      type: 'Application',
      price: { initiation: 1000, annual: 2400, currency: 'USD' },
      waitlist: 6
    },
    amenities: ['Rooftop Pool', 'Screening Room', 'Gym', 'Restaurant', 'Bedrooms', 'Spa'],
    dressCode: 'Smart Casual',
    website: 'https://sohohouse.com/houses/soho-house-west-hollywood',
    contact: {
      email: 'westhollywood@sohohouse.com',
      phone: '+1 310 432 9200',
      address: '9200 Sunset Boulevard, West Hollywood, CA 90069'
    },
    description: 'Entertainment industry hub with stunning rooftop pool and Sunset Strip views.',
    membershipProcess: 'Application for creative industry professionals. 6-8 week review process.',
    nominationRequired: false,
    rating: 4.6
  },
  {
    id: 'LAX-002',
    name: 'Jonathan Club',
    type: [ClubType.BUSINESS_CLUB, ClubType.ATHLETIC_CLUB],
    city: 'Los Angeles',
    country: 'United States',
    region: 'North America',
    established: 1895,
    membership: {
      type: 'Application',
      price: { initiation: 7500, annual: 6800, currency: 'USD' },
      waitlist: 14
    },
    amenities: ['Beach Club', 'Pool', 'Gym', 'Tennis', 'Dining Rooms', 'Business Center'],
    dressCode: 'Business Formal',
    website: 'https://jc.org',
    contact: {
      email: 'membership@jc.org',
      phone: '+1 213 624 0881',
      address: '545 South Figueroa Street, Los Angeles, CA 90071'
    },
    description: 'Historic LA institution with downtown club and Santa Monica beach facilities.',
    membershipProcess: 'Requires nomination by two members and extensive background review.',
    nominationRequired: true,
    rating: 4.7
  },

  // MIAMI
  {
    id: 'MIA-001',
    name: 'Soho Beach House',
    type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB],
    city: 'Miami',
    country: 'United States',
    region: 'North America',
    established: 2010,
    membership: {
      type: 'Application',
      price: { initiation: 1000, annual: 2200, currency: 'USD' },
      waitlist: 5
    },
    amenities: ['Beach Access', 'Pool', 'Cowshed Spa', 'Restaurant', 'Bedrooms', 'Gym'],
    dressCode: 'Resort',
    website: 'https://sohohouse.com/houses/soho-beach-house',
    contact: {
      email: 'miamibeach@sohohouse.com',
      phone: '+1 786 507 7900',
      address: '4385 Collins Avenue, Miami Beach, FL 33140'
    },
    description: 'Beachfront club combining Art Deco glamour with Soho House creative community.',
    membershipProcess: 'Application for creative professionals with 4-6 week approval process.',
    nominationRequired: false,
    rating: 4.7,
    featured: true
  },

  // SAN FRANCISCO
  {
    id: 'SFO-001',
    name: 'The Battery',
    type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB],
    city: 'San Francisco',
    country: 'United States',
    region: 'North America',
    established: 2013,
    membership: {
      type: 'Application',
      price: { initiation: 2500, annual: 2900, currency: 'USD' },
      waitlist: 10
    },
    amenities: ['Restaurant', 'Bar', 'Museum', 'Gym', 'Spa', 'Bedrooms', 'Events'],
    dressCode: 'Smart Casual',
    website: 'https://thebatterysf.com',
    contact: {
      email: 'membership@thebatterysf.com',
      phone: '+1 415 230 0555',
      address: '717 Battery Street, San Francisco, CA 94111'
    },
    description: 'Tech and creative community hub in historic Telegraph Hill building.',
    membershipProcess: 'Application with focus on innovators and creative leaders.',
    nominationRequired: false,
    rating: 4.6
  },

  // ZÜRICH
  {
    id: 'ZRH-001',
    name: 'Dolder Grand Golf Club',
    type: [ClubType.ATHLETIC_CLUB, ClubType.COUNTRY_CLUB],
    city: 'Zürich',
    country: 'Switzerland',
    region: 'Europe',
    established: 1907,
    membership: {
      type: 'Application',
      price: { initiation: 5000, annual: 4500, currency: 'USD' },
      waitlist: 8
    },
    amenities: ['Golf Course', 'Restaurant', 'Clubhouse', 'Events', 'Pro Shop'],
    dressCode: 'Smart Casual',
    website: 'https://doldergolf.ch',
    contact: {
      email: 'info@doldergolf.ch',
      phone: '+41 44 261 50 45',
      address: 'Kurhausstrasse 66, 8032 Zürich'
    },
    description: 'Prestigious golf club with panoramic city and Alpine views.',
    membershipProcess: 'Application with golf handicap required. Two member recommendations.',
    nominationRequired: true,
    rating: 4.6
  }
];

export const CITIES = Array.from(new Set(ELITE_CLUBS.map(club => club.city))).sort();
export const COUNTRIES = Array.from(new Set(ELITE_CLUBS.map(club => club.country))).sort();
export const REGIONS = ['Europe', 'North America', 'Asia', 'Middle East', 'South America', 'Africa', 'Oceania'];
export const ALL_AMENITIES = Array.from(
  new Set(ELITE_CLUBS.flatMap(club => club.amenities))
).sort();
