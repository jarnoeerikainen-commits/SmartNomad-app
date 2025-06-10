
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
  private static readonly API_SOURCES = {
    hotels: [
      'booking.com',
      'hotels.com',
      'expedia.com',
      'agoda.com',
      'trivago.com'
    ],
    insurance: [
      'worldnomads.com',
      'safetywing.com',
      'allianz-travel.com',
      'travelguard.com'
    ],
    restaurants: [
      'opentable.com',
      'tripadvisor.com',
      'yelp.com',
      'zomato.com'
    ],
    vip: [
      'viator.com',
      'getyourguide.com',
      'klook.com',
      'privatejet.com'
    ]
  };

  static async searchOffers(params: OfferSearchParams): Promise<Offer[]> {
    const { service, location } = params;
    const city = location.city;
    const country = location.country;
    const locationString = `${city}, ${country}`;

    console.log(`Searching ${service} offers for ${locationString}`);

    try {
      // Simulate API calls to various sources
      const offers = await this.generateOffersForService(service, locationString, location);
      return offers;
    } catch (error) {
      console.error('Error searching offers:', error);
      return this.getFallbackOffers(service, locationString);
    }
  }

  private static async generateOffersForService(
    service: string, 
    locationString: string, 
    location: LocationData
  ): Promise<Offer[]> {
    const sources = this.API_SOURCES[service as keyof typeof this.API_SOURCES] || [];
    const offers: Offer[] = [];

    // Generate realistic offers based on service type and location
    switch (service) {
      case 'hotels':
        offers.push(
          {
            id: '1',
            title: `Luxury Hotel in ${location.city}`,
            description: `5-star accommodation in the heart of ${location.city}`,
            price: '$189/night',
            originalPrice: '$249/night',
            discount: '24% off',
            provider: 'Booking.com',
            url: `https://booking.com/hotel/${location.city.toLowerCase()}`,
            rating: 4.8,
            location: locationString
          },
          {
            id: '2',
            title: `Boutique Hotel ${location.city}`,
            description: `Charming boutique property near city center`,
            price: '$129/night',
            originalPrice: '$169/night',
            discount: '24% off',
            provider: 'Hotels.com',
            url: `https://hotels.com/search/${location.city.toLowerCase()}`,
            rating: 4.5,
            location: locationString
          },
          {
            id: '3',
            title: `Budget Hotel ${location.city}`,
            description: `Clean and comfortable accommodation`,
            price: '$69/night',
            provider: 'Agoda',
            url: `https://agoda.com/${location.city.toLowerCase()}`,
            rating: 4.2,
            location: locationString
          }
        );
        break;

      case 'insurance':
        offers.push(
          {
            id: '1',
            title: `Travel Insurance for ${location.country}`,
            description: `Comprehensive coverage including medical and trip cancellation`,
            price: '$45/week',
            originalPrice: '$59/week',
            discount: '24% off',
            provider: 'World Nomads',
            url: `https://worldnomads.com/travel-insurance/${location.country_code.toLowerCase()}`,
            location: locationString
          },
          {
            id: '2',
            title: `Digital Nomad Insurance`,
            description: `Perfect for remote workers and long-term travelers`,
            price: '$42/month',
            provider: 'SafetyWing',
            url: 'https://safetywing.com/nomad-insurance',
            location: locationString
          },
          {
            id: '3',
            title: `Premium Travel Protection`,
            description: `High-end coverage with 24/7 assistance`,
            price: '$89/trip',
            originalPrice: '$119/trip',
            discount: '25% off',
            provider: 'Allianz Travel',
            url: 'https://allianz-travel.com',
            location: locationString
          }
        );
        break;

      case 'restaurants':
        offers.push(
          {
            id: '1',
            title: `Fine Dining in ${location.city}`,
            description: `Michelin-starred restaurant with local cuisine`,
            price: '$89/person',
            originalPrice: '$120/person',
            discount: '26% off',
            provider: 'OpenTable',
            url: `https://opentable.com/${location.city.toLowerCase()}`,
            rating: 4.9,
            location: locationString
          },
          {
            id: '2',
            title: `Local Food Tour ${location.city}`,
            description: `Guided tour of authentic local restaurants`,
            price: '$65/person',
            provider: 'TripAdvisor',
            url: `https://tripadvisor.com/tours/${location.city.toLowerCase()}`,
            rating: 4.7,
            location: locationString
          },
          {
            id: '3',
            title: `Street Food Experience`,
            description: `Discover the best street food in ${location.city}`,
            price: '$35/person',
            originalPrice: '$45/person',
            discount: '22% off',
            provider: 'Yelp',
            url: `https://yelp.com/${location.city.toLowerCase()}`,
            rating: 4.6,
            location: locationString
          }
        );
        break;

      case 'vip':
        offers.push(
          {
            id: '1',
            title: `Private Helicopter Tour ${location.city}`,
            description: `Exclusive aerial tour of ${location.city} landmarks`,
            price: '$899/person',
            originalPrice: '$1,199/person',
            discount: '25% off',
            provider: 'Viator',
            url: `https://viator.com/helicopter-tours/${location.city.toLowerCase()}`,
            rating: 4.9,
            location: locationString
          },
          {
            id: '2',
            title: `Luxury Yacht Charter`,
            description: `Private yacht rental with crew and catering`,
            price: '$2,499/day',
            originalPrice: '$3,199/day',
            discount: '22% off',
            provider: 'GetYourGuide',
            url: `https://getyourguide.com/yacht-charter/${location.city.toLowerCase()}`,
            rating: 4.8,
            location: locationString
          },
          {
            id: '3',
            title: `Private Jet to Next Destination`,
            description: `Luxury air travel from ${location.city}`,
            price: '$8,999/flight',
            provider: 'PrivateJet.com',
            url: 'https://privatejet.com/instant-quote',
            location: locationString
          }
        );
        break;
    }

    return offers;
  }

  private static getFallbackOffers(service: string, locationString: string): Offer[] {
    return [
      {
        id: 'fallback-1',
        title: `${service} deals in your area`,
        description: `Great ${service} options available in ${locationString}`,
        price: 'Contact for pricing',
        provider: 'Local Provider',
        url: '#',
        location: locationString
      }
    ];
  }
}

export default OffersService;
