import { MarketplaceItem, ItemCategory, ItemCondition, SellerProfile, ItemOffer } from '@/types/marketplace';

// ─── 50 Major Expat Cities ──────────────────────────────────────────────────
export const POPULAR_CITIES = [
  'Barcelona', 'Lisbon', 'Berlin', 'Mexico City', 'Bangkok',
  'Medellín', 'Dubai', 'Singapore', 'Bali', 'Chiang Mai',
  'London', 'Paris', 'Amsterdam', 'Prague', 'Budapest',
  'Tokyo', 'Seoul', 'Ho Chi Minh City', 'Kuala Lumpur', 'Manila',
  'Buenos Aires', 'São Paulo', 'Bogotá', 'Lima', 'Santiago',
  'Cape Town', 'Nairobi', 'Lagos', 'Accra', 'Casablanca',
  'Istanbul', 'Tbilisi', 'Athens', 'Rome', 'Milan',
  'Dublin', 'Vienna', 'Warsaw', 'Stockholm', 'Copenhagen',
  'Sydney', 'Melbourne', 'Auckland', 'Toronto', 'Vancouver',
  'Austin', 'Miami', 'New York', 'San Francisco', 'Los Angeles',
];

// ─── City metadata: currency, neighborhoods, coordinate seeds ───────────
interface CityMeta {
  currency: string;
  neighborhoods: string[];
  lat: number;
  lng: number;
  country: string;
}

const CITY_META: Record<string, CityMeta> = {
  'Barcelona':       { currency: 'EUR', neighborhoods: ['Eixample','Gràcia','Poblenou','Barceloneta','Sant Martí','Les Corts','Sarrià'], lat: 41.39, lng: 2.17, country: 'Spain' },
  'Lisbon':          { currency: 'EUR', neighborhoods: ['Alfama','Bairro Alto','Chiado','Santos','Estrela','Príncipe Real'], lat: 38.72, lng: -9.14, country: 'Portugal' },
  'Berlin':          { currency: 'EUR', neighborhoods: ['Kreuzberg','Neukölln','Prenzlauer Berg','Mitte','Friedrichshain','Charlottenburg'], lat: 52.52, lng: 13.41, country: 'Germany' },
  'Mexico City':     { currency: 'MXN', neighborhoods: ['Roma Norte','Condesa','Polanco','Coyoacán','Santa Fe','Del Valle'], lat: 19.43, lng: -99.13, country: 'Mexico' },
  'Bangkok':         { currency: 'THB', neighborhoods: ['Sukhumvit','Silom','Sathorn','Thonglor','Ari','Ekkamai'], lat: 13.76, lng: 100.50, country: 'Thailand' },
  'Medellín':        { currency: 'COP', neighborhoods: ['El Poblado','Laureles','Envigado','Belén','Sabaneta','La Floresta'], lat: 6.24, lng: -75.57, country: 'Colombia' },
  'Dubai':           { currency: 'AED', neighborhoods: ['Downtown','Marina','JBR','JLT','Business Bay','DIFC'], lat: 25.20, lng: 55.27, country: 'UAE' },
  'Singapore':       { currency: 'SGD', neighborhoods: ['Orchard','Tiong Bahru','Tanjong Pagar','Holland Village','Bugis','Lavender'], lat: 1.35, lng: 103.82, country: 'Singapore' },
  'Bali':            { currency: 'IDR', neighborhoods: ['Canggu','Seminyak','Ubud','Sanur','Kuta','Uluwatu'], lat: -8.34, lng: 115.09, country: 'Indonesia' },
  'Chiang Mai':      { currency: 'THB', neighborhoods: ['Nimmanhaemin','Old City','Santitham','Chang Phueak','Hang Dong','Mae Rim'], lat: 18.79, lng: 98.98, country: 'Thailand' },
  'London':          { currency: 'GBP', neighborhoods: ['Shoreditch','Camden','Brixton','Notting Hill','Hackney','Bermondsey'], lat: 51.51, lng: -0.13, country: 'UK' },
  'Paris':           { currency: 'EUR', neighborhoods: ['Le Marais','Montmartre','Bastille','Oberkampf','Saint-Germain','Belleville'], lat: 48.86, lng: 2.35, country: 'France' },
  'Amsterdam':       { currency: 'EUR', neighborhoods: ['Jordaan','De Pijp','Oud-West','Oost','Noord','Centrum'], lat: 52.37, lng: 4.90, country: 'Netherlands' },
  'Prague':          { currency: 'CZK', neighborhoods: ['Vinohrady','Žižkov','Karlín','Smíchov','Letná','Holešovice'], lat: 50.08, lng: 14.44, country: 'Czech Republic' },
  'Budapest':        { currency: 'HUF', neighborhoods: ['District VII','District V','District VI','District IX','Buda Hills','Óbuda'], lat: 47.50, lng: 19.04, country: 'Hungary' },
  'Tokyo':           { currency: 'JPY', neighborhoods: ['Shibuya','Shinjuku','Roppongi','Nakameguro','Shimokitazawa','Daikanyama'], lat: 35.68, lng: 139.69, country: 'Japan' },
  'Seoul':           { currency: 'KRW', neighborhoods: ['Gangnam','Itaewon','Hongdae','Mapo','Jongno','Yongsan'], lat: 37.57, lng: 126.98, country: 'South Korea' },
  'Ho Chi Minh City':{ currency: 'VND', neighborhoods: ['District 1','District 2','District 7','Bình Thạnh','Thảo Điền','Phú Nhuận'], lat: 10.82, lng: 106.63, country: 'Vietnam' },
  'Kuala Lumpur':    { currency: 'MYR', neighborhoods: ['KLCC','Bangsar','Mont Kiara','Bukit Bintang','Damansara','Sri Hartamas'], lat: 3.14, lng: 101.69, country: 'Malaysia' },
  'Manila':          { currency: 'PHP', neighborhoods: ['Makati','BGC','Ortigas','Alabang','Eastwood','Quezon City'], lat: 14.60, lng: 120.98, country: 'Philippines' },
  'Buenos Aires':    { currency: 'ARS', neighborhoods: ['Palermo','Recoleta','San Telmo','Belgrano','Núñez','Villa Crespo'], lat: -34.60, lng: -58.38, country: 'Argentina' },
  'São Paulo':       { currency: 'BRL', neighborhoods: ['Vila Madalena','Pinheiros','Jardins','Itaim Bibi','Moema','Brooklin'], lat: -23.55, lng: -46.63, country: 'Brazil' },
  'Bogotá':          { currency: 'COP', neighborhoods: ['Chapinero','Usaquén','La Candelaria','Zona T','Rosales','Chicó'], lat: 4.71, lng: -74.07, country: 'Colombia' },
  'Lima':            { currency: 'PEN', neighborhoods: ['Miraflores','Barranco','San Isidro','Surco','La Molina','Pueblo Libre'], lat: -12.05, lng: -77.04, country: 'Peru' },
  'Santiago':        { currency: 'CLP', neighborhoods: ['Providencia','Las Condes','Ñuñoa','Vitacura','Bellavista','Lastarria'], lat: -33.45, lng: -70.67, country: 'Chile' },
  'Cape Town':       { currency: 'ZAR', neighborhoods: ['Sea Point','Camps Bay','Woodstock','Gardens','Green Point','Observatory'], lat: -33.93, lng: 18.42, country: 'South Africa' },
  'Nairobi':         { currency: 'KES', neighborhoods: ['Westlands','Kilimani','Karen','Lavington','Kileleshwa','Hurlingham'], lat: -1.29, lng: 36.82, country: 'Kenya' },
  'Lagos':           { currency: 'NGN', neighborhoods: ['Victoria Island','Lekki','Ikoyi','Yaba','Surulere','Ikeja'], lat: 6.52, lng: 3.38, country: 'Nigeria' },
  'Accra':           { currency: 'GHS', neighborhoods: ['Osu','Cantonments','East Legon','Airport Residential','Labone','Ridge'], lat: 5.60, lng: -0.19, country: 'Ghana' },
  'Casablanca':      { currency: 'MAD', neighborhoods: ['Maarif','Gauthier','Bourgogne','Anfa','Racine','Ain Diab'], lat: 33.57, lng: -7.59, country: 'Morocco' },
  'Istanbul':        { currency: 'TRY', neighborhoods: ['Kadıköy','Beşiktaş','Cihangir','Beyoğlu','Nişantaşı','Üsküdar'], lat: 41.01, lng: 28.98, country: 'Turkey' },
  'Tbilisi':         { currency: 'GEL', neighborhoods: ['Vera','Vake','Saburtalo','Old Town','Sololaki','Marjanishvili'], lat: 41.72, lng: 44.79, country: 'Georgia' },
  'Athens':          { currency: 'EUR', neighborhoods: ['Koukaki','Exarchia','Pangrati','Psyrri','Kolonaki','Plaka'], lat: 37.98, lng: 23.73, country: 'Greece' },
  'Rome':            { currency: 'EUR', neighborhoods: ['Trastevere','Monti','Prati','Testaccio','San Lorenzo','Pigneto'], lat: 41.90, lng: 12.50, country: 'Italy' },
  'Milan':           { currency: 'EUR', neighborhoods: ['Navigli','Isola','Brera','Porta Venezia','Città Studi','Tortona'], lat: 45.46, lng: 9.19, country: 'Italy' },
  'Dublin':          { currency: 'EUR', neighborhoods: ['Portobello','Rathmines','Ranelagh','Smithfield','Dún Laoghaire','Phibsborough'], lat: 53.35, lng: -6.26, country: 'Ireland' },
  'Vienna':          { currency: 'EUR', neighborhoods: ['Neubau','Josefstadt','Mariahilf','Leopoldstadt','Wieden','Alsergrund'], lat: 48.21, lng: 16.37, country: 'Austria' },
  'Warsaw':          { currency: 'PLN', neighborhoods: ['Mokotów','Praga','Śródmieście','Wola','Żoliborz','Ochota'], lat: 52.23, lng: 21.01, country: 'Poland' },
  'Stockholm':       { currency: 'SEK', neighborhoods: ['Södermalm','Vasastan','Östermalm','Kungsholmen','Gamla Stan','Norrmalm'], lat: 59.33, lng: 18.07, country: 'Sweden' },
  'Copenhagen':      { currency: 'DKK', neighborhoods: ['Nørrebro','Vesterbro','Østerbro','Frederiksberg','Christianshavn','Amager'], lat: 55.68, lng: 12.57, country: 'Denmark' },
  'Sydney':          { currency: 'AUD', neighborhoods: ['Surry Hills','Bondi','Newtown','Paddington','Manly','Glebe'], lat: -33.87, lng: 151.21, country: 'Australia' },
  'Melbourne':       { currency: 'AUD', neighborhoods: ['Fitzroy','St Kilda','Collingwood','Brunswick','South Yarra','Carlton'], lat: -37.81, lng: 144.96, country: 'Australia' },
  'Auckland':        { currency: 'NZD', neighborhoods: ['Ponsonby','Grey Lynn','Mt Eden','Parnell','Devonport','Kingsland'], lat: -36.85, lng: 174.76, country: 'New Zealand' },
  'Toronto':         { currency: 'CAD', neighborhoods: ['Queen West','Kensington','Liberty Village','Leslieville','Yorkville','Bloor West'], lat: 43.65, lng: -79.38, country: 'Canada' },
  'Vancouver':       { currency: 'CAD', neighborhoods: ['Gastown','Kitsilano','Yaletown','Mount Pleasant','Commercial Drive','West End'], lat: 49.28, lng: -123.12, country: 'Canada' },
  'Austin':          { currency: 'USD', neighborhoods: ['East Austin','South Lamar','Downtown','Hyde Park','Zilker','Mueller'], lat: 30.27, lng: -97.74, country: 'USA' },
  'Miami':           { currency: 'USD', neighborhoods: ['Brickell','Wynwood','Coconut Grove','South Beach','Coral Gables','Design District'], lat: 25.76, lng: -80.19, country: 'USA' },
  'New York':        { currency: 'USD', neighborhoods: ['Williamsburg','East Village','Chelsea','Bushwick','LES','Greenpoint'], lat: 40.71, lng: -74.01, country: 'USA' },
  'San Francisco':   { currency: 'USD', neighborhoods: ['Mission','SoMa','Hayes Valley','Castro','Noe Valley','Marina'], lat: 37.77, lng: -122.42, country: 'USA' },
  'Los Angeles':     { currency: 'USD', neighborhoods: ['Silver Lake','Venice','Echo Park','Santa Monica','Los Feliz','Highland Park'], lat: 34.05, lng: -118.24, country: 'USA' },
};

// ─── Seller name pools per region ───────────────────────────────────────────
const SELLER_NAMES: Record<string, string[]> = {
  default: ['Sarah M.','Alex T.','Maria G.','James L.','Emma W.','Carlos R.','Yuki K.','Priya S.','Oliver H.','Nina P.',
            'David K.','Lisa C.','Mark S.','Julia F.','Tom A.','Anna R.','Chris L.','Rachel G.','Peter W.','Sophie B.'],
};

function getSeller(cityIndex: number, itemIndex: number): SellerProfile {
  const names = SELLER_NAMES.default;
  const idx = (cityIndex * 7 + itemIndex * 3) % names.length;
  const name = names[idx];
  const seed = name.replace(/[^a-zA-Z]/g, '');
  return {
    id: `seller-${cityIndex}-${idx}`,
    name,
    photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}${cityIndex}`,
    rating: 4.5 + (((cityIndex + itemIndex) % 5) * 0.1),
    totalSales: 5 + ((cityIndex + itemIndex * 2) % 45),
    responseTime: ['< 30 min', '< 1 hour', '< 2 hours', '< 4 hours'][(cityIndex + itemIndex) % 4],
    verified: (cityIndex + itemIndex) % 5 !== 0,
    joinDate: new Date(2023, (cityIndex + itemIndex) % 12, 1 + (itemIndex % 28)),
    badges: ['Verified Expat', ...(((cityIndex + itemIndex) % 3 === 0) ? ['Quick Responder'] : []), ...(((cityIndex + itemIndex) % 5 === 0) ? ['Top Rated'] : [])],
  };
}

// ─── 50 Item Templates (what expats actually sell) ──────────────────────────
interface ItemTemplate {
  title: string;
  category: ItemCategory;
  description: string;
  condition: ItemCondition;
  priceEUR: number;
  originalPriceEUR: number;
  tags: string[];
  dimensions?: string;
  weight?: number;
  image: string;
}

const ITEM_TEMPLATES: ItemTemplate[] = [
  // FURNITURE (10)
  { title: 'IKEA Kallax 4x4 Shelf Unit', category: 'furniture', description: 'Excellent condition shelf unit, perfect for books and storage. Easy to disassemble for transport.', condition: 'good', priceEUR: 75, originalPriceEUR: 139, tags: ['furniture','shelf','ikea','storage'], dimensions: '147x147x39cm', weight: 40, image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800' },
  { title: 'Standing Desk - Electric Adjustable', category: 'furniture', description: 'Electric standing desk with memory presets. Promotes healthy posture and productivity. Smooth height adjustment.', condition: 'good', priceEUR: 280, originalPriceEUR: 499, tags: ['desk','standing-desk','office','work'], dimensions: '140x70cm', weight: 35, image: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800' },
  { title: 'King Size Bed Frame with Mattress', category: 'furniture', description: 'Solid wood bed frame with premium memory foam mattress. Only months old. Must sell due to relocation.', condition: 'like-new', priceEUR: 450, originalPriceEUR: 1200, tags: ['bed','furniture','bedroom','mattress'], dimensions: '200x180cm', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800' },
  { title: 'Modern 3-Seater Sofa', category: 'furniture', description: 'Comfortable contemporary sofa, deep cushions, removable covers. Non-smoking home. Moving to smaller apartment.', condition: 'like-new', priceEUR: 380, originalPriceEUR: 899, tags: ['sofa','couch','furniture','living-room'], dimensions: '220x90x85cm', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
  { title: 'Extendable Dining Table - Seats 8', category: 'furniture', description: 'Beautiful wooden dining table, extends from 6 to 8 seats. Scandinavian design. Perfect for entertaining.', condition: 'good', priceEUR: 320, originalPriceEUR: 799, tags: ['table','dining','furniture','wood'], dimensions: '180-240x90cm', weight: 45, image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800' },
  { title: 'IKEA MALM Wardrobe with Mirror', category: 'furniture', description: 'Spacious wardrobe with sliding mirror door. Great storage for any bedroom. Clean, no scratches.', condition: 'good', priceEUR: 120, originalPriceEUR: 279, tags: ['wardrobe','ikea','bedroom','storage'], dimensions: '150x60x200cm', weight: 55, image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800' },
  { title: 'Bookshelf - Solid Oak', category: 'furniture', description: 'Handcrafted oak bookshelf, 5 shelves. Beautiful grain, very sturdy. Fits any living room or study.', condition: 'good', priceEUR: 150, originalPriceEUR: 350, tags: ['bookshelf','furniture','wood','storage'], dimensions: '90x30x180cm', weight: 30, image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800' },
  { title: 'TV Stand / Media Console', category: 'furniture', description: 'Modern TV stand with cable management and storage drawers. Fits TVs up to 65". Minimalist design.', condition: 'like-new', priceEUR: 90, originalPriceEUR: 199, tags: ['tv-stand','furniture','living-room','media'], dimensions: '160x40x50cm', weight: 20, image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800' },
  { title: 'Office Desk with Drawers', category: 'furniture', description: 'Compact office desk with 3 drawers. Perfect for home office. Sturdy construction, minor wear.', condition: 'good', priceEUR: 95, originalPriceEUR: 249, tags: ['desk','office','furniture','work'], dimensions: '120x60x75cm', weight: 25, image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800' },
  { title: 'Bar Stools Set of 4', category: 'furniture', description: 'Set of 4 industrial-style bar stools with footrest. Adjustable height. Great for kitchen island.', condition: 'good', priceEUR: 110, originalPriceEUR: 280, tags: ['stools','furniture','kitchen','bar'], weight: 20, image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800' },

  // ELECTRONICS (8)
  { title: 'Samsung 55" 4K Smart TV', category: 'electronics', description: 'Crystal clear 4K, HDR, built-in streaming apps. Wall mount included. Moving internationally, must sell.', condition: 'like-new', priceEUR: 380, originalPriceEUR: 699, tags: ['tv','samsung','4k','electronics'], dimensions: '123x71cm', weight: 15, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800' },
  { title: 'iPad Pro 11" with Apple Pencil', category: 'electronics', description: 'iPad Pro with Apple Pencil 2nd gen and case. Always used with screen protector. Great for work and creativity.', condition: 'like-new', priceEUR: 720, originalPriceEUR: 1299, tags: ['ipad','apple','tablet','electronics'], weight: 0.5, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800' },
  { title: 'Sony WH-1000XM5 Headphones', category: 'electronics', description: 'Premium noise-cancelling headphones. Industry-leading ANC, 30h battery. Perfect for remote work and travel.', condition: 'like-new', priceEUR: 240, originalPriceEUR: 399, tags: ['headphones','sony','audio','noise-cancelling'], weight: 0.25, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' },
  { title: 'Nintendo Switch OLED Bundle', category: 'electronics', description: 'Switch OLED with 5 games, pro controller, and carrying case. Great condition. Fun for downtime between work.', condition: 'good', priceEUR: 280, originalPriceEUR: 450, tags: ['nintendo','gaming','switch','electronics'], weight: 0.9, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800' },
  { title: 'Sonos One SL Speaker Pair', category: 'electronics', description: 'Two Sonos speakers for stereo sound. WiFi connected, works with all streaming services. Rich, clear audio.', condition: 'like-new', priceEUR: 260, originalPriceEUR: 438, tags: ['speaker','sonos','audio','smart-home'], weight: 3.6, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800' },
  { title: 'Canon EOS R50 Mirrorless Camera', category: 'electronics', description: 'Compact mirrorless camera with 18-45mm lens. 4K video, excellent autofocus. Includes bag and 64GB SD card.', condition: 'like-new', priceEUR: 550, originalPriceEUR: 899, tags: ['camera','canon','photography','electronics'], weight: 0.7, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800' },
  { title: 'Apple AirPods Pro 2nd Gen', category: 'electronics', description: 'AirPods Pro with MagSafe case. Excellent noise cancellation and transparency mode. Under warranty.', condition: 'like-new', priceEUR: 170, originalPriceEUR: 279, tags: ['airpods','apple','earbuds','audio'], weight: 0.06, image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800' },
  { title: 'Kindle Paperwhite + Case', category: 'electronics', description: 'Waterproof Kindle with adjustable warm light. Includes leather case and USB-C cable. Battery lasts weeks.', condition: 'like-new', priceEUR: 85, originalPriceEUR: 149, tags: ['kindle','ebook','reader','amazon'], weight: 0.2, image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800' },

  // KITCHEN (7)
  { title: 'Nespresso Vertuo Plus Coffee Machine', category: 'kitchen', description: 'Barely used Nespresso machine in excellent condition. Comes with capsule holder. Quick sale needed.', condition: 'like-new', priceEUR: 180, originalPriceEUR: 299, tags: ['coffee','kitchen','nespresso','appliances'], dimensions: '30x30x40cm', weight: 4.5, image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800' },
  { title: 'Instant Pot Duo 7-in-1', category: 'kitchen', description: 'Great condition pressure cooker, used only a few times. Includes manual and accessories. Perfect for busy nomads.', condition: 'like-new', priceEUR: 65, originalPriceEUR: 119, tags: ['kitchen','cooking','instant-pot','appliances'], dimensions: '32x32x31cm', weight: 5.5, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800' },
  { title: 'KitchenAid Stand Mixer', category: 'kitchen', description: 'Iconic stand mixer with multiple attachments. Barely used. Includes dough hook, whisk, and paddle.', condition: 'like-new', priceEUR: 220, originalPriceEUR: 499, tags: ['kitchen','mixer','kitchenaid','baking'], weight: 10, image: 'https://images.unsplash.com/photo-1578237493287-8d3994143eae?w=800' },
  { title: 'Complete Kitchen Starter Pack', category: 'kitchen', description: 'Pots, pans, utensils, dishes for 6, cutlery, glasses. Everything you need. Clean and well-maintained.', condition: 'good', priceEUR: 95, originalPriceEUR: 350, tags: ['kitchen','cookware','dishes','bundle','starter-pack'], image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800' },
  { title: 'Vitamix Blender E310', category: 'kitchen', description: 'Professional-grade blender for smoothies, soups, and sauces. Powerful motor, variable speed. Barely used.', condition: 'like-new', priceEUR: 250, originalPriceEUR: 449, tags: ['blender','vitamix','kitchen','smoothie'], weight: 5, image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800' },
  { title: 'Air Fryer - Philips XXL', category: 'kitchen', description: 'Large capacity air fryer, cooks for 4-6 people. Fat removal technology. Includes recipe booklet.', condition: 'good', priceEUR: 110, originalPriceEUR: 249, tags: ['air-fryer','kitchen','philips','cooking'], weight: 7, image: 'https://images.unsplash.com/photo-1648145853920-7b26cf0ebb0c?w=800' },
  { title: 'Microwave + Toaster Bundle', category: 'kitchen', description: 'Reliable Samsung microwave and Smeg toaster. Both work perfectly. Selling as bundle, prefer not to split.', condition: 'good', priceEUR: 60, originalPriceEUR: 180, tags: ['microwave','toaster','kitchen','bundle'], weight: 14, image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800' },

  // WORK EQUIPMENT (6)
  { title: 'Dell UltraSharp 27" 4K Monitor', category: 'work-equipment', description: 'Professional 4K monitor, USB-C connectivity, height adjustable stand. Perfect for remote work.', condition: 'like-new', priceEUR: 420, originalPriceEUR: 699, tags: ['monitor','work','dell','4k','office'], dimensions: '61x36cm', weight: 6.8, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800' },
  { title: 'Herman Miller Aeron Chair - Size B', category: 'work-equipment', description: 'Premium ergonomic office chair, adjustable everything. Perfect working condition. The gold standard of office chairs.', condition: 'good', priceEUR: 580, originalPriceEUR: 1400, tags: ['chair','office','herman-miller','ergonomic'], image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800' },
  { title: 'MacBook Pro 16" M1 Pro', category: 'work-equipment', description: 'Powerful laptop for creative work. 16GB RAM, 512GB SSD. Includes charger and USB-C hub. AppleCare+ active.', condition: 'like-new', priceEUR: 1850, originalPriceEUR: 2799, tags: ['laptop','macbook','apple','computer','work'], weight: 2.1, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
  { title: 'Logitech MX Master 3S Mouse', category: 'work-equipment', description: 'Premium wireless mouse with MagSpeed scroll. USB-C rechargeable. Works on any surface including glass.', condition: 'like-new', priceEUR: 55, originalPriceEUR: 109, tags: ['mouse','logitech','office','work'], weight: 0.14, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800' },
  { title: 'USB-C Docking Station', category: 'work-equipment', description: 'CalDigit TS4 Thunderbolt dock. 18 ports, dual 4K display support. Everything you need in one hub.', condition: 'like-new', priceEUR: 220, originalPriceEUR: 399, tags: ['dock','usb-c','thunderbolt','office'], weight: 0.6, image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=800' },
  { title: 'Webcam + Ring Light Kit', category: 'work-equipment', description: 'Logitech Brio 4K webcam with adjustable ring light and desk mount. Crystal clear video calls.', condition: 'like-new', priceEUR: 120, originalPriceEUR: 249, tags: ['webcam','ring-light','video','work'], weight: 1.2, image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800' },

  // TRANSPORTATION (5)
  { title: 'Canyon E-Bike Urban Commuter', category: 'transportation', description: 'High-quality electric bike, 80km battery range. Integrated lights, rear rack, fenders. Recently serviced.', condition: 'good', priceEUR: 1450, originalPriceEUR: 2800, tags: ['e-bike','bicycle','electric','transportation'], image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800' },
  { title: 'Xiaomi Electric Scooter Pro 2', category: 'transportation', description: 'Popular electric scooter, 45km range, 25km/h top speed. Foldable, easy to store. Great for city commuting.', condition: 'good', priceEUR: 280, originalPriceEUR: 499, tags: ['scooter','electric','xiaomi','transportation'], weight: 14.2, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800' },
  { title: 'Brompton Folding Bike', category: 'transportation', description: 'Iconic British folding bike, 6-speed. Folds in 20 seconds. Perfect for public transport + cycling combo.', condition: 'good', priceEUR: 850, originalPriceEUR: 1650, tags: ['bike','brompton','folding','transportation'], weight: 11, image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800' },
  { title: 'Skateboard - Loaded Boards', category: 'transportation', description: 'Premium longboard for cruising. Bamboo flex deck, Paris trucks, Orangatang wheels. Smooth ride.', condition: 'good', priceEUR: 120, originalPriceEUR: 280, tags: ['skateboard','longboard','transportation','sports'], weight: 3.5, image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800' },
  { title: 'Bike Lock + Lights + Helmet Bundle', category: 'transportation', description: 'Kryptonite U-lock, front/rear LED lights, and MIPS helmet (size M). Essential cycling safety kit.', condition: 'good', priceEUR: 65, originalPriceEUR: 150, tags: ['bike','safety','helmet','lock','lights'], weight: 2, image: 'https://images.unsplash.com/photo-1557803175-2f53559b93b1?w=800' },

  // BEDDING (4)
  { title: 'Complete Bedding Set - Queen', category: 'bedding', description: 'Premium cotton sheets, duvet, 4 pillows, mattress protector. All freshly laundered. Like new condition.', condition: 'like-new', priceEUR: 85, originalPriceEUR: 250, tags: ['bedding','sheets','pillows','bedroom'], image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800' },
  { title: 'Bath Towel Set (8 pieces)', category: 'bedding', description: 'Luxury Egyptian cotton towels: 4 bath, 2 hand, 2 face. Soft, absorbent, barely used. White/grey.', condition: 'like-new', priceEUR: 45, originalPriceEUR: 120, tags: ['towels','bath','bathroom','linen'], image: 'https://images.unsplash.com/photo-1600369671854-7904de20c077?w=800' },
  { title: 'Blackout Curtains - 2 Panels', category: 'bedding', description: 'Heavy-duty blackout curtains, thermal insulated. 100% light blocking. Essential for jet lag recovery.', condition: 'like-new', priceEUR: 35, originalPriceEUR: 89, tags: ['curtains','blackout','bedroom','window'], image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800' },
  { title: 'Memory Foam Mattress Topper', category: 'bedding', description: 'Premium 7cm memory foam topper, queen size. Transforms any bed. Comes with removable washable cover.', condition: 'like-new', priceEUR: 60, originalPriceEUR: 149, tags: ['mattress','topper','bedroom','sleep'], dimensions: '200x150x7cm', weight: 8, image: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800' },

  // SPORTS (5)
  { title: 'Professional Road Bike - Carbon Frame', category: 'sports', description: 'High-end road bike, carbon fiber frame, Shimano 105 groupset. Recently serviced with new tires.', condition: 'good', priceEUR: 890, originalPriceEUR: 2200, tags: ['bike','bicycle','road-bike','carbon','sports'], image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800' },
  { title: 'Yoga Mat + Block Set', category: 'sports', description: 'Premium cork yoga mat with 2 blocks and strap. Non-slip, eco-friendly. Perfect for home or studio practice.', condition: 'like-new', priceEUR: 35, originalPriceEUR: 89, tags: ['yoga','mat','fitness','sports'], weight: 2.5, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800' },
  { title: 'Adjustable Dumbbell Set (2-24kg)', category: 'sports', description: 'Space-saving adjustable dumbbells, replace 15 sets. Quick weight change mechanism. Perfect home gym.', condition: 'good', priceEUR: 220, originalPriceEUR: 449, tags: ['dumbbells','gym','fitness','weights'], weight: 48, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800' },
  { title: 'Surfboard - 7ft Funboard', category: 'sports', description: 'Great all-round board for beginners and intermediates. Includes fins, leash, and board bag.', condition: 'good', priceEUR: 180, originalPriceEUR: 400, tags: ['surfboard','surfing','water-sports','beach'], weight: 5, image: 'https://images.unsplash.com/photo-1502680390548-bdbac40e8296?w=800' },
  { title: 'Peloton-Style Spin Bike', category: 'sports', description: 'Indoor cycling bike with tablet holder, adjustable resistance. Quiet belt drive. Great cardio at home.', condition: 'good', priceEUR: 350, originalPriceEUR: 799, tags: ['spin-bike','cycling','fitness','cardio'], weight: 40, image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800' },

  // CLOTHING (5)
  { title: 'Winter Jacket Collection - Bundle', category: 'clothing', description: 'Bundle of 3 quality winter jackets: down jacket, waterproof shell, wool blend coat. Moving to warm climate.', condition: 'good', priceEUR: 180, originalPriceEUR: 650, tags: ['clothing','jackets','winter','bundle'], image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800' },
  { title: 'Business Suits - Men\'s (2 pcs)', category: 'clothing', description: 'Two tailored suits: navy and charcoal. Wool blend, fits 40R. Dry cleaned and ready. Going fully remote.', condition: 'good', priceEUR: 250, originalPriceEUR: 800, tags: ['suits','clothing','business','formal'], image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800' },
  { title: 'Designer Shoes Collection', category: 'clothing', description: 'Collection of 5 pairs: sneakers, boots, loafers, sandals, running shoes. Sizes EU 42-43. Good condition.', condition: 'good', priceEUR: 200, originalPriceEUR: 600, tags: ['shoes','clothing','footwear','bundle'], image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800' },
  { title: 'North Face Backpack 40L', category: 'clothing', description: 'Travel backpack with laptop sleeve, waterproof cover. Used on 2 trips. Perfect for digital nomad life.', condition: 'good', priceEUR: 75, originalPriceEUR: 160, tags: ['backpack','travel','north-face','bag'], weight: 1.4, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  { title: 'Samsonite Cabin Suitcase', category: 'clothing', description: 'Hard-shell carry-on suitcase with spinner wheels and TSA lock. Fits all airline cabin specs. Like new.', condition: 'like-new', priceEUR: 95, originalPriceEUR: 229, tags: ['suitcase','luggage','travel','samsonite'], weight: 2.8, image: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=800' },
];

// ─── Currency conversion rates from EUR ─────────────────────────────────────
const EUR_RATES: Record<string, number> = {
  EUR: 1, GBP: 0.86, USD: 1.08, CAD: 1.47, AUD: 1.65, NZD: 1.78,
  MXN: 18.5, COP: 4300, BRL: 5.4, ARS: 920, PEN: 4.0, CLP: 1020,
  THB: 38, JPY: 163, KRW: 1430, VND: 26500, MYR: 5.1, PHP: 61,
  SGD: 1.46, IDR: 17000, AED: 3.97, TRY: 34, GEL: 2.95,
  CZK: 25, HUF: 395, PLN: 4.3, SEK: 11.5, DKK: 7.46,
  ZAR: 20.5, KES: 162, NGN: 1650, GHS: 15.5, MAD: 10.8,
};

function convertPrice(eurAmount: number, currency: string): number {
  const rate = EUR_RATES[currency] || 1;
  const converted = eurAmount * rate;
  // Round nicely based on magnitude
  if (converted > 10000) return Math.round(converted / 100) * 100;
  if (converted > 1000) return Math.round(converted / 10) * 10;
  if (converted > 100) return Math.round(converted / 5) * 5;
  return Math.round(converted);
}

// ─── Unsplash images pool ──────────────────────────────────────────────────
const EXTRA_IMAGES = [
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800',
  'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800',
];

// ─── Generate all items ─────────────────────────────────────────────────────
function generateMarketplaceItems(): MarketplaceItem[] {
  const items: MarketplaceItem[] = [];
  let globalId = 1;

  POPULAR_CITIES.forEach((city, cityIdx) => {
    const meta = CITY_META[city];
    if (!meta) return;

    ITEM_TEMPLATES.forEach((template, itemIdx) => {
      const id = `item-${globalId++}`;
      const neighborhoodIdx = (cityIdx + itemIdx) % meta.neighborhoods.length;
      const daysAgo = 1 + ((cityIdx * 3 + itemIdx * 7) % 30);
      const urgencies: ('flexible' | 'moderate' | 'urgent')[] = ['flexible', 'moderate', 'urgent'];
      const urgency = urgencies[(cityIdx + itemIdx) % 3];

      const offers: ItemOffer[] = [];
      if ((cityIdx + itemIdx) % 4 === 0) {
        const offerAmount = convertPrice(template.priceEUR * 0.92, meta.currency);
        offers.push({
          id: `offer-${id}`,
          itemId: id,
          buyerName: SELLER_NAMES.default[(cityIdx + itemIdx + 5) % SELLER_NAMES.default.length],
          buyerPhoto: `https://api.dicebear.com/7.x/avataaars/svg?seed=buyer${globalId}`,
          amount: offerAmount,
          currency: meta.currency,
          message: ['Can pick up today', 'Very interested!', 'Is price negotiable?', 'Available this weekend?'][(cityIdx + itemIdx) % 4],
          createdAt: new Date(Date.now() - ((cityIdx + itemIdx) % 12) * 60 * 60 * 1000),
          status: 'pending',
        });
      }

      const item: MarketplaceItem = {
        id,
        seller: getSeller(cityIdx, itemIdx),
        category: template.category,
        title: template.title,
        description: template.description,
        condition: template.condition,
        price: {
          amount: convertPrice(template.priceEUR, meta.currency),
          currency: meta.currency,
          originalPrice: convertPrice(template.originalPriceEUR, meta.currency),
          priceConfidence: 75 + ((cityIdx + itemIdx) % 20),
        },
        location: {
          city,
          neighborhood: meta.neighborhoods[neighborhoodIdx],
          exactLocation: 'approximate',
          coordinates: {
            lat: meta.lat + ((itemIdx % 10) - 5) * 0.005,
            lng: meta.lng + ((itemIdx % 10) - 5) * 0.005,
          },
        },
        availability: {
          availableFrom: new Date(),
          availableUntil: new Date(Date.now() + (7 + (itemIdx % 20)) * 24 * 60 * 60 * 1000),
          urgency,
        },
        images: [template.image, ...(itemIdx % 3 === 0 ? [EXTRA_IMAGES[itemIdx % EXTRA_IMAGES.length]] : [])],
        dimensions: template.dimensions,
        weight: template.weight,
        tags: [...template.tags, city.toLowerCase().replace(/\s/g, '-')],
        views: 50 + ((cityIdx * 13 + itemIdx * 7) % 900),
        favorites: 5 + ((cityIdx * 3 + itemIdx * 11) % 150),
        offers,
        aiFeatures: {
          pricingSuggestion: convertPrice(template.priceEUR, meta.currency),
          demandScore: 60 + ((cityIdx + itemIdx * 3) % 35),
          descriptionQuality: 75 + ((cityIdx + itemIdx) % 20),
          aiGenerated: itemIdx % 5 === 0,
        },
        createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        status: 'active',
      };

      items.push(item);
    });
  });

  return items;
}

export const DEMO_SELLERS = [
  getSeller(0, 0),
  getSeller(0, 1),
  getSeller(0, 2),
];

export const DEMO_MARKETPLACE_ITEMS: MarketplaceItem[] = generateMarketplaceItems();
