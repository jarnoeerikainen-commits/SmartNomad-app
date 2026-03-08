import { EliteClub, ClubType } from '@/types/eliteClub';

export const ELITE_CLUBS: EliteClub[] = [
  // LONDON
  {
    id: 'LON-001', name: "Annabel's", type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB], city: 'London', country: 'United Kingdom', region: 'Europe', established: 1963,
    membership: { type: 'Invitation Only', price: { initiation: 2500, annual: 3500, currency: 'USD' }, waitlist: 12 },
    amenities: ['Fine Dining', 'Nightclub', 'Garden Terrace', 'Private Events', 'Wellness Spa', 'Cigar Lounge'], dressCode: 'Business Formal',
    website: 'https://annabels.co.uk', contact: { email: 'membership@annabels.co.uk', phone: '+44 20 7629 1096', address: '46 Berkeley Square, Mayfair, London W1J 5AT' },
    description: 'Legendary Mayfair private members club with iconic nightlife, Michelin-quality dining, and exclusive international events.',
    membershipProcess: 'Requires nomination by two existing members, followed by committee review. Average waiting period 12 months.', nominationRequired: true, rating: 4.9, featured: true
  },
  {
    id: 'LON-002', name: 'The Arts Club', type: [ClubType.ARTS_CLUB, ClubType.SOCIAL_CLUB], city: 'London', country: 'United Kingdom', region: 'Europe', established: 1863,
    membership: { type: 'Application', price: { initiation: 1500, annual: 2800, currency: 'USD' }, waitlist: 6 },
    amenities: ['Art Gallery', 'Fine Dining', 'Library', 'Private Events', 'Townhouse Rooms', 'Terrace'], dressCode: 'Smart Casual',
    website: 'https://theartsclub.co.uk', contact: { email: 'membership@theartsclub.co.uk', phone: '+44 20 7499 8581', address: '40 Dover Street, Mayfair, London W1S 4NP' },
    description: 'Historic private members club for artists, creatives, and art enthusiasts in the heart of Mayfair.',
    membershipProcess: 'Application requires creative industry credentials or significant art patronage.', nominationRequired: false, rating: 4.7, featured: true
  },
  {
    id: 'LON-003', name: "5 Hertford Street (Loulou's)", type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB], city: 'London', country: 'United Kingdom', region: 'Europe', established: 2012,
    membership: { type: 'Invitation Only', price: { initiation: 1800, annual: 2400, currency: 'USD' }, waitlist: 18 },
    amenities: ['Restaurant', 'Nightclub', 'Private Dining', 'Events', 'Members Bar'], dressCode: 'Formal',
    website: 'https://5hertfordstreet.com', contact: { email: 'info@5hertfordstreet.com', phone: '+44 20 3141 0555', address: '5 Hertford Street, Mayfair, London W1J 7RU' },
    description: 'Ultra-exclusive Mayfair club favored by celebrities, aristocracy, and international elites.',
    membershipProcess: 'Strictly invitation only. Requires sponsorship from two existing members.', nominationRequired: true, rating: 4.8
  },
  {
    id: 'LON-004', name: 'The Garrick Club', type: [ClubType.GENTLEMENS_CLUB, ClubType.ARTS_CLUB], city: 'London', country: 'United Kingdom', region: 'Europe', established: 1831,
    membership: { type: 'Invitation Only', price: { initiation: 2000, annual: 2200, currency: 'USD' }, waitlist: 24 },
    amenities: ['Fine Dining', 'Library', 'Art Collection', 'Theatre History', 'Private Rooms'], dressCode: 'Business Formal',
    website: 'https://garrickclub.co.uk', contact: { email: 'secretary@garrickclub.co.uk', phone: '+44 20 7379 6478', address: '15 Garrick Street, London WC2E 9AY' },
    description: 'Historic gentleman\'s club celebrating theatre, literature, and the arts since 1831.',
    membershipProcess: 'Invitation only. Extremely selective with years-long waitlist.', nominationRequired: true, rating: 4.8
  },
  {
    id: 'LON-005', name: 'The Groucho Club', type: [ClubType.PRIVATE_MEMBERS, ClubType.ARTS_CLUB], city: 'London', country: 'United Kingdom', region: 'Europe', established: 1985,
    membership: { type: 'Application', price: { initiation: 1200, annual: 1800, currency: 'USD' }, waitlist: 8 },
    amenities: ['Restaurant', 'Bar', 'Bedrooms', 'Screening Room', 'Private Events'], dressCode: 'Smart Casual',
    website: 'https://thegrouchoclub.com', contact: { email: 'membership@thegrouchoclub.com', phone: '+44 20 7439 4685', address: '45 Dean Street, Soho, London W1D 4QB' },
    description: 'Iconic Soho club beloved by media, publishing, and entertainment professionals.',
    membershipProcess: 'Application with two proposers from the creative industries.', nominationRequired: true, rating: 4.6
  },

  // NEW YORK
  {
    id: 'NYC-001', name: 'Soho House New York', type: [ClubType.PRIVATE_MEMBERS, ClubType.ARTS_CLUB], city: 'New York', country: 'United States', region: 'North America', established: 2003,
    membership: { type: 'Application', price: { initiation: 1000, annual: 2700, currency: 'USD' }, waitlist: 8 },
    amenities: ['Rooftop Pool', 'Gym', 'Screening Room', 'Restaurants', 'Bedrooms', 'Cowshed Spa'], dressCode: 'Smart Casual',
    website: 'https://sohohouse.com/houses/soho-house-new-york', contact: { email: 'newyork@sohohouse.com', phone: '+1 212 627 9800', address: '29-35 Ninth Avenue, New York, NY 10014' },
    description: 'Global private members club for creative professionals with access to 40+ houses worldwide.',
    membershipProcess: 'Application requires working in creative industry.', nominationRequired: false, rating: 4.6, featured: true
  },
  {
    id: 'NYC-002', name: 'The Core Club', type: [ClubType.BUSINESS_CLUB, ClubType.PRIVATE_MEMBERS], city: 'New York', country: 'United States', region: 'North America', established: 2005,
    membership: { type: 'Invitation Only', price: { initiation: 15000, annual: 15000, currency: 'USD' }, waitlist: 24 },
    amenities: ['Fine Dining', 'Wine Cellar', 'Library', 'Conference Rooms', 'Art Gallery', 'Private Events'], dressCode: 'Business Formal',
    website: 'https://thecoreclub.com', contact: { email: 'membership@thecoreclub.com', phone: '+1 212 223 5100', address: '66 East 55th Street, New York, NY 10022' },
    description: 'Ultra-exclusive club for top tier business leaders, cultural icons, and influential figures.',
    membershipProcess: 'By invitation only. Requires extensive vetting and personal interviews.', nominationRequired: true, rating: 4.9, featured: true
  },
  {
    id: 'NYC-003', name: 'Zero Bond', type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB], city: 'New York', country: 'United States', region: 'North America', established: 2020,
    membership: { type: 'Invitation Only', price: { initiation: 5000, annual: 3500, currency: 'USD' }, waitlist: 15 },
    amenities: ['Restaurant', 'Bar', 'Wine Lounge', 'Private Dining', 'Events Space'], dressCode: 'Casual Elegant',
    website: 'https://zerobond.com', contact: { email: 'info@zerobond.com', phone: '+1 212 555 0100', address: '0 Bond Street, New York, NY 10012' },
    description: 'Modern members club attracting tech entrepreneurs, creatives, and cultural influencers.',
    membershipProcess: 'Invitation only with emphasis on accomplished individuals under 40.', nominationRequired: true, rating: 4.7
  },
  {
    id: 'NYC-004', name: 'The Metropolitan Club', type: [ClubType.GENTLEMENS_CLUB, ClubType.BUSINESS_CLUB], city: 'New York', country: 'United States', region: 'North America', established: 1891,
    membership: { type: 'Invitation Only', price: { initiation: 10000, annual: 8000, currency: 'USD' }, waitlist: 18 },
    amenities: ['Fine Dining', 'Library', 'Ballroom', 'Guest Rooms', 'Wine Cellar', 'Private Events'], dressCode: 'Business Formal',
    website: 'https://metropolitanclubnyc.org', contact: { email: 'membership@metropolitanclubnyc.org', phone: '+1 212 838 7400', address: '1 East 60th Street, New York, NY 10022' },
    description: 'Grand Stanford White-designed clubhouse founded by J.P. Morgan for New York\'s elite.',
    membershipProcess: 'Invitation by existing members. Multi-step vetting process.', nominationRequired: true, rating: 4.8
  },

  // DUBAI
  {
    id: 'DXB-001', name: 'The Club Dubai (DIFC)', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', established: 2010,
    membership: { type: 'Corporate', price: { initiation: 5000, annual: 8000, currency: 'USD' }, waitlist: 3 },
    amenities: ['Business Center', 'Fine Dining', 'Pool', 'Gym', 'Meeting Rooms', 'Events'], dressCode: 'Business Formal',
    website: 'https://theclubdubai.com', contact: { email: 'membership@theclubdubai.com', phone: '+971 4 425 0555', address: 'Gate Village, DIFC, Dubai' },
    description: 'Premier business and social club in Dubai International Financial Centre.',
    membershipProcess: 'Application with business credentials. Corporate memberships available.', nominationRequired: false, rating: 4.5, featured: true
  },
  {
    id: 'DXB-002', name: 'Soho Garden', type: [ClubType.SOCIAL_CLUB, ClubType.PRIVATE_MEMBERS], city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', established: 2017,
    membership: { type: 'Application', price: { initiation: 2000, annual: 4500, currency: 'USD' }, waitlist: 4 },
    amenities: ['Restaurants', 'Pool', 'Beach Club', 'Events', 'VIP Areas'], dressCode: 'Resort',
    website: 'https://sohogardendxb.com', contact: { email: 'info@sohogardendxb.com', phone: '+971 4 244 8844', address: 'Meydan, Dubai' },
    description: 'Stylish entertainment destination combining dining, nightlife, and social experiences.',
    membershipProcess: 'Application process with focus on lifestyle fit.', nominationRequired: false, rating: 4.4
  },
  {
    id: 'DXB-003', name: 'Capital Club Dubai', type: [ClubType.BUSINESS_CLUB, ClubType.PRIVATE_MEMBERS], city: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', established: 2004,
    membership: { type: 'Application', price: { initiation: 3000, annual: 6000, currency: 'USD' }, waitlist: 2 },
    amenities: ['Fine Dining', 'Business Center', 'Meeting Rooms', 'Cigar Lounge', 'Events'], dressCode: 'Business Formal',
    website: 'https://capitalclubdubai.com', contact: { email: 'membership@capitalclubdubai.com', phone: '+971 4 364 0111', address: 'Gate Village 9, DIFC, Dubai' },
    description: 'Exclusive business club in DIFC catering to senior executives and entrepreneurs.',
    membershipProcess: 'Application with professional references.', nominationRequired: false, rating: 4.6
  },

  // PARIS
  {
    id: 'PAR-001', name: 'Silencio', type: [ClubType.ARTS_CLUB, ClubType.PRIVATE_MEMBERS], city: 'Paris', country: 'France', region: 'Europe', established: 2011,
    membership: { type: 'Application', price: { initiation: 800, annual: 1200, currency: 'USD' }, waitlist: 6 },
    amenities: ['Cinema', 'Restaurant', 'Bar', 'Live Music', 'Art Exhibitions', 'Late Night'], dressCode: 'Smart Casual',
    website: 'https://silencio-club.com', contact: { email: 'contact@silencio-club.com', phone: '+33 1 40 13 12 33', address: '142 Rue Montmartre, 75002 Paris' },
    description: 'David Lynch-designed club for artists, musicians, and creative professionals.',
    membershipProcess: 'Application for creatives in film, music, art, or fashion.', nominationRequired: false, rating: 4.6, featured: true
  },
  {
    id: 'PAR-002', name: "Cercle de l'Union Interalliée", type: [ClubType.GENTLEMENS_CLUB, ClubType.SOCIAL_CLUB], city: 'Paris', country: 'France', region: 'Europe', established: 1917,
    membership: { type: 'Invitation Only', price: { initiation: 4000, annual: 5000, currency: 'USD' }, waitlist: 18 },
    amenities: ['Fine Dining', 'Library', 'Billiards', 'Private Rooms', 'Conference Facilities'], dressCode: 'Business Formal',
    website: 'https://cercleinterallie.fr', contact: { email: 'info@cercleinterallie.fr', phone: '+33 1 44 13 50 50', address: '33 Rue du Faubourg Saint-Honoré, 75008 Paris' },
    description: "Historic gentleman's club in prestigious Faubourg Saint-Honoré, founded post-WWI.",
    membershipProcess: 'Invitation only. Requires three current members as sponsors.', nominationRequired: true, rating: 4.8
  },
  {
    id: 'PAR-003', name: 'Le Très Honoré', type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB], city: 'Paris', country: 'France', region: 'Europe', established: 2019,
    membership: { type: 'Application', price: { initiation: 600, annual: 900, currency: 'USD' }, waitlist: 4 },
    amenities: ['Bar', 'Cocktail Lab', 'Private Events', 'Late Night'], dressCode: 'Smart Casual',
    website: 'https://letreshonore.com', contact: { email: 'info@letreshonore.com', phone: '+33 1 42 60 06 98', address: '35 Rue du Louvre, 75001 Paris' },
    description: 'Exclusive cocktail club hidden behind a secret entrance near the Louvre.',
    membershipProcess: 'Application with referral from existing member preferred.', nominationRequired: false, rating: 4.5
  },

  // HONG KONG
  {
    id: 'HKG-001', name: 'The Hong Kong Club', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Hong Kong', country: 'China', region: 'Asia', established: 1846,
    membership: { type: 'Application', price: { initiation: 8000, annual: 6000, currency: 'USD' }, waitlist: 12 },
    amenities: ['Fine Dining', 'Sports Facilities', 'Library', 'Business Center', 'Bedrooms'], dressCode: 'Business Formal',
    website: 'https://thehongkongclub.hk', contact: { email: 'membership@hkclub.org.hk', phone: '+852 2525 5251', address: '1 Jackson Road, Central, Hong Kong' },
    description: 'Colonial-era club maintaining traditions while serving modern business elite.',
    membershipProcess: 'Requires nomination by two members, extensive vetting.', nominationRequired: true, rating: 4.7, featured: true
  },
  {
    id: 'HKG-002', name: 'The China Club', type: [ClubType.BUSINESS_CLUB, ClubType.ARTS_CLUB], city: 'Hong Kong', country: 'China', region: 'Asia', established: 1991,
    membership: { type: 'Application', price: { initiation: 3500, annual: 4200, currency: 'USD' }, waitlist: 8 },
    amenities: ['Chinese Restaurant', 'Art Collection', 'Library', 'Private Rooms', 'Events'], dressCode: 'Smart Casual',
    website: 'https://chinaclub.com.hk', contact: { email: 'info@chinaclub.com.hk', phone: '+852 2521 8888', address: '13-15/F, Old Bank of China Building, Central' },
    description: 'Renowned for spectacular Chinese art collection and refined Cantonese cuisine.',
    membershipProcess: 'Application with focus on business leaders and cultural figures.', nominationRequired: false, rating: 4.6
  },

  // SINGAPORE
  {
    id: 'SIN-001', name: 'The Tanglin Club', type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB], city: 'Singapore', country: 'Singapore', region: 'Asia', established: 1865,
    membership: { type: 'Application', price: { initiation: 4500, annual: 3800, currency: 'USD' }, waitlist: 10 },
    amenities: ['Swimming Pool', 'Tennis Courts', 'Gym', 'Restaurants', 'Library', 'Children Facilities'], dressCode: 'Smart Casual',
    website: 'https://www.tanglinclub.org.sg', contact: { email: 'membership@tanglinclub.org.sg', phone: '+65 6737 5550', address: '5 Stevens Road, Singapore 257814' },
    description: 'Historic social and sporting club with colonial heritage and modern facilities.',
    membershipProcess: 'Application requires two proposers who are existing members.', nominationRequired: true, rating: 4.5, featured: true
  },
  {
    id: 'SIN-002', name: '1880', type: [ClubType.BUSINESS_CLUB, ClubType.PRIVATE_MEMBERS], city: 'Singapore', country: 'Singapore', region: 'Asia', established: 2012,
    membership: { type: 'Invitation Only', price: { initiation: 20000, annual: 18000, currency: 'USD' }, waitlist: 24 },
    amenities: ['Fine Dining', 'Cigar Lounge', 'Wine Cellar', 'Private Dining', 'Business Facilities'], dressCode: 'Business Formal',
    website: 'https://1880.com.sg', contact: { email: 'concierge@1880.com.sg', phone: '+65 6225 1880', address: 'One Fullerton, Singapore 049213' },
    description: "Ultra-exclusive waterfront club for Asia's business elite and leaders.",
    membershipProcess: 'Strictly by invitation. Extensive background checks.', nominationRequired: true, rating: 4.9
  },
  {
    id: 'SIN-003', name: 'The Tower Club', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Singapore', country: 'Singapore', region: 'Asia', established: 1999,
    membership: { type: 'Application', price: { initiation: 8000, annual: 5500, currency: 'USD' }, waitlist: 6 },
    amenities: ['Fine Dining', 'Business Center', 'Meeting Rooms', 'Wine Cellar', 'Panoramic Views'], dressCode: 'Business Formal',
    website: 'https://towerclub.com.sg', contact: { email: 'membership@towerclub.com.sg', phone: '+65 6536 9898', address: '9 Raffles Place, #60-01, Republic Plaza' },
    description: 'Premier business club on the 60th floor with panoramic views of Singapore.',
    membershipProcess: 'Application with corporate or personal references required.', nominationRequired: false, rating: 4.6
  },

  // TOKYO
  {
    id: 'TYO-001', name: 'Tokyo American Club', type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB], city: 'Tokyo', country: 'Japan', region: 'Asia', established: 1928,
    membership: { type: 'Application', price: { initiation: 6000, annual: 7200, currency: 'USD' }, waitlist: 6 },
    amenities: ['Pool', 'Gym', 'Tennis Courts', 'Restaurants', 'Library', 'Bowling'], dressCode: 'Smart Casual',
    website: 'https://tac-club.org', contact: { email: 'membership@tac-club.org', phone: '+81 3 4588 0670', address: '2-1-2 Azabudai, Minato-ku, Tokyo 106-8649' },
    description: 'International club serving expatriate and Japanese business communities.',
    membershipProcess: 'Application with two member sponsors.', nominationRequired: true, rating: 4.5, featured: true
  },
  {
    id: 'TYO-002', name: 'Roppongi Hills Club', type: [ClubType.BUSINESS_CLUB, ClubType.PRIVATE_MEMBERS], city: 'Tokyo', country: 'Japan', region: 'Asia', established: 2003,
    membership: { type: 'Application', price: { initiation: 10000, annual: 9000, currency: 'USD' }, waitlist: 12 },
    amenities: ['Fine Dining', 'Library', 'Spa', 'Conference Rooms', 'Art Museum Access', 'Sky Lounge'], dressCode: 'Business Formal',
    website: 'https://roppongihillsclub.com', contact: { email: 'membership@roppongihillsclub.com', phone: '+81 3 6406 6000', address: 'Roppongi Hills Mori Tower 51F, Tokyo' },
    description: 'Ultra-premium club atop Mori Tower with Tokyo skyline views and art museum privileges.',
    membershipProcess: 'Application for senior executives and cultural leaders.', nominationRequired: false, rating: 4.8
  },

  // LOS ANGELES
  {
    id: 'LAX-001', name: 'Soho House West Hollywood', type: [ClubType.PRIVATE_MEMBERS, ClubType.ARTS_CLUB], city: 'Los Angeles', country: 'United States', region: 'North America', established: 2010,
    membership: { type: 'Application', price: { initiation: 1000, annual: 2400, currency: 'USD' }, waitlist: 6 },
    amenities: ['Rooftop Pool', 'Screening Room', 'Gym', 'Restaurant', 'Bedrooms', 'Spa'], dressCode: 'Smart Casual',
    website: 'https://sohohouse.com/houses/soho-house-west-hollywood', contact: { email: 'westhollywood@sohohouse.com', phone: '+1 310 432 9200', address: '9200 Sunset Boulevard, West Hollywood, CA 90069' },
    description: 'Entertainment industry hub with stunning rooftop pool and Sunset Strip views.',
    membershipProcess: 'Application for creative industry professionals.', nominationRequired: false, rating: 4.6
  },
  {
    id: 'LAX-002', name: 'Jonathan Club', type: [ClubType.BUSINESS_CLUB, ClubType.ATHLETIC_CLUB], city: 'Los Angeles', country: 'United States', region: 'North America', established: 1895,
    membership: { type: 'Application', price: { initiation: 7500, annual: 6800, currency: 'USD' }, waitlist: 14 },
    amenities: ['Beach Club', 'Pool', 'Gym', 'Tennis', 'Dining Rooms', 'Business Center'], dressCode: 'Business Formal',
    website: 'https://jc.org', contact: { email: 'membership@jc.org', phone: '+1 213 624 0881', address: '545 South Figueroa Street, Los Angeles, CA 90071' },
    description: 'Historic LA institution with downtown club and Santa Monica beach facilities.',
    membershipProcess: 'Requires nomination by two members and extensive background review.', nominationRequired: true, rating: 4.7
  },

  // MIAMI
  {
    id: 'MIA-001', name: 'Soho Beach House', type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB], city: 'Miami', country: 'United States', region: 'North America', established: 2010,
    membership: { type: 'Application', price: { initiation: 1000, annual: 2200, currency: 'USD' }, waitlist: 5 },
    amenities: ['Beach Access', 'Pool', 'Cowshed Spa', 'Restaurant', 'Bedrooms', 'Gym'], dressCode: 'Resort',
    website: 'https://sohohouse.com/houses/soho-beach-house', contact: { email: 'miamibeach@sohohouse.com', phone: '+1 786 507 7900', address: '4385 Collins Avenue, Miami Beach, FL 33140' },
    description: 'Beachfront club combining Art Deco glamour with Soho House creative community.',
    membershipProcess: 'Application for creative professionals.', nominationRequired: false, rating: 4.7, featured: true
  },
  {
    id: 'MIA-002', name: 'The Key Club', type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB], city: 'Miami', country: 'United States', region: 'North America', established: 2019,
    membership: { type: 'Invitation Only', price: { initiation: 4000, annual: 3000, currency: 'USD' }, waitlist: 10 },
    amenities: ['Rooftop Pool', 'Restaurant', 'Co-Working', 'Events', 'Wine Bar'], dressCode: 'Casual Elegant',
    website: 'https://thekeyclubmiami.com', contact: { email: 'info@thekeyclubmiami.com', phone: '+1 305 555 0200', address: '137 NE 1st Avenue, Miami, FL 33132' },
    description: 'Coconut Grove members club for Miami\'s creative and entrepreneurial scene.',
    membershipProcess: 'By invitation from existing members.', nominationRequired: true, rating: 4.5
  },

  // SAN FRANCISCO
  {
    id: 'SFO-001', name: 'The Battery', type: [ClubType.PRIVATE_MEMBERS, ClubType.SOCIAL_CLUB], city: 'San Francisco', country: 'United States', region: 'North America', established: 2013,
    membership: { type: 'Application', price: { initiation: 2500, annual: 2900, currency: 'USD' }, waitlist: 10 },
    amenities: ['Restaurant', 'Bar', 'Museum', 'Gym', 'Spa', 'Bedrooms', 'Events'], dressCode: 'Smart Casual',
    website: 'https://thebatterysf.com', contact: { email: 'membership@thebatterysf.com', phone: '+1 415 230 0555', address: '717 Battery Street, San Francisco, CA 94111' },
    description: 'Tech and creative community hub in historic Telegraph Hill building.',
    membershipProcess: 'Application with focus on innovators and creative leaders.', nominationRequired: false, rating: 4.6
  },

  // ZÜRICH
  {
    id: 'ZRH-001', name: 'Dolder Grand Golf Club', type: [ClubType.ATHLETIC_CLUB, ClubType.COUNTRY_CLUB], city: 'Zürich', country: 'Switzerland', region: 'Europe', established: 1907,
    membership: { type: 'Application', price: { initiation: 5000, annual: 4500, currency: 'USD' }, waitlist: 8 },
    amenities: ['Golf Course', 'Restaurant', 'Clubhouse', 'Events', 'Pro Shop'], dressCode: 'Smart Casual',
    website: 'https://doldergolf.ch', contact: { email: 'info@doldergolf.ch', phone: '+41 44 261 50 45', address: 'Kurhausstrasse 66, 8032 Zürich' },
    description: 'Prestigious golf club with panoramic city and Alpine views.',
    membershipProcess: 'Application with golf handicap required.', nominationRequired: true, rating: 4.6
  },

  // MONACO
  {
    id: 'MCO-001', name: 'Monte-Carlo Country Club', type: [ClubType.ATHLETIC_CLUB, ClubType.COUNTRY_CLUB], city: 'Monaco', country: 'Monaco', region: 'Europe', established: 1928,
    membership: { type: 'Invitation Only', price: { initiation: 15000, annual: 12000, currency: 'USD' }, waitlist: 24 },
    amenities: ['Tennis Courts', 'Pool', 'Gym', 'Fine Dining', 'Spa', 'Sea Views'], dressCode: 'Smart Casual',
    website: 'https://mccc.mc', contact: { email: 'info@mccc.mc', phone: '+377 93 41 30 15', address: '155 Avenue Princesse Grace, 06190 Roquebrune-Cap-Martin' },
    description: 'Home of the Monte-Carlo Masters. Exclusive athletic club overlooking the Mediterranean.',
    membershipProcess: 'Strictly by invitation. Requires Monaco residency or significant ties.', nominationRequired: true, rating: 4.9, featured: true
  },

  // BERLIN
  {
    id: 'BER-001', name: 'Soho House Berlin', type: [ClubType.PRIVATE_MEMBERS, ClubType.ARTS_CLUB], city: 'Berlin', country: 'Germany', region: 'Europe', established: 2010,
    membership: { type: 'Application', price: { initiation: 800, annual: 1800, currency: 'USD' }, waitlist: 6 },
    amenities: ['Rooftop Pool', 'Gym', 'Screening Room', 'Restaurant', 'Bedrooms', 'Spa'], dressCode: 'Smart Casual',
    website: 'https://sohohouse.com/houses/soho-house-berlin', contact: { email: 'berlin@sohohouse.com', phone: '+49 30 405 0440', address: 'Torstraße 1, 10119 Berlin' },
    description: 'Creative hub in a landmark Bauhaus building in Berlin-Mitte.',
    membershipProcess: 'Application for creative industry professionals.', nominationRequired: false, rating: 4.5
  },

  // ROME
  {
    id: 'ROM-001', name: 'Circolo della Caccia', type: [ClubType.GENTLEMENS_CLUB, ClubType.SOCIAL_CLUB], city: 'Rome', country: 'Italy', region: 'Europe', established: 1869,
    membership: { type: 'Invitation Only', price: { initiation: 6000, annual: 5000, currency: 'USD' }, waitlist: 24 },
    amenities: ['Fine Dining', 'Library', 'Card Room', 'Fencing Hall', 'Private Events'], dressCode: 'Business Formal',
    website: 'https://circolodelcaccia.it', contact: { email: 'segreteria@circolodelcaccia.it', phone: '+39 06 6880 3414', address: 'Piazza di Monte Citorio 125, 00186 Roma' },
    description: 'One of Italy\'s most prestigious gentlemen\'s clubs, frequented by aristocracy and statesmen.',
    membershipProcess: 'Invitation only. Must be proposed by three existing members.', nominationRequired: true, rating: 4.8
  },

  // VIENNA
  {
    id: 'VIE-001', name: 'Wiener Club', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Vienna', country: 'Austria', region: 'Europe', established: 1986,
    membership: { type: 'Application', price: { initiation: 3000, annual: 3500, currency: 'USD' }, waitlist: 6 },
    amenities: ['Fine Dining', 'Library', 'Meeting Rooms', 'Wine Cellar', 'Private Events'], dressCode: 'Business Formal',
    website: 'https://wienerclub.at', contact: { email: 'office@wienerclub.at', phone: '+43 1 512 7777', address: 'Kärntner Ring 5-7, 1010 Vienna' },
    description: 'Premier business club in the heart of Vienna overlooking the Opera.',
    membershipProcess: 'Application with two sponsors required.', nominationRequired: true, rating: 4.5
  },

  // MADRID
  {
    id: 'MAD-001', name: 'Casino de Madrid', type: [ClubType.GENTLEMENS_CLUB, ClubType.SOCIAL_CLUB], city: 'Madrid', country: 'Spain', region: 'Europe', established: 1836,
    membership: { type: 'Application', price: { initiation: 3000, annual: 2400, currency: 'USD' }, waitlist: 8 },
    amenities: ['Fine Dining', 'Library', 'Ballroom', 'Meeting Rooms', 'Art Collection'], dressCode: 'Business Formal',
    website: 'https://casinodemadrid.es', contact: { email: 'info@casinodemadrid.es', phone: '+34 91 521 87 00', address: 'Calle de Alcalá 15, 28014 Madrid' },
    description: 'Historic club on Gran Vía, one of Spain\'s oldest and most distinguished social institutions.',
    membershipProcess: 'Application with references from two existing members.', nominationRequired: true, rating: 4.6
  },

  // ISTANBUL
  {
    id: 'IST-001', name: 'Istanbul Rotary Club', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Istanbul', country: 'Turkey', region: 'Middle East', established: 1957,
    membership: { type: 'Application', price: { initiation: 2000, annual: 1800, currency: 'USD' }, waitlist: 4 },
    amenities: ['Restaurant', 'Meeting Rooms', 'Events', 'Networking'], dressCode: 'Business Formal',
    website: 'https://istanbulrotaryclub.org', contact: { email: 'info@istanbulrotaryclub.org', phone: '+90 212 252 0909', address: 'Beyoğlu, Istanbul' },
    description: 'Premier business networking club bridging European and Asian business communities.',
    membershipProcess: 'Application with business credentials required.', nominationRequired: false, rating: 4.3
  },

  // MUMBAI
  {
    id: 'BOM-001', name: 'Willingdon Club', type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB], city: 'Mumbai', country: 'India', region: 'Asia', established: 1917,
    membership: { type: 'Application', price: { initiation: 50000, annual: 2000, currency: 'USD' }, waitlist: 36 },
    amenities: ['Swimming Pool', 'Tennis', 'Golf', 'Restaurant', 'Bar', 'Gym', 'Library'], dressCode: 'Smart Casual',
    website: 'https://willingdonclub.com', contact: { email: 'membership@willingdonclub.com', phone: '+91 22 2386 1003', address: 'Mahalaxmi, Mumbai 400034' },
    description: 'Mumbai\'s most exclusive social club with a legendary years-long waiting list.',
    membershipProcess: 'Application with extremely long waitlist. Up to 36 months or more.', nominationRequired: true, rating: 4.8, featured: true
  },
  {
    id: 'BOM-002', name: 'Royal Bombay Yacht Club', type: [ClubType.YACHT_CLUB, ClubType.SOCIAL_CLUB], city: 'Mumbai', country: 'India', region: 'Asia', established: 1846,
    membership: { type: 'Application', price: { initiation: 5000, annual: 1500, currency: 'USD' }, waitlist: 18 },
    amenities: ['Marina', 'Restaurant', 'Bar', 'Accommodations', 'Library'], dressCode: 'Smart Casual',
    website: 'https://rbyc.in', contact: { email: 'secretary@rbyc.in', phone: '+91 22 2202 1880', address: 'Apollo Bunder, Mumbai 400001' },
    description: 'One of Asia\'s oldest yacht clubs overlooking the Gateway of India.',
    membershipProcess: 'Application with two members as proposers.', nominationRequired: true, rating: 4.6
  },

  // BANGKOK
  {
    id: 'BKK-001', name: 'Royal Bangkok Sports Club', type: [ClubType.ATHLETIC_CLUB, ClubType.SOCIAL_CLUB], city: 'Bangkok', country: 'Thailand', region: 'Asia', established: 1901,
    membership: { type: 'Invitation Only', price: { initiation: 25000, annual: 3000, currency: 'USD' }, waitlist: 48 },
    amenities: ['Golf Course', 'Swimming Pool', 'Tennis', 'Gym', 'Restaurants', 'Horse Racing'], dressCode: 'Smart Casual',
    website: 'https://rbsc.org', contact: { email: 'membership@rbsc.org', phone: '+66 2 652 5000', address: '1 Henri Dunant Road, Pathumwan, Bangkok' },
    description: 'Bangkok\'s most prestigious club with a legendary decades-long waiting list.',
    membershipProcess: 'By invitation only with extremely limited openings.', nominationRequired: true, rating: 4.7, featured: true
  },

  // SYDNEY
  {
    id: 'SYD-001', name: 'The Australian Club', type: [ClubType.GENTLEMENS_CLUB, ClubType.BUSINESS_CLUB], city: 'Sydney', country: 'Australia', region: 'Oceania', established: 1838,
    membership: { type: 'Invitation Only', price: { initiation: 5000, annual: 4500, currency: 'USD' }, waitlist: 18 },
    amenities: ['Fine Dining', 'Library', 'Wine Cellar', 'Accommodation', 'Billiards'], dressCode: 'Business Formal',
    website: 'https://australianclub.com.au', contact: { email: 'secretary@australianclub.com.au', phone: '+61 2 9232 1699', address: '165 Macquarie Street, Sydney NSW 2000' },
    description: 'Australia\'s oldest and most prestigious gentlemen\'s club.',
    membershipProcess: 'Invitation only. Proposed by two members with committee review.', nominationRequired: true, rating: 4.7, featured: true
  },
  {
    id: 'SYD-002', name: 'Soho House Sydney', type: [ClubType.PRIVATE_MEMBERS, ClubType.ARTS_CLUB], city: 'Sydney', country: 'Australia', region: 'Oceania', established: 2023,
    membership: { type: 'Application', price: { initiation: 800, annual: 2200, currency: 'USD' }, waitlist: 6 },
    amenities: ['Rooftop Pool', 'Restaurant', 'Gym', 'Screening Room', 'Spa'], dressCode: 'Smart Casual',
    website: 'https://sohohouse.com', contact: { email: 'sydney@sohohouse.com', phone: '+61 2 8000 0000', address: '100 Harris Street, Pyrmont, Sydney' },
    description: 'Newest Soho House location bringing creative community to Sydney\'s waterfront.',
    membershipProcess: 'Application for creative professionals.', nominationRequired: false, rating: 4.5
  },

  // MELBOURNE
  {
    id: 'MEL-001', name: 'Melbourne Club', type: [ClubType.GENTLEMENS_CLUB, ClubType.BUSINESS_CLUB], city: 'Melbourne', country: 'Australia', region: 'Oceania', established: 1838,
    membership: { type: 'Invitation Only', price: { initiation: 6000, annual: 5000, currency: 'USD' }, waitlist: 24 },
    amenities: ['Fine Dining', 'Library', 'Wine Cellar', 'Accommodation', 'Squash Courts'], dressCode: 'Business Formal',
    website: 'https://melbourneclub.com.au', contact: { email: 'info@melbourneclub.com.au', phone: '+61 3 9650 3355', address: '36 Collins Street, Melbourne VIC 3000' },
    description: 'The oldest and most exclusive club in Melbourne, a pillar of Australian establishment.',
    membershipProcess: 'Invitation only. Multiple member endorsements required.', nominationRequired: true, rating: 4.8
  },

  // CAPE TOWN
  {
    id: 'CPT-001', name: 'City Club Cape Town', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Cape Town', country: 'South Africa', region: 'Africa', established: 1878,
    membership: { type: 'Application', price: { initiation: 2000, annual: 1800, currency: 'USD' }, waitlist: 4 },
    amenities: ['Fine Dining', 'Library', 'Meeting Rooms', 'Events', 'Wine Cellar'], dressCode: 'Business Formal',
    website: 'https://cityclubcapetown.co.za', contact: { email: 'info@cityclubcapetown.co.za', phone: '+27 21 424 0560', address: '11 St. George\'s Mall, Cape Town 8001' },
    description: 'Cape Town\'s premier business club, a hub for South Africa\'s corporate leaders.',
    membershipProcess: 'Application with professional credentials.', nominationRequired: false, rating: 4.4, featured: true
  },

  // JOHANNESBURG
  {
    id: 'JNB-001', name: 'Rand Club', type: [ClubType.GENTLEMENS_CLUB, ClubType.SOCIAL_CLUB], city: 'Johannesburg', country: 'South Africa', region: 'Africa', established: 1887,
    membership: { type: 'Application', price: { initiation: 1500, annual: 1200, currency: 'USD' }, waitlist: 3 },
    amenities: ['Fine Dining', 'Library', 'Billiards', 'Bar', 'Events Hall'], dressCode: 'Business Formal',
    website: 'https://randclub.co.za', contact: { email: 'info@randclub.co.za', phone: '+27 11 834 8401', address: '33 Loveday Street, Johannesburg 2001' },
    description: 'Historic club from the gold rush era, a Johannesburg landmark.',
    membershipProcess: 'Application with two existing member sponsors.', nominationRequired: true, rating: 4.3
  },

  // NAIROBI
  {
    id: 'NBO-001', name: 'Muthaiga Country Club', type: [ClubType.COUNTRY_CLUB, ClubType.SOCIAL_CLUB], city: 'Nairobi', country: 'Kenya', region: 'Africa', established: 1913,
    membership: { type: 'Application', price: { initiation: 8000, annual: 2000, currency: 'USD' }, waitlist: 12 },
    amenities: ['Golf Course', 'Tennis', 'Swimming Pool', 'Restaurant', 'Accommodation', 'Bar'], dressCode: 'Smart Casual',
    website: 'https://muthaigaclub.com', contact: { email: 'secretary@muthaigaclub.com', phone: '+254 20 276 2414', address: 'Muthaiga Road, Nairobi' },
    description: 'Kenya\'s most prestigious club, a colonial-era institution in the affluent Muthaiga suburb.',
    membershipProcess: 'Application with two member proposers and committee approval.', nominationRequired: true, rating: 4.6, featured: true
  },

  // BUENOS AIRES
  {
    id: 'BUE-001', name: 'Jockey Club Buenos Aires', type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB], city: 'Buenos Aires', country: 'Argentina', region: 'South America', established: 1882,
    membership: { type: 'Invitation Only', price: { initiation: 5000, annual: 3000, currency: 'USD' }, waitlist: 18 },
    amenities: ['Fine Dining', 'Library', 'Art Collection', 'Equestrian', 'Golf', 'Pool'], dressCode: 'Business Formal',
    website: 'https://jockeyclub.org.ar', contact: { email: 'info@jockeyclub.org.ar', phone: '+54 11 4311 0100', address: 'Av. Alvear 1345, C1014AAJ Buenos Aires' },
    description: 'South America\'s most prestigious social club with extraordinary art collection.',
    membershipProcess: 'By invitation. Requires three member sponsors.', nominationRequired: true, rating: 4.8, featured: true
  },

  // SÃO PAULO
  {
    id: 'GRU-001', name: 'Clube Athletico Paulistano', type: [ClubType.ATHLETIC_CLUB, ClubType.SOCIAL_CLUB], city: 'São Paulo', country: 'Brazil', region: 'South America', established: 1900,
    membership: { type: 'Application', price: { initiation: 15000, annual: 3000, currency: 'USD' }, waitlist: 24 },
    amenities: ['Olympic Pool', 'Tennis', 'Gym', 'Restaurants', 'Basketball', 'Children Facilities'], dressCode: 'Smart Casual',
    website: 'https://clubepaulistano.com.br', contact: { email: 'secretaria@clubepaulistano.com.br', phone: '+55 11 3018 5500', address: 'Rua Honduras 1400, São Paulo' },
    description: 'São Paulo\'s most exclusive athletic and social club for the city\'s elite families.',
    membershipProcess: 'Application with extremely selective admission and long waitlist.', nominationRequired: true, rating: 4.7
  },

  // MEXICO CITY
  {
    id: 'MEX-001', name: 'Club de Banqueros de México', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Mexico City', country: 'Mexico', region: 'North America', established: 1947,
    membership: { type: 'Application', price: { initiation: 4000, annual: 2800, currency: 'USD' }, waitlist: 6 },
    amenities: ['Fine Dining', 'Library', 'Meeting Rooms', 'Wine Cellar', 'Events'], dressCode: 'Business Formal',
    website: 'https://clubdebanqueros.com.mx', contact: { email: 'info@clubdebanqueros.com.mx', phone: '+52 55 5518 0456', address: 'Av. 16 de Septiembre 27, Centro Histórico, CDMX' },
    description: 'Mexico\'s premier business club in a restored Art Deco building in the historic center.',
    membershipProcess: 'Application with corporate credentials required.', nominationRequired: false, rating: 4.5
  },

  // RIYADH
  {
    id: 'RUH-001', name: 'Riyadh Business Club', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Riyadh', country: 'Saudi Arabia', region: 'Middle East', established: 2018,
    membership: { type: 'Application', price: { initiation: 8000, annual: 10000, currency: 'USD' }, waitlist: 6 },
    amenities: ['Fine Dining', 'Business Center', 'Meeting Rooms', 'Gym', 'Events'], dressCode: 'Business Formal',
    website: 'https://riyadhbusinessclub.sa', contact: { email: 'membership@riyadhbusinessclub.sa', phone: '+966 11 460 5555', address: 'King Abdullah Financial District, Riyadh' },
    description: 'Modern business club in KAFD aligned with Saudi Vision 2030.',
    membershipProcess: 'Application for senior business professionals.', nominationRequired: false, rating: 4.4
  },

  // ABU DHABI
  {
    id: 'AUH-001', name: 'Abu Dhabi Golf Club', type: [ClubType.ATHLETIC_CLUB, ClubType.COUNTRY_CLUB], city: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', established: 2000,
    membership: { type: 'Application', price: { initiation: 6000, annual: 7000, currency: 'USD' }, waitlist: 4 },
    amenities: ['Championship Golf', 'Pool', 'Gym', 'Restaurants', 'Pro Shop', 'Driving Range'], dressCode: 'Smart Casual',
    website: 'https://adgolfclub.com', contact: { email: 'membership@adgolfclub.com', phone: '+971 2 885 3555', address: 'Sas Al Nakhl, Abu Dhabi' },
    description: 'Premier golf and leisure club hosting the Abu Dhabi Championship.',
    membershipProcess: 'Application with golf handicap recommended.', nominationRequired: false, rating: 4.6
  },

  // TORONTO
  {
    id: 'YYZ-001', name: 'The Toronto Club', type: [ClubType.BUSINESS_CLUB, ClubType.GENTLEMENS_CLUB], city: 'Toronto', country: 'Canada', region: 'North America', established: 1837,
    membership: { type: 'Invitation Only', price: { initiation: 8000, annual: 5000, currency: 'USD' }, waitlist: 18 },
    amenities: ['Fine Dining', 'Library', 'Meeting Rooms', 'Accommodation', 'Wine Cellar'], dressCode: 'Business Formal',
    website: 'https://thetorontoclub.com', contact: { email: 'secretary@thetorontoclub.com', phone: '+1 416 366 1871', address: '107 Wellington Street West, Toronto' },
    description: 'Canada\'s oldest and most exclusive private club for business leaders.',
    membershipProcess: 'By invitation. Multiple member endorsements required.', nominationRequired: true, rating: 4.7
  },

  // LISBON
  {
    id: 'LIS-001', name: 'Grémio Literário', type: [ClubType.ARTS_CLUB, ClubType.SOCIAL_CLUB], city: 'Lisbon', country: 'Portugal', region: 'Europe', established: 1846,
    membership: { type: 'Application', price: { initiation: 1000, annual: 800, currency: 'USD' }, waitlist: 3 },
    amenities: ['Library', 'Restaurant', 'Events Hall', 'Art Exhibitions', 'Private Rooms'], dressCode: 'Smart Casual',
    website: 'https://gremioliterario.pt', contact: { email: 'info@gremioliterario.pt', phone: '+351 21 346 6772', address: 'Rua Ivens 37, 1200-226 Lisboa' },
    description: 'Historic literary and cultural club in the heart of Chiado, Lisbon.',
    membershipProcess: 'Application open to cultural enthusiasts.', nominationRequired: false, rating: 4.4
  },

  // AMSTERDAM
  {
    id: 'AMS-001', name: 'Soho House Amsterdam', type: [ClubType.PRIVATE_MEMBERS, ClubType.ARTS_CLUB], city: 'Amsterdam', country: 'Netherlands', region: 'Europe', established: 2018,
    membership: { type: 'Application', price: { initiation: 800, annual: 2000, currency: 'USD' }, waitlist: 6 },
    amenities: ['Rooftop', 'Restaurant', 'Gym', 'Screening Room', 'Bedrooms'], dressCode: 'Smart Casual',
    website: 'https://sohohouse.com', contact: { email: 'amsterdam@sohohouse.com', phone: '+31 20 888 0000', address: 'Spuistraat 210, 1012 VT Amsterdam' },
    description: 'Canal-side creative hub in a converted warehouse in central Amsterdam.',
    membershipProcess: 'Application for creative professionals.', nominationRequired: false, rating: 4.5
  },

  // STOCKHOLM
  {
    id: 'ARN-001', name: 'Sällskapet', type: [ClubType.SOCIAL_CLUB, ClubType.ARTS_CLUB], city: 'Stockholm', country: 'Sweden', region: 'Europe', established: 1800,
    membership: { type: 'Invitation Only', price: { initiation: 2000, annual: 1500, currency: 'USD' }, waitlist: 12 },
    amenities: ['Fine Dining', 'Library', 'Bar', 'Events', 'Private Rooms'], dressCode: 'Business Formal',
    website: 'https://sallskapet.se', contact: { email: 'info@sallskapet.se', phone: '+46 8 679 5560', address: 'Norrlandsgatan 18, 111 43 Stockholm' },
    description: 'Stockholm\'s most exclusive private members club, founded in 1800.',
    membershipProcess: 'Invitation only. Known for extreme selectivity.', nominationRequired: true, rating: 4.7
  },

  // KUALA LUMPUR
  {
    id: 'KUL-001', name: 'Royal Selangor Club', type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB], city: 'Kuala Lumpur', country: 'Malaysia', region: 'Asia', established: 1884,
    membership: { type: 'Application', price: { initiation: 3000, annual: 1500, currency: 'USD' }, waitlist: 12 },
    amenities: ['Swimming Pool', 'Tennis', 'Squash', 'Restaurant', 'Bar', 'Library'], dressCode: 'Smart Casual',
    website: 'https://rsc.org.my', contact: { email: 'membership@rsc.org.my', phone: '+60 3 2692 7166', address: 'Dataran Merdeka, Kuala Lumpur' },
    description: 'Historic club overlooking Dataran Merdeka, Malaysia\'s independence square.',
    membershipProcess: 'Application with two member endorsements.', nominationRequired: true, rating: 4.5
  },

  // JAKARTA
  {
    id: 'CGK-001', name: 'Jakarta Club', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Jakarta', country: 'Indonesia', region: 'Asia', established: 1960,
    membership: { type: 'Application', price: { initiation: 4000, annual: 2500, currency: 'USD' }, waitlist: 8 },
    amenities: ['Fine Dining', 'Pool', 'Tennis', 'Gym', 'Business Center', 'Events'], dressCode: 'Business Formal',
    website: 'https://jakartaclub.or.id', contact: { email: 'membership@jakartaclub.or.id', phone: '+62 21 525 5115', address: 'Jl. Jenderal Sudirman, Jakarta' },
    description: 'Jakarta\'s premier international business and social club.',
    membershipProcess: 'Application with corporate or personal references.', nominationRequired: false, rating: 4.4
  },

  // DOHA
  {
    id: 'DOH-001', name: 'The Pearl Club', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Doha', country: 'Qatar', region: 'Middle East', established: 2015,
    membership: { type: 'Application', price: { initiation: 5000, annual: 7500, currency: 'USD' }, waitlist: 4 },
    amenities: ['Fine Dining', 'Beach Access', 'Pool', 'Gym', 'Meeting Rooms', 'Events'], dressCode: 'Business Formal',
    website: 'https://thepearlclub.qa', contact: { email: 'info@thepearlclub.qa', phone: '+974 4002 0000', address: 'The Pearl-Qatar, Doha' },
    description: 'Luxury business club in the Pearl-Qatar development with waterfront views.',
    membershipProcess: 'Application for business professionals.', nominationRequired: false, rating: 4.5
  },

  // LAGOS
  {
    id: 'LOS-001', name: 'Ikoyi Club 1938', type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB], city: 'Lagos', country: 'Nigeria', region: 'Africa', established: 1938,
    membership: { type: 'Application', price: { initiation: 5000, annual: 1500, currency: 'USD' }, waitlist: 12 },
    amenities: ['Golf', 'Tennis', 'Swimming Pool', 'Restaurant', 'Squash', 'Gym'], dressCode: 'Smart Casual',
    website: 'https://ikoyiclub1938.com', contact: { email: 'admin@ikoyiclub1938.com', phone: '+234 1 269 0901', address: 'Ikoyi, Lagos' },
    description: 'Nigeria\'s most prestigious social and sporting club in the heart of Ikoyi.',
    membershipProcess: 'Application with two member proposers.', nominationRequired: true, rating: 4.4
  },

  // SANTIAGO
  {
    id: 'SCL-001', name: 'Club de la Unión', type: [ClubType.GENTLEMENS_CLUB, ClubType.SOCIAL_CLUB], city: 'Santiago', country: 'Chile', region: 'South America', established: 1864,
    membership: { type: 'Invitation Only', price: { initiation: 3000, annual: 2000, currency: 'USD' }, waitlist: 12 },
    amenities: ['Fine Dining', 'Library', 'Ballroom', 'Wine Cellar', 'Private Rooms'], dressCode: 'Business Formal',
    website: 'https://clubdelaunion.cl', contact: { email: 'info@clubdelaunion.cl', phone: '+56 2 2360 1100', address: 'Av. Libertador Bernardo O\'Higgins 1091, Santiago' },
    description: 'Chile\'s most distinguished gentlemen\'s club near La Moneda palace.',
    membershipProcess: 'Invitation only. Three member sponsors required.', nominationRequired: true, rating: 4.6
  },

  // BOGOTÁ
  {
    id: 'BOG-001', name: 'Club El Nogal', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Bogotá', country: 'Colombia', region: 'South America', established: 1985,
    membership: { type: 'Application', price: { initiation: 6000, annual: 2500, currency: 'USD' }, waitlist: 8 },
    amenities: ['Fine Dining', 'Gym', 'Pool', 'Business Center', 'Events', 'Spa'], dressCode: 'Business Formal',
    website: 'https://clubelnogal.com', contact: { email: 'info@clubelnogal.com', phone: '+57 1 625 0000', address: 'Carrera 7 No. 78-96, Bogotá' },
    description: 'Colombia\'s most prestigious business club for the Bogotá elite.',
    membershipProcess: 'Application with professional vetting.', nominationRequired: false, rating: 4.5
  },

  // BEIJING
  {
    id: 'PEK-001', name: 'Chang An Club', type: [ClubType.BUSINESS_CLUB, ClubType.PRIVATE_MEMBERS], city: 'Beijing', country: 'China', region: 'Asia', established: 1996,
    membership: { type: 'Application', price: { initiation: 12000, annual: 8000, currency: 'USD' }, waitlist: 12 },
    amenities: ['Fine Dining', 'Spa', 'Business Center', 'Wine Cellar', 'Karaoke', 'Events'], dressCode: 'Business Formal',
    website: 'https://changanclub.com', contact: { email: 'membership@changanclub.com', phone: '+86 10 6510 1988', address: '10 Chang An Avenue East, Beijing' },
    description: 'Beijing\'s most elite private club on Chang\'an Avenue, China\'s corridor of power.',
    membershipProcess: 'Application for senior business leaders and government officials.', nominationRequired: false, rating: 4.7
  },

  // SHANGHAI
  {
    id: 'PVG-001', name: 'The Shanghai Club', type: [ClubType.BUSINESS_CLUB, ClubType.SOCIAL_CLUB], city: 'Shanghai', country: 'China', region: 'Asia', established: 2010,
    membership: { type: 'Application', price: { initiation: 8000, annual: 6000, currency: 'USD' }, waitlist: 8 },
    amenities: ['Fine Dining', 'Cigar Lounge', 'Wine Cellar', 'Business Center', 'Events'], dressCode: 'Business Formal',
    website: 'https://theshanghaiclub.com', contact: { email: 'membership@theshanghaiclub.com', phone: '+86 21 6329 5888', address: 'The Bund, Shanghai' },
    description: 'Premier business club on the historic Bund waterfront.',
    membershipProcess: 'Application with corporate credentials.', nominationRequired: false, rating: 4.6
  },

  // SEOUL
  {
    id: 'ICN-001', name: 'The Seoul Club', type: [ClubType.SOCIAL_CLUB, ClubType.ATHLETIC_CLUB], city: 'Seoul', country: 'South Korea', region: 'Asia', established: 1975,
    membership: { type: 'Application', price: { initiation: 5000, annual: 4000, currency: 'USD' }, waitlist: 6 },
    amenities: ['Swimming Pool', 'Gym', 'Tennis', 'Restaurant', 'Business Center', 'Library'], dressCode: 'Smart Casual',
    website: 'https://seoulclub.org', contact: { email: 'membership@seoulclub.org', phone: '+82 2 793 8001', address: '33 Sejong-daero 21-gil, Jung-gu, Seoul' },
    description: 'International club serving Seoul\'s expatriate and Korean business community.',
    membershipProcess: 'Application open to international professionals.', nominationRequired: false, rating: 4.4
  },

  // AUCKLAND
  {
    id: 'AKL-001', name: 'Northern Club', type: [ClubType.GENTLEMENS_CLUB, ClubType.BUSINESS_CLUB], city: 'Auckland', country: 'New Zealand', region: 'Oceania', established: 1869,
    membership: { type: 'Invitation Only', price: { initiation: 3000, annual: 2500, currency: 'USD' }, waitlist: 12 },
    amenities: ['Fine Dining', 'Library', 'Bar', 'Meeting Rooms', 'Accommodation'], dressCode: 'Business Formal',
    website: 'https://northernclub.co.nz', contact: { email: 'secretary@northernclub.co.nz', phone: '+64 9 303 1320', address: '19 Princes Street, Auckland 1010' },
    description: 'Auckland\'s most exclusive club in a heritage building overlooking the harbour.',
    membershipProcess: 'Invitation with two member sponsors.', nominationRequired: true, rating: 4.5
  },

  // CAIRO
  {
    id: 'CAI-001', name: 'Gezira Sporting Club', type: [ClubType.ATHLETIC_CLUB, ClubType.SOCIAL_CLUB], city: 'Cairo', country: 'Egypt', region: 'Africa', established: 1882,
    membership: { type: 'Application', price: { initiation: 10000, annual: 1000, currency: 'USD' }, waitlist: 24 },
    amenities: ['Golf', 'Tennis', 'Swimming Pool', 'Horse Riding', 'Restaurant', 'Gym'], dressCode: 'Smart Casual',
    website: 'https://geziraclub.com', contact: { email: 'membership@geziraclub.com', phone: '+20 2 2735 6000', address: 'Gezira Island, Zamalek, Cairo' },
    description: 'Cairo\'s most prestigious sporting club on Gezira Island in the Nile.',
    membershipProcess: 'Application with extremely long waitlist.', nominationRequired: true, rating: 4.6
  },

  // ACCRA
  {
    id: 'ACC-001', name: 'Accra Polo Club', type: [ClubType.ATHLETIC_CLUB, ClubType.SOCIAL_CLUB], city: 'Accra', country: 'Ghana', region: 'Africa', established: 1920,
    membership: { type: 'Application', price: { initiation: 2000, annual: 1000, currency: 'USD' }, waitlist: 6 },
    amenities: ['Polo Field', 'Restaurant', 'Bar', 'Events', 'Swimming Pool'], dressCode: 'Smart Casual',
    website: 'https://accrapoloclub.com', contact: { email: 'info@accrapoloclub.com', phone: '+233 30 277 3870', address: 'Liberation Road, Airport Residential Area, Accra' },
    description: 'Accra\'s exclusive polo and social club in the upmarket Airport Residential Area.',
    membershipProcess: 'Application with membership committee approval.', nominationRequired: false, rating: 4.3
  },

  // WASHINGTON DC
  {
    id: 'DCA-001', name: 'The Cosmos Club', type: [ClubType.UNIVERSITY_CLUB, ClubType.SOCIAL_CLUB], city: 'Washington DC', country: 'United States', region: 'North America', established: 1878,
    membership: { type: 'Invitation Only', price: { initiation: 5000, annual: 4500, currency: 'USD' }, waitlist: 18 },
    amenities: ['Fine Dining', 'Library', 'Accommodation', 'Meeting Rooms', 'Garden'], dressCode: 'Business Formal',
    website: 'https://cosmosclub.org', contact: { email: 'membership@cosmosclub.org', phone: '+1 202 387 7783', address: '2121 Massachusetts Avenue NW, Washington DC 20008' },
    description: 'Prestigious club for scholars, scientists, and leaders. Three Nobel laureates among members.',
    membershipProcess: 'Invitation with extraordinary academic or professional achievement.', nominationRequired: true, rating: 4.8
  },

  // CHICAGO
  {
    id: 'ORD-001', name: 'The Chicago Club', type: [ClubType.BUSINESS_CLUB, ClubType.GENTLEMENS_CLUB], city: 'Chicago', country: 'United States', region: 'North America', established: 1869,
    membership: { type: 'Invitation Only', price: { initiation: 8000, annual: 6000, currency: 'USD' }, waitlist: 18 },
    amenities: ['Fine Dining', 'Library', 'Squash', 'Accommodation', 'Meeting Rooms'], dressCode: 'Business Formal',
    website: 'https://thechicagoclub.org', contact: { email: 'membership@thechicagoclub.org', phone: '+1 312 427 6600', address: '81 East Van Buren Street, Chicago, IL 60605' },
    description: 'Chicago\'s oldest and most prestigious club for the city\'s business elite.',
    membershipProcess: 'Invitation only. Multiple endorsements required.', nominationRequired: true, rating: 4.7
  },
];

export const CITIES = Array.from(new Set(ELITE_CLUBS.map(club => club.city))).sort();
export const COUNTRIES = Array.from(new Set(ELITE_CLUBS.map(club => club.country))).sort();
export const REGIONS = ['Europe', 'North America', 'Asia', 'Middle East', 'South America', 'Africa', 'Oceania'];
export const ALL_AMENITIES = Array.from(
  new Set(ELITE_CLUBS.flatMap(club => club.amenities))
).sort();
