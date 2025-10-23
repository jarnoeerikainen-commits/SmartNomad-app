import { ServiceCategory, ServiceProvider, CityServiceData } from '@/types/localServices';

export const serviceCategories: ServiceCategory[] = [
  // Health & Wellness (Priority 1)
  {
    id: 'h1',
    categoryName: 'Home Medical Services',
    categoryIcon: '🏥',
    priority: 1,
    description: 'Medical professionals coming to your home',
    averageResponseTime: 45,
    providerCount: 0
  },
  {
    id: 'h2',
    categoryName: 'Lab Tests at Home',
    categoryIcon: '🩺',
    priority: 1,
    description: 'Blood tests and medical diagnostics at home',
    averageResponseTime: 60,
    providerCount: 0
  },
  {
    id: 'h3',
    categoryName: 'Therapy & Wellness',
    categoryIcon: '💆',
    priority: 2,
    description: 'Mental and physical wellness services',
    averageResponseTime: 120,
    providerCount: 0
  },
  {
    id: 'h4',
    categoryName: 'Vaccines at Home',
    categoryIcon: '💉',
    priority: 1,
    description: 'Vaccination services at your location',
    averageResponseTime: 90,
    providerCount: 0
  },
  {
    id: 'h5',
    categoryName: 'Physiotherapy at Home',
    categoryIcon: '🤸',
    priority: 2,
    description: 'Professional physiotherapy services',
    averageResponseTime: 120,
    providerCount: 0
  },

  // Home Maintenance (Priority 2)
  {
    id: 'm1',
    categoryName: 'Emergency Home Repair',
    categoryIcon: '🔧',
    priority: 1,
    description: 'Plumbers, electricians, handymen',
    averageResponseTime: 30,
    providerCount: 0
  },
  {
    id: 'm2',
    categoryName: 'Pest Control',
    categoryIcon: '🐛',
    priority: 2,
    description: 'Professional pest elimination',
    averageResponseTime: 48,
    providerCount: 0
  },
  {
    id: 'm3',
    categoryName: 'Home Improvement',
    categoryIcon: '🎨',
    priority: 3,
    description: 'Painting, renovations, repairs',
    averageResponseTime: 72,
    providerCount: 0
  },
  {
    id: 'm4',
    categoryName: 'AC Cleaning Service',
    categoryIcon: '❄️',
    priority: 2,
    description: 'Air conditioning maintenance and cleaning',
    averageResponseTime: 48,
    providerCount: 0
  },
  {
    id: 'm5',
    categoryName: 'Packers and Movers',
    categoryIcon: '📦',
    priority: 3,
    description: 'Professional moving and packing services',
    averageResponseTime: 96,
    providerCount: 0
  },

  // Cleaning Services (Priority 3)
  {
    id: 'c1',
    categoryName: 'Regular Cleaning',
    categoryIcon: '🧹',
    priority: 2,
    description: 'Weekly or monthly house cleaning',
    averageResponseTime: 24,
    providerCount: 0
  },
  {
    id: 'c2',
    categoryName: 'Deep Cleaning',
    categoryIcon: '✨',
    priority: 2,
    description: 'Move-in/move-out and intensive cleaning',
    averageResponseTime: 48,
    providerCount: 0
  },
  {
    id: 'c3',
    categoryName: 'Specialty Cleaning',
    categoryIcon: '🛋️',
    priority: 3,
    description: 'Carpet, furniture, appliance cleaning',
    averageResponseTime: 72,
    providerCount: 0
  },
  {
    id: 'c4',
    categoryName: 'Disinfection Service',
    categoryIcon: '🦠',
    priority: 2,
    description: 'Professional sanitization and disinfection',
    averageResponseTime: 48,
    providerCount: 0
  },

  // Personal Care (Priority 4)
  {
    id: 'p1',
    categoryName: 'Beauty Services',
    categoryIcon: '💅',
    priority: 3,
    description: 'Salon and spa services at home',
    averageResponseTime: 48,
    providerCount: 0
  },
  {
    id: 'p2',
    categoryName: 'Hair Services',
    categoryIcon: '💇',
    priority: 3,
    description: 'Haircuts, styling, treatments',
    averageResponseTime: 24,
    providerCount: 0
  },
  {
    id: 'p3',
    categoryName: 'Lashes and Brows',
    categoryIcon: '👁️',
    priority: 4,
    description: 'Professional lash and brow treatments',
    averageResponseTime: 48,
    providerCount: 0
  },
  {
    id: 'p4',
    categoryName: 'Massage Therapy',
    categoryIcon: '💆‍♀️',
    priority: 3,
    description: 'Professional massage services at home',
    averageResponseTime: 60,
    providerCount: 0
  },

  // Specialty Services (Priority 5)
  {
    id: 's1',
    categoryName: 'Pet Care',
    categoryIcon: '🐾',
    priority: 4,
    description: 'Pet grooming and care services',
    averageResponseTime: 48,
    providerCount: 0
  },
  {
    id: 's2',
    categoryName: 'Child Care',
    categoryIcon: '👶',
    priority: 4,
    description: 'Babysitting and child care',
    averageResponseTime: 72,
    providerCount: 0
  },
  {
    id: 's3',
    categoryName: 'Fitness & Training',
    categoryIcon: '💪',
    priority: 4,
    description: 'Personal trainers and fitness',
    averageResponseTime: 96,
    providerCount: 0
  },
  {
    id: 's4',
    categoryName: 'Car Wash At Home',
    categoryIcon: '🚗',
    priority: 4,
    description: 'Professional car detailing at your location',
    averageResponseTime: 48,
    providerCount: 0
  },
];

// Top 100 cities with service data
export const majorCities: CityServiceData[] = [
  { cityName: 'Tokyo', countryCode: 'JPN', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 245, topRatedProviders: [] },
  { cityName: 'Delhi', countryCode: 'IND', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 189, topRatedProviders: [] },
  { cityName: 'Shanghai', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 'p2'], providerCount: 198, topRatedProviders: [] },
  { cityName: 'São Paulo', countryCode: 'BRA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'p1', 's1'], providerCount: 167, topRatedProviders: [] },
  { cityName: 'Mexico City', countryCode: 'MEX', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 143, topRatedProviders: [] },
  { cityName: 'Cairo', countryCode: 'EGY', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Mumbai', countryCode: 'IND', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 178, topRatedProviders: [] },
  { cityName: 'Beijing', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 187, topRatedProviders: [] },
  { cityName: 'Dhaka', countryCode: 'BGD', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 76, topRatedProviders: [] },
  { cityName: 'Osaka', countryCode: 'JPN', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2'], providerCount: 156, topRatedProviders: [] },
  { cityName: 'New York', countryCode: 'USA', availableCategories: ['h1', 'h2', 'h3', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's2', 's3'], providerCount: 312, topRatedProviders: [] },
  { cityName: 'Karachi', countryCode: 'PAK', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 89, topRatedProviders: [] },
  { cityName: 'Buenos Aires', countryCode: 'ARG', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 134, topRatedProviders: [] },
  { cityName: 'Chongqing', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 112, topRatedProviders: [] },
  { cityName: 'Istanbul', countryCode: 'TUR', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 'p2'], providerCount: 145, topRatedProviders: [] },
  { cityName: 'Kolkata', countryCode: 'IND', availableCategories: ['h1', 'h2', 'm1', 'c1', 'p1'], providerCount: 123, topRatedProviders: [] },
  { cityName: 'Manila', countryCode: 'PHL', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Lagos', countryCode: 'NGA', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 67, topRatedProviders: [] },
  { cityName: 'Rio de Janeiro', countryCode: 'BRA', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 134, topRatedProviders: [] },
  { cityName: 'Tianjin', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Kinshasa', countryCode: 'COD', availableCategories: ['h1', 'm1', 'c1'], providerCount: 34, topRatedProviders: [] },
  { cityName: 'Guangzhou', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 167, topRatedProviders: [] },
  { cityName: 'Los Angeles', countryCode: 'USA', availableCategories: ['h1', 'h2', 'h3', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's2', 's3'], providerCount: 289, topRatedProviders: [] },
  { cityName: 'Moscow', countryCode: 'RUS', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 'p2'], providerCount: 178, topRatedProviders: [] },
  { cityName: 'Shenzhen', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 198, topRatedProviders: [] },
  { cityName: 'Lahore', countryCode: 'PAK', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 87, topRatedProviders: [] },
  { cityName: 'Bangalore', countryCode: 'IND', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1', 's3'], providerCount: 203, topRatedProviders: [] },
  { cityName: 'Paris', countryCode: 'FRA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 245, topRatedProviders: [] },
  { cityName: 'Bogotá', countryCode: 'COL', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 112, topRatedProviders: [] },
  { cityName: 'Jakarta', countryCode: 'IDN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 156, topRatedProviders: [] },
  { cityName: 'Chennai', countryCode: 'IND', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1'], providerCount: 145, topRatedProviders: [] },
  { cityName: 'Lima', countryCode: 'PER', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Bangkok', countryCode: 'THA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 223, topRatedProviders: [] },
  { cityName: 'Seoul', countryCode: 'KOR', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 267, topRatedProviders: [] },
  { cityName: 'Nagoya', countryCode: 'JPN', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1'], providerCount: 134, topRatedProviders: [] },
  { cityName: 'Hyderabad', countryCode: 'IND', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1'], providerCount: 156, topRatedProviders: [] },
  { cityName: 'London', countryCode: 'GBR', availableCategories: ['h1', 'h2', 'h3', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's2', 's3'], providerCount: 298, topRatedProviders: [] },
  { cityName: 'Tehran', countryCode: 'IRN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 123, topRatedProviders: [] },
  { cityName: 'Chicago', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's3'], providerCount: 234, topRatedProviders: [] },
  { cityName: 'Chengdu', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 145, topRatedProviders: [] },
  { cityName: 'Nanjing', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 112, topRatedProviders: [] },
  { cityName: 'Wuhan', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 134, topRatedProviders: [] },
  { cityName: 'Ho Chi Minh City', countryCode: 'VNM', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 112, topRatedProviders: [] },
  { cityName: 'Luanda', countryCode: 'AGO', availableCategories: ['h1', 'm1', 'c1'], providerCount: 45, topRatedProviders: [] },
  { cityName: 'Ahmedabad', countryCode: 'IND', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Kuala Lumpur', countryCode: 'MYS', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 189, topRatedProviders: [] },
  { cityName: 'Xi\'an', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Hong Kong', countryCode: 'HKG', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 245, topRatedProviders: [] },
  { cityName: 'Dongguan', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 87, topRatedProviders: [] },
  { cityName: 'Hangzhou', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 134, topRatedProviders: [] },
  { cityName: 'Foshan', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 76, topRatedProviders: [] },
  { cityName: 'Shenyang', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 89, topRatedProviders: [] },
  { cityName: 'Riyadh', countryCode: 'SAU', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 123, topRatedProviders: [] },
  { cityName: 'Baghdad', countryCode: 'IRQ', availableCategories: ['h1', 'm1', 'c1'], providerCount: 56, topRatedProviders: [] },
  { cityName: 'Santiago', countryCode: 'CHL', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 134, topRatedProviders: [] },
  { cityName: 'Surat', countryCode: 'IND', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 87, topRatedProviders: [] },
  { cityName: 'Madrid', countryCode: 'ESP', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 223, topRatedProviders: [] },
  { cityName: 'Suzhou', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Pune', countryCode: 'IND', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1'], providerCount: 145, topRatedProviders: [] },
  { cityName: 'Harbin', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 76, topRatedProviders: [] },
  { cityName: 'Houston', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1', 's3'], providerCount: 198, topRatedProviders: [] },
  { cityName: 'Dallas', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 189, topRatedProviders: [] },
  { cityName: 'Toronto', countryCode: 'CAN', availableCategories: ['h1', 'h2', 'h3', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's3'], providerCount: 245, topRatedProviders: [] },
  { cityName: 'Dar es Salaam', countryCode: 'TZA', availableCategories: ['h1', 'm1', 'c1'], providerCount: 45, topRatedProviders: [] },
  { cityName: 'Miami', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 178, topRatedProviders: [] },
  { cityName: 'Belo Horizonte', countryCode: 'BRA', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Singapore', countryCode: 'SGP', availableCategories: ['h1', 'h2', 'h3', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's2', 's3'], providerCount: 289, topRatedProviders: [] },
  { cityName: 'Philadelphia', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 167, topRatedProviders: [] },
  { cityName: 'Atlanta', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 156, topRatedProviders: [] },
  { cityName: 'Fukuoka', countryCode: 'JPN', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1'], providerCount: 123, topRatedProviders: [] },
  { cityName: 'Khartoum', countryCode: 'SDN', availableCategories: ['h1', 'm1', 'c1'], providerCount: 34, topRatedProviders: [] },
  { cityName: 'Barcelona', countryCode: 'ESP', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 'p2', 's1'], providerCount: 212, topRatedProviders: [] },
  { cityName: 'Johannesburg', countryCode: 'ZAF', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 134, topRatedProviders: [] },
  { cityName: 'Saint Petersburg', countryCode: 'RUS', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 145, topRatedProviders: [] },
  { cityName: 'Qingdao', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 87, topRatedProviders: [] },
  { cityName: 'Dalian', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 76, topRatedProviders: [] },
  { cityName: 'Washington', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 189, topRatedProviders: [] },
  { cityName: 'Yangon', countryCode: 'MMR', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 56, topRatedProviders: [] },
  { cityName: 'Alexandria', countryCode: 'EGY', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 67, topRatedProviders: [] },
  { cityName: 'Jinan', countryCode: 'CHN', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 76, topRatedProviders: [] },
  { cityName: 'Guadalajara', countryCode: 'MEX', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Ankara', countryCode: 'TUR', availableCategories: ['h1', 'm1', 'c1', 'p1'], providerCount: 89, topRatedProviders: [] },
  { cityName: 'Chittagong', countryCode: 'BGD', availableCategories: ['h1', 'm1', 'c1'], providerCount: 45, topRatedProviders: [] },
  { cityName: 'Melbourne', countryCode: 'AUS', availableCategories: ['h1', 'h2', 'h3', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's3'], providerCount: 234, topRatedProviders: [] },
  { cityName: 'Addis Ababa', countryCode: 'ETH', availableCategories: ['h1', 'm1', 'c1'], providerCount: 45, topRatedProviders: [] },
  { cityName: 'Nairobi', countryCode: 'KEN', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 89, topRatedProviders: [] },
  { cityName: 'Hanoi', countryCode: 'VNM', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 98, topRatedProviders: [] },
  { cityName: 'Sydney', countryCode: 'AUS', availableCategories: ['h1', 'h2', 'h3', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's3'], providerCount: 256, topRatedProviders: [] },
  { cityName: 'Boston', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 178, topRatedProviders: [] },
  { cityName: 'Cape Town', countryCode: 'ZAF', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 145, topRatedProviders: [] },
  { cityName: 'Montreal', countryCode: 'CAN', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 198, topRatedProviders: [] },
  { cityName: 'Jeddah', countryCode: 'SAU', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 112, topRatedProviders: [] },
  { cityName: 'Phoenix', countryCode: 'USA', availableCategories: ['h1', 'h2', 'm1', 'c1', 'c2', 'p1', 's1'], providerCount: 145, topRatedProviders: [] },
  { cityName: 'San Francisco', countryCode: 'USA', availableCategories: ['h1', 'h2', 'h3', 'm1', 'c1', 'c2', 'p1', 'p2', 's1', 's3'], providerCount: 278, topRatedProviders: [] },
  { cityName: 'Monterrey', countryCode: 'MEX', availableCategories: ['h1', 'm1', 'c1', 'c2', 'p1'], providerCount: 87, topRatedProviders: [] },
];

// Sample service providers for demonstration
export const sampleProviders: ServiceProvider[] = [
  {
    id: 'p1',
    businessName: 'Sparkle Home Cleaning',
    serviceCategories: ['c1', 'c2'],
    description: 'Professional home cleaning with eco-friendly products',
    countries: ['THA', 'SGP', 'MYS'],
    cities: ['Bangkok', 'Singapore', 'Kuala Lumpur'],
    address: '123 Service St, Bangkok',
    contactInfo: {
      phone: '+66-123-4567',
      email: 'contact@sparkleclean.com',
      website: 'www.sparkleclean.com'
    },
    verificationStatus: 'verified',
    rating: 4.8,
    reviewCount: 250,
    responseTimeMinutes: 30,
    pricingModel: {
      basePrice: 45,
      currency: 'USD',
      priceUnit: 'per 3 hours'
    },
    languages: ['English', 'Thai'],
    insuranceVerified: true,
    backgroundChecked: true,
    availableNow: true,
    emergencyService: false
  },
  {
    id: 'p2',
    businessName: 'QuickFix Home Services',
    serviceCategories: ['m1', 'm2'],
    description: '24/7 emergency plumbing and electrical services',
    countries: ['USA', 'GBR', 'AUS'],
    cities: ['New York', 'London', 'Sydney'],
    address: '456 Repair Ave, New York',
    contactInfo: {
      phone: '+1-555-0123',
      email: 'help@quickfix.com'
    },
    verificationStatus: 'verified',
    rating: 4.6,
    reviewCount: 180,
    responseTimeMinutes: 45,
    pricingModel: {
      basePrice: 80,
      currency: 'USD',
      priceUnit: 'per hour'
    },
    languages: ['English'],
    insuranceVerified: true,
    backgroundChecked: true,
    availableNow: true,
    emergencyService: true
  },
  {
    id: 'p3',
    businessName: 'Home Health Professionals',
    serviceCategories: ['h1', 'h2', 'h4'],
    description: 'Licensed medical professionals for home visits',
    countries: ['SGP', 'JPN', 'KOR'],
    cities: ['Singapore', 'Tokyo', 'Seoul'],
    address: '789 Medical Plaza, Singapore',
    contactInfo: {
      phone: '+65-9876-5432',
      email: 'care@homehealthpro.com'
    },
    verificationStatus: 'verified',
    rating: 4.9,
    reviewCount: 320,
    responseTimeMinutes: 60,
    pricingModel: {
      basePrice: 120,
      currency: 'USD',
      priceUnit: 'per visit'
    },
    languages: ['English', 'Mandarin', 'Japanese'],
    insuranceVerified: true,
    backgroundChecked: true,
    availableNow: false,
    emergencyService: true
  },
  {
    id: 'p4',
    businessName: 'Pamper Beauty & Spa',
    serviceCategories: ['p1', 'p2', 'p3'],
    description: 'Premium beauty services at your location',
    countries: ['FRA', 'ITA', 'ESP'],
    cities: ['Paris', 'Madrid', 'Barcelona'],
    address: '321 Beauty Blvd, Paris',
    contactInfo: {
      phone: '+33-1-2345-6789',
      email: 'booking@pamperbeauty.com'
    },
    verificationStatus: 'verified',
    rating: 4.7,
    reviewCount: 210,
    responseTimeMinutes: 90,
    pricingModel: {
      basePrice: 65,
      currency: 'EUR',
      priceUnit: 'per service'
    },
    languages: ['French', 'English', 'Spanish'],
    insuranceVerified: false,
    backgroundChecked: true,
    availableNow: true,
    emergencyService: false
  },
  {
    id: 'p5',
    businessName: 'Pet Pals Grooming',
    serviceCategories: ['s1'],
    description: 'Professional pet grooming and care',
    countries: ['USA', 'CAN', 'GBR'],
    cities: ['Toronto', 'New York', 'London'],
    address: '555 Pet Lane, Toronto',
    contactInfo: {
      phone: '+1-416-555-0199',
      email: 'woof@petpals.com'
    },
    verificationStatus: 'verified',
    rating: 4.5,
    reviewCount: 145,
    responseTimeMinutes: 120,
    pricingModel: {
      basePrice: 50,
      currency: 'CAD',
      priceUnit: 'per session'
    },
    languages: ['English', 'French'],
    insuranceVerified: true,
    backgroundChecked: true,
    availableNow: true,
    emergencyService: false
  }
];
