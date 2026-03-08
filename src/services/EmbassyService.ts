
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
    // ═══════════════════════ NORTH AMERICA ═══════════════════════
    { id: 'us', country: 'United States', countryCode: 'US', name: 'U.S. Department of State', website: 'https://travel.state.gov', travelAdvisoryUrl: 'https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories.html', emergencyContact: '+1-888-407-4747', registrationUrl: 'https://step.state.gov', languages: ['en', 'es'], region: 'North America' },
    { id: 'ca', country: 'Canada', countryCode: 'CA', name: 'Global Affairs Canada', website: 'https://travel.gc.ca', travelAdvisoryUrl: 'https://travel.gc.ca/travelling/advisories', emergencyContact: '+1-613-996-8885', registrationUrl: 'https://registration.gc.ca', languages: ['en', 'fr'], region: 'North America' },
    { id: 'mx', country: 'Mexico', countryCode: 'MX', name: 'Secretaría de Relaciones Exteriores', website: 'https://www.gob.mx/sre', travelAdvisoryUrl: 'https://www.gob.mx/sre/acciones-y-programas/alertas-de-viaje', emergencyContact: '+52-55-3686-5100', languages: ['es', 'en'], region: 'North America' },
    { id: 'gt', country: 'Guatemala', countryCode: 'GT', name: 'MINEX Guatemala', website: 'https://www.minex.gob.gt', travelAdvisoryUrl: 'https://www.minex.gob.gt', emergencyContact: '+502-2410-0000', languages: ['es'], region: 'North America' },
    { id: 'bz', country: 'Belize', countryCode: 'BZ', name: 'Ministry of Foreign Affairs Belize', website: 'https://www.mfa.gov.bz', travelAdvisoryUrl: 'https://www.mfa.gov.bz', emergencyContact: '+501-822-2322', languages: ['en'], region: 'North America' },
    { id: 'hn', country: 'Honduras', countryCode: 'HN', name: 'Cancillería Honduras', website: 'https://www.sreci.gob.hn', travelAdvisoryUrl: 'https://www.sreci.gob.hn', emergencyContact: '+504-2234-3005', languages: ['es'], region: 'North America' },
    { id: 'sv', country: 'El Salvador', countryCode: 'SV', name: 'MRREE El Salvador', website: 'https://www.cancilleria.gob.sv', travelAdvisoryUrl: 'https://www.cancilleria.gob.sv', emergencyContact: '+503-2231-1000', languages: ['es'], region: 'North America' },
    { id: 'ni', country: 'Nicaragua', countryCode: 'NI', name: 'Cancillería Nicaragua', website: 'https://www.cancilleria.gob.ni', travelAdvisoryUrl: 'https://www.cancilleria.gob.ni', emergencyContact: '+505-2244-8000', languages: ['es'], region: 'North America' },
    { id: 'cr', country: 'Costa Rica', countryCode: 'CR', name: 'MREC Costa Rica', website: 'https://www.rree.go.cr', travelAdvisoryUrl: 'https://www.rree.go.cr', emergencyContact: '+506-2539-5600', languages: ['es', 'en'], region: 'North America' },
    { id: 'pa', country: 'Panama', countryCode: 'PA', name: 'MRE Panama', website: 'https://www.mire.gob.pa', travelAdvisoryUrl: 'https://www.mire.gob.pa', emergencyContact: '+507-511-4100', languages: ['es', 'en'], region: 'North America' },

    // Caribbean
    { id: 'cu', country: 'Cuba', countryCode: 'CU', name: 'MINREX Cuba', website: 'https://www.minrex.gob.cu', travelAdvisoryUrl: 'https://www.minrex.gob.cu', emergencyContact: '+53-7-209-4444', languages: ['es'], region: 'North America' },
    { id: 'jm', country: 'Jamaica', countryCode: 'JM', name: 'MFAFT Jamaica', website: 'https://mfaft.gov.jm', travelAdvisoryUrl: 'https://mfaft.gov.jm', emergencyContact: '+1-876-926-4220', languages: ['en'], region: 'North America' },
    { id: 'ht', country: 'Haiti', countryCode: 'HT', name: 'MAE Haiti', website: 'https://www.mae.gouv.ht', travelAdvisoryUrl: 'https://www.mae.gouv.ht', emergencyContact: '+509-2229-1700', languages: ['fr', 'ht'], region: 'North America' },
    { id: 'do', country: 'Dominican Republic', countryCode: 'DO', name: 'MIREX Dominican Republic', website: 'https://www.mirex.gob.do', travelAdvisoryUrl: 'https://www.mirex.gob.do', emergencyContact: '+1-809-987-7001', languages: ['es'], region: 'North America' },
    { id: 'tt', country: 'Trinidad and Tobago', countryCode: 'TT', name: 'MFCA Trinidad', website: 'https://foreign.gov.tt', travelAdvisoryUrl: 'https://foreign.gov.tt', emergencyContact: '+1-868-623-4116', languages: ['en'], region: 'North America' },
    { id: 'bb', country: 'Barbados', countryCode: 'BB', name: 'MFAFT Barbados', website: 'https://www.foreign.gov.bb', travelAdvisoryUrl: 'https://www.foreign.gov.bb', emergencyContact: '+1-246-431-2200', languages: ['en'], region: 'North America' },
    { id: 'bs', country: 'Bahamas', countryCode: 'BS', name: 'MFA Bahamas', website: 'https://mofa.gov.bs', travelAdvisoryUrl: 'https://mofa.gov.bs', emergencyContact: '+1-242-322-7624', languages: ['en'], region: 'North America' },

    // ═══════════════════════ SOUTH AMERICA ═══════════════════════
    { id: 'br', country: 'Brazil', countryCode: 'BR', name: 'Itamaraty', website: 'https://www.gov.br/mre/en', travelAdvisoryUrl: 'https://www.gov.br/mre/en/consular-services', emergencyContact: '+55-61-2030-8000', languages: ['pt', 'en'], region: 'South America' },
    { id: 'ar', country: 'Argentina', countryCode: 'AR', name: 'Cancillería Argentina', website: 'https://www.cancilleria.gob.ar/en', travelAdvisoryUrl: 'https://www.cancilleria.gob.ar/en/travel-advice', emergencyContact: '+54-11-4819-7000', languages: ['es', 'en'], region: 'South America' },
    { id: 'cl', country: 'Chile', countryCode: 'CL', name: 'MINREL Chile', website: 'https://www.minrel.gob.cl', travelAdvisoryUrl: 'https://www.minrel.gob.cl', emergencyContact: '+56-2-2827-4100', languages: ['es', 'en'], region: 'South America' },
    { id: 'co', country: 'Colombia', countryCode: 'CO', name: 'Cancillería Colombia', website: 'https://www.cancilleria.gov.co', travelAdvisoryUrl: 'https://www.cancilleria.gov.co/en/travel-advice', emergencyContact: '+57-1-381-4000', languages: ['es', 'en'], region: 'South America' },
    { id: 'pe', country: 'Peru', countryCode: 'PE', name: 'MRE Peru', website: 'https://www.gob.pe/rree', travelAdvisoryUrl: 'https://www.gob.pe/rree', emergencyContact: '+51-1-204-2400', languages: ['es', 'en'], region: 'South America' },
    { id: 've', country: 'Venezuela', countryCode: 'VE', name: 'MPPRE Venezuela', website: 'https://www.mppre.gob.ve', travelAdvisoryUrl: 'https://www.mppre.gob.ve', emergencyContact: '+58-212-806-4000', languages: ['es'], region: 'South America' },
    { id: 'ec', country: 'Ecuador', countryCode: 'EC', name: 'Cancillería Ecuador', website: 'https://www.cancilleria.gob.ec', travelAdvisoryUrl: 'https://www.cancilleria.gob.ec', emergencyContact: '+593-2-299-3200', languages: ['es', 'en'], region: 'South America' },
    { id: 'bo', country: 'Bolivia', countryCode: 'BO', name: 'MRE Bolivia', website: 'https://www.cancilleria.gob.bo', travelAdvisoryUrl: 'https://www.cancilleria.gob.bo', emergencyContact: '+591-2-240-8900', languages: ['es'], region: 'South America' },
    { id: 'py', country: 'Paraguay', countryCode: 'PY', name: 'MRE Paraguay', website: 'https://www.mre.gov.py', travelAdvisoryUrl: 'https://www.mre.gov.py', emergencyContact: '+595-21-493-872', languages: ['es', 'gn'], region: 'South America' },
    { id: 'uy', country: 'Uruguay', countryCode: 'UY', name: 'MRREE Uruguay', website: 'https://www.gub.uy/ministerio-relaciones-exteriores', travelAdvisoryUrl: 'https://www.gub.uy/ministerio-relaciones-exteriores', emergencyContact: '+598-2-902-1010', languages: ['es', 'en'], region: 'South America' },
    { id: 'gy', country: 'Guyana', countryCode: 'GY', name: 'MFA Guyana', website: 'https://minfor.gov.gy', travelAdvisoryUrl: 'https://minfor.gov.gy', emergencyContact: '+592-226-1607', languages: ['en'], region: 'South America' },
    { id: 'sr', country: 'Suriname', countryCode: 'SR', name: 'BUZA Suriname', website: 'https://gov.sr/ministerie-van-buitenlandse-zaken', travelAdvisoryUrl: 'https://gov.sr/ministerie-van-buitenlandse-zaken', emergencyContact: '+597-477-007', languages: ['nl'], region: 'South America' },

    // ═══════════════════════ EUROPE ═══════════════════════
    { id: 'gb', country: 'United Kingdom', countryCode: 'GB', name: 'UK FCDO', website: 'https://www.gov.uk/foreign-travel-advice', travelAdvisoryUrl: 'https://www.gov.uk/foreign-travel-advice', emergencyContact: '+44-20-7008-5000', languages: ['en'], region: 'Europe' },
    { id: 'de', country: 'Germany', countryCode: 'DE', name: 'Federal Foreign Office', website: 'https://www.auswaertiges-amt.de/en', travelAdvisoryUrl: 'https://www.auswaertiges-amt.de/en/ReiseUndSicherheit', emergencyContact: '+49-30-5000-2000', registrationUrl: 'https://elefand.diplo.de', languages: ['de', 'en'], region: 'Europe' },
    { id: 'fr', country: 'France', countryCode: 'FR', name: 'France Diplomatie', website: 'https://www.diplomatie.gouv.fr/en', travelAdvisoryUrl: 'https://www.diplomatie.gouv.fr/en/country-files', emergencyContact: '+33-1-43-17-53-53', registrationUrl: 'https://pastel.diplomatie.gouv.fr/fildariane', languages: ['fr', 'en'], region: 'Europe' },
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
    { id: 'ro', country: 'Romania', countryCode: 'RO', name: 'MAE Romania', website: 'https://www.mae.ro/en', travelAdvisoryUrl: 'https://www.mae.ro/en/travel-conditions', emergencyContact: '+40-21-319-2125', languages: ['ro', 'en'], region: 'Europe' },
    { id: 'hu', country: 'Hungary', countryCode: 'HU', name: 'KKM Hungary', website: 'https://konzuliszolgalat.kormany.hu/en', travelAdvisoryUrl: 'https://konzuliszolgalat.kormany.hu/en', emergencyContact: '+36-1-458-1000', languages: ['hu', 'en'], region: 'Europe' },
    { id: 'bg', country: 'Bulgaria', countryCode: 'BG', name: 'MFA Bulgaria', website: 'https://www.mfa.bg/en', travelAdvisoryUrl: 'https://www.mfa.bg/en/travel-advice', emergencyContact: '+359-2-948-2999', languages: ['bg', 'en'], region: 'Europe' },
    { id: 'hr', country: 'Croatia', countryCode: 'HR', name: 'MVEP Croatia', website: 'https://mvep.gov.hr/en', travelAdvisoryUrl: 'https://mvep.gov.hr/en/services-for-citizens', emergencyContact: '+385-1-4569-964', languages: ['hr', 'en'], region: 'Europe' },
    { id: 'sk', country: 'Slovakia', countryCode: 'SK', name: 'MZV Slovakia', website: 'https://www.mzv.sk/en', travelAdvisoryUrl: 'https://www.mzv.sk/en/travel-advice', emergencyContact: '+421-2-5978-1111', languages: ['sk', 'en'], region: 'Europe' },
    { id: 'si', country: 'Slovenia', countryCode: 'SI', name: 'MZZ Slovenia', website: 'https://www.gov.si/en/state-authorities/ministries/ministry-of-foreign-and-european-affairs', travelAdvisoryUrl: 'https://www.gov.si/en/topics/travel-advice', emergencyContact: '+386-1-478-2000', languages: ['sl', 'en'], region: 'Europe' },
    { id: 'rs', country: 'Serbia', countryCode: 'RS', name: 'MFA Serbia', website: 'https://www.mfa.gov.rs/en', travelAdvisoryUrl: 'https://www.mfa.gov.rs/en', emergencyContact: '+381-11-306-8000', languages: ['sr', 'en'], region: 'Europe' },
    { id: 'lt', country: 'Lithuania', countryCode: 'LT', name: 'URM Lithuania', website: 'https://www.urm.lt/default/en', travelAdvisoryUrl: 'https://www.urm.lt/default/en/travel-advice', emergencyContact: '+370-5-236-2444', languages: ['lt', 'en'], region: 'Europe' },
    { id: 'lv', country: 'Latvia', countryCode: 'LV', name: 'MFA Latvia', website: 'https://www.mfa.gov.lv/en', travelAdvisoryUrl: 'https://www.mfa.gov.lv/en/travel-advice', emergencyContact: '+371-6701-6201', languages: ['lv', 'en'], region: 'Europe' },
    { id: 'ee', country: 'Estonia', countryCode: 'EE', name: 'MFA Estonia', website: 'https://www.vm.ee/en', travelAdvisoryUrl: 'https://www.vm.ee/en/travel-advice', emergencyContact: '+372-637-7440', languages: ['et', 'en'], region: 'Europe' },
    { id: 'is', country: 'Iceland', countryCode: 'IS', name: 'MFA Iceland', website: 'https://www.government.is/ministries/ministry-for-foreign-affairs', travelAdvisoryUrl: 'https://www.government.is/ministries/ministry-for-foreign-affairs', emergencyContact: '+354-545-9900', languages: ['is', 'en'], region: 'Europe' },
    { id: 'lu', country: 'Luxembourg', countryCode: 'LU', name: 'MAEE Luxembourg', website: 'https://maee.gouvernement.lu/en.html', travelAdvisoryUrl: 'https://maee.gouvernement.lu/en/conseils-aux-voyageurs.html', emergencyContact: '+352-247-82300', languages: ['fr', 'de', 'lb', 'en'], region: 'Europe' },
    { id: 'mt', country: 'Malta', countryCode: 'MT', name: 'MFEA Malta', website: 'https://foreignandeu.gov.mt', travelAdvisoryUrl: 'https://foreignandeu.gov.mt/travel-advice', emergencyContact: '+356-2124-2191', languages: ['mt', 'en'], region: 'Europe' },
    { id: 'cy', country: 'Cyprus', countryCode: 'CY', name: 'MFA Cyprus', website: 'https://www.mfa.gov.cy/mfa/mfa.nsf/index_en', travelAdvisoryUrl: 'https://www.mfa.gov.cy', emergencyContact: '+357-22-401000', languages: ['el', 'tr', 'en'], region: 'Europe' },
    { id: 'al', country: 'Albania', countryCode: 'AL', name: 'MFA Albania', website: 'https://punetejashtme.gov.al/en', travelAdvisoryUrl: 'https://punetejashtme.gov.al/en', emergencyContact: '+355-4-241-9072', languages: ['sq', 'en'], region: 'Europe' },
    { id: 'me', country: 'Montenegro', countryCode: 'ME', name: 'MFA Montenegro', website: 'https://www.gov.me/en/mfa', travelAdvisoryUrl: 'https://www.gov.me/en/mfa', emergencyContact: '+382-20-224-670', languages: ['sr', 'en'], region: 'Europe' },
    { id: 'mk', country: 'North Macedonia', countryCode: 'MK', name: 'MFA North Macedonia', website: 'https://www.mfa.gov.mk/en', travelAdvisoryUrl: 'https://www.mfa.gov.mk/en', emergencyContact: '+389-2-311-0333', languages: ['mk', 'en'], region: 'Europe' },
    { id: 'ba', country: 'Bosnia and Herzegovina', countryCode: 'BA', name: 'MFA Bosnia', website: 'https://www.mvp.gov.ba/default.aspx?langTag=en-US', travelAdvisoryUrl: 'https://www.mvp.gov.ba', emergencyContact: '+387-33-281-100', languages: ['bs', 'hr', 'sr', 'en'], region: 'Europe' },
    { id: 'xk', country: 'Kosovo', countryCode: 'XK', name: 'MFA Kosovo', website: 'https://www.mfa-ks.net/en', travelAdvisoryUrl: 'https://www.mfa-ks.net/en', emergencyContact: '+383-38-212-536', languages: ['sq', 'sr', 'en'], region: 'Europe' },
    { id: 'md', country: 'Moldova', countryCode: 'MD', name: 'MFAEI Moldova', website: 'https://www.mfa.gov.md/en', travelAdvisoryUrl: 'https://www.mfa.gov.md/en', emergencyContact: '+373-22-578-207', languages: ['ro', 'en'], region: 'Europe' },
    { id: 'ua', country: 'Ukraine', countryCode: 'UA', name: 'MFA Ukraine', website: 'https://www.mfa.gov.ua/en', travelAdvisoryUrl: 'https://www.mfa.gov.ua/en', emergencyContact: '+380-44-238-1600', languages: ['uk', 'en'], region: 'Europe' },
    { id: 'by', country: 'Belarus', countryCode: 'BY', name: 'MFA Belarus', website: 'https://www.mfa.gov.by/en', travelAdvisoryUrl: 'https://www.mfa.gov.by/en', emergencyContact: '+375-17-327-2922', languages: ['be', 'ru', 'en'], region: 'Europe' },
    { id: 'ru', country: 'Russia', countryCode: 'RU', name: 'MID Russia', website: 'https://www.mid.ru/en', travelAdvisoryUrl: 'https://www.mid.ru/en', emergencyContact: '+7-495-244-1581', languages: ['ru', 'en'], region: 'Europe' },
    { id: 'ge', country: 'Georgia', countryCode: 'GE', name: 'MFA Georgia', website: 'https://www.mfa.gov.ge/en', travelAdvisoryUrl: 'https://www.mfa.gov.ge/en', emergencyContact: '+995-32-294-5050', languages: ['ka', 'en'], region: 'Europe' },
    { id: 'am', country: 'Armenia', countryCode: 'AM', name: 'MFA Armenia', website: 'https://www.mfa.am/en', travelAdvisoryUrl: 'https://www.mfa.am/en', emergencyContact: '+374-10-544-041', languages: ['hy', 'en'], region: 'Europe' },
    { id: 'az', country: 'Azerbaijan', countryCode: 'AZ', name: 'MFA Azerbaijan', website: 'https://www.mfa.gov.az/en', travelAdvisoryUrl: 'https://www.mfa.gov.az/en', emergencyContact: '+994-12-596-9000', languages: ['az', 'en'], region: 'Europe' },

    // ═══════════════════════ ASIA PACIFIC ═══════════════════════
    { id: 'jp', country: 'Japan', countryCode: 'JP', name: 'MOFA Japan', website: 'https://www.mofa.go.jp/index.html', travelAdvisoryUrl: 'https://www.anzen.mofa.go.jp', emergencyContact: '+81-3-3580-3311', languages: ['ja', 'en'], region: 'Asia Pacific' },
    { id: 'au', country: 'Australia', countryCode: 'AU', name: 'DFAT Smartraveller', website: 'https://smartraveller.gov.au', travelAdvisoryUrl: 'https://smartraveller.gov.au/destinations', emergencyContact: '+61-2-6261-3305', registrationUrl: 'https://smartraveller.gov.au/guide/all-travellers/let-someone-know', languages: ['en'], region: 'Asia Pacific' },
    { id: 'nz', country: 'New Zealand', countryCode: 'NZ', name: 'SafeTravel NZ', website: 'https://safetravel.govt.nz', travelAdvisoryUrl: 'https://safetravel.govt.nz/destinations', emergencyContact: '+64-4-439-8000', languages: ['en'], region: 'Asia Pacific' },
    { id: 'kr', country: 'South Korea', countryCode: 'KR', name: 'MOFA Korea', website: 'https://www.mofa.go.kr/eng', travelAdvisoryUrl: 'https://www.0404.go.kr/dev/main.mofa', emergencyContact: '+82-2-2100-2114', languages: ['ko', 'en'], region: 'Asia Pacific' },
    { id: 'cn', country: 'China', countryCode: 'CN', name: 'MFA China', website: 'https://www.fmprc.gov.cn/eng', travelAdvisoryUrl: 'https://www.fmprc.gov.cn/eng', emergencyContact: '+86-10-12308', languages: ['zh', 'en'], region: 'Asia Pacific' },
    { id: 'in', country: 'India', countryCode: 'IN', name: 'MEA India', website: 'https://www.mea.gov.in', travelAdvisoryUrl: 'https://www.mea.gov.in/travel-advisory.htm', emergencyContact: '+91-11-2301-2113', languages: ['hi', 'en'], region: 'Asia Pacific' },
    { id: 'sg', country: 'Singapore', countryCode: 'SG', name: 'MFA Singapore', website: 'https://www.mfa.gov.sg', travelAdvisoryUrl: 'https://www.mfa.gov.sg/Services/Singaporeans-Overseas/Travel-Page', emergencyContact: '+65-6379-8000', languages: ['en', 'zh', 'ms'], region: 'Asia Pacific' },
    { id: 'th', country: 'Thailand', countryCode: 'TH', name: 'MFA Thailand', website: 'https://www.mfa.go.th/en', travelAdvisoryUrl: 'https://www.mfa.go.th/en/content/travel-advisory', emergencyContact: '+66-2-203-5000', languages: ['th', 'en'], region: 'Asia Pacific' },
    { id: 'my', country: 'Malaysia', countryCode: 'MY', name: 'Wisma Putra', website: 'https://www.kln.gov.my', travelAdvisoryUrl: 'https://www.kln.gov.my/web/guest/travel-advisory', emergencyContact: '+60-3-8887-4570', languages: ['ms', 'en'], region: 'Asia Pacific' },
    { id: 'ph', country: 'Philippines', countryCode: 'PH', name: 'DFA Philippines', website: 'https://dfa.gov.ph', travelAdvisoryUrl: 'https://dfa.gov.ph/travel-advisories', emergencyContact: '+63-2-8834-4000', languages: ['tl', 'en'], region: 'Asia Pacific' },
    { id: 'id', country: 'Indonesia', countryCode: 'ID', name: 'Kemlu Indonesia', website: 'https://kemlu.go.id/portal/en', travelAdvisoryUrl: 'https://kemlu.go.id/portal/en/page/travel-advisory', emergencyContact: '+62-21-3441-508', languages: ['id', 'en'], region: 'Asia Pacific' },
    { id: 'tw', country: 'Taiwan', countryCode: 'TW', name: 'BOCA Taiwan', website: 'https://www.boca.gov.tw/mp-2.html', travelAdvisoryUrl: 'https://www.boca.gov.tw/mp-2.html', emergencyContact: '+886-800-085-095', languages: ['zh', 'en'], region: 'Asia Pacific' },
    { id: 'vn', country: 'Vietnam', countryCode: 'VN', name: 'MOFA Vietnam', website: 'https://www.mofa.gov.vn/en', travelAdvisoryUrl: 'https://www.mofa.gov.vn/en', emergencyContact: '+84-24-3799-3000', languages: ['vi', 'en'], region: 'Asia Pacific' },
    { id: 'kh', country: 'Cambodia', countryCode: 'KH', name: 'MFAIC Cambodia', website: 'https://www.mfaic.gov.kh', travelAdvisoryUrl: 'https://www.mfaic.gov.kh', emergencyContact: '+855-23-216-141', languages: ['km', 'en'], region: 'Asia Pacific' },
    { id: 'mm', country: 'Myanmar', countryCode: 'MM', name: 'MOFA Myanmar', website: 'https://www.mofa.gov.mm', travelAdvisoryUrl: 'https://www.mofa.gov.mm', emergencyContact: '+95-1-229-991', languages: ['my', 'en'], region: 'Asia Pacific' },
    { id: 'la', country: 'Laos', countryCode: 'LA', name: 'MOFA Laos', website: 'https://www.mofa.gov.la', travelAdvisoryUrl: 'https://www.mofa.gov.la', emergencyContact: '+856-21-451-940', languages: ['lo', 'en'], region: 'Asia Pacific' },
    { id: 'bd', country: 'Bangladesh', countryCode: 'BD', name: 'MOFA Bangladesh', website: 'https://mofa.gov.bd', travelAdvisoryUrl: 'https://mofa.gov.bd', emergencyContact: '+880-2-9562-9900', languages: ['bn', 'en'], region: 'Asia Pacific' },
    { id: 'pk', country: 'Pakistan', countryCode: 'PK', name: 'MOFA Pakistan', website: 'https://mofa.gov.pk', travelAdvisoryUrl: 'https://mofa.gov.pk', emergencyContact: '+92-51-920-4000', languages: ['ur', 'en'], region: 'Asia Pacific' },
    { id: 'lk', country: 'Sri Lanka', countryCode: 'LK', name: 'MFA Sri Lanka', website: 'https://www.mfa.gov.lk', travelAdvisoryUrl: 'https://www.mfa.gov.lk', emergencyContact: '+94-11-232-5365', languages: ['si', 'ta', 'en'], region: 'Asia Pacific' },
    { id: 'np', country: 'Nepal', countryCode: 'NP', name: 'MOFA Nepal', website: 'https://mofa.gov.np', travelAdvisoryUrl: 'https://mofa.gov.np', emergencyContact: '+977-1-441-6011', languages: ['ne', 'en'], region: 'Asia Pacific' },
    { id: 'mv', country: 'Maldives', countryCode: 'MV', name: 'MFA Maldives', website: 'https://www.foreign.gov.mv', travelAdvisoryUrl: 'https://www.foreign.gov.mv', emergencyContact: '+960-332-3400', languages: ['dv', 'en'], region: 'Asia Pacific' },
    { id: 'bt', country: 'Bhutan', countryCode: 'BT', name: 'MFA Bhutan', website: 'https://www.mfa.gov.bt', travelAdvisoryUrl: 'https://www.mfa.gov.bt', emergencyContact: '+975-2-322-460', languages: ['dz', 'en'], region: 'Asia Pacific' },
    { id: 'mn', country: 'Mongolia', countryCode: 'MN', name: 'MOFA Mongolia', website: 'https://www.mfa.gov.mn', travelAdvisoryUrl: 'https://www.mfa.gov.mn', emergencyContact: '+976-11-262-095', languages: ['mn', 'en'], region: 'Asia Pacific' },
    { id: 'hk', country: 'Hong Kong', countryCode: 'HK', name: 'HKSAR Gov', website: 'https://www.gov.hk/en', travelAdvisoryUrl: 'https://www.sb.gov.hk/eng/osa', emergencyContact: '+852-1868', languages: ['zh', 'en'], region: 'Asia Pacific' },
    { id: 'fj', country: 'Fiji', countryCode: 'FJ', name: 'MFA Fiji', website: 'https://www.foreignaffairs.gov.fj', travelAdvisoryUrl: 'https://www.foreignaffairs.gov.fj', emergencyContact: '+679-330-9645', languages: ['en', 'fj', 'hi'], region: 'Asia Pacific' },
    { id: 'pg', country: 'Papua New Guinea', countryCode: 'PG', name: 'DFAIT PNG', website: 'https://www.foreignaffairs.gov.pg', travelAdvisoryUrl: 'https://www.foreignaffairs.gov.pg', emergencyContact: '+675-301-0200', languages: ['en', 'tpi'], region: 'Asia Pacific' },
    { id: 'ws', country: 'Samoa', countryCode: 'WS', name: 'MFAT Samoa', website: 'https://www.mfat.gov.ws', travelAdvisoryUrl: 'https://www.mfat.gov.ws', emergencyContact: '+685-21-171', languages: ['sm', 'en'], region: 'Asia Pacific' },
    { id: 'to', country: 'Tonga', countryCode: 'TO', name: 'MFA Tonga', website: 'https://www.gov.to', travelAdvisoryUrl: 'https://www.gov.to', emergencyContact: '+676-23-600', languages: ['to', 'en'], region: 'Asia Pacific' },
    { id: 'kz', country: 'Kazakhstan', countryCode: 'KZ', name: 'MFA Kazakhstan', website: 'https://www.gov.kz/memleket/entities/mfa/en', travelAdvisoryUrl: 'https://www.gov.kz/memleket/entities/mfa/en', emergencyContact: '+7-7172-72-0618', languages: ['kk', 'ru', 'en'], region: 'Asia Pacific' },
    { id: 'uz', country: 'Uzbekistan', countryCode: 'UZ', name: 'MFA Uzbekistan', website: 'https://mfa.uz/en', travelAdvisoryUrl: 'https://mfa.uz/en', emergencyContact: '+998-71-233-4882', languages: ['uz', 'ru', 'en'], region: 'Asia Pacific' },
    { id: 'kg', country: 'Kyrgyzstan', countryCode: 'KG', name: 'MFA Kyrgyzstan', website: 'https://mfa.gov.kg/en', travelAdvisoryUrl: 'https://mfa.gov.kg/en', emergencyContact: '+996-312-620-545', languages: ['ky', 'ru', 'en'], region: 'Asia Pacific' },
    { id: 'tj', country: 'Tajikistan', countryCode: 'TJ', name: 'MFA Tajikistan', website: 'https://mfa.tj/en', travelAdvisoryUrl: 'https://mfa.tj/en', emergencyContact: '+992-37-221-1850', languages: ['tg', 'ru', 'en'], region: 'Asia Pacific' },
    { id: 'tm', country: 'Turkmenistan', countryCode: 'TM', name: 'MFA Turkmenistan', website: 'https://www.mfa.gov.tm/en', travelAdvisoryUrl: 'https://www.mfa.gov.tm/en', emergencyContact: '+993-12-35-4578', languages: ['tk', 'ru', 'en'], region: 'Asia Pacific' },

    // ═══════════════════════ MIDDLE EAST ═══════════════════════
    { id: 'ae', country: 'United Arab Emirates', countryCode: 'AE', name: 'MOFAIC UAE', website: 'https://www.mofaic.gov.ae/en', travelAdvisoryUrl: 'https://www.mofaic.gov.ae/en/Travel-Advisory', emergencyContact: '+971-2-449-2999', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'sa', country: 'Saudi Arabia', countryCode: 'SA', name: 'MOFA Saudi Arabia', website: 'https://www.mofa.gov.sa/en', travelAdvisoryUrl: 'https://www.mofa.gov.sa/en', emergencyContact: '+966-11-406-7777', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'qa', country: 'Qatar', countryCode: 'QA', name: 'MOFA Qatar', website: 'https://mofa.gov.qa/en', travelAdvisoryUrl: 'https://mofa.gov.qa/en/travel-advice', emergencyContact: '+974-4404-4444', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'il', country: 'Israel', countryCode: 'IL', name: 'MFA Israel', website: 'https://www.gov.il/en/departments/ministry_of_foreign_affairs', travelAdvisoryUrl: 'https://www.gov.il/en/departments/ministry_of_foreign_affairs', emergencyContact: '+972-2-530-3111', languages: ['he', 'en'], region: 'Middle East' },
    { id: 'tr', country: 'Turkey', countryCode: 'TR', name: 'MFA Turkey', website: 'https://www.mfa.gov.tr/default.en.mfa', travelAdvisoryUrl: 'https://www.mfa.gov.tr/travel-advice.en.mfa', emergencyContact: '+90-312-292-1000', languages: ['tr', 'en'], region: 'Middle East' },
    { id: 'kw', country: 'Kuwait', countryCode: 'KW', name: 'MOFA Kuwait', website: 'https://www.mofa.gov.kw/en', travelAdvisoryUrl: 'https://www.mofa.gov.kw/en', emergencyContact: '+965-2225-5775', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'bh', country: 'Bahrain', countryCode: 'BH', name: 'MOFA Bahrain', website: 'https://www.mofa.gov.bh', travelAdvisoryUrl: 'https://www.mofa.gov.bh', emergencyContact: '+973-1722-7555', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'om', country: 'Oman', countryCode: 'OM', name: 'MFA Oman', website: 'https://www.fm.gov.om', travelAdvisoryUrl: 'https://www.fm.gov.om', emergencyContact: '+968-2469-9500', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'jo', country: 'Jordan', countryCode: 'JO', name: 'MFA Jordan', website: 'https://www.mfa.gov.jo/en', travelAdvisoryUrl: 'https://www.mfa.gov.jo/en', emergencyContact: '+962-6-573-5150', languages: ['ar', 'en'], region: 'Middle East' },
    { id: 'lb', country: 'Lebanon', countryCode: 'LB', name: 'MFA Lebanon', website: 'https://www.mfa.gov.lb', travelAdvisoryUrl: 'https://www.mfa.gov.lb', emergencyContact: '+961-1-333-100', languages: ['ar', 'fr', 'en'], region: 'Middle East' },
    { id: 'iq', country: 'Iraq', countryCode: 'IQ', name: 'MOFA Iraq', website: 'https://www.mofa.gov.iq/en', travelAdvisoryUrl: 'https://www.mofa.gov.iq/en', emergencyContact: '+964-1-541-2000', languages: ['ar', 'ku', 'en'], region: 'Middle East' },
    { id: 'ir', country: 'Iran', countryCode: 'IR', name: 'MFA Iran', website: 'https://en.mfa.gov.ir', travelAdvisoryUrl: 'https://en.mfa.gov.ir', emergencyContact: '+98-21-6115-3000', languages: ['fa', 'en'], region: 'Middle East' },
    { id: 'ye', country: 'Yemen', countryCode: 'YE', name: 'MOFA Yemen', website: 'https://www.mofa-ye.org', travelAdvisoryUrl: 'https://www.mofa-ye.org', emergencyContact: '+967-1-274-141', languages: ['ar'], region: 'Middle East' },
    { id: 'sy', country: 'Syria', countryCode: 'SY', name: 'MOFA Syria', website: 'https://www.mofa.gov.sy', travelAdvisoryUrl: 'https://www.mofa.gov.sy', emergencyContact: '+963-11-331-4400', languages: ['ar'], region: 'Middle East' },
    { id: 'ps', country: 'Palestine', countryCode: 'PS', name: 'MFA Palestine', website: 'https://www.mofa.pna.ps/en', travelAdvisoryUrl: 'https://www.mofa.pna.ps/en', emergencyContact: '+970-2-294-3740', languages: ['ar', 'en'], region: 'Middle East' },

    // ═══════════════════════ AFRICA ═══════════════════════
    { id: 'za', country: 'South Africa', countryCode: 'ZA', name: 'DIRCO', website: 'https://www.dirco.gov.za', travelAdvisoryUrl: 'https://www.dirco.gov.za', emergencyContact: '+27-12-351-1000', languages: ['en', 'af'], region: 'Africa' },
    { id: 'eg', country: 'Egypt', countryCode: 'EG', name: 'MFA Egypt', website: 'https://www.mfa.gov.eg', travelAdvisoryUrl: 'https://www.mfa.gov.eg', emergencyContact: '+20-2-2574-3939', languages: ['ar', 'en'], region: 'Africa' },
    { id: 'ke', country: 'Kenya', countryCode: 'KE', name: 'MFA Kenya', website: 'https://www.mfa.go.ke', travelAdvisoryUrl: 'https://www.mfa.go.ke', emergencyContact: '+254-20-271-8888', languages: ['sw', 'en'], region: 'Africa' },
    { id: 'ng', country: 'Nigeria', countryCode: 'NG', name: 'MFA Nigeria', website: 'https://www.foreignaffairs.gov.ng', travelAdvisoryUrl: 'https://www.foreignaffairs.gov.ng', emergencyContact: '+234-9-523-6700', languages: ['en'], region: 'Africa' },
    { id: 'ma', country: 'Morocco', countryCode: 'MA', name: 'MAEC Morocco', website: 'https://www.diplomatie.ma', travelAdvisoryUrl: 'https://www.diplomatie.ma/en', emergencyContact: '+212-537-76-1000', languages: ['ar', 'fr', 'en'], region: 'Africa' },
    { id: 'tz', country: 'Tanzania', countryCode: 'TZ', name: 'MFA Tanzania', website: 'https://www.foreign.go.tz', travelAdvisoryUrl: 'https://www.foreign.go.tz', emergencyContact: '+255-22-211-1906', languages: ['sw', 'en'], region: 'Africa' },
    { id: 'gh', country: 'Ghana', countryCode: 'GH', name: 'MFA Ghana', website: 'https://mfa.gov.gh', travelAdvisoryUrl: 'https://mfa.gov.gh', emergencyContact: '+233-30-266-4951', languages: ['en'], region: 'Africa' },
    { id: 'et', country: 'Ethiopia', countryCode: 'ET', name: 'MFA Ethiopia', website: 'https://www.mfa.gov.et', travelAdvisoryUrl: 'https://www.mfa.gov.et', emergencyContact: '+251-11-551-7345', languages: ['am', 'en'], region: 'Africa' },
    { id: 'sn', country: 'Senegal', countryCode: 'SN', name: 'MAESE Senegal', website: 'https://www.diplomatie.gouv.sn', travelAdvisoryUrl: 'https://www.diplomatie.gouv.sn', emergencyContact: '+221-33-839-5100', languages: ['fr', 'en'], region: 'Africa' },
    { id: 'ci', country: "Côte d'Ivoire", countryCode: 'CI', name: 'MAE Côte d\'Ivoire', website: 'https://www.diplomatie.gouv.ci', travelAdvisoryUrl: 'https://www.diplomatie.gouv.ci', emergencyContact: '+225-27-20-25-8000', languages: ['fr'], region: 'Africa' },
    { id: 'cm', country: 'Cameroon', countryCode: 'CM', name: 'MINREX Cameroon', website: 'https://www.diplomatie.gov.cm', travelAdvisoryUrl: 'https://www.diplomatie.gov.cm', emergencyContact: '+237-222-220-133', languages: ['fr', 'en'], region: 'Africa' },
    { id: 'ug', country: 'Uganda', countryCode: 'UG', name: 'MFA Uganda', website: 'https://www.mofa.go.ug', travelAdvisoryUrl: 'https://www.mofa.go.ug', emergencyContact: '+256-414-257-791', languages: ['en', 'sw'], region: 'Africa' },
    { id: 'rw', country: 'Rwanda', countryCode: 'RW', name: 'MINAFFET Rwanda', website: 'https://www.minaffet.gov.rw', travelAdvisoryUrl: 'https://www.minaffet.gov.rw', emergencyContact: '+250-252-575-388', languages: ['rw', 'en', 'fr'], region: 'Africa' },
    { id: 'ao', country: 'Angola', countryCode: 'AO', name: 'MIREX Angola', website: 'https://www.mirex.gov.ao', travelAdvisoryUrl: 'https://www.mirex.gov.ao', emergencyContact: '+244-222-393-510', languages: ['pt'], region: 'Africa' },
    { id: 'mz', country: 'Mozambique', countryCode: 'MZ', name: 'MINEC Mozambique', website: 'https://www.minec.gov.mz', travelAdvisoryUrl: 'https://www.minec.gov.mz', emergencyContact: '+258-21-327-000', languages: ['pt', 'en'], region: 'Africa' },
    { id: 'zm', country: 'Zambia', countryCode: 'ZM', name: 'MFA Zambia', website: 'https://www.mofa.gov.zm', travelAdvisoryUrl: 'https://www.mofa.gov.zm', emergencyContact: '+260-211-252-666', languages: ['en'], region: 'Africa' },
    { id: 'zw', country: 'Zimbabwe', countryCode: 'ZW', name: 'MFA Zimbabwe', website: 'https://www.zimfa.gov.zw', travelAdvisoryUrl: 'https://www.zimfa.gov.zw', emergencyContact: '+263-242-727-005', languages: ['en'], region: 'Africa' },
    { id: 'bw', country: 'Botswana', countryCode: 'BW', name: 'MFAIT Botswana', website: 'https://www.mofaic.gov.bw', travelAdvisoryUrl: 'https://www.mofaic.gov.bw', emergencyContact: '+267-360-0700', languages: ['en', 'tn'], region: 'Africa' },
    { id: 'na', country: 'Namibia', countryCode: 'NA', name: 'MIRCO Namibia', website: 'https://mirco.gov.na', travelAdvisoryUrl: 'https://mirco.gov.na', emergencyContact: '+264-61-282-9111', languages: ['en'], region: 'Africa' },
    { id: 'mu', country: 'Mauritius', countryCode: 'MU', name: 'MFA Mauritius', website: 'https://foreign.govmu.org', travelAdvisoryUrl: 'https://foreign.govmu.org', emergencyContact: '+230-405-2500', languages: ['en', 'fr'], region: 'Africa' },
    { id: 'tn', country: 'Tunisia', countryCode: 'TN', name: 'MAE Tunisia', website: 'https://www.diplomatie.gov.tn', travelAdvisoryUrl: 'https://www.diplomatie.gov.tn', emergencyContact: '+216-71-799-433', languages: ['ar', 'fr'], region: 'Africa' },
    { id: 'dz', country: 'Algeria', countryCode: 'DZ', name: 'MAE Algeria', website: 'https://www.mae.gov.dz', travelAdvisoryUrl: 'https://www.mae.gov.dz', emergencyContact: '+213-21-504-300', languages: ['ar', 'fr'], region: 'Africa' },
    { id: 'ly', country: 'Libya', countryCode: 'LY', name: 'MFA Libya', website: 'https://www.foreign.gov.ly', travelAdvisoryUrl: 'https://www.foreign.gov.ly', emergencyContact: '+218-21-340-4040', languages: ['ar'], region: 'Africa' },
    { id: 'sd', country: 'Sudan', countryCode: 'SD', name: 'MFA Sudan', website: 'https://www.mfa.gov.sd', travelAdvisoryUrl: 'https://www.mfa.gov.sd', emergencyContact: '+249-183-770-000', languages: ['ar', 'en'], region: 'Africa' },
    { id: 'mg', country: 'Madagascar', countryCode: 'MG', name: 'MAE Madagascar', website: 'https://www.diplomatie.gov.mg', travelAdvisoryUrl: 'https://www.diplomatie.gov.mg', emergencyContact: '+261-20-22-211-37', languages: ['fr', 'mg'], region: 'Africa' },
    { id: 'cd', country: 'DR Congo', countryCode: 'CD', name: 'MAE RDC', website: 'https://www.minaffetint.gouv.cd', travelAdvisoryUrl: 'https://www.minaffetint.gouv.cd', emergencyContact: '+243-81-555-3000', languages: ['fr'], region: 'Africa' },
    { id: 'ml', country: 'Mali', countryCode: 'ML', name: 'MAECI Mali', website: 'https://www.diplomatie.gouv.ml', travelAdvisoryUrl: 'https://www.diplomatie.gouv.ml', emergencyContact: '+223-20-22-9797', languages: ['fr'], region: 'Africa' },
    { id: 'bf', country: 'Burkina Faso', countryCode: 'BF', name: 'MAECR Burkina Faso', website: 'https://www.mae.gov.bf', travelAdvisoryUrl: 'https://www.mae.gov.bf', emergencyContact: '+226-25-32-4734', languages: ['fr'], region: 'Africa' },
    { id: 'ne', country: 'Niger', countryCode: 'NE', name: 'MFA Niger', website: 'https://www.diplomatie.gouv.ne', travelAdvisoryUrl: 'https://www.diplomatie.gouv.ne', emergencyContact: '+227-20-72-3310', languages: ['fr'], region: 'Africa' },
    { id: 'so', country: 'Somalia', countryCode: 'SO', name: 'MFA Somalia', website: 'https://www.mfa.gov.so', travelAdvisoryUrl: 'https://www.mfa.gov.so', emergencyContact: '+252-1-242-085', languages: ['so', 'ar'], region: 'Africa' },
    { id: 'ss', country: 'South Sudan', countryCode: 'SS', name: 'MFA South Sudan', website: 'https://www.mofa.gov.ss', travelAdvisoryUrl: 'https://www.mofa.gov.ss', emergencyContact: '+211-911-222-555', languages: ['en', 'ar'], region: 'Africa' },
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
    return this.embassies.find(embassy => embassy.countryCode.toUpperCase() === countryCode.toUpperCase());
  }

  getRegions(): string[] {
    return [...new Set(this.embassies.map(e => e.region))];
  }

  getEmbassiesByRegion(region: string): Embassy[] {
    return this.embassies.filter(e => e.region === region);
  }

  // Get embassy sorted with passport country first, then current location country
  getEmbassiesSorted(passportCountryCode?: string | null, locationCountryCode?: string | null): Embassy[] {
    return [...this.embassies].sort((a, b) => {
      const pcc = passportCountryCode?.toUpperCase();
      const lcc = locationCountryCode?.toUpperCase();
      // Passport country always first
      if (pcc) {
        if (a.countryCode === pcc && b.countryCode !== pcc) return -1;
        if (b.countryCode === pcc && a.countryCode !== pcc) return 1;
      }
      // Current location second
      if (lcc && lcc !== pcc) {
        if (a.countryCode === lcc && b.countryCode !== lcc) return -1;
        if (b.countryCode === lcc && a.countryCode !== lcc) return 1;
      }
      return a.country.localeCompare(b.country);
    });
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
