
import { LocationData } from '@/types/country';

export interface Offer {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  provider: string;
  url: string;
  rating?: number;
  image?: string;
  location: string;
}

export interface OfferSearchParams {
  service: 'insurance' | 'hotels' | 'restaurants' | 'vip';
  location: LocationData;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export class OffersService {
  private static readonly VALID_SOURCES = {
    hotels: [
      { name: 'Booking.com', baseUrl: 'https://www.booking.com' },
      { name: 'Hotels.com', baseUrl: 'https://www.hotels.com' },
      { name: 'Expedia', baseUrl: 'https://www.expedia.com' },
      { name: 'Agoda', baseUrl: 'https://www.agoda.com' },
      { name: 'Trivago', baseUrl: 'https://www.trivago.com' }
    ],
    insurance: [
      { name: 'World Nomads', baseUrl: 'https://www.worldnomads.com' },
      { name: 'SafetyWing', baseUrl: 'https://safetywing.com' },
      { name: 'Allianz Travel', baseUrl: 'https://www.allianztravelinsurance.com' },
      { name: 'Travel Guard', baseUrl: 'https://www.travelguard.com' }
    ],
    restaurants: [
      { name: 'OpenTable', baseUrl: 'https://www.opentable.com' },
      { name: 'TripAdvisor', baseUrl: 'https://www.tripadvisor.com' },
      { name: 'Yelp', baseUrl: 'https://www.yelp.com' },
      { name: 'Zomato', baseUrl: 'https://www.zomato.com' }
    ],
    vip: [
      { name: 'Viator', baseUrl: 'https://www.viator.com' },
      { name: 'GetYourGuide', baseUrl: 'https://www.getyourguide.com' },
      { name: 'Klook', baseUrl: 'https://www.klook.com' },
      { name: 'PrivateJet.com', baseUrl: 'https://www.privatejet.com' }
    ]
  };

  static async searchOffers(params: OfferSearchParams): Promise<Offer[]> {
    const { service, location } = params;
    const city = location.city;
    const country = location.country;
    const locationString = `${city}, ${country}`;

    console.log(`Searching ${service} offers for ${locationString}`);

    try {
      const offers = await this.generateValidatedOffersForService(service, locationString, location);
      return offers;
    } catch (error) {
      console.error('Error searching offers:', error);
      return [];
    }
  }

  private static async generateValidatedOffersForService(
    service: string, 
    locationString: string, 
    location: LocationData
  ): Promise<Offer[]> {
    const sources = this.VALID_SOURCES[service as keyof typeof this.VALID_SOURCES] || [];
    const offers: Offer[] = [];

    // Generate realistic offers with validated URLs
    switch (service) {
      case 'hotels':
        const hotelOffers = [
          {
            id: '1',
            title: `Premium Hotels in ${location.city}`,
            description: `Top-rated accommodations in ${location.city}`,
            price: '$189/night',
            originalPrice: '$249/night',
            discount: '24% off',
            provider: 'Booking.com',
            url: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(location.city)}&checkin_monthday=&checkin_month=&checkin_year=&checkout_monthday=&checkout_month=&checkout_year=`,
            rating: 4.8,
            location: locationString
          },
          {
            id: '2',
            title: `Boutique Properties ${location.city}`,
            description: `Unique stays and local experiences`,
            price: '$129/night',
            originalPrice: '$169/night',
            discount: '24% off',
            provider: 'Hotels.com',
            url: `https://www.hotels.com/search.do?destination=${encodeURIComponent(location.city + ', ' + location.country)}`,
            rating: 4.5,
            location: locationString
          },
          {
            id: '3',
            title: `Budget Hotels ${location.city}`,
            description: `Affordable and comfortable stays`,
            price: '$69/night',
            provider: 'Agoda',
            url: `https://www.agoda.com/search?city=${encodeURIComponent(location.city)}&country=${encodeURIComponent(location.country)}`,
            rating: 4.2,
            location: locationString
          }
        ];
        offers.push(...hotelOffers);
        break;

      case 'insurance':
        const insuranceOffers = [
          {
            id: '1',
            title: `Travel Insurance for ${location.country}`,
            description: `Comprehensive coverage for your ${location.country} trip`,
            price: '$45/week',
            originalPrice: '$59/week',
            discount: '24% off',
            provider: 'World Nomads',
            url: `https://www.worldnomads.com/travel-insurance/quote?country=${encodeURIComponent(location.country)}`,
            location: locationString
          },
          {
            id: '2',
            title: `Digital Nomad Insurance`,
            description: `Perfect for remote workers traveling to ${location.country}`,
            price: '$42/month',
            provider: 'SafetyWing',
            url: 'https://safetywing.com/nomad-insurance',
            location: locationString
          },
          {
            id: '3',
            title: `Premium Travel Protection`,
            description: `High coverage with worldwide assistance`,
            price: '$89/trip',
            originalPrice: '$119/trip',
            discount: '25% off',
            provider: 'Allianz Travel',
            url: 'https://www.allianztravelinsurance.com/travel-insurance-plans.htm',
            location: locationString
          }
        ];
        offers.push(...insuranceOffers);
        break;

      case 'restaurants':
        const restaurantOffers = [
          {
            id: '1',
            title: `Top Restaurants in ${location.city}`,
            description: `Discover the best dining experiences in ${location.city}`,
            price: '$89/person',
            originalPrice: '$120/person',
            discount: '26% off',
            provider: 'OpenTable',
            url: `https://www.opentable.com/s?covers=2&dateTime=${new Date().toISOString().split('T')[0]}%2019%3A00&metroId=&regionIds=&term=${encodeURIComponent(location.city)}`,
            rating: 4.9,
            location: locationString
          },
          {
            id: '2',
            title: `Food Tours ${location.city}`,
            description: `Guided culinary experiences`,
            price: '$65/person',
            provider: 'TripAdvisor',
            url: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(location.city + ' food tours')}`,
            rating: 4.7,
            location: locationString
          },
          {
            id: '3',
            title: `Local Cuisine ${location.city}`,
            description: `Authentic local restaurants and cafes`,
            price: '$35/person',
            originalPrice: '$45/person',
            discount: '22% off',
            provider: 'Yelp',
            url: `https://www.yelp.com/search?find_desc=restaurants&find_loc=${encodeURIComponent(location.city + ', ' + location.country)}`,
            rating: 4.6,
            location: locationString
          }
        ];
        offers.push(...restaurantOffers);
        break;

      case 'vip':
        const vipOffers = [
          {
            id: '1',
            title: `VIP Tours ${location.city}`,
            description: `Exclusive private tours and experiences`,
            price: '$899/person',
            originalPrice: '$1,199/person',
            discount: '25% off',
            provider: 'Viator',
            url: `https://www.viator.com/search/s?text=${encodeURIComponent(location.city + ' private tours')}`,
            rating: 4.9,
            location: locationString
          },
          {
            id: '2',
            title: `Luxury Experiences ${location.city}`,
            description: `Premium activities and exclusive access`,
            price: '$2,499/day',
            originalPrice: '$3,199/day',
            discount: '22% off',
            provider: 'GetYourGuide',
            url: `https://www.getyourguide.com/s/?q=${encodeURIComponent(location.city + ' luxury')}`,
            rating: 4.8,
            location: locationString
          },
          {
            id: '3',
            title: `Private Transportation`,
            description: `Luxury transfers and private vehicles`,
            price: '$299/day',
            provider: 'Klook',
            url: `https://www.klook.com/search/?query=${encodeURIComponent(location.city + ' private transfer')}`,
            location: locationString
          }
        ];
        offers.push(...vipOffers);
        break;
    }

    // Validate all offers before returning
    const validatedOffers = await this.validateOffers(offers);
    return validatedOffers;
  }

  private static async validateOffers(offers: Offer[]): Promise<Offer[]> {
    const validOffers: Offer[] = [];

    for (const offer of offers) {
      if (await this.isValidOffer(offer)) {
        validOffers.push(offer);
      } else {
        console.log(`Skipping invalid offer: ${offer.title} - ${offer.url}`);
      }
    }

    return validOffers;
  }

  private static async isValidOffer(offer: Offer): Promise<boolean> {
    try {
      // Check if URL is well-formed
      const url = new URL(offer.url);
      
      // Check if it's a known valid domain
      const validDomains = [
        'booking.com', 'hotels.com', 'expedia.com', 'agoda.com', 'trivago.com',
        'worldnomads.com', 'safetywing.com', 'allianztravelinsurance.com', 'travelguard.com',
        'opentable.com', 'tripadvisor.com', 'yelp.com', 'zomato.com',
        'viator.com', 'getyourguide.com', 'klook.com', 'privatejet.com'
      ];

      const isValidDomain = validDomains.some(domain => 
        url.hostname.includes(domain) || url.hostname.endsWith(domain)
      );

      if (!isValidDomain) {
        return false;
      }

      // Basic validation passed
      return true;
    } catch (error) {
      console.error(`Invalid URL for offer ${offer.title}:`, error);
      return false;
    }
  }
}

export default OffersService;
