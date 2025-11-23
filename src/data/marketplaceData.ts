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
    offers: [],
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
    offers: [],
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
    offers: [],
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
    offers: [],
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
    offers: [],
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
    offers: [
      {
        id: 'offer-1',
        itemId: 'item-6',
        buyerName: 'John Smith',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        amount: 250,
        currency: 'EUR',
        message: 'Can pick up this weekend',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 280,
      demandScore: 88,
      descriptionQuality: 93,
      aiGenerated: true
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-7',
    seller: DEMO_SELLERS[0],
    category: 'transportation',
    title: 'Toyota Corolla 2019 - Low Mileage',
    description: 'Reliable sedan, perfect for city and highway driving. 45,000 km, full service history, excellent fuel economy. Relocating to US, must sell. All maintenance records included.',
    condition: 'good',
    price: {
      amount: 12500,
      currency: 'EUR',
      originalPrice: 18000,
      priceConfidence: 88
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Sant Andreu',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ],
    tags: ['car', 'vehicle', 'toyota', 'sedan', 'transportation'],
    views: 892,
    favorites: 134,
    offers: [
      {
        id: 'offer-2',
        itemId: 'item-7',
        buyerName: 'Emma Wilson',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
        amount: 12000,
        currency: 'EUR',
        message: 'Very interested, can pay cash immediately',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: 'offer-3',
        itemId: 'item-7',
        buyerName: 'Carlos Martinez',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        amount: 11800,
        currency: 'EUR',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 12500,
      demandScore: 94,
      descriptionQuality: 91
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-8',
    seller: DEMO_SELLERS[1],
    category: 'transportation',
    title: 'Small Sailboat - 15ft Day Sailer',
    description: 'Perfect weekend sailboat for coastal sailing. Includes trailer, sails in good condition, recently serviced. Great for beginners and experienced sailors. Stored at marina.',
    condition: 'good',
    price: {
      amount: 3200,
      currency: 'EUR',
      originalPrice: 6500,
      priceConfidence: 82
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Port Vell',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      urgency: 'flexible'
    },
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
    ],
    tags: ['boat', 'sailboat', 'water-sports', 'marina', 'sailing'],
    views: 234,
    favorites: 45,
    offers: [],
    aiFeatures: {
      pricingSuggestion: 3200,
      demandScore: 68,
      descriptionQuality: 86
    },
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-9',
    seller: DEMO_SELLERS[2],
    category: 'furniture',
    title: 'King Size Bed Frame with Mattress',
    description: 'Solid wood king bed frame with premium memory foam mattress. Only 8 months old, like new condition. Includes headboard and side tables. Must sell due to relocation.',
    condition: 'like-new',
    price: {
      amount: 450,
      currency: 'EUR',
      originalPrice: 1200,
      priceConfidence: 90
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Eixample',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      urgency: 'urgent'
    },
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'
    ],
    dimensions: '200cm x 180cm',
    tags: ['bed', 'furniture', 'bedroom', 'mattress'],
    views: 445,
    favorites: 67,
    offers: [
      {
        id: 'offer-4',
        itemId: 'item-9',
        buyerName: 'Sophie Anderson',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
        amount: 420,
        currency: 'EUR',
        message: 'Can arrange pickup with van',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 450,
      demandScore: 89,
      descriptionQuality: 88
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-10',
    seller: DEMO_SELLERS[0],
    category: 'furniture',
    title: 'Extendable Dining Table - Seats 8',
    description: 'Beautiful wooden dining table, extends from 6 to 8 seats. Scandinavian design, minor wear on surface but very sturdy. Perfect for family dinners and entertaining.',
    condition: 'good',
    price: {
      amount: 320,
      currency: 'EUR',
      originalPrice: 799,
      priceConfidence: 87
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
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=800'
    ],
    dimensions: '180-240cm x 90cm',
    weight: 45,
    tags: ['table', 'dining', 'furniture', 'wood'],
    views: 298,
    favorites: 52,
    offers: [],
    aiFeatures: {
      pricingSuggestion: 320,
      demandScore: 81,
      descriptionQuality: 85
    },
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-11',
    seller: DEMO_SELLERS[1],
    category: 'furniture',
    title: 'Modern 3-Seater Sofa - Grey Fabric',
    description: 'Comfortable contemporary sofa in excellent condition. Deep cushions, removable covers for washing. Non-smoking home. Moving to smaller apartment.',
    condition: 'like-new',
    price: {
      amount: 380,
      currency: 'EUR',
      originalPrice: 899,
      priceConfidence: 89
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Poblenou',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      urgency: 'flexible'
    },
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'
    ],
    dimensions: '220cm x 90cm x 85cm',
    tags: ['sofa', 'couch', 'furniture', 'living-room'],
    views: 367,
    favorites: 71,
    offers: [
      {
        id: 'offer-5',
        itemId: 'item-11',
        buyerName: 'David Brown',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
        amount: 350,
        currency: 'EUR',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 380,
      demandScore: 86,
      descriptionQuality: 84
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-12',
    seller: DEMO_SELLERS[2],
    category: 'sports',
    title: 'Kids Trampoline 10ft with Safety Net',
    description: 'Large outdoor trampoline with full safety enclosure. Great condition, kids outgrew it. Includes ladder and weather cover. Easy to disassemble for transport.',
    condition: 'good',
    price: {
      amount: 185,
      currency: 'EUR',
      originalPrice: 450,
      priceConfidence: 84
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Sarrià',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1590739225053-e513c1c5d068?w=800'
    ],
    dimensions: '10ft diameter',
    weight: 85,
    tags: ['trampoline', 'kids', 'outdoor', 'sports', 'garden'],
    views: 198,
    favorites: 38,
    offers: [],
    aiFeatures: {
      pricingSuggestion: 185,
      demandScore: 74,
      descriptionQuality: 82
    },
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-13',
    seller: DEMO_SELLERS[0],
    category: 'electronics',
    title: 'Samsung 55" 4K Smart TV',
    description: 'Crystal clear picture quality, HDR support, built-in streaming apps. Wall mount included. Excellent condition, rarely used. Moving internationally.',
    condition: 'like-new',
    price: {
      amount: 380,
      currency: 'EUR',
      originalPrice: 699,
      priceConfidence: 91
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Les Corts',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'
    ],
    dimensions: '123cm x 71cm',
    weight: 15,
    tags: ['tv', 'television', 'electronics', 'samsung', '4k'],
    views: 512,
    favorites: 89,
    offers: [
      {
        id: 'offer-6',
        itemId: 'item-13',
        buyerName: 'Laura Chen',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
        amount: 360,
        currency: 'EUR',
        message: 'Available for pickup today',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: 'offer-7',
        itemId: 'item-13',
        buyerName: 'Mike Johnson',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        amount: 370,
        currency: 'EUR',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 380,
      demandScore: 92,
      descriptionQuality: 87
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-14',
    seller: DEMO_SELLERS[1],
    category: 'work-equipment',
    title: 'Herman Miller Aeron Chair - Size B',
    description: 'Premium ergonomic office chair, adjustable everything. Original packaging and manual included. Perfect working condition. Cost $1,400 new.',
    condition: 'good',
    price: {
      amount: 580,
      currency: 'EUR',
      originalPrice: 1400,
      priceConfidence: 93
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Eixample',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      urgency: 'flexible'
    },
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    tags: ['chair', 'office', 'herman-miller', 'ergonomic', 'work'],
    views: 423,
    favorites: 95,
    offers: [
      {
        id: 'offer-8',
        itemId: 'item-14',
        buyerName: 'Rachel Green',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
        amount: 550,
        currency: 'EUR',
        message: 'Perfect for my home office!',
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 580,
      demandScore: 95,
      descriptionQuality: 90
    },
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-15',
    seller: DEMO_SELLERS[2],
    category: 'kitchen',
    title: 'KitchenAid Stand Mixer - Red',
    description: 'Iconic stand mixer with multiple attachments. Barely used, perfect for baking enthusiasts. Includes dough hook, whisk, and paddle. Moving to smaller place.',
    condition: 'like-new',
    price: {
      amount: 220,
      currency: 'EUR',
      originalPrice: 499,
      priceConfidence: 88
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Gràcia',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1578237493287-8d3994143eae?w=800'
    ],
    weight: 10,
    tags: ['kitchen', 'mixer', 'kitchenaid', 'appliance', 'baking'],
    views: 287,
    favorites: 58,
    offers: [],
    aiFeatures: {
      pricingSuggestion: 220,
      demandScore: 83,
      descriptionQuality: 86
    },
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-16',
    seller: DEMO_SELLERS[0],
    category: 'bedding',
    title: 'Complete Bedding Set - Queen Size',
    description: 'Premium cotton sheets, duvet, 4 pillows, and mattress protector. All freshly laundered. Neutral beige color. Like new, used for guest room only.',
    condition: 'like-new',
    price: {
      amount: 85,
      currency: 'EUR',
      originalPrice: 250,
      priceConfidence: 82
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Sant Martí',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
    ],
    tags: ['bedding', 'sheets', 'pillows', 'bedroom', 'linen'],
    views: 156,
    favorites: 31,
    offers: [],
    aiFeatures: {
      pricingSuggestion: 85,
      demandScore: 76,
      descriptionQuality: 81
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-17',
    seller: DEMO_SELLERS[1],
    category: 'sports',
    title: 'Professional Road Bike - Carbon Frame',
    description: 'High-end road bike, carbon fiber frame, Shimano 105 groupset. Recently serviced, new tires and brake pads. Perfect for serious cyclists. Includes pedals and computer mount.',
    condition: 'good',
    price: {
      amount: 890,
      currency: 'EUR',
      originalPrice: 2200,
      priceConfidence: 87
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Eixample',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      urgency: 'flexible'
    },
    images: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800'
    ],
    tags: ['bike', 'bicycle', 'road-bike', 'carbon', 'sports'],
    views: 534,
    favorites: 102,
    offers: [
      {
        id: 'offer-9',
        itemId: 'item-17',
        buyerName: 'Tom Anderson',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
        amount: 850,
        currency: 'EUR',
        message: 'Interested in test ride',
        createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 890,
      demandScore: 91,
      descriptionQuality: 89
    },
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-18',
    seller: DEMO_SELLERS[2],
    category: 'electronics',
    title: 'iPad Pro 11" 2021 - 256GB WiFi',
    description: 'Space grey iPad Pro with Apple Pencil 2nd gen and Magic Keyboard. Excellent condition, always used with screen protector. Perfect for remote work and creativity.',
    condition: 'like-new',
    price: {
      amount: 720,
      currency: 'EUR',
      originalPrice: 1299,
      priceConfidence: 94
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Poblenou',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      urgency: 'urgent'
    },
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'
    ],
    weight: 0.5,
    tags: ['ipad', 'tablet', 'apple', 'electronics', 'mobile'],
    views: 678,
    favorites: 123,
    offers: [
      {
        id: 'offer-10',
        itemId: 'item-18',
        buyerName: 'Anna Rodriguez',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        amount: 700,
        currency: 'EUR',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'pending'
      },
      {
        id: 'offer-11',
        itemId: 'item-18',
        buyerName: 'Peter Wright',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter',
        amount: 680,
        currency: 'EUR',
        message: 'Can meet today',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 720,
      demandScore: 96,
      descriptionQuality: 92
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-19',
    seller: DEMO_SELLERS[0],
    category: 'clothing',
    title: 'Winter Jacket Collection - Men\'s L',
    description: 'Bundle of 3 high-quality winter jackets: North Face down jacket, Columbia waterproof shell, wool blend coat. All size L, excellent condition. Moving to tropical climate.',
    condition: 'good',
    price: {
      amount: 180,
      currency: 'EUR',
      originalPrice: 650,
      priceConfidence: 79
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Gràcia',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
      urgency: 'flexible'
    },
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
    ],
    tags: ['clothing', 'jackets', 'winter', 'mens', 'bundle'],
    views: 145,
    favorites: 28,
    offers: [],
    aiFeatures: {
      pricingSuggestion: 180,
      demandScore: 71,
      descriptionQuality: 79
    },
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-20',
    seller: DEMO_SELLERS[1],
    category: 'work-equipment',
    title: 'MacBook Pro 16" M1 Pro 2021',
    description: 'Powerful laptop for creative work. 16GB RAM, 512GB SSD. Includes original charger and USB-C hub. AppleCare+ until 2025. Pristine condition, always used with keyboard cover.',
    condition: 'like-new',
    price: {
      amount: 1850,
      currency: 'EUR',
      originalPrice: 2799,
      priceConfidence: 92
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Les Corts',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
      urgency: 'moderate'
    },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'
    ],
    weight: 2.1,
    tags: ['laptop', 'macbook', 'apple', 'computer', 'work'],
    views: 892,
    favorites: 156,
    offers: [
      {
        id: 'offer-12',
        itemId: 'item-20',
        buyerName: 'Julia Santos',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
        amount: 1800,
        currency: 'EUR',
        message: 'Very interested, can we meet tomorrow?',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 1850,
      demandScore: 97,
      descriptionQuality: 93
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'active'
  },
  {
    id: 'item-21',
    seller: DEMO_SELLERS[2],
    category: 'kitchen',
    title: 'Complete Kitchen Starter Pack',
    description: 'Everything you need: pots, pans, utensils, dishes for 6, cutlery, glasses. All from IKEA and Zara Home. Great for someone just moving in. Clean and well-maintained.',
    condition: 'good',
    price: {
      amount: 95,
      currency: 'EUR',
      originalPrice: 350,
      priceConfidence: 81
    },
    location: {
      city: 'Barcelona',
      neighborhood: 'Barceloneta',
      exactLocation: 'approximate'
    },
    availability: {
      availableFrom: new Date(),
      availableUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      urgency: 'urgent'
    },
    images: [
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=800'
    ],
    tags: ['kitchen', 'cookware', 'dishes', 'bundle', 'starter-pack'],
    views: 321,
    favorites: 64,
    offers: [
      {
        id: 'offer-13',
        itemId: 'item-21',
        buyerName: 'Chris Lee',
        buyerPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
        amount: 90,
        currency: 'EUR',
        message: 'Perfect timing, just arrived!',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        status: 'pending'
      }
    ],
    aiFeatures: {
      pricingSuggestion: 95,
      demandScore: 85,
      descriptionQuality: 83
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
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
