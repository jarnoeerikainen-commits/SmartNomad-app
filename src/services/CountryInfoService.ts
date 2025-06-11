
import { CountryDetails } from '@/types/countryInfo';

export class CountryInfoService {
  private static countries: CountryDetails[] = [
    // North America
    {
      code: 'US',
      name: 'United States',
      flag: '🇺🇸',
      visaFreeStays: { tourist: 90, business: 90, transit: 30 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: 'USD',
      languages: ['English'],
      timeZones: ['EST', 'CST', 'MST', 'PST'],
      commonVisaTypes: ['B1/B2 Tourist', 'F-1 Student', 'H-1B Work', 'O-1 Talent'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 10, max: 37 }, corporate: 21 },
      officialWebsites: {
        government: 'https://www.usa.gov',
        visa: 'https://travel.state.gov/content/travel/en/us-visas.html',
        visaApplication: 'https://travel.state.gov',
        passport: 'https://travel.state.gov/content/travel/en/passports.html',
        passportApplication: 'https://travel.state.gov/content/travel/en/passports.html',
        tourism: 'https://www.visittheusa.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 5,
        maxStudyDays: 1825,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 20000, max: 70000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['English'],
        averageCostOfLiving: 3500,
        popularExpatAreas: ['New York', 'California', 'Florida'],
        residencyRequirementDays: 1095,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2000, medium: 3500, high: 5000 }
    },
    {
      code: 'CA',
      name: 'Canada',
      flag: '🇨🇦',
      visaFreeStays: { tourist: 180, business: 180, transit: 48 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: 'CAD',
      languages: ['English', 'French'],
      timeZones: ['EST', 'CST', 'MST', 'PST'],
      commonVisaTypes: ['Visitor Visa', 'Study Permit', 'Work Permit', 'Express Entry'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 15, max: 33 }, corporate: 15 },
      officialWebsites: {
        government: 'https://www.canada.ca',
        visa: 'https://www.cic.gc.ca/english/visit/visas.asp',
        visaApplication: 'https://www.cic.gc.ca',
        passport: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports.html',
        passportApplication: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports.html',
        tourism: 'https://www.destinationcanada.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English', 'French'],
        tuitionRange: { min: 15000, max: 45000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 200000,
        languageRequirements: ['English', 'French'],
        averageCostOfLiving: 2800,
        popularExpatAreas: ['Toronto', 'Vancouver', 'Montreal'],
        residencyRequirementDays: 1095,
        permanentResidencyDays: 1095,
        citizenshipRequirementDays: 1095
      },
      costOfLiving: { low: 1800, medium: 2800, high: 4000 }
    },
    {
      code: 'MX',
      name: 'Mexico',
      flag: '🇲🇽',
      visaFreeStays: { tourist: 180, business: 180, transit: 30 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '911', medical: '911', fire: '911' },
      currency: 'MXN',
      languages: ['Spanish'],
      timeZones: ['CST', 'MST', 'PST'],
      commonVisaTypes: ['Tourist Card', 'Student Visa', 'Work Visa', 'Temporary Resident'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 1.92, max: 35 }, corporate: 30 },
      officialWebsites: {
        government: 'https://www.gob.mx',
        visa: 'https://consulmex.sre.gob.mx/sanfrancisco/index.php/servicios-consulares/visas',
        visaApplication: 'https://consulmex.sre.gob.mx',
        passport: 'https://www.gob.mx/sre/acciones-y-programas/pasaporte-mexicano-requisitos',
        passportApplication: 'https://www.gob.mx/sre/acciones-y-programas/pasaporte-mexicano-requisitos',
        tourism: 'https://www.visitmexico.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 1,
        maxStudyDays: 365,
        workPermitWhileStudying: false,
        languageRequirements: ['Spanish'],
        tuitionRange: { min: 2000, max: 15000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 100000,
        languageRequirements: ['Spanish'],
        averageCostOfLiving: 1200,
        popularExpatAreas: ['Mexico City', 'Playa del Carmen', 'Puerto Vallarta'],
        residencyRequirementDays: 730,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 800, medium: 1200, high: 2000 }
    },

    // Europe - Schengen Countries
    {
      code: 'DE',
      name: 'Germany',
      flag: '🇩🇪',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '110', medical: '112', fire: '112' },
      currency: 'EUR',
      languages: ['German'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'EU Blue Card'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 14, max: 45 }, corporate: 30 },
      officialWebsites: {
        government: 'https://www.deutschland.de',
        visa: 'https://www.germany.travel/en/ms/german-visa/german-visa.html',
        visaApplication: 'https://www.germany.travel/en/ms/german-visa/german-visa.html',
        passport: 'https://www.bmi.bund.de/EN/topics/civil-protection/passport-and-personal-identity-documents/passport-and-personal-identity-documents-node.html',
        passportApplication: 'https://www.bmi.bund.de',
        tourism: 'https://www.germany.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['German', 'English'],
        tuitionRange: { min: 0, max: 20000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 250000,
        languageRequirements: ['German'],
        averageCostOfLiving: 2500,
        popularExpatAreas: ['Berlin', 'Munich', 'Frankfurt'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 2920
      },
      costOfLiving: { low: 1800, medium: 2500, high: 3500 }
    },
    {
      code: 'FR',
      name: 'France',
      flag: '🇫🇷',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '17', medical: '15', fire: '18' },
      currency: 'EUR',
      languages: ['French'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'Talent Passport'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 45 }, corporate: 25 },
      officialWebsites: {
        government: 'https://www.service-public.fr',
        visa: 'https://france-visas.gouv.fr/en',
        visaApplication: 'https://france-visas.gouv.fr',
        passport: 'https://www.diplomatie.gouv.fr/fr/services-aux-francais/passeport/',
        passportApplication: 'https://www.diplomatie.gouv.fr/fr/services-aux-francais/passeport/',
        tourism: 'https://www.france.fr'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['French'],
        tuitionRange: { min: 0, max: 15000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 300000,
        languageRequirements: ['French'],
        averageCostOfLiving: 2800,
        popularExpatAreas: ['Paris', 'Lyon', 'Nice'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2000, medium: 2800, high: 4000 }
    },
    {
      code: 'ES',
      name: 'Spain',
      flag: '🇪🇸',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '091', medical: '112', fire: '080' },
      currency: 'EUR',
      languages: ['Spanish', 'Catalan', 'Basque'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'Digital Nomad Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 19, max: 47 }, corporate: 25 },
      officialWebsites: {
        government: 'https://www.lamoncloa.gob.es',
        visa: 'https://www.exteriores.gob.es/Consulados/en/',
        visaApplication: 'https://www.exteriores.gob.es/Consulados/en/',
        passport: 'https://www.dnielectronico.es/PortalDNIe/',
        passportApplication: 'https://www.dnielectronico.es',
        tourism: 'https://www.spain.info'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Spanish'],
        tuitionRange: { min: 1000, max: 12000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['Spanish'],
        averageCostOfLiving: 2000,
        popularExpatAreas: ['Madrid', 'Barcelona', 'Valencia'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 3650
      },
      costOfLiving: { low: 1500, medium: 2000, high: 3000 }
    },
    {
      code: 'IT',
      name: 'Italy',
      flag: '🇮🇹',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '113', medical: '118', fire: '115' },
      currency: 'EUR',
      languages: ['Italian'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Visa', 'Self-Employment Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 23, max: 43 }, corporate: 24 },
      officialWebsites: {
        government: 'https://www.governo.it',
        visa: 'https://www.esteri.it/mae/en/servizi/stranieri/ingressosoggiornoinitalia/',
        visaApplication: 'https://www.esteri.it/mae/en/servizi/stranieri/ingressosoggiornoinitalia/',
        passport: 'https://www.poliziadistato.it/articolo/191',
        passportApplication: 'https://www.poliziadistato.it/articolo/191',
        tourism: 'https://www.italia.it'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Italian'],
        tuitionRange: { min: 1000, max: 4000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['Italian'],
        averageCostOfLiving: 2200,
        popularExpatAreas: ['Rome', 'Milan', 'Florence'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 3650
      },
      costOfLiving: { low: 1600, medium: 2200, high: 3200 }
    },
    {
      code: 'NL',
      name: 'Netherlands',
      flag: '🇳🇱',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '112', medical: '112', fire: '112' },
      currency: 'EUR',
      languages: ['Dutch', 'English'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Highly Skilled Migrant', 'EU Blue Card'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 37, max: 49.5 }, corporate: 25.8 },
      officialWebsites: {
        government: 'https://www.government.nl',
        visa: 'https://www.government.nl/topics/immigration-to-the-netherlands',
        visaApplication: 'https://www.government.nl/topics/immigration-to-the-netherlands',
        passport: 'https://www.government.nl/topics/identity-documents/dutch-passport',
        passportApplication: 'https://www.government.nl/topics/identity-documents/dutch-passport',
        tourism: 'https://www.holland.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Dutch', 'English'],
        tuitionRange: { min: 2000, max: 15000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 1250000,
        languageRequirements: ['Dutch'],
        averageCostOfLiving: 3000,
        popularExpatAreas: ['Amsterdam', 'Rotterdam', 'The Hague'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2200, medium: 3000, high: 4000 }
    },
    {
      code: 'CH',
      name: 'Switzerland',
      flag: '🇨🇭',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '117', medical: '144', fire: '118' },
      currency: 'CHF',
      languages: ['German', 'French', 'Italian', 'Romansh'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Student Visa', 'Work Permit', 'Investor Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 40 }, corporate: 18 },
      officialWebsites: {
        government: 'https://www.admin.ch',
        visa: 'https://www.sem.admin.ch/sem/en/home/themen/einreise.html',
        visaApplication: 'https://www.sem.admin.ch/sem/en/home/themen/einreise.html',
        passport: 'https://www.passeport.ch/en',
        passportApplication: 'https://www.passeport.ch',
        tourism: 'https://www.myswitzerland.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['German', 'French', 'Italian'],
        tuitionRange: { min: 1000, max: 3000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 1000000,
        languageRequirements: ['German', 'French', 'Italian'],
        averageCostOfLiving: 4500,
        popularExpatAreas: ['Zurich', 'Geneva', 'Basel'],
        residencyRequirementDays: 3650,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 3650
      },
      costOfLiving: { low: 3500, medium: 4500, high: 6000 }
    },

    // Europe - Non-Schengen
    {
      code: 'GB',
      name: 'United Kingdom',
      flag: '🇬🇧',
      visaFreeStays: { tourist: 180, business: 180, transit: 48 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '999', medical: '999', fire: '999' },
      currency: 'GBP',
      languages: ['English'],
      timeZones: ['GMT'],
      commonVisaTypes: ['Standard Visitor', 'Student Visa', 'Skilled Worker', 'Global Talent'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 20, max: 45 }, corporate: 25 },
      officialWebsites: {
        government: 'https://www.gov.uk',
        visa: 'https://www.gov.uk/apply-uk-visa',
        visaApplication: 'https://www.gov.uk/apply-uk-visa',
        passport: 'https://www.gov.uk/apply-renew-passport',
        passportApplication: 'https://www.gov.uk/apply-renew-passport',
        tourism: 'https://www.visitbritain.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 10000, max: 40000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 2000000,
        languageRequirements: ['English'],
        averageCostOfLiving: 3500,
        popularExpatAreas: ['London', 'Manchester', 'Edinburgh'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2500, medium: 3500, high: 5000 }
    },

    // Asia-Pacific
    {
      code: 'AU',
      name: 'Australia',
      flag: '🇦🇺',
      visaFreeStays: { tourist: 90, business: 90, transit: 8 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '000', medical: '000', fire: '000' },
      currency: 'AUD',
      languages: ['English'],
      timeZones: ['AEST', 'ACST', 'AWST'],
      commonVisaTypes: ['ETA', 'Student Visa', 'Skilled Visa', 'Working Holiday'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 45 }, corporate: 30 },
      officialWebsites: {
        government: 'https://www.australia.gov.au',
        visa: 'https://immi.homeaffairs.gov.au/visas',
        visaApplication: 'https://immi.homeaffairs.gov.au',
        passport: 'https://www.passports.gov.au',
        passportApplication: 'https://www.passports.gov.au',
        tourism: 'https://www.tourism.australia.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 5,
        maxStudyDays: 1825,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 20000, max: 45000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 1500000,
        languageRequirements: ['English'],
        averageCostOfLiving: 3200,
        popularExpatAreas: ['Sydney', 'Melbourne', 'Brisbane'],
        residencyRequirementDays: 1460,
        permanentResidencyDays: 1460,
        citizenshipRequirementDays: 1460
      },
      costOfLiving: { low: 2500, medium: 3200, high: 4500 }
    },
    {
      code: 'JP',
      name: 'Japan',
      flag: '🇯🇵',
      visaFreeStays: { tourist: 90, business: 90, transit: 15 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '110', medical: '119', fire: '119' },
      currency: 'JPY',
      languages: ['Japanese'],
      timeZones: ['JST'],
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Specialist Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 5, max: 45 }, corporate: 23.2 },
      officialWebsites: {
        government: 'https://www.japan.go.jp',
        visa: 'https://www.mofa.go.jp/j_info/visit/visa/',
        visaApplication: 'https://www.mofa.go.jp/j_info/visit/visa/',
        passport: 'https://www.mofa.go.jp/j_info/visit/passport/',
        passportApplication: 'https://www.mofa.go.jp/j_info/visit/passport/',
        tourism: 'https://www.jnto.go.jp'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Japanese'],
        tuitionRange: { min: 8000, max: 25000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 50000,
        languageRequirements: ['Japanese'],
        averageCostOfLiving: 2800,
        popularExpatAreas: ['Tokyo', 'Osaka', 'Kyoto'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 3650,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2000, medium: 2800, high: 4000 }
    },
    {
      code: 'SG',
      name: 'Singapore',
      flag: '🇸🇬',
      visaFreeStays: { tourist: 90, business: 90, transit: 96 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '999', medical: '995', fire: '995' },
      currency: 'SGD',
      languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
      timeZones: ['SGT'],
      commonVisaTypes: ['Tourist Visa', 'Student Pass', 'Work Permit', 'Tech.Pass'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 22 }, corporate: 17 },
      officialWebsites: {
        government: 'https://www.gov.sg',
        visa: 'https://www.ica.gov.sg/enter-depart/entry_requirements/visa_requirements',
        visaApplication: 'https://www.ica.gov.sg',
        passport: 'https://www.ica.gov.sg/enter-depart/entry_requirements/passport',
        passportApplication: 'https://www.ica.gov.sg/enter-depart/entry_requirements/passport',
        tourism: 'https://www.visitsingapore.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 15000, max: 40000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 2500000,
        languageRequirements: ['English'],
        averageCostOfLiving: 3500,
        popularExpatAreas: ['Central Business District', 'Orchard', 'Marina Bay'],
        residencyRequirementDays: 730,
        permanentResidencyDays: 730,
        citizenshipRequirementDays: 730
      },
      costOfLiving: { low: 2500, medium: 3500, high: 5000 }
    },

    // Additional countries with complete data structures...
    {
      code: 'TH',
      name: 'Thailand',
      flag: '🇹🇭',
      visaFreeStays: { tourist: 30, business: 30, transit: 12 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '191', medical: '1669', fire: '199' },
      currency: 'THB',
      languages: ['Thai'],
      timeZones: ['ICT'],
      commonVisaTypes: ['Tourist Visa', 'Education Visa', 'Work Permit', 'Smart Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 35 }, corporate: 20 },
      officialWebsites: {
        government: 'https://www.thaigov.go.th',
        visa: 'https://www.mfa.go.th/en/content/visa-information',
        visaApplication: 'https://www.mfa.go.th/en/content/visa-information',
        passport: 'https://www.mfa.go.th/en/content/passport',
        passportApplication: 'https://www.mfa.go.th/en/content/passport',
        tourism: 'https://www.tourismthailand.org'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 1,
        maxStudyDays: 365,
        workPermitWhileStudying: false,
        languageRequirements: ['Thai'],
        tuitionRange: { min: 2000, max: 15000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 60000,
        languageRequirements: ['Thai'],
        averageCostOfLiving: 1000,
        popularExpatAreas: ['Bangkok', 'Chiang Mai', 'Phuket'],
        residencyRequirementDays: 1095,
        permanentResidencyDays: 1095,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 600, medium: 1000, high: 1800 }
    },
    {
      code: 'BR',
      name: 'Brazil',
      flag: '🇧🇷',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '190', medical: '192', fire: '193' },
      currency: 'BRL',
      languages: ['Portuguese'],
      timeZones: ['BRT', 'AMT', 'ACST'],
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'Investment Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 27.5 }, corporate: 34 },
      officialWebsites: {
        government: 'https://www.gov.br',
        visa: 'https://www.gov.br/mre/pt-br/assuntos/portal-consular/vistos',
        visaApplication: 'https://www.gov.br/mre/pt-br/assuntos/portal-consular/vistos',
        passport: 'https://www.gov.br/pt-br/servicos/solicitar-passaporte-comum-para-brasileiro',
        passportApplication: 'https://www.gov.br/pt-br/servicos/solicitar-passaporte-comum-para-brasileiro',
        tourism: 'https://www.visitbrasil.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 1,
        maxStudyDays: 365,
        workPermitWhileStudying: true,
        languageRequirements: ['Portuguese'],
        tuitionRange: { min: 1000, max: 8000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 150000,
        languageRequirements: ['Portuguese'],
        averageCostOfLiving: 1200,
        popularExpatAreas: ['São Paulo', 'Rio de Janeiro', 'Florianópolis'],
        residencyRequirementDays: 1460,
        permanentResidencyDays: 1460,
        citizenshipRequirementDays: 1460
      },
      costOfLiving: { low: 800, medium: 1200, high: 2000 }
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
      currency: { code: country.currency, symbol: this.getCurrencySymbol(country.currency) },
      emergencyNumbers: country.emergencyNumbers,
      healthInsuranceRequired: country.healthInsuranceRequired,
      commonVisaTypes: country.commonVisaTypes
    };
  }

  private static getCurrencySymbol(currencyCode: string): string {
    const symbols: { [key: string]: string } = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CAD': 'C$', 
      'AUD': 'A$', 'CHF': 'Fr.', 'SGD': 'S$', 'THB': '฿', 'BRL': 'R$',
      'MXN': '$', 'CNY': '¥', 'INR': '₹', 'KRW': '₩', 'HKD': 'HK$',
      'NZD': 'NZ$', 'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr', 'PLN': 'zł',
      'CZK': 'Kč', 'HUF': 'Ft', 'TRY': '₺', 'RUB': '₽', 'ZAR': 'R',
      'AED': 'د.إ', 'SAR': 'ر.س', 'QAR': 'ر.ق', 'ILS': '₪'
    };
    return symbols[currencyCode] || currencyCode;
  }
}

export default CountryInfoService;
