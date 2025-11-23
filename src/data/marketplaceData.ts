import { MarketplaceItem, ItemCategory, ItemCondition } from '@/types/marketplace';

export const DEMO_SELLERS = [
  {
    id: 'seller-1',
    name: 'Sarah Mitchell',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 4.9,
    totalSales: 23,
    responseTime: '< 1 hour',
    verified: true,
    joinDate: new Date('2023-01-15'),
    badges: ['Verified Expat', 'Quick Responder', 'Premium Member']
  },
  {
    id: 'seller-2',
    name: 'Alex Thompson',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    rating: 4.7,
    totalSales: 15,
    responseTime: '< 2 hours',
    verified: true,
    joinDate: new Date('2023-06-20'),
    badges: ['Verified Expat', 'Frequent Seller']
  },
  {
    id: 'seller-3',
    name: 'Maria Garcia',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    rating: 5.0,
    totalSales: 8,
    responseTime: '< 30 min',
    verified: true,
    joinDate: new Date('2024-01-10'),
    badges: ['Verified Expat', 'Quick Responder', 'Top Rated']
  }
];

export const DEMO_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'item-1',
    seller: DEMO_SELLERS[0],
    category: 'electronics',
    title: 'Nespresso Vertuo Plus Coffee Machine',
    description: 'Barely used Nespresso machine in excellent condition. Moving back to US next week and need to sell quickly. Comes with 20 capsules. Original price €299, selling for quick sale.',
    condition: 'like-new',
    price: {
      amount: 180,
      currency: 'EUR',
      originalPrice: 299,
      priceConfidence: 92
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Eixample',
      exactLocation: 'approximate',
      coordinates: { lat: 41.3874, lng: 2.1686 }
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      urgency: 'urgent'
    },
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'
    ],
    dimensions: '30cm x 30cm x 40cm',
    weight: 4.5,
    tags: ['coffee', 'kitchen', 'nespresso', 'appliances'],
    views: 156,
    favorites: 23,
    aiFeatures: {
      pricingSuggestion: 180,
      demandScore: 87,
      descriptionQuality: 95,
      similarItems: ['item-5']
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-2',
    seller: DEMO_SELLERS[1],
    category: 'furniture',
    title: 'IKEA Kallax 4x4 Shelf Unit - White',
    description: 'Excellent condition Kallax shelf unit. Perfect for books, storage boxes, or decor. Easy to disassemble for transport. Must pick up from Gràcia neighborhood.',
    condition: 'good',
    price: {
      amount: 75,
      currency: 'EUR',
      originalPrice: 139,
      priceConfidence: 88
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Gràcia',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800'
    ],
    dimensions: '147cm x 147cm x 39cm',
    weight: 40,
    tags: ['furniture', 'storage', 'ikea', 'shelf'],
    views: 203,
    favorites: 31,
    aiFeatures: {
      pricingSuggestion: 75,
      demandScore: 76,
      descriptionQuality: 82
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-3',
    seller: DEMO_SELLERS[2],
    category: 'transportation',
    title: 'Canyon E-Bike - Urban Commuter',
    description: 'AI-assisted description: High-quality Canyon electric bike perfect for city commuting. Battery life: 80km. Features include integrated lights, rear rack, and fenders. Regularly serviced and in excellent working condition.',
    condition: 'good',
    price: {
      amount: 1450,
      currency: 'EUR',
      originalPrice: 2800,
      priceConfidence: 85
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Poblenou',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      urgency: 'flexible'
    },
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
      'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800'
    ],
    tags: ['e-bike', 'bicycle', 'transportation', 'canyon', 'electric'],
    views: 412,
    favorites: 67,
    aiFeatures: {
      pricingSuggestion: 1450,
      demandScore: 91,
      descriptionQuality: 94,
      aiGenerated: true
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-4',
    seller: DEMO_SELLERS[0],
    category: 'work-equipment',
    title: 'Dell UltraSharp 27" 4K Monitor',
    description: 'Professional 4K monitor in pristine condition. Perfect for remote work and design. USB-C connectivity, height adjustable stand. Leaving Barcelona in 2 weeks.',
    condition: 'like-new',
    price: {
      amount: 420,
      currency: 'EUR',
      originalPrice: 699,
      priceConfidence: 90
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Sant Martí',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'
    ],
    dimensions: '61cm x 36cm (with stand)',
    weight: 6.8,
    tags: ['monitor', 'work', 'dell', '4k', 'office'],
    views: 287,
    favorites: 45,
    aiFeatures: {
      pricingSuggestion: 420,
      demandScore: 84,
      descriptionQuality: 88
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-5',
    seller: DEMO_SELLERS[1],
    category: 'kitchen',
    title: 'Instant Pot Duo 7-in-1 Pressure Cooker',
    description: 'Great condition, used only a few times. Moving to a furnished apartment and don\'t need it anymore. Includes manual and accessories. Perfect for busy nomads!',
    condition: 'like-new',
    price: {
      amount: 65,
      currency: 'EUR',
      originalPrice: 119,
      priceConfidence: 86
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Barceloneta',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'
    ],
    dimensions: '32cm x 32cm x 31cm',
    weight: 5.5,
    tags: ['kitchen', 'cooking', 'instant-pot', 'appliances'],
    views: 178,
    favorites: 29,
    aiFeatures: {
      pricingSuggestion: 65,
      demandScore: 79,
      descriptionQuality: 80
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-6',
    seller: DEMO_SELLERS[2],
    category: 'furniture',
    title: 'Standing Desk - Adjustable Height',
    description: 'AI-enhanced listing: Electric standing desk with memory presets. Promotes healthy posture and productivity. Smooth height adjustment, sturdy construction. Dimensions: 140cm x 70cm. Perfect for home office setup.',
    condition: 'good',
    price: {
      amount: 280,
      currency: 'EUR',
      originalPrice: 499,
      priceConfidence: 89
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Les Corts',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      urgency: 'flexible'
    },
    images: [
      'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800'
    ],
    dimensions: '140cm x 70cm',
    weight: 35,
    tags: ['furniture', 'desk', 'standing-desk', 'office', 'work'],
    views: 321,
    favorites: 52,
    aiFeatures: {
      pricingSuggestion: 280,
      demandScore: 88,
      descriptionQuality: 93,
      aiGenerated: true
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'active'
  }
];

export const POPULAR_CITIES = [
  'Barcelona',
  'Lisbon',
  'Berlin',
  'Mexico City',
  'Bangkok',
  'Medellin',
  'Dubai',
  'Singapore',
  'Bali',
  'Chiang Mai'
];
