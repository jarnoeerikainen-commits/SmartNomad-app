
interface Embassy {
  id: string;
  country: string;
  countryCode: string;
  name: string;
  website: string;
  travelAdvisoryUrl: string;
  emergencyContact: string;
  registrationUrl?: string;
  languages: string[];
}

interface TravelAdvisory {
  id: string;
  country: string;
  level: 'green' | 'yellow' | 'orange' | 'red';
  title: string;
  summary: string;
  details: string;
  lastUpdated: string;
  source: string;
}

class EmbassyService {
  private static instance: EmbassyService;
  private embassies: Embassy[] = [
    {
      id: 'us-embassy',
      country: 'United States',
      countryCode: 'US',
      name: 'U.S. Department of State',
      website: 'https://travel.state.gov',
      travelAdvisoryUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html',
      emergencyContact: '+1-888-407-4747',
      registrationUrl: 'https://step.state.gov',
      languages: ['en', 'es']
    },
    {
      id: 'uk-embassy',
      country: 'United Kingdom',
      countryCode: 'GB',
      name: 'UK Foreign, Commonwealth & Development Office',
      website: 'https://www.gov.uk/foreign-travel-advice',
      travelAdvisoryUrl: 'https://www.gov.uk/foreign-travel-advice',
      emergencyContact: '+44-20-7008-5000',
      languages: ['en']
    },
    {
      id: 'ca-embassy',
      country: 'Canada',
      countryCode: 'CA',
      name: 'Global Affairs Canada',
      website: 'https://travel.gc.ca',
      travelAdvisoryUrl: 'https://travel.gc.ca/travelling/advisories',
      emergencyContact: '+1-613-996-8885',
      registrationUrl: 'https://registration.gc.ca',
      languages: ['en', 'fr']
    },
    {
      id: 'au-embassy',
      country: 'Australia',
      countryCode: 'AU',
      name: 'Australian Department of Foreign Affairs',
      website: 'https://smartraveller.gov.au',
      travelAdvisoryUrl: 'https://smartraveller.gov.au/destinations',
      emergencyContact: '+61-2-6261-3305',
      registrationUrl: 'https://smartraveller.gov.au/guide/all-travellers/let-someone-know',
      languages: ['en']
    },
    {
      id: 'de-embassy',
      country: 'Germany',
      countryCode: 'DE',
      name: 'German Federal Foreign Office',
      website: 'https://www.auswaertiges-amt.de/en',
      travelAdvisoryUrl: 'https://www.auswaertiges-amt.de/en/ReiseUndSicherheit/reise-und-sicherheitshinweise',
      emergencyContact: '+49-30-5000-2000',
      registrationUrl: 'https://elefand.diplo.de',
      languages: ['de', 'en']
    },
    {
      id: 'fr-embassy',
      country: 'France',
      countryCode: 'FR',
      name: 'France Diplomatie',
      website: 'https://www.diplomatie.gouv.fr/en',
      travelAdvisoryUrl: 'https://www.diplomatie.gouv.fr/en/foreign-policy/how-to-travel-safely',
      emergencyContact: '+33-1-43-17-53-53',
      registrationUrl: 'https://pastel.diplomatie.gouv.fr/fildariane',
      languages: ['fr', 'en']
    },
    {
      id: 'jp-embassy',
      country: 'Japan',
      countryCode: 'JP',
      name: 'Ministry of Foreign Affairs of Japan',
      website: 'https://www.mofa.go.jp/index.html',
      travelAdvisoryUrl: 'https://www.anzen.mofa.go.jp',
      emergencyContact: '+81-3-3580-3311',
      languages: ['ja', 'en']
    },
    {
      id: 'cn-embassy',
      country: 'China',
      countryCode: 'CN',
      name: 'Ministry of Foreign Affairs of China',
      website: 'https://www.fmprc.gov.cn/eng',
      travelAdvisoryUrl: 'https://www.fmprc.gov.cn/eng/wjb_663304/zwjg_665342',
      emergencyContact: '+86-10-12308',
      languages: ['zh', 'en']
    },
    {
      id: 'in-embassy',
      country: 'India',
      countryCode: 'IN',
      name: 'Ministry of External Affairs India',
      website: 'https://www.mea.gov.in',
      travelAdvisoryUrl: 'https://www.mea.gov.in/travel-advisory.htm',
      emergencyContact: '+91-11-2301-2113',
      languages: ['hi', 'en']
    },
    {
      id: 'br-embassy',
      country: 'Brazil',
      countryCode: 'BR',
      name: 'Ministry of Foreign Affairs Brazil',
      website: 'https://www.gov.br/mre/en',
      travelAdvisoryUrl: 'https://www.gov.br/mre/en/consular-services',
      emergencyContact: '+55-61-2030-8000',
      languages: ['pt', 'en']
    },
    {
      id: 'it-embassy',
      country: 'Italy',
      countryCode: 'IT',
      name: 'Italian Ministry of Foreign Affairs',
      website: 'https://www.esteri.it/en',
      travelAdvisoryUrl: 'https://www.viaggiaresicuri.it',
      emergencyContact: '+39-06-3691-3726',
      registrationUrl: 'https://www.dovesiamonelmondo.it',
      languages: ['it', 'en']
    },
    {
      id: 'es-embassy',
      country: 'Spain',
      countryCode: 'ES',
      name: 'Spanish Ministry of Foreign Affairs',
      website: 'https://www.exteriores.gob.es/en',
      travelAdvisoryUrl: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Recomendaciones-de-viaje.aspx',
      emergencyContact: '+34-91-379-1700',
      registrationUrl: 'https://registroviajeros.exteriores.gob.es',
      languages: ['es', 'en']
    }
  ];

  static getInstance(): EmbassyService {
    if (!EmbassyService.instance) {
      EmbassyService.instance = new EmbassyService();
    }
    return EmbassyService.instance;
  }

  getAvailableEmbassies(): Embassy[] {
    return this.embassies;
  }

  getEmbassyByCountry(countryCode: string): Embassy | undefined {
    return this.embassies.find(embassy => embassy.countryCode === countryCode);
  }

  async getTravelAdvisories(embassyIds: string[], destinationCountries: string[]): Promise<TravelAdvisory[]> {
    try {
      // Mock travel advisories
      const mockAdvisories: TravelAdvisory[] = [
        {
          id: 'advisory-1',
          country: 'Thailand',
          level: 'yellow',
          title: 'Exercise Increased Caution',
          summary: 'Exercise increased caution due to civil unrest and terrorism.',
          details: 'Civil unrest and terrorism are ongoing concerns in parts of Thailand.',
          lastUpdated: new Date().toISOString(),
          source: 'U.S. Department of State'
        },
        {
          id: 'advisory-2',
          country: 'Germany',
          level: 'green',
          title: 'Exercise Normal Precautions',
          summary: 'Exercise normal precautions when traveling to Germany.',
          details: 'Germany maintains good security conditions for travelers.',
          lastUpdated: new Date().toISOString(),
          source: 'U.S. Department of State'
        }
      ];

      return mockAdvisories.filter(advisory => 
        destinationCountries.some(country => 
          advisory.country.toLowerCase().includes(country.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Failed to fetch travel advisories:', error);
      return [];
    }
  }

  async registerWithEmbassy(embassyId: string, phoneNumber: string, travelDetails: any): Promise<boolean> {
    try {
      // Mock registration process
      
      return true;
    } catch (error) {
      console.error('Failed to register with embassy:', error);
      return false;
    }
  }
}

export default EmbassyService;
export type { Embassy, TravelAdvisory };
