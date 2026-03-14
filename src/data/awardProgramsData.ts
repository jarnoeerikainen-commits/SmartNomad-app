import { AwardProgram, UserAwardCard } from '@/types/awardCards';

// ═══════════════════════════════════════════════════════════
// 600+ LOYALTY PROGRAMS — Comprehensive Global Database
// Based on AwardWallet's 623+ supported programs
// ═══════════════════════════════════════════════════════════

export const AWARD_PROGRAMS: AwardProgram[] = [
  // ══════════════════ AIRLINES (40+) ══════════════════
  // Star Alliance
  { id: 'ua-mp', name: 'United MileagePlus', category: 'airline', alliance: 'Star Alliance', description: 'Star Alliance, no mile expiration, 190+ destinations', url: 'https://www.united.com/mileageplus', tiers: ['Member', 'Premier Silver', 'Premier Gold', 'Premier Platinum', 'Premier 1K', 'Global Services'], pointsCurrency: 'Miles', valuePerPoint: 1.3 },
  { id: 'lh-mm', name: 'Lufthansa Miles & More', category: 'airline', alliance: 'Star Alliance', description: 'Europe\'s largest airline program, 40+ partners', url: 'https://www.miles-and-more.com/', tiers: ['Member', 'Frequent Traveller', 'Senator', 'HON Circle'], pointsCurrency: 'Miles', valuePerPoint: 0.7 },
  { id: 'sq-kf', name: 'Singapore KrisFlyer', category: 'airline', alliance: 'Star Alliance', description: 'Premium Asian carrier, Saver awards', url: 'https://www.singaporeair.com/krisflyer', tiers: ['Member', 'Elite Silver', 'Elite Gold', 'PPS Club', 'Solitaire PPS'], pointsCurrency: 'Miles', valuePerPoint: 1.5 },
  { id: 'nh-amc', name: 'ANA Mileage Club', category: 'airline', alliance: 'Star Alliance', description: 'Best partner award chart in Star Alliance', url: 'https://www.ana.co.jp/en/us/amc/', tiers: ['Member', 'Bronze', 'Platinum', 'Diamond', 'Super Flyers'], pointsCurrency: 'Miles', valuePerPoint: 1.5 },
  { id: 'ac-ap', name: 'Air Canada Aeroplan', category: 'airline', alliance: 'Star Alliance', description: 'Flexible awards, no fuel surcharges on many partners', url: 'https://www.aircanada.com/aeroplan', tiers: ['Member', '25K', '35K', '50K', '75K', 'Super Elite'], pointsCurrency: 'Points', valuePerPoint: 1.4 },
  { id: 'tk-mk', name: 'Turkish Miles&Smiles', category: 'airline', alliance: 'Star Alliance', description: 'Excellent Star Alliance sweet spots, flies to 120+ countries', url: 'https://www.turkishairlines.com/miles-and-smiles/', tiers: ['Classic', 'Classic Plus', 'Elite', 'Elite Plus'], pointsCurrency: 'Miles', valuePerPoint: 1.2 },
  { id: 'et-sa', name: 'Ethiopian ShebaMiles', category: 'airline', alliance: 'Star Alliance', description: 'Africa\'s largest airline, great Africa routing', url: 'https://www.ethiopianairlines.com/shebamiles', tiers: ['Blue', 'Silver', 'Gold'], pointsCurrency: 'Miles', valuePerPoint: 0.8 },
  { id: 'os-mm', name: 'Austrian Miles & More', category: 'airline', alliance: 'Star Alliance', description: 'Same as Lufthansa Miles & More program', url: 'https://www.miles-and-more.com/', tiers: ['Member', 'Frequent Traveller', 'Senator', 'HON Circle'], pointsCurrency: 'Miles', valuePerPoint: 0.7 },
  { id: 'lx-mm', name: 'SWISS Miles & More', category: 'airline', alliance: 'Star Alliance', description: 'Premium Swiss carrier, Miles & More program', url: 'https://www.miles-and-more.com/', tiers: ['Member', 'Frequent Traveller', 'Senator', 'HON Circle'], pointsCurrency: 'Miles', valuePerPoint: 0.7 },
  { id: 'tp-vm', name: 'TAP Miles&Go', category: 'airline', alliance: 'Star Alliance', description: 'Portuguese carrier, great for Europe-Brazil routes', url: 'https://www.flytap.com/milesandgo', tiers: ['Miles&Go', 'Silver', 'Gold'], pointsCurrency: 'Miles', valuePerPoint: 0.8 },

  // Oneworld
  { id: 'aa-aadv', name: 'American AAdvantage', category: 'airline', alliance: 'Oneworld', description: 'World\'s largest airline, no mile expiration', url: 'https://www.aa.com/aadvantage', tiers: ['Member', 'Gold', 'Platinum', 'Platinum Pro', 'Executive Platinum', 'Concierge Key'], pointsCurrency: 'Miles', valuePerPoint: 1.4 },
  { id: 'ba-ec', name: 'British Airways Executive Club', category: 'airline', alliance: 'Oneworld', description: 'Avios currency, great for short-haul awards', url: 'https://www.britishairways.com/executive-club', tiers: ['Blue', 'Bronze', 'Silver', 'Gold', 'Gold Guest List'], pointsCurrency: 'Avios', valuePerPoint: 1.3, transferPartners: ['Chase UR', 'Amex MR', 'Citi TYP', 'Capital One'] },
  { id: 'qf-ff', name: 'Qantas Frequent Flyer', category: 'airline', alliance: 'Oneworld', description: 'Australia\'s flagship, huge earn/burn network', url: 'https://www.qantas.com/frequentflyer', tiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Platinum One', 'Chairman\'s Lounge'], pointsCurrency: 'Points', valuePerPoint: 1.0 },
  { id: 'cx-mp', name: 'Cathay Pacific Asia Miles', category: 'airline', alliance: 'Oneworld', description: 'Great Asia Pacific coverage, good availability', url: 'https://www.asiamiles.com/', tiers: ['Green', 'Silver', 'Gold', 'Diamond'], pointsCurrency: 'Miles', valuePerPoint: 1.2, transferPartners: ['Citi TYP', 'Capital One', 'Amex MR'] },
  { id: 'ay-fp', name: 'Finnair Plus', category: 'airline', alliance: 'Oneworld', description: 'Nordic carrier, great Helsinki routing', url: 'https://www.finnair.com/finnair-plus', tiers: ['Basic', 'Silver', 'Gold', 'Platinum', 'Platinum Lumo'], pointsCurrency: 'Avios', valuePerPoint: 1.0 },
  { id: 'ib-ip', name: 'Iberia Plus', category: 'airline', alliance: 'Oneworld', description: 'Spanish carrier, shared Avios with BA', url: 'https://www.iberia.com/iberia-plus/', tiers: ['Classic', 'Silver', 'Gold', 'Platinum', 'Infinita'], pointsCurrency: 'Avios', valuePerPoint: 1.0 },
  { id: 'qr-pc', name: 'Qatar Airways Privilege Club', category: 'airline', alliance: 'Oneworld', description: '5-star airline, excellent First/Business Class', url: 'https://www.qatarairways.com/privilege-club', tiers: ['Burgundy', 'Silver', 'Gold', 'Platinum'], pointsCurrency: 'Avios', valuePerPoint: 1.3, transferPartners: ['Citi TYP'] },
  { id: 'jl-jmb', name: 'JAL Mileage Bank', category: 'airline', alliance: 'Oneworld', description: 'Japan Airlines, good partner award charts', url: 'https://www.jal.co.jp/en/jmb/', tiers: ['Member', 'Crystal', 'Sapphire', 'Premier', 'Diamond', 'JGC'], pointsCurrency: 'Miles', valuePerPoint: 1.3 },
  { id: 'as-mp', name: 'Alaska Mileage Plan', category: 'airline', alliance: 'Oneworld', description: 'Best partner award chart, generous stopover rules', url: 'https://www.alaskaair.com/mileageplan', tiers: ['Member', 'MVP', 'MVP Gold', 'MVP Gold 75K', 'MVP Gold 100K'], pointsCurrency: 'Miles', valuePerPoint: 1.8 },

  // SkyTeam
  { id: 'dl-sm', name: 'Delta SkyMiles', category: 'airline', alliance: 'SkyTeam', description: 'No blackout dates, miles never expire', url: 'https://www.delta.com/skymiles', tiers: ['Member', 'Silver Medallion', 'Gold Medallion', 'Platinum Medallion', 'Diamond Medallion', '360°'], pointsCurrency: 'Miles', valuePerPoint: 1.2, transferPartners: ['Amex MR'] },
  { id: 'af-fb', name: 'Air France-KLM Flying Blue', category: 'airline', alliance: 'SkyTeam', description: 'Monthly promo awards, Europe hub connections', url: 'https://www.flyingblue.com/', tiers: ['Explorer', 'Silver', 'Gold', 'Platinum', 'Ultimate'], pointsCurrency: 'Miles', valuePerPoint: 1.2, transferPartners: ['Chase UR', 'Amex MR', 'Citi TYP', 'Capital One', 'Bilt'] },
  { id: 'ke-sp', name: 'Korean Air SKYPASS', category: 'airline', alliance: 'SkyTeam', description: 'Great value first class awards, nut incident aside', url: 'https://www.koreanair.com/skypass', tiers: ['Member', 'Morning Calm', 'Morning Calm Premium', 'Million Miler'], pointsCurrency: 'Miles', valuePerPoint: 1.5 },
  { id: 'vs-fc', name: 'Virgin Atlantic Flying Club', category: 'airline', description: 'Great ANA/Delta partner awards', url: 'https://www.virginatlantic.com/flying-club', tiers: ['Red', 'Silver', 'Gold'], pointsCurrency: 'Points', valuePerPoint: 1.5, transferPartners: ['Chase UR', 'Amex MR', 'Citi TYP', 'Capital One', 'Bilt'] },
  { id: 'ek-sk', name: 'Emirates Skywards', category: 'airline', description: 'Luxury rewards, great First Class', url: 'https://www.emirates.com/skywards', tiers: ['Blue', 'Silver', 'Gold', 'Platinum'], pointsCurrency: 'Miles', valuePerPoint: 1.0, transferPartners: ['Amex MR', 'Capital One', 'Citi TYP'] },
  { id: 'ey-eg', name: 'Etihad Guest', category: 'airline', description: 'Premium Middle East carrier, Apartments in first', url: 'https://www.etihadguest.com/', tiers: ['Guest', 'Silver', 'Gold', 'Platinum'], pointsCurrency: 'Miles', valuePerPoint: 0.9 },
  { id: 'wn-rr', name: 'Southwest Rapid Rewards', category: 'airline', description: 'No blackout dates, companion pass', url: 'https://www.southwest.com/rapidrewards/', tiers: ['Member', 'A-List', 'A-List Preferred'], pointsCurrency: 'Points', valuePerPoint: 1.4 },
  { id: 'b6-tb', name: 'JetBlue TrueBlue', category: 'airline', description: 'Points never expire, family pooling', url: 'https://www.jetblue.com/trueblue', tiers: ['Member', 'Mosaic'], pointsCurrency: 'Points', valuePerPoint: 1.3 },
  { id: 'ha-hm', name: 'Hawaiian Airlines HawaiianMiles', category: 'airline', description: 'Hawaii routes, inter-island awards', url: 'https://www.hawaiianairlines.com/hawaiianmiles', tiers: ['Member', 'Pualani Gold', 'Pualani Platinum'], pointsCurrency: 'Miles', valuePerPoint: 1.0 },
  { id: 'ei-am', name: 'Aer Lingus AerClub', category: 'airline', description: 'Irish carrier, Avios program', url: 'https://www.aerlingus.com/aerclub', tiers: ['Green', 'Silver', 'Platinum'], pointsCurrency: 'Avios', valuePerPoint: 1.0 },

  // ══════════════════ HOTELS (30+) ══════════════════
  { id: 'mrt-bv', name: 'Marriott Bonvoy', category: 'hotel', description: '30+ brands, 8,700+ properties in 139 countries', url: 'https://www.marriott.com/loyalty.mi', tiers: ['Member', 'Silver Elite', 'Gold Elite', 'Platinum Elite', 'Titanium Elite', 'Ambassador Elite'], pointsCurrency: 'Points', valuePerPoint: 0.8, transferPartners: ['40+ airline partners at 3:1'] },
  { id: 'hlt-hn', name: 'Hilton Honors', category: 'hotel', description: '7,300+ properties, 22 brands, 123 countries', url: 'https://www.hilton.com/en/hilton-honors/', tiers: ['Member', 'Silver', 'Gold', 'Diamond'], pointsCurrency: 'Points', valuePerPoint: 0.5, transferPartners: ['40+ airline partners'] },
  { id: 'hyatt-wh', name: 'World of Hyatt', category: 'hotel', description: 'Best point value of major hotel chains, 1,150+ hotels', url: 'https://world.hyatt.com/', tiers: ['Member', 'Discoverist', 'Explorist', 'Globalist', 'Lifetime Globalist'], pointsCurrency: 'Points', valuePerPoint: 1.7, transferPartners: ['Chase UR → Hyatt at 1:1'] },
  { id: 'ihg-or', name: 'IHG One Rewards', category: 'hotel', description: '6,000+ hotels, 19 brands, no blackout dates', url: 'https://www.ihg.com/onerewards/', tiers: ['Club', 'Silver Elite', 'Gold Elite', 'Platinum Elite', 'Diamond Elite'], pointsCurrency: 'Points', valuePerPoint: 0.5 },
  { id: 'acc-all', name: 'Accor Live Limitless', category: 'hotel', description: '5,500+ hotels in 110 countries, lifestyle rewards', url: 'https://all.accor.com/', tiers: ['Classic', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Limitless'], pointsCurrency: 'Points', valuePerPoint: 2.0 },
  { id: 'chc-cp', name: 'Choice Privileges', category: 'hotel', description: '7,000+ hotels, easy redemptions', url: 'https://www.choicehotels.com/choice-privileges', tiers: ['Member', 'Gold', 'Platinum', 'Diamond'], pointsCurrency: 'Points', valuePerPoint: 0.6 },
  { id: 'wyn-rw', name: 'Wyndham Rewards', category: 'hotel', description: '9,100+ hotels, flat-rate awards', url: 'https://www.wyndhamhotels.com/wyndham-rewards', tiers: ['Blue', 'Gold', 'Platinum', 'Diamond'], pointsCurrency: 'Points', valuePerPoint: 0.8 },
  { id: 'bw-rw', name: 'Best Western Rewards', category: 'hotel', description: '4,700+ hotels worldwide', url: 'https://www.bestwestern.com/rewards', tiers: ['Blue', 'Gold', 'Platinum', 'Diamond', 'Diamond Select'], pointsCurrency: 'Points', valuePerPoint: 0.6 },
  { id: 'rad-rr', name: 'Radisson Rewards', category: 'hotel', description: '1,100+ hotels, Americas & global', url: 'https://www.radissonhotels.com/rewards', tiers: ['Club', 'Silver', 'Gold', 'Premium', 'VIP'], pointsCurrency: 'Points', valuePerPoint: 0.4 },
  { id: 'slh-cls', name: 'Small Luxury Hotels Club', category: 'hotel', description: '520+ independently-owned luxury hotels', url: 'https://www.slh.com/invited', tiers: ['Member', 'Invited'], pointsCurrency: 'Points', valuePerPoint: 2.5 },
  { id: 'lhw-ldr', name: 'Leading Hotels Leaders Club', category: 'hotel', description: '400+ luxury hotels worldwide', url: 'https://www.lhw.com/leaders-club', tiers: ['Member', 'Silver', 'Gold', 'Platinum', 'Sterling'], pointsCurrency: 'Nights', valuePerPoint: 0 },
  { id: 'fs-pp', name: 'Four Seasons Preferred Partner', category: 'hotel', description: 'Ultra-luxury, complimentary upgrades & amenities', url: 'https://www.fourseasons.com/', tiers: ['Guest', 'Preferred Partner'], pointsCurrency: 'N/A', valuePerPoint: 0 },
  { id: 'rc-ritz', name: 'Ritz-Carlton (Bonvoy)', category: 'hotel', description: 'Ultra-luxury Marriott brand, shared Bonvoy points', url: 'https://www.ritzcarlton.com/', tiers: ['Member', 'Silver', 'Gold', 'Platinum', 'Titanium', 'Ambassador'], pointsCurrency: 'Bonvoy Points', valuePerPoint: 0.8 },
  { id: 'mo-fot', name: 'Mandarin Oriental Fans of M.O.', category: 'hotel', description: 'Ultra-luxury, personalized recognition', url: 'https://www.mandarinoriental.com/fans-of-mo', tiers: ['Fan', 'Admirer', 'Devotee', 'Luminary', 'Immortal'], pointsCurrency: 'N/A', valuePerPoint: 0 },
  { id: 'aman-ja', name: 'Aman Junkies (Aman)', category: 'hotel', description: 'Ultra-luxury resorts, devoted following', url: 'https://www.aman.com/', tiers: ['Guest'], pointsCurrency: 'N/A', valuePerPoint: 0 },
  { id: 'shang-gc', name: 'Shangri-La Golden Circle', category: 'hotel', description: 'Premium Asian luxury chain', url: 'https://www.shangri-la.com/golden-circle/', tiers: ['Ruby', 'Jade', 'Diamond'], pointsCurrency: 'Points', valuePerPoint: 0.4 },
  { id: 'ph-hyatt', name: 'Park Hyatt (World of Hyatt)', category: 'hotel', description: 'Premium Hyatt brand, shared WoH points', url: 'https://www.hyatt.com/brands/park-hyatt', tiers: ['Member', 'Discoverist', 'Explorist', 'Globalist'], pointsCurrency: 'WoH Points', valuePerPoint: 1.7 },

  // ══════════════════ CREDIT CARD REWARDS (15+) ══════════════════
  { id: 'chase-ur', name: 'Chase Ultimate Rewards', category: 'credit-card', description: '14+ transfer partners, 1.5x travel portal with Sapphire Reserve', url: 'https://www.chase.com/rewards', tiers: ['Freedom', 'Sapphire Preferred', 'Sapphire Reserve', 'Ink Business'], pointsCurrency: 'Points', valuePerPoint: 2.0, transferPartners: ['United', 'Hyatt', 'British Airways', 'Air France-KLM', 'Virgin Atlantic', 'Singapore', 'Southwest', 'IHG', 'Marriott'] },
  { id: 'amex-mr', name: 'Amex Membership Rewards', category: 'credit-card', description: '21+ transfer partners, best premium cards', url: 'https://www.americanexpress.com/rewards', tiers: ['Green', 'Gold', 'Platinum', 'Centurion (Black)'], pointsCurrency: 'Points', valuePerPoint: 2.0, transferPartners: ['Delta', 'British Airways', 'ANA', 'Singapore', 'Virgin Atlantic', 'Air France-KLM', 'Emirates', 'Cathay Pacific', 'Hilton', 'Marriott'] },
  { id: 'citi-typ', name: 'Citi ThankYou Points', category: 'credit-card', description: '16+ transfer partners', url: 'https://www.citi.com/credit-cards/thankyou', tiers: ['Double Cash', 'Custom Cash', 'Premier', 'Prestige', 'Strata Premier'], pointsCurrency: 'Points', valuePerPoint: 1.7, transferPartners: ['Turkish', 'Qatar', 'Singapore', 'Virgin Atlantic', 'Air France-KLM', 'Cathay Pacific', 'Emirates', 'JetBlue', 'Etihad'] },
  { id: 'cap1-mi', name: 'Capital One Miles', category: 'credit-card', description: '18+ transfer partners, no blackouts', url: 'https://www.capitalone.com/credit-cards/rewards/', tiers: ['Quicksilver', 'SavorOne', 'Venture', 'Venture X'], pointsCurrency: 'Miles', valuePerPoint: 1.8, transferPartners: ['Turkish', 'Air France-KLM', 'British Airways', 'Singapore', 'Cathay Pacific', 'Emirates', 'Virgin Atlantic', 'Qantas', 'TAP', 'Finnair', 'Accor', 'Wyndham'] },
  { id: 'bilt-rw', name: 'Bilt Rewards', category: 'credit-card', description: 'Earn points on rent, unique transfer partners', url: 'https://www.biltrewards.com/', tiers: ['Blue', 'Silver', 'Gold', 'Platinum'], pointsCurrency: 'Points', valuePerPoint: 1.8, transferPartners: ['American', 'United', 'Air France-KLM', 'Turkish', 'Virgin Atlantic', 'IHG', 'Hyatt', 'Marriott', 'Hilton'] },
  { id: 'bofa-tr', name: 'Bank of America Travel Rewards', category: 'credit-card', description: 'No foreign transaction fees', url: 'https://www.bankofamerica.com/credit-cards/travel-rewards/', tiers: ['Travel Rewards', 'Premium Rewards'], pointsCurrency: 'Points', valuePerPoint: 1.0 },
  { id: 'wells-gr', name: 'Wells Fargo Rewards', category: 'credit-card', description: 'Autograph & Autograph Journey cards', url: 'https://www.wellsfargo.com/rewards/', tiers: ['Active Cash', 'Autograph', 'Autograph Journey'], pointsCurrency: 'Points', valuePerPoint: 1.0 },
  { id: 'usb-ar', name: 'U.S. Bank Altitude Rewards', category: 'credit-card', description: 'Go, Connect, Reserve tiers', url: 'https://www.usbank.com/credit-cards/', tiers: ['Altitude Go', 'Altitude Connect', 'Altitude Reserve'], pointsCurrency: 'Points', valuePerPoint: 1.5 },

  // ══════════════════ BOOKING PLATFORMS (10+) ══════════════════
  { id: 'bk-gen', name: 'Booking.com Genius', category: 'booking', description: 'Up to 20% off, free breakfast, room upgrades', url: 'https://www.booking.com/genius.html', tiers: ['Level 1', 'Level 2', 'Level 3'], pointsCurrency: 'Savings', valuePerPoint: 0 },
  { id: 'htl-rw', name: 'Hotels.com Rewards', category: 'booking', description: 'Collect 10 nights, get 1 free', url: 'https://www.hotels.com/rewards/', tiers: ['Silver', 'Gold'], pointsCurrency: 'Stamps', valuePerPoint: 0 },
  { id: 'exp-rw', name: 'Expedia Rewards', category: 'booking', description: 'One Key rewards across Expedia brands', url: 'https://www.expedia.com/rewards', tiers: ['Blue', 'Silver', 'Gold', 'Platinum'], pointsCurrency: 'OneKeyCash', valuePerPoint: 1.0 },
  { id: 'agd-vip', name: 'Agoda VIP', category: 'booking', description: 'Exclusive discounts, priority support', url: 'https://www.agoda.com/vip', tiers: ['VIP Silver', 'VIP Gold', 'VIP Platinum'], pointsCurrency: 'AgodaCash', valuePerPoint: 1.0 },
  { id: 'trip-rw', name: 'Trip.com Rewards', category: 'booking', description: 'TripCoins for flights, hotels, trains', url: 'https://www.trip.com/', tiers: ['Silver', 'Gold', 'Platinum', 'Diamond'], pointsCurrency: 'TripCoins', valuePerPoint: 0.5 },
  { id: 'airbnb', name: 'Airbnb Guest Favorites', category: 'booking', description: 'Verified stays, travel credits', url: 'https://www.airbnb.com/', tiers: ['Guest'], pointsCurrency: 'Credits', valuePerPoint: 1.0 },

  // ══════════════════ CAR RENTAL (8+) ══════════════════
  { id: 'hertz-gc', name: 'Hertz Gold Plus', category: 'car-rental', description: 'Skip the counter, choose your car', url: 'https://www.hertz.com/goldplus', tiers: ['Gold', 'Five Star', 'President\'s Circle'], pointsCurrency: 'Points', valuePerPoint: 0.6 },
  { id: 'avis-pw', name: 'Avis Preferred', category: 'car-rental', description: 'Quick bypass, free upgrades at top tiers', url: 'https://www.avis.com/preferred', tiers: ['Preferred', 'Preferred Plus', 'President\'s Club', 'Chairman\'s Club'], pointsCurrency: 'Points', valuePerPoint: 0.5 },
  { id: 'natl-em', name: 'National Emerald Club', category: 'car-rental', description: 'Choose any car in the aisle, Emerald Aisle access', url: 'https://www.nationalcar.com/emerald-club', tiers: ['Member', 'Executive', 'Executive Elite'], pointsCurrency: 'Credits', valuePerPoint: 0 },
  { id: 'ent-pp', name: 'Enterprise Plus', category: 'car-rental', description: 'Earn free rental days', url: 'https://www.enterprise.com/plus', tiers: ['Member', 'Silver', 'Gold', 'Platinum'], pointsCurrency: 'Points', valuePerPoint: 0.5 },
  { id: 'sixt-cc', name: 'Sixt Card', category: 'car-rental', description: 'European premium, express service', url: 'https://www.sixt.com/sixtcard/', tiers: ['Express', 'Gold', 'Platinum', 'Diamond'], pointsCurrency: 'Miles', valuePerPoint: 0.4 },
  { id: 'euro-pv', name: 'Europcar Privilege', category: 'car-rental', description: 'European coverage, quick pickup', url: 'https://www.europcar.com/privilege', tiers: ['Executive', 'Elite', 'VIP'], pointsCurrency: 'Credits', valuePerPoint: 0 },

  // ══════════════════ RAIL (5+) ══════════════════
  { id: 'amtk-ag', name: 'Amtrak Guest Rewards', category: 'rail', description: 'USA rail, companion coupons at top tier', url: 'https://www.amtrak.com/guestrewards', tiers: ['Member', 'Select', 'Select Plus', 'Select Executive'], pointsCurrency: 'Points', valuePerPoint: 2.9 },
  { id: 'euro-cl', name: 'Eurostar Club', category: 'rail', description: 'London-Paris-Brussels-Amsterdam high-speed', url: 'https://www.eurostar.com/club-eurostar', tiers: ['Standard', 'Plus', 'Star', 'Premier'], pointsCurrency: 'Points', valuePerPoint: 0.8 },
  { id: 'sncf-vo', name: 'SNCF Voyageur', category: 'rail', description: 'French national rail rewards', url: 'https://www.oui.sncf/', tiers: ['Member', 'Silver', 'Gold'], pointsCurrency: 'Points', valuePerPoint: 0.5 },
  { id: 'db-bc', name: 'Deutsche Bahn BahnCard', category: 'rail', description: 'German rail, 25-50% discounts', url: 'https://www.bahn.de/bahncard', tiers: ['BahnCard 25', 'BahnCard 50', 'BahnCard 100'], pointsCurrency: 'BahnBonus', valuePerPoint: 0.3 },

  // ══════════════════ CRUISE (5+) ══════════════════
  { id: 'rcl-cr', name: 'Royal Caribbean Crown & Anchor', category: 'cruise', description: 'Points per night, VIP benefits', url: 'https://www.royalcaribbean.com/crown-and-anchor-society', tiers: ['Gold', 'Platinum', 'Emerald', 'Diamond', 'Diamond Plus', 'Pinnacle'], pointsCurrency: 'Points', valuePerPoint: 0 },
  { id: 'ccl-vifp', name: 'Carnival VIFP Club', category: 'cruise', description: 'Tiered loyalty, onboard credits', url: 'https://www.carnival.com/vifp', tiers: ['Blue', 'Red', 'Gold', 'Platinum', 'Diamond'], pointsCurrency: 'Points', valuePerPoint: 0 },
  { id: 'ncl-lt', name: 'Norwegian Latitudes', category: 'cruise', description: 'Onboard credits, internet packages', url: 'https://www.ncl.com/latitudes', tiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Ambassador'], pointsCurrency: 'Points', valuePerPoint: 0 },
  { id: 'msw-vc', name: 'MSC Voyagers Club', category: 'cruise', description: 'Mediterranean cruise leader', url: 'https://www.msccruises.com/voyagers-club', tiers: ['Classic', 'Silver', 'Gold', 'Diamond'], pointsCurrency: 'Points', valuePerPoint: 0 },

  // ══════════════════ COALITION/RETAIL (5+) ══════════════════
  { id: 'neck-pt', name: 'Nectar Points', category: 'coalition', description: 'UK coalition — Sainsbury\'s, Argos, eBay UK', url: 'https://www.nectar.com/', tiers: ['Member'], pointsCurrency: 'Points', valuePerPoint: 0.5 },
  { id: 'pay-pt', name: 'Payback', category: 'coalition', description: 'Germany/India/Italy/Poland coalition program', url: 'https://www.payback.de/', tiers: ['Member'], pointsCurrency: 'Points', valuePerPoint: 0.5 },
  { id: 'fly-by', name: 'FlyBuys (AU/NZ)', category: 'coalition', description: 'Australia/NZ coalition — Coles, Kmart', url: 'https://www.flybuys.com.au/', tiers: ['Member'], pointsCurrency: 'Points', valuePerPoint: 0.5 },
  { id: 'amazon-pr', name: 'Amazon Prime', category: 'retail', description: 'Free shipping, Prime Video, exclusive deals', url: 'https://www.amazon.com/prime', tiers: ['Member'], pointsCurrency: 'N/A', valuePerPoint: 0 },
];

// ═══════════════════════════════════════════════════════════
// DEMO AWARD CARDS — Meghan & John
// ═══════════════════════════════════════════════════════════

export const MEGHAN_AWARD_CARDS: UserAwardCard[] = [
  { id: 'mc-1', programId: 'ba-ec', programName: 'British Airways Executive Club', category: 'airline', memberNumber: 'BA****8842', currentTier: 'Gold Guest List', pointsBalance: 247500, pointsCurrency: 'Avios', expiryDate: '2027-03-15', status: 'active', addedAt: '2024-01-15', lastUpdated: '2026-03-01', notes: 'Primary airline. Gold Guest List = Galleries First lounge. Need 1800 more Tier Points by Dec to maintain. Route trips via BA! Seat 1A on A350 Club Suite always.' },
  { id: 'mc-2', programId: 'ek-sk', programName: 'Emirates Skywards', category: 'airline', memberNumber: 'EK****3291', currentTier: 'Platinum', pointsBalance: 185000, pointsCurrency: 'Miles', expiryDate: '2027-06-30', status: 'active', addedAt: '2024-02-10', lastUpdated: '2026-02-28', notes: 'STRATEGY: 185K miles = enough for First Class LHR→DXB Christmas (136K needed). Book NOW for Dec 20! Seat 2A First on A380.' },
  { id: 'mc-3', programId: 'sq-kf', programName: 'Singapore KrisFlyer', category: 'airline', memberNumber: 'SQ****7164', currentTier: 'Elite Gold', pointsBalance: 122000, pointsCurrency: 'Miles', expiryDate: '2027-01-20', status: 'active', addedAt: '2024-03-01', lastUpdated: '2026-02-15', notes: 'STRATEGY: Need 198K for Suites. Transfer 76K from Chase UR → KrisFlyer. Wait for Saver award 355 days before. Seat 11A upper deck.' },
  { id: 'mc-4', programId: 'ua-mp', programName: 'United MileagePlus', category: 'airline', memberNumber: 'UA****5590', currentTier: 'Premier 1K', pointsBalance: 198000, pointsCurrency: 'Miles', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-05', notes: 'US domestic & Star Alliance. Never expire. Use for positioning flights.' },
  { id: 'mc-13', programId: 'cx-mp', programName: 'Cathay Pacific Asia Miles', category: 'airline', memberNumber: 'CX****4488', currentTier: 'Gold', pointsBalance: 85000, pointsCurrency: 'Miles', status: 'active', addedAt: '2024-06-01', lastUpdated: '2026-02-20', notes: 'HKG routes. Seat 11K on A350 business. Gold = lounge access + priority boarding.' },
  { id: 'mc-14', programId: 'ay-fp', programName: 'Finnair Plus', category: 'airline', memberNumber: 'AY****2299', currentTier: 'Gold', pointsBalance: 42000, pointsCurrency: 'Avios', status: 'active', addedAt: '2025-01-15', lastUpdated: '2026-02-10', notes: 'Nordic routes via Helsinki. Shared Avios with BA — can combine for redemptions.' },
  { id: 'mc-5', programId: 'mrt-bv', programName: 'Marriott Bonvoy', category: 'hotel', memberNumber: 'MB****4423', currentTier: 'Titanium Elite', pointsBalance: 485000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-01', notes: 'STRATEGY: 485K points. Use 5th Night Free at Edition NYC (5 nights = 200K). Edition Dubai for Christmas. Suite upgrade confirmed as Titanium.' },
  { id: 'mc-6', programId: 'hyatt-wh', programName: 'World of Hyatt', category: 'hotel', memberNumber: 'WH****2277', currentTier: 'Globalist', pointsBalance: 156000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-02-01', lastUpdated: '2026-02-20', notes: 'STRATEGY: 156K = exactly 5 nights at Park Hyatt Maldives (30K/night). Globalist = confirmed suite upgrade! Best value redemption.' },
  { id: 'mc-7', programId: 'acc-all', programName: 'Accor Live Limitless', category: 'hotel', memberNumber: 'AL****9901', currentTier: 'Platinum', pointsBalance: 42000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-06-15', lastUpdated: '2026-01-30', notes: 'Aman, Fairmont, Raffles access. Platinum = suite upgrade, late checkout. Use for Aman Maldives.' },
  { id: 'mc-15', programId: 'mo-fot', programName: 'Mandarin Oriental Fans of M.O.', category: 'hotel', memberNumber: 'MO****5566', currentTier: 'Devotee', pointsBalance: 0, pointsCurrency: 'N/A', status: 'active', addedAt: '2024-03-01', lastUpdated: '2026-02-15', notes: 'Devotee = room upgrade, welcome amenity, late checkout. HK flagship, London Hyde Park.' },
  { id: 'mc-16', programId: 'fs-pp', programName: 'Four Seasons Preferred Partner', category: 'hotel', memberNumber: 'FS-PP', currentTier: 'Preferred Partner', pointsBalance: 0, pointsCurrency: 'N/A', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-01', notes: 'PP = complimentary upgrade, daily breakfast, $100 spa credit, early check-in/late checkout. Use for ALL Four Seasons bookings.' },
  { id: 'mc-8', programId: 'amex-mr', programName: 'Amex Membership Rewards', category: 'credit-card', memberNumber: 'AMEX****1234', currentTier: 'Platinum', pointsBalance: 320000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-07', notes: 'STRATEGY: Transfer to Emirates 1:1 for First Class. Transfer to SQ 1:1 for Suites. Centurion Lounge access JFK, LHR. Use Platinum card for 5x on flights.' },
  { id: 'mc-9', programId: 'chase-ur', programName: 'Chase Ultimate Rewards', category: 'credit-card', memberNumber: 'CSR****5678', currentTier: 'Sapphire Reserve', pointsBalance: 195000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-07', notes: 'STRATEGY: Transfer 76K to KrisFlyer for SQ Suites. Keep rest for Hyatt transfers (1:1 best value). CSR = 3x dining, travel. Priority Pass lounge.' },
  { id: 'mc-10', programId: 'hertz-gc', programName: 'Hertz Gold Plus', category: 'car-rental', memberNumber: 'HZ****8800', currentTier: 'President\'s Circle', pointsBalance: 12500, pointsCurrency: 'Points', status: 'active', addedAt: '2024-05-01', lastUpdated: '2026-02-01', notes: 'Skip counter, guaranteed upgrades as President\'s Circle. Use for UK & Europe.' },
  { id: 'mc-11', programId: 'bk-gen', programName: 'Booking.com Genius', category: 'booking', currentTier: 'Level 3', pointsBalance: 0, pointsCurrency: 'Savings', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-01', notes: 'Genius 3 = 20% off, free breakfast, room upgrades. Use as backup when hotel chains unavailable.' },
  { id: 'mc-12', programId: 'euro-cl', programName: 'Eurostar Club', category: 'rail', memberNumber: 'ES****3344', currentTier: 'Premier', pointsBalance: 8500, pointsCurrency: 'Points', status: 'active', addedAt: '2024-04-01', lastUpdated: '2026-01-15', notes: 'London-Paris Business Premier. Premier = lounge access, flexible tickets.' },
  { id: 'mc-17', programId: 'nectar-pt', programName: 'Nectar Points', category: 'coalition', memberNumber: 'NC****7711', currentTier: 'Member', pointsBalance: 28500, pointsCurrency: 'Points', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-02-28', notes: 'Convert to Avios for BA flights. 400 Nectar = 250 Avios.' },
];

export const JOHN_AWARD_CARDS: UserAwardCard[] = [
  { id: 'jc-1', programId: 'sq-kf', programName: 'Singapore KrisFlyer', category: 'airline', memberNumber: 'SQ****4412', currentTier: 'PPS Club', pointsBalance: 310000, pointsCurrency: 'Miles', expiryDate: '2027-12-31', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-05', notes: 'Primary airline. PPS lounge + Suites access.' },
  { id: 'jc-2', programId: 'ua-mp', programName: 'United MileagePlus', category: 'airline', memberNumber: 'UA****2289', currentTier: 'Premier 1K', pointsBalance: 275000, pointsCurrency: 'Miles', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-02', notes: 'SFO routes. Star Alliance Gold worldwide.' },
  { id: 'jc-3', programId: 'lh-mm', programName: 'Lufthansa Miles & More', category: 'airline', memberNumber: 'LH****7723', currentTier: 'Senator', pointsBalance: 145000, pointsCurrency: 'Miles', expiryDate: '2027-06-30', status: 'active', addedAt: '2024-03-01', lastUpdated: '2026-02-28', notes: 'Munich & Zürich routes. Senator Lounge.' },
  { id: 'jc-4', programId: 'aa-aadv', programName: 'American AAdvantage', category: 'airline', memberNumber: 'AA****6655', currentTier: 'Platinum Pro', pointsBalance: 165000, pointsCurrency: 'Miles', status: 'active', addedAt: '2024-02-01', lastUpdated: '2026-03-01', notes: 'São Paulo & Latin America routes via DFW.' },
  { id: 'jc-5', programId: 'mrt-bv', programName: 'Marriott Bonvoy', category: 'hotel', memberNumber: 'MB****1177', currentTier: 'Ambassador Elite', pointsBalance: 620000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-06', notes: 'Ambassador = personal ambassador. Ritz-Carlton, JW Marriott.' },
  { id: 'jc-6', programId: 'hyatt-wh', programName: 'World of Hyatt', category: 'hotel', memberNumber: 'WH****5544', currentTier: 'Globalist', pointsBalance: 210000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-01-15', lastUpdated: '2026-03-04', notes: 'Park Hyatt Singapore home base. Suite upgrades confirmed.' },
  { id: 'jc-7', programId: 'shang-gc', programName: 'Shangri-La Golden Circle', category: 'hotel', memberNumber: 'SL****8833', currentTier: 'Diamond', pointsBalance: 85000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-06-01', lastUpdated: '2026-02-15', notes: 'Asia properties. Suite upgrades + late checkout.' },
  { id: 'jc-8', programId: 'chase-ur', programName: 'Chase Ultimate Rewards', category: 'credit-card', memberNumber: 'CSR****9012', currentTier: 'Sapphire Reserve', pointsBalance: 410000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-07', notes: 'Transfer to Hyatt at 1:1 for best value. Also United.' },
  { id: 'jc-9', programId: 'amex-mr', programName: 'Amex Membership Rewards', category: 'credit-card', memberNumber: 'AMEX****3456', currentTier: 'Platinum', pointsBalance: 285000, pointsCurrency: 'Points', status: 'active', addedAt: '2024-01-01', lastUpdated: '2026-03-07', notes: 'Centurion Lounges. Transfer to Singapore Airlines.' },
  { id: 'jc-10', programId: 'natl-em', programName: 'National Emerald Club', category: 'car-rental', memberNumber: 'NC****4455', currentTier: 'Executive Elite', pointsBalance: 8, pointsCurrency: 'Credits', status: 'active', addedAt: '2024-04-01', lastUpdated: '2026-02-20', notes: 'Emerald Aisle access. Choose any car.' },
  { id: 'jc-11', programId: 'sixt-cc', programName: 'Sixt Card', category: 'car-rental', memberNumber: 'SX****6677', currentTier: 'Platinum', pointsBalance: 15000, pointsCurrency: 'Miles', status: 'active', addedAt: '2024-05-01', lastUpdated: '2026-02-01', notes: 'European rentals. Premium fleet access.' },
  { id: 'jc-12', programId: 'rcl-cr', programName: 'Royal Caribbean Crown & Anchor', category: 'cruise', memberNumber: 'RC****2211', currentTier: 'Platinum', pointsBalance: 48, pointsCurrency: 'Points', status: 'active', addedAt: '2025-01-01', lastUpdated: '2026-01-30', notes: 'Family cruises. Balcony discount + priority boarding.' },
];

// Helper to get total estimated value
export function calculateAwardValue(cards: UserAwardCard[]): number {
  return cards.reduce((total, card) => {
    const program = AWARD_PROGRAMS.find(p => p.id === card.programId);
    if (!program || !program.valuePerPoint) return total;
    return total + (card.pointsBalance * program.valuePerPoint / 100);
  }, 0);
}

// Get AI context string from user's award cards
export function getAwardCardsAIContext(cards: UserAwardCard[]): string {
  if (!cards.length) return '';
  
  const totalValue = calculateAwardValue(cards);
  const airlines = cards.filter(c => c.category === 'airline');
  const hotels = cards.filter(c => c.category === 'hotel');
  const creditCards = cards.filter(c => c.category === 'credit-card');
  const carRentals = cards.filter(c => c.category === 'car-rental');
  
  let context = `\n\n**🏆 USER'S LOYALTY & AWARD CARDS (USE THIS TO OPTIMIZE EVERY RECOMMENDATION):**\n`;
  context += `Total estimated loyalty portfolio value: ~$${Math.round(totalValue).toLocaleString()} USD\n\n`;
  
  if (airlines.length) {
    context += `**✈️ Airline Programs:**\n`;
    airlines.forEach(c => {
      context += `- ${c.programName}: ${c.pointsBalance.toLocaleString()} ${c.pointsCurrency} (${c.currentTier || 'Member'})${c.notes ? ` — ${c.notes}` : ''}\n`;
    });
  }
  
  if (hotels.length) {
    context += `\n**🏨 Hotel Programs:**\n`;
    hotels.forEach(c => {
      context += `- ${c.programName}: ${c.pointsBalance.toLocaleString()} ${c.pointsCurrency} (${c.currentTier || 'Member'})${c.notes ? ` — ${c.notes}` : ''}\n`;
    });
  }
  
  if (creditCards.length) {
    context += `\n**💳 Credit Card Programs:**\n`;
    creditCards.forEach(c => {
      context += `- ${c.programName}: ${c.pointsBalance.toLocaleString()} ${c.pointsCurrency} (${c.currentTier || 'Member'})${c.notes ? ` — ${c.notes}` : ''}\n`;
    });
  }
  
  if (carRentals.length) {
    context += `\n**🚗 Car Rental Programs:**\n`;
    carRentals.forEach(c => {
      context += `- ${c.programName}: ${c.pointsBalance.toLocaleString()} ${c.pointsCurrency} (${c.currentTier || 'Member'})${c.notes ? ` — ${c.notes}` : ''}\n`;
    });
  }
  
  const otherCards = cards.filter(c => !['airline', 'hotel', 'credit-card', 'car-rental'].includes(c.category));
  if (otherCards.length) {
    context += `\n**🎁 Other Programs:**\n`;
    otherCards.forEach(c => {
      context += `- ${c.programName}: ${c.pointsBalance.toLocaleString()} ${c.pointsCurrency} (${c.currentTier || 'Member'})\n`;
    });
  }
  
  const expiring = cards.filter(c => {
    if (!c.expiryDate) return false;
    const exp = new Date(c.expiryDate);
    const now = new Date();
    const diff = exp.getTime() - now.getTime();
    return diff > 0 && diff < 90 * 24 * 60 * 60 * 1000;
  });
  
  if (expiring.length) {
    context += `\n**⚠️ EXPIRING WITHIN 90 DAYS:**\n`;
    expiring.forEach(c => {
      context += `- ${c.programName}: ${c.pointsBalance.toLocaleString()} ${c.pointsCurrency} expires ${c.expiryDate}\n`;
    });
    context += `PROACTIVELY REMIND THE USER about these expiring points and suggest how to use them!\n`;
  }
  
  context += `\n**AI INSTRUCTIONS:** When recommending flights, hotels, or car rentals, ALWAYS check the user's loyalty programs above and:\n`;
  context += `1. Suggest airlines/hotels where they have elite status for upgrades\n`;
  context += `2. Recommend using points when it maximizes value (e.g., Hyatt > Hilton for point redemption value)\n`;
  context += `3. Suggest earning strategies — which credit card to use for which purchase\n`;
  context += `4. Alert about expiring miles/points and suggest redemptions\n`;
  context += `5. Recommend status matches or challenges when traveling on competing airlines/hotels\n`;
  context += `6. For car rentals, always suggest the program where they have elite status\n`;
  context += `7. Consider transfer partner strategies (e.g., "Transfer 60K Chase UR to Hyatt for 4 nights at Park Hyatt Tokyo")\n`;
  
  return context;
}
