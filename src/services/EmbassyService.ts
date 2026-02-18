
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
  region: string;
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
    // North America
    { id: 'us', country: 'United States', countryCode: 'US', name: 'U.S. Department of State', website: 'https://travel.state.gov', travelAdvisoryUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html', emergencyContact: '+1-888-407-4747', registrationUrl: 'https://step.state.gov', languages: ['en', 'es'], region: 'North America' },
    { id: 'ca', country: 'Canada', countryCode: 'CA', name: 'Global Affairs Canada', website: 'https://travel.gc.ca', travelAdvisoryUrl: 'https://travel.gc.ca/travelling/advisories', emergencyContact: '+1-613-996-8885', registrationUrl: 'https://registration.gc.ca', languages: ['en', 'fr'], region: 'North America' },
    { id: 'mx', country: 'Mexico', countryCode: 'MX', name: 'Secretaría de Relaciones Exteriores', website: 'https://www.gob.mx/sre', travelAdvisoryUrl: 'https://www.gob.mx/sre/acciones-y-programas/alertas-de-viaje', emergencyContact: '+52-55-3686-5100', languages: ['es', 'en'], region: 'North America' },

    // Europe
    { id: 'gb', country: 'United Kingdom', countryCode: 'GB', name: 'UK FCDO', website: 'https://www.gov.uk/foreign-travel-advice', travelAdvisoryUrl: 'https://www.gov.uk/foreign-travel-advice', emergencyContact: '+44-20-7008-5000', languages: ['en'], region: 'Europe' },
    { id: 'de', country: 'Germany', countryCode: 'DE', name: 'Federal Foreign Office', website: 'https://www.auswaertiges-amt.de/en', travelAdvisoryUrl: 'https://www.auswaertiges-amt.de/en/ReiseUndSicherheit', emergencyContact: '+49-30-5000-2000', registrationUrl: 'https://elefand.diplo.de', languages: ['de', 'en'], region: 'Europe' },
    { id: 'fr', country: 'France', countryCode: 'FR', name: 'France Diplomatie', website: 'https://www.diplomatie.gouv.fr/en', travelAdvisoryUrl: 'https://www.diplomatie.gouv.fr/en/foreign-policy/how-to-travel-safely', emergencyContact: '+33-1-43-17-53-53', registrationUrl: 'https://pastel.diplomatie.gouv.fr/fildariane', languages: ['fr', 'en'], region: 'Europe' },
    { id: 'it', country: 'Italy', countryCode: 'IT', name: 'Farnesina', website: 'https://www.esteri.it/en', travelAdvisoryUrl: 'https://www.viaggiaresicuri.it', emergencyContact: '+39-06-3691-3726', registrationUrl: 'https://www.dovesiamonelmondo.it', languages: ['it', 'en'], region: 'Europe' },
    { id: 'es', country: 'Spain', countryCode: 'ES', name: 'Ministerio de Asuntos Exteriores', website: 'https://www.exteriores.gob.es/en', travelAdvisoryUrl: 'https://www.exteriores.gob.es/en/ServiciosAlCiudadano/Paginas/Recomendaciones-de-viaje.aspx', emergencyContact: '+34-91-379-1700', registrationUrl: 'https://registroviajeros.exteriores.gob.es', languages: ['es', 'en'], region: 'Europe' },
    { id: 'nl', country: 'Netherlands', countryCode: 'NL', name: 'Ministry of Foreign Affairs', website: 'https://www.government.nl/ministries/bz', travelAdvisoryUrl: 'https://www.nederlandwereldwijd.nl/reizen/reisadviezen', emergencyContact: '+31-247-247-247', languages: ['nl', 'en'], region: 'Europe' },
    { id: 'ch', country: 'Switzerland', countryCode: 'CH', name: 'FDFA', website: 'https://www.eda.admin.ch/eda/en', travelAdvisoryUrl: 'https://www.eda.admin.ch/eda/en/fdfa/representations-and-travel-advice.html', emergencyContact: '+41-800-247-365', languages: ['de', 'fr', 'it', 'en'], region: 'Europe' },
    { id: 'at', country: 'Austria', countryCode: 'AT', name: 'BMEIA', website: 'https://www.bmeia.gv.at/en', travelAdvisoryUrl: 'https://www.bmeia.gv.at/en/travel-stay/travel-advice', emergencyContact: '+43-1-90115-4411', languages: ['de', 'en'], region: 'Europe' },
    { id: 'be', country: 'Belgium', countryCode: 'BE', name: 'FPS Foreign Affairs', website: 'https://diplomatie.belgium.be/en', travelAdvisoryUrl: 'https://diplomatie.belgium.be/en/travel-advice', emergencyContact: '+32-2-501-8111', languages: ['fr', 'nl', 'en'], region: 'Europe' },
    { id: 'pt', country: 'Portugal', countryCode: 'PT', name: 'MNE', website: 'https://www.portaldascomunidades.mne.gov.pt', travelAdvisoryUrl: 'https://www.portaldascomunidades.mne.gov.pt/pt/conselhos-aos-viajantes', emergencyContact: '+351-21-394-6000', languages: ['pt', 'en'], region: 'Europe' },
    { id: 'se', country: 'Sweden', countryCode: 'SE', name: 'MFA Sweden', website: 'https://www.government.se/government-of-sweden/ministry-for-foreign-affairs', travelAdvisoryUrl: 'https://www.swedenabroad.se', emergencyContact: '+46-8-405-5005', languages: ['sv', 'en'], region: 'Europe' },
    { id: 'no', country: 'Norway', countryCode: 'NO', name: 'MFA Norway', website: 'https://www.regjeringen.no/en/dep/ud', travelAdvisoryUrl: 'https://www.regjeringen.no/en/topics/foreign-affairs/travel-advice', emergencyContact: '+47-23-95-00-00', languages: ['no', 'en'], region: 'Europe' },
    { id: 'dk', country: 'Denmark', countryCode: 'DK', name: 'MFA Denmark', website: 'https://um.dk/en', travelAdvisoryUrl: 'https://um.dk/en/travel-and-residence/travel-advice', emergencyContact: '+45-33-92-00-00', languages: ['da', 'en'], region: 'Europe' },
    { id: 'fi', country: 'Finland', countryCode: 'FI', name: 'MFA Finland', website: 'https://um.fi/en', travelAdvisoryUrl: 'https://um.fi/en/travel-advisories', emergencyContact: '+358-9-1605-5555', languages: ['fi', 'sv', 'en'], region: 'Europe' },
    { id: 'ie', country: 'Ireland', countryCode: 'IE', name: 'DFA Ireland', website: 'https://www.dfa.ie', travelAdvisoryUrl: 'https://www.dfa.ie/travel/travel-advice', emergencyContact: '+353-1-408-2000', languages: ['en', 'ga'], region: 'Europe' },
    { id: 'pl', country: 'Poland', countryCode: 'PL', name: 'MSZ Poland', website: 'https://www.gov.pl/web/diplomacy', travelAdvisoryUrl: 'https://www.gov.pl/web/diplomacy/travel-advice', emergencyContact: '+48-22-523-9000', languages: ['pl', 'en'], region: 'Europe' },
    { id: 'cz', country: 'Czech Republic', countryCode: 'CZ', name: 'MZV Czech Republic', website: 'https://www.mzv.cz/jnp/en', travelAdvisoryUrl: 'https://www.mzv.cz/jnp/en/travel_advice', emergencyContact: '+420-224-183-100', languages: ['cs', 'en'], region: 'Europe' },
    { id: 'gr', country: 'Greece', countryCode: 'GR', name: 'MFA Greece', website: 'https://www.mfa.gr/en', travelAdvisoryUrl: 'https://www.mfa.gr/en/travel-advice.html', emergencyContact: '+30-210-368-2000', languages: ['el', 'en'], region: 'Europe' },

    // Asia Pacific
    { id: 'jp', country: 'Japan', countryCode: 'JP', name: 'MOFA Japan', website: 'https://www.mofa.go.jp/index.html', travelAdvisoryUrl: 'https://www.anzen.mofa.go.jp', emergencyContact: '+81-3-3580-3311', languages: ['ja', 'en'], region: 'Asia Pacific' },
    { id: 'au', country: 'Australia', countryCode: 'AU', name: 'DFAT Smartraveller', website: 'https://smartraveller.gov.au', travelAdvisoryUrl: 'https://smartraveller.gov.au/destinations', emergencyContact: '+61-2-6261-3305', registrationUrl: 'https://smartraveller.gov.au/guide/all-travellers/let-someone-know', languages: ['en'], region: 'Asia Pacific' },
    { id: 'nz', country: 'New Zealand', countryCode: 'NZ', name: 'SafeTravel NZ', website: 'https://safetravel.govt.nz', travelAdvisoryUrl: 'https://safetravel.govt.nz/destinations', emergencyContact: '+64-4-439-8000', languages: ['en'], region: 'Asia Pacific' },
    { id: 'kr', country: 'South Korea', countryCode: 'KR', name: 'MOFA Korea', website: 'https://www.mofa.go.kr/eng', travelAdvisoryUrl: 'https://www.0404.go.kr/dev/main.mofa', emergencyContact: '+82-2-2100-2114', languages: ['ko', 'en'], region: 'Asia Pacific' },
    { id: 'cn', country: 'China', countryCode: 'CN', name: 'MFA China', website: 'https://www.fmprc.gov.cn/eng', travelAdvisoryUrl: 'https://www.fmprc.gov.cn/eng/wjb_663304/zwjg_665342', emergencyContact: '+86-10-12308', languages: ['zh', 'en'], region: 'Asia Pacific' },
    { id: 'in', country: 'India', countryCode: 'IN', name: 'MEA India', website: 'https://www.mea.gov.in', travelAdvisoryUrl: 'https://www.mea.gov.in/travel-advisory.htm', emergencyContact: '+91-11-2301-2113', languages: ['hi', 'en'], region: 'Asia Pacific' },
    { id: 'sg', country: 'Singapore', countryCode: 'SG', name: 'MFA Singapore', website: 'https://www.mfa.gov.sg', travelAdvisoryUrl: 'https://www.mfa.gov.sg/Services/Singaporeans-Overseas/Travel-Page', emergencyContact: '+65-6379-8000', languages: ['en', 'zh', 'ms'], region: 'Asia Pacific' },
    { id: 'th', country: 'Thailand', countryCode: 'TH', name: 'MFA Thailand', website: 'https://www.mfa.go.th/en', travelAdvisoryUrl: 'https://www.mfa.go.th/en/content/travel-advisory', emergencyContact: '+66-2-203-5000', languages: ['th', 'en'], region: 'Asia Pacific' },
    { id: 'my', country: 'Malaysia', countryCode: 'MY', name: 'Wisma Putra', website: 'https://www.kln.gov.my', travelAdvisoryUrl: 'https://www.kln.gov.my/web/guest/travel-advisory', emergencyContact: '+60-3-8887-4570', languages: ['ms', 'en'], region: 'Asia Pacific' },
    { id: 'ph', country: 'Philippines', countryCode: 'PH', name: 'DFA Philippines', website: 'https://dfa.gov.ph', travelAdvisoryUrl: 'https://dfa.gov.ph/travel-advisories', emergencyContact: '+63-2-8834-4000', languages: ['tl', 'en'], region: 'Asia Pacific' },
    { id: 'id', country: 'Indonesia', countryCode: 'ID', name: 'Kemlu Indonesia', website: 'https://kemlu.go.id/portal/en', travelAdvisoryUrl: 'https://kemlu.go.id/portal/en/page/travel-advisory', emergencyContact: '+62-21-3441-508', languages: ['id', 'en'], region: 'Asia Pacific' },
    { id: 'tw', country: 'Taiwan', countryCode: 'TW', name: 'BOCA Taiwan', website: 'https://www.boca.gov.tw/mp-2.html', travelAdvisoryUrl: 'https://www.boca.gov.tw/mp-2.html', emergencyContact: '+886-800-085-095', languages: ['zh', 'en'], region: 'Asia Pacific' },

    // Middle East
    { id: 'ae', country: 'United Arab Emirates', countryCode: 'AE', name: 'MOFAIC UAE', website: 'https://www.mofaic.gov.ae/en', travelAdvisoryUrl: 'https://www.mofaic.gov.ae/en/Travel-Advisory', emergencyContact: '+971-2-449-2999', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'sa', country: 'Saudi Arabia', countryCode: 'SA', name: 'MOFA Saudi Arabia', website: 'https://www.mofa.gov.sa/en', travelAdvisoryUrl: 'https://www.mofa.gov.sa/en/eServices', emergencyContact: '+966-11-406-7777', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'qa', country: 'Qatar', countryCode: 'QA', name: 'MOFA Qatar', website: 'https://mofa.gov.qa/en', travelAdvisoryUrl: 'https://mofa.gov.qa/en/travel-advice', emergencyContact: '+974-4404-4444', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'il', country: 'Israel', countryCode: 'IL', name: 'MFA Israel', website: 'https://www.gov.il/en/departments/ministry_of_foreign_affairs', travelAdvisoryUrl: 'https://www.gov.il/en/departments/ministry_of_foreign_affairs', emergencyContact: '+972-2-530-3111', languages: ['he', 'en'], region: 'Middle East' },
    { id: 'tr', country: 'Turkey', countryCode: 'TR', name: 'MFA Turkey', website: 'https://www.mfa.gov.tr/default.en.mfa', travelAdvisoryUrl: 'https://www.mfa.gov.tr/travel-advice.en.mfa', emergencyContact: '+90-312-292-1000', languages: ['tr', 'en'], region: 'Middle East' },

    // Africa
    { id: 'za', country: 'South Africa', countryCode: 'ZA', name: 'DIRCO', website: 'https://www.dirco.gov.za', travelAdvisoryUrl: 'https://www.dirco.gov.za/travel-advisory', emergencyContact: '+27-12-351-1000', languages: ['en', 'af'], region: 'Africa' },
    { id: 'eg', country: 'Egypt', countryCode: 'EG', name: 'MFA Egypt', website: 'https://www.mfa.gov.eg', travelAdvisoryUrl: 'https://www.mfa.gov.eg/English/Pages/default.aspx', emergencyContact: '+20-2-2574-3939', languages: ['ar', 'en'], region: 'Africa' },
    { id: 'ke', country: 'Kenya', countryCode: 'KE', name: 'MFA Kenya', website: 'https://www.mfa.go.ke', travelAdvisoryUrl: 'https://www.mfa.go.ke/travel-advice', emergencyContact: '+254-20-271-8888', languages: ['sw', 'en'], region: 'Africa' },
    { id: 'ng', country: 'Nigeria', countryCode: 'NG', name: 'MFA Nigeria', website: 'https://www.foreignaffairs.gov.ng', travelAdvisoryUrl: 'https://www.foreignaffairs.gov.ng/travel-advisory', emergencyContact: '+234-9-523-6700', languages: ['en'], region: 'Africa' },
    { id: 'ma', country: 'Morocco', countryCode: 'MA', name: 'MAEC Morocco', website: 'https://www.diplomatie.ma', travelAdvisoryUrl: 'https://www.diplomatie.ma/en', emergencyContact: '+212-537-76-1000', languages: ['ar', 'fr', 'en'], region: 'Africa' },

    // South America
    { id: 'br', country: 'Brazil', countryCode: 'BR', name: 'Itamaraty', website: 'https://www.gov.br/mre/en', travelAdvisoryUrl: 'https://www.gov.br/mre/en/consular-services', emergencyContact: '+55-61-2030-8000', languages: ['pt', 'en'], region: 'South America' },
    { id: 'ar', country: 'Argentina', countryCode: 'AR', name: 'Cancillería Argentina', website: 'https://www.cancilleria.gob.ar/en', travelAdvisoryUrl: 'https://www.cancilleria.gob.ar/en/travel-advice', emergencyContact: '+54-11-4819-7000', languages: ['es', 'en'], region: 'South America' },
    { id: 'cl', country: 'Chile', countryCode: 'CL', name: 'MINREL Chile', website: 'https://www.minrel.gob.cl', travelAdvisoryUrl: 'https://www.minrel.gob.cl/travel-advice', emergencyContact: '+56-2-2827-4100', languages: ['es', 'en'], region: 'South America' },
    { id: 'co', country: 'Colombia', countryCode: 'CO', name: 'Cancillería Colombia', website: 'https://www.cancilleria.gov.co', travelAdvisoryUrl: 'https://www.cancilleria.gov.co/en/travel-advice', emergencyContact: '+57-1-381-4000', languages: ['es', 'en'], region: 'South America' },
    { id: 'pe', country: 'Peru', countryCode: 'PE', name: 'MRE Peru', website: 'https://www.gob.pe/rree', travelAdvisoryUrl: 'https://www.gob.pe/rree/travel-advice', emergencyContact: '+51-1-204-2400', languages: ['es', 'en'], region: 'South America' },
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

  getRegions(): string[] {
    return [...new Set(this.embassies.map(e => e.region))];
  }

  getEmbassiesByRegion(region: string): Embassy[] {
    return this.embassies.filter(e => e.region === region);
  }

  async getTravelAdvisories(embassyIds: string[], destinationCountries: string[]): Promise<TravelAdvisory[]> {
    try {
      const mockAdvisories: TravelAdvisory[] = [
        { id: 'advisory-1', country: 'Thailand', level: 'yellow', title: 'Exercise Increased Caution', summary: 'Exercise increased caution due to civil unrest and terrorism.', details: 'Civil unrest and terrorism are ongoing concerns.', lastUpdated: new Date().toISOString(), source: 'U.S. Department of State' },
        { id: 'advisory-2', country: 'Germany', level: 'green', title: 'Exercise Normal Precautions', summary: 'Exercise normal precautions when traveling.', details: 'Good security conditions for travelers.', lastUpdated: new Date().toISOString(), source: 'U.S. Department of State' }
      ];
      return mockAdvisories.filter(advisory => destinationCountries.some(country => advisory.country.toLowerCase().includes(country.toLowerCase())));
    } catch (error) {
      console.error('Failed to fetch travel advisories:', error);
      return [];
    }
  }

  async registerWithEmbassy(embassyId: string, phoneNumber: string, travelDetails: any): Promise<boolean> {
    try { return true; } catch (error) { console.error('Failed to register:', error); return false; }
  }
}

export default EmbassyService;
export type { Embassy, TravelAdvisory };
