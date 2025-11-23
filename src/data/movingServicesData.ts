import { MovingServiceProvider, MovingRequest, MovingQuote } from '@/types/movingServices';

export const movingProviders: MovingServiceProvider[] = [
  {
    id: 'allied',
    name: 'Allied Van Lines',
    type: 'international',
    rating: 4.8,
    reviews: 12543,
    coverage: ['USA', 'Canada', 'UK', 'Germany', 'France', 'Spain', 'Australia', 'Japan', 'Singapore', 'Dubai'],
    specialties: ['Corporate moves', 'High-value goods', 'Full-service packing', 'Container shipping'],
    services: ['Packing', 'Unpacking', 'Insurance', 'Storage', 'Vehicle transport', 'Pet relocation', 'Customs clearance'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.allied.com',
    description: 'Leading international moving company with 130+ years of experience. Specialized in corporate relocations and high-value goods transport.',
    priceRange: { min: 4000, max: 15000, currency: 'USD', unit: 'per-move' },
    certifications: ['ISO 9001', 'FIDI', 'FAIM'],
    insuranceCoverage: true,
    featured: true
  },
  {
    id: 'crown',
    name: 'Crown Relocations',
    type: 'international',
    rating: 4.7,
    reviews: 8932,
    coverage: ['Singapore', 'Hong Kong', 'Bangkok', 'Tokyo', 'Dubai', 'London', 'Sydney'],
    specialties: ['Expat relocations', 'Asia-Pacific expertise', 'Destination services', 'Immigration support'],
    services: ['Packing', 'Unpacking', 'Insurance', 'Storage', 'Home search', 'School search', 'Visa assistance'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.crownrelo.com',
    description: 'Asia-Pacific leader in relocation services with 50+ years helping expats settle globally.',
    priceRange: { min: 5000, max: 18000, currency: 'USD', unit: 'per-move' },
    certifications: ['ISO 9001', 'FIDI', 'FAIM', 'EuRA'],
    insuranceCoverage: true,
    featured: true
  },
  {
    id: 'sirva',
    name: 'SIRVA Worldwide',
    type: 'international',
    rating: 4.6,
    reviews: 15234,
    coverage: ['170+ countries worldwide'],
    specialties: ['Corporate mobility', 'Government contracts', 'Global relocation', 'Supply chain'],
    services: ['Packing', 'Unpacking', 'Insurance', 'Storage', 'Air freight', 'Sea freight', 'Customs'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.sirva.com',
    description: 'World\'s largest corporate relocation company serving Fortune 500 clients and governments.',
    priceRange: { min: 4500, max: 20000, currency: 'USD', unit: 'per-move' },
    certifications: ['ISO 9001', 'FIDI', 'FAIM'],
    insuranceCoverage: true,
    featured: true
  },
  {
    id: 'ags',
    name: 'AGS Four Winds',
    type: 'international',
    rating: 4.5,
    reviews: 6782,
    coverage: ['Europe', 'Africa', 'Middle East', 'Asia', 'Americas'],
    specialties: ['International moving', 'Vehicle shipping', 'Fine art transport', 'Records management'],
    services: ['Packing', 'Unpacking', 'Insurance', 'Storage', 'Vehicle transport', 'Fine art handling'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.agsfourwinds.com',
    description: 'Global moving and logistics company with strong presence in Europe, Africa, and Middle East.',
    priceRange: { min: 3800, max: 14000, currency: 'USD', unit: 'per-move' },
    certifications: ['FIDI', 'FAIM', 'ISO 9001'],
    insuranceCoverage: true,
    featured: false
  },
  {
    id: 'northamerican',
    name: 'North American Van Lines',
    type: 'international',
    rating: 4.7,
    reviews: 11234,
    coverage: ['USA', 'Canada', 'Mexico', 'Europe', 'Asia-Pacific'],
    specialties: ['Household moves', 'Fine art', 'Pianos', 'Antiques'],
    services: ['Packing', 'Unpacking', 'Insurance', 'Storage', 'Specialty handling', 'Customs clearance'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.northamerican.com',
    description: 'Premium household moving services with expertise in delicate and high-value items.',
    priceRange: { min: 4200, max: 16000, currency: 'USD', unit: 'per-move' },
    certifications: ['ISO 9001', 'FIDI'],
    insuranceCoverage: true,
    featured: false
  },
  // Local movers
  {
    id: 'quickmove',
    name: 'QuickMove Local',
    type: 'local',
    rating: 4.6,
    reviews: 3421,
    coverage: ['Barcelona', 'Madrid', 'Lisbon', 'Porto'],
    specialties: ['Same-day moves', 'Apartment moving', 'Furniture assembly', 'Storage solutions'],
    services: ['Loading', 'Transport', 'Unloading', 'Packing', 'Furniture assembly'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.quickmovelocal.com',
    description: 'Fast and reliable local moving services across major European cities.',
    priceRange: { min: 80, max: 150, currency: 'EUR', unit: 'per-hour' },
    certifications: ['Licensed', 'Insured'],
    insuranceCoverage: true,
    featured: true
  },
  {
    id: 'citymovers',
    name: 'City Movers Pro',
    type: 'local',
    rating: 4.8,
    reviews: 5234,
    coverage: ['London', 'Berlin', 'Amsterdam', 'Paris'],
    specialties: ['Urban moving', 'High-rise buildings', 'Last-minute moves', 'Office relocation'],
    services: ['Loading', 'Transport', 'Unloading', 'Packing', 'Storage', 'Disposal'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.citymoverspro.com',
    description: 'Specialized in complex urban moves with experience in high-rise and historic buildings.',
    priceRange: { min: 90, max: 180, currency: 'EUR', unit: 'per-hour' },
    certifications: ['Licensed', 'Insured', 'BAR'],
    insuranceCoverage: true,
    featured: true
  },
  {
    id: 'ecomovers',
    name: 'EcoMove Green',
    type: 'local',
    rating: 4.7,
    reviews: 2156,
    coverage: ['Singapore', 'Bangkok', 'Kuala Lumpur', 'Jakarta'],
    specialties: ['Eco-friendly moving', 'Reusable boxes', 'Carbon-neutral transport', 'Recycling'],
    services: ['Loading', 'Transport', 'Unloading', 'Eco packing', 'Donation coordination'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.ecomovegreen.com',
    description: 'Sustainable moving solutions with carbon-neutral transport and eco-friendly materials.',
    priceRange: { min: 70, max: 140, currency: 'SGD', unit: 'per-hour' },
    certifications: ['Green certified', 'Licensed', 'Insured'],
    insuranceCoverage: true,
    featured: false
  },
  {
    id: 'manandvan',
    name: 'Man & Van Express',
    type: 'local',
    rating: 4.4,
    reviews: 8934,
    coverage: ['Dubai', 'Abu Dhabi', 'Mexico City', 'Medellin'],
    specialties: ['Small moves', 'Furniture delivery', 'Single items', 'Budget-friendly'],
    services: ['Loading', 'Transport', 'Unloading', 'Light assembly'],
    apiIntegration: true,
    autoQuote: true,
    website: 'https://www.manandvanexpress.com',
    description: 'Affordable moving solutions for small apartments, single items, and last-minute needs.',
    priceRange: { min: 50, max: 100, currency: 'USD', unit: 'per-hour' },
    certifications: ['Licensed', 'Insured'],
    insuranceCoverage: true,
    featured: false
  },
  {
    id: 'premiummovers',
    name: 'Premium Relocation Services',
    type: 'both',
    rating: 4.9,
    reviews: 4567,
    coverage: ['New York', 'Los Angeles', 'Miami', 'San Francisco', 'London', 'Paris'],
    specialties: ['White-glove service', 'Luxury goods', 'Concierge moving', 'Full-service'],
    services: ['Full packing', 'Unpacking', 'Insurance', 'Storage', 'Setup', 'Interior design coordination'],
    apiIntegration: true,
    autoQuote: false,
    website: 'https://www.premiumreloservices.com',
    description: 'Luxury moving services with personal move coordinators and white-glove handling.',
    priceRange: { min: 200, max: 500, currency: 'USD', unit: 'per-hour' },
    certifications: ['ISO 9001', 'Licensed', 'Insured', 'Bonded'],
    insuranceCoverage: true,
    featured: true
  }
];

export const demoMovingRequests: MovingRequest[] = [
  {
    id: 'move-1',
    userId: 'user-1',
    type: 'international',
    route: {
      from: { city: 'New York', country: 'USA' },
      to: { city: 'London', country: 'UK' },
      preferredDates: { startDate: '2024-09-15', endDate: '2024-10-01', flexible: true },
      urgency: 'standard'
    },
    inventory: {
      containerSize: '20ft',
      roomBreakdown: [
        { room: 'living', items: ['Sofa', 'TV stand', 'Coffee table', 'Bookshelf'], estimatedBoxes: 12, specialHandling: false },
        { room: 'bedroom', items: ['Queen bed', 'Wardrobe', 'Dresser', 'Nightstands'], estimatedBoxes: 15, specialHandling: false },
        { room: 'kitchen', items: ['Dining table', 'Chairs', 'Kitchenware'], estimatedBoxes: 20, specialHandling: true }
      ],
      specialItems: [{ name: 'Grand Piano', category: 'Musical Instrument', requiresSpecialHandling: true, estimatedValue: 8000 }],
      totalVolume: 35,
      estimatedWeight: 1200,
      totalBoxes: 47
    },
    services: {
      packing: true,
      unpacking: true,
      insurance: true,
      storage: false,
      vehicleTransport: false,
      petRelocation: false,
      furnitureAssembly: true
    },
    budget: { range: '$4,000 - $8,000', currency: 'USD', maxBudget: 8000 },
    status: 'quotes-received',
    createdAt: '2024-08-01',
    quotes: [
      {
        id: 'quote-1',
        providerId: 'allied',
        providerName: 'Allied Van Lines',
        moveRequestId: 'move-1',
        totalCost: 6800,
        currency: 'USD',
        breakdown: { shipping: 4200, packing: 1200, insurance: 800, customs: 600 },
        includedServices: ['Door-to-door service', 'Full packing', 'Insurance up to $10k', 'Customs clearance'],
        excludedServices: ['Storage', 'Pet relocation'],
        estimatedDuration: '4-6 weeks',
        validUntil: '2024-09-01',
        rating: 4.8,
        aiRecommendation: 'best-value',
        createdAt: '2024-08-05'
      },
      {
        id: 'quote-2',
        providerId: 'northamerican',
        providerName: 'North American Van Lines',
        moveRequestId: 'move-1',
        totalCost: 7200,
        currency: 'USD',
        breakdown: { shipping: 4500, packing: 1400, insurance: 800, customs: 500 },
        includedServices: ['Door-to-door service', 'Premium packing', 'Piano specialist', 'Insurance $10k'],
        excludedServices: ['Storage'],
        estimatedDuration: '3-5 weeks',
        validUntil: '2024-09-01',
        rating: 4.7,
        aiRecommendation: 'premium',
        createdAt: '2024-08-05'
      }
    ]
  }
];

export const containerSizeInfo = {
  '20ft': {
    capacity: '1,100 cubic feet',
    rooms: '2-3 bedroom apartment',
    items: 'Furniture + 50-80 boxes',
    transitTime: '4-8 weeks',
    volume: 33
  },
  '40ft': {
    capacity: '2,400 cubic feet',
    rooms: '4-5 bedroom house',
    items: 'Full household + vehicle',
    transitTime: '4-8 weeks',
    volume: 67
  },
  'LCL': {
    capacity: 'Partial container (5-15 CBM)',
    rooms: 'Studio - 1 bedroom',
    items: 'Essential furniture + 20-40 boxes',
    transitTime: '6-10 weeks',
    volume: 10
  },
  'air': {
    capacity: 'Up to 500 kg',
    rooms: 'Immediate needs only',
    items: 'Personal items + essentials',
    transitTime: '2-7 days',
    volume: 2
  }
};
