
import { CountryDetails } from '@/types/countryInfo';

export class CountryInfoService {
  private static countries: CountryDetails[] = [
    // North America
    {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1825, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: { code: 'USD', symbol: '$' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['B1/B2 Tourist', 'F-1 Student', 'H-1B Work', 'O-1 Talent'],
      officialWebsites: {
        government: 'https://www.usa.gov',
        visaApplication: 'https://travel.state.gov',
        passportApplication: 'https://travel.state.gov/content/travel/en/passports.html',
        tourism: 'https://www.visittheusa.com'
      }
    },
    {
      code: 'CA',
      name: 'Canada',
      flag: '🇨🇦',
      visaFreeStays: { tourist: 180, business: 180 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 1095, citizenshipRequirementDays: 1095 },
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: { code: 'CAD', symbol: 'C$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Visitor Visa', 'Study Permit', 'Work Permit', 'Express Entry'],
      officialWebsites: {
        government: 'https://www.canada.ca',
        visaApplication: 'https://www.cic.gc.ca',
        passportApplication: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports.html',
        tourism: 'https://www.destinationcanada.com'
      }
    },
    {
      code: 'MX',
      name: 'Mexico',
      flag: '🇲🇽',
      visaFreeStays: { tourist: 180, business: 180 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 730, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: { code: 'MXN', symbol: '$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Card', 'Student Visa', 'Work Visa', 'Temporary Resident'],
      officialWebsites: {
        government: 'https://www.gob.mx',
        visaApplication: 'https://consulmex.sre.gob.mx',
        passportApplication: 'https://www.gob.mx/sre/acciones-y-programas/pasaporte-mexicano-requisitos',
        tourism: 'https://www.visitmexico.com'
      }
    },

    // Europe - Schengen Countries
    {
      code: 'DE',
      name: 'Germany',
      flag: '🇩🇪',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 2920 },
      emergencyNumbers: { police: '110', medical: '112', fire: '112' },
      currency: { code: 'EUR', symbol: '€' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'EU Blue Card'],
      officialWebsites: {
        government: 'https://www.deutschland.de',
        visaApplication: 'https://www.germany.travel/en/ms/german-visa/german-visa.html',
        passportApplication: 'https://www.bmi.bund.de',
        tourism: 'https://www.germany.travel'
      }
    },
    {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '17', medical: '15', fire: '18' },
      currency: { code: 'EUR', symbol: '€' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'Talent Passport'],
      officialWebsites: {
        government: 'https://www.service-public.fr',
        visaApplication: 'https://france-visas.gouv.fr',
        passportApplication: 'https://www.diplomatie.gouv.fr/fr/services-aux-francais/passeport/',
        tourism: 'https://www.france.fr'
      }
    },
    {
      code: 'ES',
      name: 'Spain',
      flag: '🇪🇸',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 3650 },
      emergencyNumbers: { police: '091', medical: '112', fire: '080' },
      currency: { code: 'EUR', symbol: '€' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'Digital Nomad Visa'],
      officialWebsites: {
        government: 'https://www.lamoncloa.gob.es',
        visaApplication: 'https://www.exteriores.gob.es/Consulados/en/',
        passportApplication: 'https://www.dnielectronico.es',
        tourism: 'https://www.spain.info'
      }
    },
    {
      code: 'IT',
      name: 'Italy',
      flag: '🇮🇹',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 3650 },
      emergencyNumbers: { police: '113', medical: '118', fire: '115' },
      currency: { code: 'EUR', symbol: '€' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'Self-Employment Visa'],
      officialWebsites: {
        government: 'https://www.governo.it',
        visaApplication: 'https://www.esteri.it/mae/en/servizi/stranieri/ingressosoggiornoinitalia/',
        passportApplication: 'https://www.poliziadistato.it/articolo/191',
        tourism: 'https://www.italia.it'
      }
    },
    {
      code: 'NL',
      name: 'Netherlands',
      flag: '🇳🇱',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '112', medical: '112', fire: '112' },
      currency: { code: 'EUR', symbol: '€' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Highly Skilled Migrant', 'EU Blue Card'],
      officialWebsites: {
        government: 'https://www.government.nl',
        visaApplication: 'https://www.government.nl/topics/immigration-to-the-netherlands',
        passportApplication: 'https://www.government.nl/topics/identity-documents/dutch-passport',
        tourism: 'https://www.holland.com'
      }
    },
    {
      code: 'CH',
      name: 'Switzerland',
      flag: '🇨🇭',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 3650, permanentResidencyDays: 1825, citizenshipRequirementDays: 3650 },
      emergencyNumbers: { police: '117', medical: '144', fire: '118' },
      currency: { code: 'CHF', symbol: 'Fr.' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Permit', 'Investor Visa'],
      officialWebsites: {
        government: 'https://www.admin.ch',
        visaApplication: 'https://www.sem.admin.ch/sem/en/home/themen/einreise.html',
        passportApplication: 'https://www.passeport.ch',
        tourism: 'https://www.myswitzerland.com'
      }
    },
    {
      code: 'AT',
      name: 'Austria',
      flag: '🇦🇹',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 3650 },
      emergencyNumbers: { police: '133', medical: '144', fire: '122' },
      currency: { code: 'EUR', symbol: '€' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Red-White-Red Card', 'EU Blue Card'],
      officialWebsites: {
        government: 'https://www.oesterreich.gv.at',
        visaApplication: 'https://www.bmeia.gv.at/en/travel-stay/entry-and-residence-in-austria/',
        passportApplication: 'https://www.oesterreich.gv.at/themen/dokumente_und_recht/pass_und_personalausweis.html',
        tourism: 'https://www.austria.info'
      }
    },
    {
      code: 'BE',
      name: 'Belgium',
      flag: '🇧🇪',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '101', medical: '112', fire: '112' },
      currency: { code: 'EUR', symbol: '€' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Permit', 'EU Blue Card'],
      officialWebsites: {
        government: 'https://www.belgium.be',
        visaApplication: 'https://dofi.ibz.be/sites/dvzoe/EN/Pages/home.aspx',
        passportApplication: 'https://www.ibz.rrn.fgov.be/en/identity-documents/belgian-passport/',
        tourism: 'https://www.visitbelgium.com'
      }
    },
    {
      code: 'PT',
      name: 'Portugal',
      flag: '🇵🇹',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '112', medical: '112', fire: '112' },
      currency: { code: 'EUR', symbol: '€' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'D7 Visa', 'Golden Visa'],
      officialWebsites: {
        government: 'https://www.portugal.gov.pt',
        visaApplication: 'https://www.vistos.mne.pt/en/',
        passportApplication: 'https://www.consuladoportugalsp.org.br/passaporte-portugues/',
        tourism: 'https://www.visitportugal.com'
      }
    },
    {
      code: 'DK',
      name: 'Denmark',
      flag: '🇩🇰',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 2555, permanentResidencyDays: 1460, citizenshipRequirementDays: 2920 },
      emergencyNumbers: { police: '112', medical: '112', fire: '112' },
      currency: { code: 'DKK', symbol: 'kr' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Permit', 'Green Card'],
      officialWebsites: {
        government: 'https://www.denmark.dk',
        visaApplication: 'https://www.nyidanmark.dk/en-GB',
        passportApplication: 'https://www.borger.dk/Sider/Pas.aspx',
        tourism: 'https://www.visitdenmark.com'
      }
    },
    {
      code: 'SE',
      name: 'Sweden',
      flag: '🇸🇪',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1460, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '112', medical: '112', fire: '112' },
      currency: { code: 'SEK', symbol: 'kr' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Permit', 'Residence Permit'],
      officialWebsites: {
        government: 'https://www.government.se',
        visaApplication: 'https://www.migrationsverket.se/English.html',
        passportApplication: 'https://polisen.se/en/services/passport-and-national-id-card/',
        tourism: 'https://visitsweden.com'
      }
    },
    {
      code: 'NO',
      name: 'Norway',
      flag: '🇳🇴',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 2555, permanentResidencyDays: 1095, citizenshipRequirementDays: 2555 },
      emergencyNumbers: { police: '112', medical: '113', fire: '110' },
      currency: { code: 'NOK', symbol: 'kr' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Permit', 'Skilled Worker'],
      officialWebsites: {
        government: 'https://www.regjeringen.no',
        visaApplication: 'https://www.udi.no/en/',
        passportApplication: 'https://www.politiet.no/en/services/passport/',
        tourism: 'https://www.visitnorway.com'
      }
    },

    // Europe - Non-Schengen
    {
      code: 'GB',
      name: 'United Kingdom',
      flag: '🇬🇧',
      visaFreeStays: { tourist: 180, business: 180 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '999', medical: '999', fire: '999' },
      currency: { code: 'GBP', symbol: '£' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Standard Visitor', 'Student Visa', 'Skilled Worker', 'Global Talent'],
      officialWebsites: {
        government: 'https://www.gov.uk',
        visaApplication: 'https://www.gov.uk/apply-uk-visa',
        passportApplication: 'https://www.gov.uk/apply-renew-passport',
        tourism: 'https://www.visitbritain.com'
      }
    },

    // Asia-Pacific
    {
      code: 'AU',
      name: 'Australia',
      flag: '🇦🇺',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1825, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1460, permanentResidencyDays: 1460, citizenshipRequirementDays: 1460 },
      emergencyNumbers: { police: '000', medical: '000', fire: '000' },
      currency: { code: 'AUD', symbol: 'A$' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['ETA', 'Student Visa', 'Skilled Visa', 'Working Holiday'],
      officialWebsites: {
        government: 'https://www.australia.gov.au',
        visaApplication: 'https://immi.homeaffairs.gov.au',
        passportApplication: 'https://www.passports.gov.au',
        tourism: 'https://www.tourism.australia.com'
      }
    },
    {
      code: 'NZ',
      name: 'New Zealand',
      flag: '🇳🇿',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 730, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '111', medical: '111', fire: '111' },
      currency: { code: 'NZD', symbol: 'NZ$' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Visitor Visa', 'Student Visa', 'Work Visa', 'Skilled Migrant'],
      officialWebsites: {
        government: 'https://www.govt.nz',
        visaApplication: 'https://www.immigration.govt.nz',
        passportApplication: 'https://www.passports.govt.nz',
        tourism: 'https://www.newzealand.com'
      }
    },
    {
      code: 'JP',
      name: 'Japan',
      flag: '🇯🇵',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 3650, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '110', medical: '119', fire: '119' },
      currency: { code: 'JPY', symbol: '¥' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Specialist Visa'],
      officialWebsites: {
        government: 'https://www.japan.go.jp',
        visaApplication: 'https://www.mofa.go.jp/j_info/visit/visa/',
        passportApplication: 'https://www.mofa.go.jp/j_info/visit/passport/',
        tourism: 'https://www.jnto.go.jp'
      }
    },
    {
      code: 'KR',
      name: 'South Korea',
      flag: '🇰🇷',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '112', medical: '119', fire: '119' },
      currency: { code: 'KRW', symbol: '₩' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['K-ETA', 'Student Visa', 'Work Visa', 'D-8 Investor'],
      officialWebsites: {
        government: 'https://www.korea.go.kr',
        visaApplication: 'https://www.visa.go.kr',
        passportApplication: 'https://www.passport.go.kr',
        tourism: 'https://english.visitkorea.or.kr'
      }
    },
    {
      code: 'SG',
      name: 'Singapore',
      flag: '🇸🇬',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 730, permanentResidencyDays: 730, citizenshipRequirementDays: 730 },
      emergencyNumbers: { police: '999', medical: '995', fire: '995' },
      currency: { code: 'SGD', symbol: 'S$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Pass', 'Work Permit', 'Tech.Pass'],
      officialWebsites: {
        government: 'https://www.gov.sg',
        visaApplication: 'https://www.ica.gov.sg',
        passportApplication: 'https://www.ica.gov.sg/enter-depart/entry_requirements/passport',
        tourism: 'https://www.visitsingapore.com'
      }
    },
    {
      code: 'HK',
      name: 'Hong Kong',
      flag: '🇭🇰',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 2555, permanentResidencyDays: 2555, citizenshipRequirementDays: 2555 },
      emergencyNumbers: { police: '999', medical: '999', fire: '999' },
      currency: { code: 'HKD', symbol: 'HK$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Visitor Visa', 'Student Visa', 'Work Visa', 'Investment Visa'],
      officialWebsites: {
        government: 'https://www.gov.hk',
        visaApplication: 'https://www.immd.gov.hk',
        passportApplication: 'https://www.immd.gov.hk/eng/services/travel_document.html',
        tourism: 'https://www.discoverhongkong.com'
      }
    },
    {
      code: 'TH',
      name: 'Thailand',
      flag: '🇹🇭',
      visaFreeStays: { tourist: 30, business: 30 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 1095, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '191', medical: '1669', fire: '199' },
      currency: { code: 'THB', symbol: '฿' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Education Visa', 'Work Permit', 'Smart Visa'],
      officialWebsites: {
        government: 'https://www.thaigov.go.th',
        visaApplication: 'https://www.mfa.go.th/en/content/visa-information',
        passportApplication: 'https://www.mfa.go.th/en/content/passport',
        tourism: 'https://www.tourismthailand.org'
      }
    },
    {
      code: 'MY',
      name: 'Malaysia',
      flag: '🇲🇾',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 3650, citizenshipRequirementDays: 3650 },
      emergencyNumbers: { police: '999', medical: '999', fire: '994' },
      currency: { code: 'MYR', symbol: 'RM' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Pass', 'Work Permit', 'MM2H'],
      officialWebsites: {
        government: 'https://www.malaysia.gov.my',
        visaApplication: 'https://www.imi.gov.my',
        passportApplication: 'https://www.imi.gov.my/portal2017/index.php/en/main-services/passport/',
        tourism: 'https://www.tourism.gov.my'
      }
    },
    {
      code: 'ID',
      name: 'Indonesia',
      flag: '🇮🇩',
      visaFreeStays: { tourist: 30, business: 30 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '110', medical: '118', fire: '113' },
      currency: { code: 'IDR', symbol: 'Rp' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Visit Visa', 'Student Visa', 'Work Permit', 'Investor Visa'],
      officialWebsites: {
        government: 'https://www.indonesia.go.id',
        visaApplication: 'https://www.imigrasi.go.id',
        passportApplication: 'https://www.imigrasi.go.id/en/passport-services/',
        tourism: 'https://www.indonesia.travel'
      }
    },
    {
      code: 'PH',
      name: 'Philippines',
      flag: '🇵🇭',
      visaFreeStays: { tourist: 30, business: 30 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 3650 },
      emergencyNumbers: { police: '117', medical: '911', fire: '116' },
      currency: { code: 'PHP', symbol: '₱' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'SRRV'],
      officialWebsites: {
        government: 'https://www.gov.ph',
        visaApplication: 'https://www.immigration.gov.ph',
        passportApplication: 'https://www.dfa.gov.ph/passport',
        tourism: 'https://www.itsmorefuninthephilippines.com'
      }
    },
    {
      code: 'VN',
      name: 'Vietnam',
      flag: '🇻🇳',
      visaFreeStays: { tourist: 15, business: 15 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '113', medical: '115', fire: '114' },
      currency: { code: 'VND', symbol: '₫' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Permit', 'Investment Visa'],
      officialWebsites: {
        government: 'https://www.gov.vn',
        visaApplication: 'https://immigration.gov.vn',
        passportApplication: 'https://dichvucong.bocongan.gov.vn',
        tourism: 'https://vietnam.travel'
      }
    },
    {
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      visaFreeStays: { tourist: 60, business: 60 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1825, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 2555, permanentResidencyDays: 1825, citizenshipRequirementDays: 4380 },
      emergencyNumbers: { police: '100', medical: '102', fire: '101' },
      currency: { code: 'INR', symbol: '₹' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['e-Tourist Visa', 'Student Visa', 'Employment Visa', 'Business Visa'],
      officialWebsites: {
        government: 'https://www.india.gov.in',
        visaApplication: 'https://indianvisaonline.gov.in',
        passportApplication: 'https://www.passportindia.gov.in',
        tourism: 'https://www.incredibleindia.org'
      }
    },
    {
      code: 'CN',
      name: 'China',
      flag: '🇨🇳',
      visaFreeStays: { tourist: 15, business: 15 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 1460, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '110', medical: '120', fire: '119' },
      currency: { code: 'CNY', symbol: '¥' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Business Visa'],
      officialWebsites: {
        government: 'https://www.gov.cn',
        visaApplication: 'https://www.fmprc.gov.cn/mfa_eng/consular_6769/',
        passportApplication: 'https://www.fmprc.gov.cn/mfa_eng/consular_6769/zj/',
        tourism: 'https://www.cnta.gov.cn'
      }
    },

    // Middle East & Africa
    {
      code: 'AE',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 1825, citizenshipRequirementDays: 10950 },
      emergencyNumbers: { police: '999', medical: '998', fire: '997' },
      currency: { code: 'AED', symbol: 'د.إ' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Golden Visa'],
      officialWebsites: {
        government: 'https://u.ae',
        visaApplication: 'https://www.ica.gov.ae',
        passportApplication: 'https://www.ica.gov.ae/en/services/passports-and-id',
        tourism: 'https://www.visitdubai.com'
      }
    },
    {
      code: 'QA',
      name: 'Qatar',
      flag: '🇶🇦',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 1825, citizenshipRequirementDays: 9125 },
      emergencyNumbers: { police: '999', medical: '999', fire: '999' },
      currency: { code: 'QAR', symbol: 'ر.ق' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Investor Visa'],
      officialWebsites: {
        government: 'https://www.gov.qa',
        visaApplication: 'https://portal.moi.gov.qa/qicp/',
        passportApplication: 'https://www.moi.gov.qa/site/english/departments/passports/',
        tourism: 'https://www.visitqatar.qa'
      }
    },
    {
      code: 'SA',
      name: 'Saudi Arabia',
      flag: '🇸🇦',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 3650 },
      emergencyNumbers: { police: '999', medical: '997', fire: '998' },
      currency: { code: 'SAR', symbol: 'ر.س' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Premium Residency'],
      officialWebsites: {
        government: 'https://www.my.gov.sa',
        visaApplication: 'https://visa.visitsaudi.com',
        passportApplication: 'https://www.my.gov.sa/wps/portal/snp/pages/passports',
        tourism: 'https://www.visitsaudi.com'
      }
    },
    {
      code: 'IL',
      name: 'Israel',
      flag: '🇮🇱',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 1095, citizenshipRequirementDays: 1095 },
      emergencyNumbers: { police: '100', medical: '101', fire: '102' },
      currency: { code: 'ILS', symbol: '₪' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'A1 Visa'],
      officialWebsites: {
        government: 'https://www.gov.il',
        visaApplication: 'https://www.gov.il/en/departments/ministry_of_interior',
        passportApplication: 'https://www.gov.il/en/service/passport_application',
        tourism: 'https://www.goisrael.com'
      }
    },
    {
      code: 'ZA',
      name: 'South Africa',
      flag: '🇿🇦',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '10111', medical: '10177', fire: '10177' },
      currency: { code: 'ZAR', symbol: 'R' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Visitor Visa', 'Study Visa', 'Work Visa', 'Critical Skills'],
      officialWebsites: {
        government: 'https://www.gov.za',
        visaApplication: 'http://www.dha.gov.za/index.php/immigration-services',
        passportApplication: 'http://www.dha.gov.za/index.php/civic-services/passport-and-travel-document',
        tourism: 'https://www.southafrica.net'
      }
    },

    // Latin America
    {
      code: 'BR',
      name: 'Brazil',
      flag: '🇧🇷',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1460, permanentResidencyDays: 1460, citizenshipRequirementDays: 1460 },
      emergencyNumbers: { police: '190', medical: '192', fire: '193' },
      currency: { code: 'BRL', symbol: 'R$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Investment Visa'],
      officialWebsites: {
        government: 'https://www.gov.br',
        visaApplication: 'https://www.gov.br/mre/pt-br/assuntos/portal-consular/vistos',
        passportApplication: 'https://www.gov.br/pt-br/servicos/solicitar-passaporte-comum-para-brasileiro',
        tourism: 'https://www.visitbrasil.com'
      }
    },
    {
      code: 'AR',
      name: 'Argentina',
      flag: '🇦🇷',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 730, permanentResidencyDays: 730, citizenshipRequirementDays: 730 },
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: { code: 'ARS', symbol: '$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Rentista Visa'],
      officialWebsites: {
        government: 'https://www.argentina.gob.ar',
        visaApplication: 'https://www.cancilleria.gob.ar/en/services/visas',
        passportApplication: 'https://www.argentina.gob.ar/interior/renaper/pasaporte',
        tourism: 'https://www.argentina.travel'
      }
    },
    {
      code: 'CL',
      name: 'Chile',
      flag: '🇨🇱',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '133', medical: '131', fire: '132' },
      currency: { code: 'CLP', symbol: '$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Tech Visa'],
      officialWebsites: {
        government: 'https://www.gob.cl',
        visaApplication: 'https://www.extranjeria.gob.cl',
        passportApplication: 'https://www.registrocivil.cl/principal/menu-superior/tramites-en-linea/pasaporte',
        tourism: 'https://www.chile.travel'
      }
    },
    {
      code: 'CO',
      name: 'Colombia',
      flag: '🇨🇴',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '123', medical: '123', fire: '119' },
      currency: { code: 'COP', symbol: '$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Migrant Visa'],
      officialWebsites: {
        government: 'https://www.gov.co',
        visaApplication: 'https://www.cancilleria.gov.co/en/procedures_services/visas',
        passportApplication: 'https://www.cancilleria.gov.co/en/procedures_services/passport',
        tourism: 'https://colombia.travel'
      }
    },
    {
      code: 'PE',
      name: 'Peru',
      flag: '🇵🇪',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 730, permanentResidencyDays: 730, citizenshipRequirementDays: 730 },
      emergencyNumbers: { police: '105', medical: '106', fire: '116' },
      currency: { code: 'PEN', symbol: 'S/' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Business Visa'],
      officialWebsites: {
        government: 'https://www.gob.pe',
        visaApplication: 'https://www.rree.gob.pe/SitePages/visas.aspx',
        passportApplication: 'https://www.gob.pe/269-obtener-pasaporte-electronico-peruano',
        tourism: 'https://www.peru.travel'
      }
    },
    {
      code: 'UY',
      name: 'Uruguay',
      flag: '🇺🇾',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 1095, citizenshipRequirementDays: 1095 },
      emergencyNumbers: { police: '109', medical: '105', fire: '104' },
      currency: { code: 'UYU', symbol: '$U' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Resident Visa'],
      officialWebsites: {
        government: 'https://www.gub.uy',
        visaApplication: 'https://www.gub.uy/ministerio-relaciones-exteriores/tramites-y-servicios/tramites/visas-ingresar-uruguay',
        passportApplication: 'https://www.gub.uy/tramites/pasaporte-comun',
        tourism: 'https://uruguaynatural.com'
      }
    },
    {
      code: 'EC',
      name: 'Ecuador',
      flag: '🇪🇨',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 730, permanentResidencyDays: 730, citizenshipRequirementDays: 1095 },
      emergencyNumbers: { police: '101', medical: '911', fire: '911' },
      currency: { code: 'USD', symbol: '$' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Pensioner Visa'],
      officialWebsites: {
        government: 'https://www.gob.ec',
        visaApplication: 'https://www.cancilleria.gob.ec/servicios-consulares/',
        passportApplication: 'https://www.registrocivil.gob.ec/pasaporte/',
        tourism: 'https://www.ecuador.travel'
      }
    },
    {
      code: 'PA',
      name: 'Panama',
      flag: '🇵🇦',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: { code: 'PAB', symbol: 'B/.' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Friendly Nations'],
      officialWebsites: {
        government: 'https://www.gob.pa',
        visaApplication: 'https://www.migracion.gob.pa',
        passportApplication: 'https://www.tribunalelectoral.gob.pa/cedula-y-pasaporte/',
        tourism: 'https://www.visitpanama.com'
      }
    },
    {
      code: 'CR',
      name: 'Costa Rica',
      flag: '🇨🇷',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1095, permanentResidencyDays: 1095, citizenshipRequirementDays: 2555 },
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: { code: 'CRC', symbol: '₡' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Pensioner Visa'],
      officialWebsites: {
        government: 'https://www.gob.go.cr',
        visaApplication: 'https://www.migracion.go.cr',
        passportApplication: 'https://www.tse.go.cr/pasaporte.htm',
        tourism: 'https://www.visitcostarica.com'
      }
    },

    // Additional Important Countries
    {
      code: 'TR',
      name: 'Turkey',
      flag: '🇹🇷',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: true },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '155', medical: '112', fire: '110' },
      currency: { code: 'TRY', symbol: '₺' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Permit', 'Turquoise Card'],
      officialWebsites: {
        government: 'https://www.turkiye.gov.tr',
        visaApplication: 'https://www.evisa.gov.tr',
        passportApplication: 'https://www.nvi.gov.tr/pasaport',
        tourism: 'https://www.goturkiye.com'
      }
    },
    {
      code: 'RU',
      name: 'Russia',
      flag: '🇷🇺',
      visaFreeStays: { tourist: 30, business: 30 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '102', medical: '103', fire: '101' },
      currency: { code: 'RUB', symbol: '₽' },
      healthInsuranceRequired: true,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Business Visa'],
      officialWebsites: {
        government: 'https://www.government.ru',
        visaApplication: 'https://visa.kdmid.ru',
        passportApplication: 'https://www.gosuslugi.ru/category/passport',
        tourism: 'https://www.russia.travel'
      }
    },
    {
      code: 'EG',
      name: 'Egypt',
      flag: '🇪🇬',
      visaFreeStays: { tourist: 30, business: 30 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 3650 },
      emergencyNumbers: { police: '122', medical: '123', fire: '180' },
      currency: { code: 'EGP', symbol: 'E£' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Investment Visa'],
      officialWebsites: {
        government: 'https://www.egypt.gov.eg',
        visaApplication: 'https://www.visa2egypt.gov.eg',
        passportApplication: 'https://www.moi.gov.eg/Passport/',
        tourism: 'https://www.experienceegypt.eg'
      }
    },
    {
      code: 'MA',
      name: 'Morocco',
      flag: '🇲🇦',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '19', medical: '15', fire: '15' },
      currency: { code: 'MAD', symbol: 'DH' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Investment Visa'],
      officialWebsites: {
        government: 'https://www.maroc.ma',
        visaApplication: 'https://www.consulat.ma',
        passportApplication: 'https://www.passeport.ma',
        tourism: 'https://www.visitmorocco.com'
      }
    },
    {
      code: 'KE',
      name: 'Kenya',
      flag: '🇰🇪',
      visaFreeStays: { tourist: 90, business: 90 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 2555, permanentResidencyDays: 2555, citizenshipRequirementDays: 2555 },
      emergencyNumbers: { police: '999', medical: '999', fire: '999' },
      currency: { code: 'KES', symbol: 'KSh' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Permit', 'Investment Visa'],
      officialWebsites: {
        government: 'https://www.president.go.ke',
        visaApplication: 'https://www.ecitizen.go.ke',
        passportApplication: 'https://www.immigration.go.ke/passport-services/',
        tourism: 'https://www.magicalkenya.com'
      }
    },
    {
      code: 'GH',
      name: 'Ghana',
      flag: '🇬🇭',
      visaFreeStays: { tourist: 30, business: 30 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 1825, permanentResidencyDays: 1825, citizenshipRequirementDays: 1825 },
      emergencyNumbers: { police: '191', medical: '193', fire: '192' },
      currency: { code: 'GHS', symbol: '₵' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Permit', 'Investment Visa'],
      officialWebsites: {
        government: 'https://www.ghana.gov.gh',
        visaApplication: 'https://visa.gia.gov.gh',
        passportApplication: 'https://www.passport.gov.gh',
        tourism: 'https://www.visitghana.com'
      }
    },
    {
      code: 'NG',
      name: 'Nigeria',
      flag: '🇳🇬',
      visaFreeStays: { tourist: 30, business: 30 },
      taxResidencyDays: 183,
      studentInfo: { maxStudyDays: 365, workRightsWhileStudying: false },
      expatInfo: { residencyRequirementDays: 5475, permanentResidencyDays: 5475, citizenshipRequirementDays: 5475 },
      emergencyNumbers: { police: '199', medical: '199', fire: '199' },
      currency: { code: 'NGN', symbol: '₦' },
      healthInsuranceRequired: false,
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Permit', 'Investment Visa'],
      officialWebsites: {
        government: 'https://www.nigeria.gov.ng',
        visaApplication: 'https://portal.immigration.gov.ng',
        passportApplication: 'https://www.nigeriaimmigration.gov.ng/passport/',
        tourism: 'https://www.tourismguide.ng'
      }
    }
  ];

  static getAllCountries(): CountryDetails[] {
    return this.countries;
  }

  static getCountryDetails(countryCode: string): CountryDetails | null {
    return this.countries.find(country => country.code === countryCode) || null;
  }

  static getVisaFreeStays(countryCode: string, visaType: string): number {
    const country = this.getCountryDetails(countryCode);
    if (!country) return 90;

    switch (visaType) {
      case 'Tourist visa limit':
        return country.visaFreeStays.tourist;
      case 'Business travel limit':
        return country.visaFreeStays.business;
      case 'Tax residence tracking':
        return country.taxResidencyDays || 183;
      case 'Schengen area limit':
        return 90;
      case 'Student visa limit':
        return country.studentInfo?.maxStudyDays || 365;
      default:
        return country.visaFreeStays.tourist;
    }
  }

  static getRecommendedInfo(countryCode: string, reason: string) {
    const country = this.getCountryDetails(countryCode);
    if (!country) return null;

    const dayLimit = this.getVisaFreeStays(countryCode, reason);

    return {
      dayLimit,
      currency: country.currency,
      emergencyNumbers: country.emergencyNumbers,
      healthInsuranceRequired: country.healthInsuranceRequired,
      commonVisaTypes: country.commonVisaTypes
    };
  }
}

export default CountryInfoService;
