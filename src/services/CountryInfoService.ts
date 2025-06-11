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
    },

    // More countries for comprehensive coverage...
    {
      code: 'PT',
      name: 'Portugal',
      flag: '🇵🇹',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '112', medical: '112', fire: '112' },
      currency: 'EUR',
      languages: ['Portuguese'],
      timeZones: ['WET'],
      commonVisaTypes: ['Schengen Visa', 'D7 Visa', 'Golden Visa', 'Tech Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 14.5, max: 48 }, corporate: 21 },
      officialWebsites: {
        government: 'https://www.portaldocidadao.pt',
        visa: 'https://www.vistos.mne.pt/en',
        visaApplication: 'https://www.vistos.mne.pt',
        passport: 'https://www.irn.mj.pt/sections/irn/a_registral/registo-civil/servicos-de/',
        passportApplication: 'https://www.irn.mj.pt',
        tourism: 'https://www.visitportugal.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Portuguese'],
        tuitionRange: { min: 1000, max: 7000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 280000,
        languageRequirements: ['Portuguese'],
        averageCostOfLiving: 1800,
        popularExpatAreas: ['Lisbon', 'Porto', 'Algarve'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 1200, medium: 1800, high: 2800 }
    },
    {
      code: 'AT',
      name: 'Austria',
      flag: '🇦🇹',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '133', medical: '144', fire: '122' },
      currency: 'EUR',
      languages: ['German'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Red-White-Red Card', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 55 }, corporate: 25 },
      officialWebsites: {
        government: 'https://www.oesterreich.gv.at',
        visa: 'https://www.bmeia.gv.at/en/travel-stay/entry-and-residence-in-austria/',
        visaApplication: 'https://www.bmeia.gv.at',
        passport: 'https://www.oesterreich.gv.at/themen/dokumente_und_recht/pass.html',
        passportApplication: 'https://www.oesterreich.gv.at',
        tourism: 'https://www.austria.info'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['German'],
        tuitionRange: { min: 0, max: 1500 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 400000,
        languageRequirements: ['German'],
        averageCostOfLiving: 2600,
        popularExpatAreas: ['Vienna', 'Salzburg', 'Innsbruck'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 3650
      },
      costOfLiving: { low: 1800, medium: 2600, high: 3600 }
    },
    {
      code: 'BE',
      name: 'Belgium',
      flag: '🇧🇪',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '101', medical: '112', fire: '112' },
      currency: 'EUR',
      languages: ['Dutch', 'French', 'German'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'EU Blue Card', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 25, max: 50 }, corporate: 25 },
      officialWebsites: {
        government: 'https://www.belgium.be',
        visa: 'https://dofi.ibz.be/sites/dvzoe/EN/Pages/default.aspx',
        visaApplication: 'https://dofi.ibz.be',
        passport: 'https://www.belgium.be/en/family/identity_documents/passport',
        passportApplication: 'https://www.belgium.be',
        tourism: 'https://www.visitbelgium.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Dutch', 'French'],
        tuitionRange: { min: 1000, max: 4000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['Dutch', 'French'],
        averageCostOfLiving: 2400,
        popularExpatAreas: ['Brussels', 'Antwerp', 'Ghent'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 1800, medium: 2400, high: 3200 }
    },
    {
      code: 'SE',
      name: 'Sweden',
      flag: '🇸🇪',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '112', medical: '112', fire: '112' },
      currency: 'SEK',
      languages: ['Swedish'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Work Permit', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 57 }, corporate: 20.6 },
      officialWebsites: {
        government: 'https://www.government.se',
        visa: 'https://www.migrationsverket.se/English/Private-individuals.html',
        visaApplication: 'https://www.migrationsverket.se',
        passport: 'https://www.polisen.se/en/services/passport-and-national-id-card/',
        passportApplication: 'https://www.polisen.se',
        tourism: 'https://visitsweden.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Swedish', 'English'],
        tuitionRange: { min: 0, max: 15000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 200000,
        languageRequirements: ['Swedish'],
        averageCostOfLiving: 3000,
        popularExpatAreas: ['Stockholm', 'Gothenburg', 'Malmo'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2200, medium: 3000, high: 4000 }
    },
    {
      code: 'NO',
      name: 'Norway',
      flag: '🇳🇴',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '112', medical: '113', fire: '110' },
      currency: 'NOK',
      languages: ['Norwegian'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Work Permit', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 22, max: 47.4 }, corporate: 22 },
      officialWebsites: {
        government: 'https://www.regjeringen.no',
        visa: 'https://www.udi.no/en/',
        visaApplication: 'https://www.udi.no',
        passport: 'https://www.politiet.no/en/services/passport/',
        passportApplication: 'https://www.politiet.no',
        tourism: 'https://www.visitnorway.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Norwegian'],
        tuitionRange: { min: 0, max: 20000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 200000,
        languageRequirements: ['Norwegian'],
        averageCostOfLiving: 3800,
        popularExpatAreas: ['Oslo', 'Bergen', 'Stavanger'],
        residencyRequirementDays: 1095,
        permanentResidencyDays: 1095,
        citizenshipRequirementDays: 2555
      },
      costOfLiving: { low: 3000, medium: 3800, high: 5000 }
    },
    {
      code: 'DK',
      name: 'Denmark',
      flag: '🇩🇰',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '114', medical: '112', fire: '112' },
      currency: 'DKK',
      languages: ['Danish'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Work Permit', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 8, max: 55.9 }, corporate: 22 },
      officialWebsites: {
        government: 'https://www.borger.dk',
        visa: 'https://www.nyidanmark.dk/en-gb',
        visaApplication: 'https://www.nyidanmark.dk',
        passport: 'https://www.borger.dk/Sider/Pas.aspx',
        passportApplication: 'https://www.borger.dk',
        tourism: 'https://www.visitdenmark.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Danish'],
        tuitionRange: { min: 0, max: 16000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 50000,
        languageRequirements: ['Danish'],
        averageCostOfLiving: 3200,
        popularExpatAreas: ['Copenhagen', 'Aarhus', 'Odense'],
        residencyRequirementDays: 2555,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 2555
      },
      costOfLiving: { low: 2400, medium: 3200, high: 4200 }
    },
    {
      code: 'FI',
      name: 'Finland',
      flag: '🇫🇮',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '112', medical: '112', fire: '112' },
      currency: 'EUR',
      languages: ['Finnish', 'Swedish'],
      timeZones: ['EET'],
      commonVisaTypes: ['Schengen Visa', 'Work Permit', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 6, max: 31.25 }, corporate: 20 },
      officialWebsites: {
        government: 'https://www.suomi.fi',
        visa: 'https://migri.fi/en/home',
        visaApplication: 'https://migri.fi',
        passport: 'https://www.suomi.fi/services/passport',
        passportApplication: 'https://www.suomi.fi',
        tourism: 'https://www.visitfinland.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Finnish'],
        tuitionRange: { min: 0, max: 18000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 350000,
        languageRequirements: ['Finnish'],
        averageCostOfLiving: 2800,
        popularExpatAreas: ['Helsinki', 'Tampere', 'Turku'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1460,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2000, medium: 2800, high: 3800 }
    },
    {
      code: 'PL',
      name: 'Poland',
      flag: '🇵🇱',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '997', medical: '999', fire: '998' },
      currency: 'PLN',
      languages: ['Polish'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Work Permit', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 12, max: 32 }, corporate: 19 },
      officialWebsites: {
        government: 'https://www.gov.pl',
        visa: 'https://www.gov.pl/web/diplomacy/visas',
        visaApplication: 'https://www.gov.pl/web/diplomacy',
        passport: 'https://www.gov.pl/web/gov/uzyskaj-paszport',
        passportApplication: 'https://www.gov.pl',
        tourism: 'https://www.poland.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Polish'],
        tuitionRange: { min: 2000, max: 6000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 250000,
        languageRequirements: ['Polish'],
        averageCostOfLiving: 1400,
        popularExpatAreas: ['Warsaw', 'Krakow', 'Gdansk'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1095
      },
      costOfLiving: { low: 1000, medium: 1400, high: 2000 }
    },
    {
      code: 'CZ',
      name: 'Czech Republic',
      flag: '🇨🇿',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '158', medical: '155', fire: '150' },
      currency: 'CZK',
      languages: ['Czech'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Work Permit', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 15, max: 23 }, corporate: 19 },
      officialWebsites: {
        government: 'https://www.vlada.cz',
        visa: 'https://www.mzv.cz/jnp/en/information_for_aliens/index.html',
        visaApplication: 'https://www.mzv.cz',
        passport: 'https://www.mzv.cz/jnp/en/information_for_aliens/passports.html',
        passportApplication: 'https://www.mzv.cz',
        tourism: 'https://www.czechtourism.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Czech'],
        tuitionRange: { min: 0, max: 8000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['Czech'],
        averageCostOfLiving: 1600,
        popularExpatAreas: ['Prague', 'Brno', 'Ostrava'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 1200, medium: 1600, high: 2400 }
    },
    {
      code: 'GR',
      name: 'Greece',
      flag: '🇬🇷',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '100', medical: '166', fire: '199' },
      currency: 'EUR',
      languages: ['Greek'],
      timeZones: ['EET'],
      commonVisaTypes: ['Schengen Visa', 'Golden Visa', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 9, max: 44 }, corporate: 24 },
      officialWebsites: {
        government: 'https://www.gov.gr',
        visa: 'https://www.mfa.gr/en/visas/',
        visaApplication: 'https://www.mfa.gr',
        passport: 'https://www.hellenicpolice.gr/en/?page_id=329',
        passportApplication: 'https://www.hellenicpolice.gr',
        tourism: 'https://www.visitgreece.gr'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Greek'],
        tuitionRange: { min: 1500, max: 9000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 250000,
        languageRequirements: ['Greek'],
        averageCostOfLiving: 1500,
        popularExpatAreas: ['Athens', 'Thessaloniki', 'Crete'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 2555
      },
      costOfLiving: { low: 1000, medium: 1500, high: 2200 }
    },
    {
      code: 'HU',
      name: 'Hungary',
      flag: '🇭🇺',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '107', medical: '104', fire: '105' },
      currency: 'HUF',
      languages: ['Hungarian'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Work Permit', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 15, max: 15 }, corporate: 9 },
      officialWebsites: {
        government: 'https://www.kormany.hu',
        visa: 'https://konzuliszolgalat.kormany.hu/en',
        visaApplication: 'https://konzuliszolgalat.kormany.hu',
        passport: 'https://okmanyiroda.hu',
        passportApplication: 'https://okmanyiroda.hu',
        tourism: 'https://www.gotohungary.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Hungarian'],
        tuitionRange: { min: 3000, max: 8000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 350000,
        languageRequirements: ['Hungarian'],
        averageCostOfLiving: 1200,
        popularExpatAreas: ['Budapest', 'Debrecen', 'Szeged'],
        residencyRequirementDays: 2555,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 2920
      },
      costOfLiving: { low: 800, medium: 1200, high: 1800 }
    },
    {
      code: 'IE',
      name: 'Ireland',
      flag: '🇮🇪',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '999', medical: '999', fire: '999' },
      currency: 'EUR',
      languages: ['English', 'Irish'],
      timeZones: ['GMT'],
      commonVisaTypes: ['Short Stay Visa', 'Student Visa', 'Work Permit'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 20, max: 40 }, corporate: 12.5 },
      officialWebsites: {
        government: 'https://www.gov.ie',
        visa: 'https://www.irishimmigration.ie',
        visaApplication: 'https://www.irishimmigration.ie',
        passport: 'https://www.dfa.ie/passports/',
        passportApplication: 'https://www.dfa.ie',
        tourism: 'https://www.ireland.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 10000, max: 25000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['English'],
        averageCostOfLiving: 2800,
        popularExpatAreas: ['Dublin', 'Cork', 'Galway'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2000, medium: 2800, high: 4000 }
    },
    {
      code: 'LU',
      name: 'Luxembourg',
      flag: '🇱🇺',
      visaFreeStays: { tourist: 90, business: 90, transit: 5 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '113', medical: '112', fire: '112' },
      currency: 'EUR',
      languages: ['Luxembourgish', 'French', 'German'],
      timeZones: ['CET'],
      commonVisaTypes: ['Schengen Visa', 'Work Permit', 'Student Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 42 }, corporate: 24.94 },
      officialWebsites: {
        government: 'https://www.luxembourg.lu',
        visa: 'https://mae.gouvernement.lu/en/services-aux-citoyens/entree-sejour-luxembourg.html',
        visaApplication: 'https://mae.gouvernement.lu',
        passport: 'https://guichet.public.lu/en/citoyens/passeport-identite/passeport/premiere-demande-majeur.html',
        passportApplication: 'https://guichet.public.lu',
        tourism: 'https://www.visitluxembourg.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['French', 'German'],
        tuitionRange: { min: 200, max: 2000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['Luxembourgish', 'French', 'German'],
        averageCostOfLiving: 4000,
        popularExpatAreas: ['Luxembourg City', 'Esch-sur-Alzette'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 3000, medium: 4000, high: 5500 }
    },
    {
      code: 'NZ',
      name: 'New Zealand',
      flag: '🇳🇿',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '111', medical: '111', fire: '111' },
      currency: 'NZD',
      languages: ['English', 'Māori'],
      timeZones: ['NZST'],
      commonVisaTypes: ['Visitor Visa', 'Student Visa', 'Work Visa', 'Skilled Migrant'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 10.5, max: 39 }, corporate: 28 },
      officialWebsites: {
        government: 'https://www.newzealand.govt.nz',
        visa: 'https://www.immigration.govt.nz',
        visaApplication: 'https://www.immigration.govt.nz',
        passport: 'https://www.passports.govt.nz',
        passportApplication: 'https://www.passports.govt.nz',
        tourism: 'https://www.newzealand.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 22000, max: 37000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 3000000,
        languageRequirements: ['English'],
        averageCostOfLiving: 2800,
        popularExpatAreas: ['Auckland', 'Wellington', 'Christchurch'],
        residencyRequirementDays: 1350,
        permanentResidencyDays: 1350,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2200, medium: 2800, high: 3800 }
    },
    {
      code: 'HK',
      name: 'Hong Kong',
      flag: '🇭🇰',
      visaFreeStays: { tourist: 90, business: 90, transit: 7 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '999', medical: '999', fire: '999' },
      currency: 'HKD',
      languages: ['Cantonese', 'English'],
      timeZones: ['HKT'],
      commonVisaTypes: ['Visit Visa', 'Student Visa', 'Work Visa', 'Investment Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 2, max: 17 }, corporate: 16.5 },
      officialWebsites: {
        government: 'https://www.gov.hk',
        visa: 'https://www.immd.gov.hk/eng/services/',
        visaApplication: 'https://www.immd.gov.hk',
        passport: 'https://www.immd.gov.hk/eng/residents/immigration/traveldoc/',
        passportApplication: 'https://www.immd.gov.hk',
        tourism: 'https://www.discoverhongkong.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 16000, max: 40000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 10000000,
        languageRequirements: ['English'],
        averageCostOfLiving: 3800,
        popularExpatAreas: ['Central', 'Admiralty', 'Tsim Sha Tsui'],
        residencyRequirementDays: 1095,
        permanentResidencyDays: 2555,
        citizenshipRequirementDays: 2555
      },
      costOfLiving: { low: 2800, medium: 3800, high: 5500 }
    },
    {
      code: 'MY',
      name: 'Malaysia',
      flag: '🇲🇾',
      visaFreeStays: { tourist: 90, business: 90, transit: 120 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '999', medical: '999', fire: '994' },
      currency: 'MYR',
      languages: ['Malay', 'English'],
      timeZones: ['MST'],
      commonVisaTypes: ['Social Visit Pass', 'Student Pass', 'Work Permit', 'MM2H'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 30 }, corporate: 24 },
      officialWebsites: {
        government: 'https://www.malaysia.gov.my',
        visa: 'https://www.imi.gov.my/portal/lihat/',
        visaApplication: 'https://www.imi.gov.my',
        passport: 'https://www.imi.gov.my/portal/paspor/',
        passportApplication: 'https://www.imi.gov.my',
        tourism: 'https://www.malaysia.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 4000, max: 15000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 150000,
        languageRequirements: ['English'],
        averageCostOfLiving: 1200,
        popularExpatAreas: ['Kuala Lumpur', 'George Town', 'Johor Bahru'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 3650,
        citizenshipRequirementDays: 3650
      },
      costOfLiving: { low: 800, medium: 1200, high: 2000 }
    },
    {
      code: 'PH',
      name: 'Philippines',
      flag: '🇵🇭',
      visaFreeStays: { tourist: 30, business: 30, transit: 72 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '117', medical: '911', fire: '116' },
      currency: 'PHP',
      languages: ['Filipino', 'English'],
      timeZones: ['PST'],
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'SRRV'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 35 }, corporate: 30 },
      officialWebsites: {
        government: 'https://www.gov.ph',
        visa: 'https://www.immigration.gov.ph',
        visaApplication: 'https://www.immigration.gov.ph',
        passport: 'https://www.dfa.gov.ph/passport',
        passportApplication: 'https://www.dfa.gov.ph',
        tourism: 'https://www.itsmorefuninthephilippines.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: false,
        languageRequirements: ['English'],
        tuitionRange: { min: 2000, max: 8000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 75000,
        languageRequirements: ['English'],
        averageCostOfLiving: 800,
        popularExpatAreas: ['Manila', 'Cebu', 'Davao'],
        residencyRequirementDays: 1095,
        permanentResidencyDays: 1460,
        citizenshipRequirementDays: 3650
      },
      costOfLiving: { low: 500, medium: 800, high: 1500 }
    },
    {
      code: 'VN',
      name: 'Vietnam',
      flag: '🇻🇳',
      visaFreeStays: { tourist: 30, business: 30, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '113', medical: '115', fire: '114' },
      currency: 'VND',
      languages: ['Vietnamese'],
      timeZones: ['ICT'],
      commonVisaTypes: ['Tourist Visa', 'Business Visa', 'Work Permit'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 5, max: 35 }, corporate: 20 },
      officialWebsites: {
        government: 'https://www.chinhphu.vn',
        visa: 'https://evisa.xuatnhapcanh.gov.vn',
        visaApplication: 'https://evisa.xuatnhapcanh.gov.vn',
        passport: 'https://dichvucong.bocongan.gov.vn',
        passportApplication: 'https://dichvucong.bocongan.gov.vn',
        tourism: 'https://vietnam.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: false,
        languageRequirements: ['Vietnamese'],
        tuitionRange: { min: 2000, max: 8000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 130000,
        languageRequirements: ['Vietnamese'],
        averageCostOfLiving: 800,
        popularExpatAreas: ['Ho Chi Minh City', 'Hanoi', 'Da Nang'],
        residencyRequirementDays: 1095,
        permanentResidencyDays: 1095,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 500, medium: 800, high: 1400 }
    },
    {
      code: 'IN',
      name: 'India',
      flag: '🇮🇳',
      visaFreeStays: { tourist: 30, business: 30, transit: 72 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '100', medical: '102', fire: '101' },
      currency: 'INR',
      languages: ['Hindi', 'English'],
      timeZones: ['IST'],
      commonVisaTypes: ['e-Tourist Visa', 'Student Visa', 'Employment Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 30 }, corporate: 25 },
      officialWebsites: {
        government: 'https://www.india.gov.in',
        visa: 'https://indianvisaonline.gov.in',
        visaApplication: 'https://indianvisaonline.gov.in',
        passport: 'https://www.passportindia.gov.in',
        passportApplication: 'https://www.passportindia.gov.in',
        tourism: 'https://www.incredibleindia.org'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 5,
        maxStudyDays: 1825,
        workPermitWhileStudying: false,
        languageRequirements: ['English'],
        tuitionRange: { min: 1000, max: 15000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 150000,
        languageRequirements: ['English'],
        averageCostOfLiving: 600,
        popularExpatAreas: ['Mumbai', 'Delhi', 'Bangalore'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 4380
      },
      costOfLiving: { low: 300, medium: 600, high: 1200 }
    },
    {
      code: 'ID',
      name: 'Indonesia',
      flag: '🇮🇩',
      visaFreeStays: { tourist: 30, business: 30, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '110', medical: '118', fire: '113' },
      currency: 'IDR',
      languages: ['Indonesian'],
      timeZones: ['WIB', 'WITA', 'WIT'],
      commonVisaTypes: ['Visit Visa', 'B211A Visa', 'Work Permit'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 5, max: 30 }, corporate: 22 },
      officialWebsites: {
        government: 'https://www.indonesia.go.id',
        visa: 'https://www.imigrasi.go.id',
        visaApplication: 'https://www.imigrasi.go.id',
        passport: 'https://www.imigrasi.go.id/id/layanan/paspor',
        passportApplication: 'https://www.imigrasi.go.id',
        tourism: 'https://www.indonesia.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: false,
        languageRequirements: ['Indonesian'],
        tuitionRange: { min: 1500, max: 8000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 130000,
        languageRequirements: ['Indonesian'],
        averageCostOfLiving: 700,
        popularExpatAreas: ['Jakarta', 'Bali', 'Surabaya'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 400, medium: 700, high: 1300 }
    },
    {
      code: 'KR',
      name: 'South Korea',
      flag: '🇰🇷',
      visaFreeStays: { tourist: 90, business: 90, transit: 30 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '112', medical: '119', fire: '119' },
      currency: 'KRW',
      languages: ['Korean'],
      timeZones: ['KST'],
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa', 'F-Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 6, max: 42 }, corporate: 25 },
      officialWebsites: {
        government: 'https://www.korea.kr',
        visa: 'https://www.visa.go.kr',
        visaApplication: 'https://www.visa.go.kr',
        passport: 'https://www.passport.go.kr',
        passportApplication: 'https://www.passport.go.kr',
        tourism: 'https://english.visitkorea.or.kr'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Korean'],
        tuitionRange: { min: 6000, max: 20000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['Korean'],
        averageCostOfLiving: 2000,
        popularExpatAreas: ['Seoul', 'Busan', 'Incheon'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 1400, medium: 2000, high: 2800 }
    },
    {
      code: 'CN',
      name: 'China',
      flag: '🇨🇳',
      visaFreeStays: { tourist: 15, business: 15, transit: 72 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '110', medical: '120', fire: '119' },
      currency: 'CNY',
      languages: ['Mandarin'],
      timeZones: ['CST'],
      commonVisaTypes: ['L Visa', 'F Visa', 'Z Visa', 'X Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 3, max: 45 }, corporate: 25 },
      officialWebsites: {
        government: 'https://www.gov.cn',
        visa: 'https://www.fmprc.gov.cn/mfa_eng/wjbxw/t84246.shtml',
        visaApplication: 'https://www.fmprc.gov.cn',
        passport: 'https://www.gov.cn/fuwu/2016-05/19/content_5075484.htm',
        passportApplication: 'https://www.gov.cn',
        tourism: 'https://www.travelchinaguide.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: false,
        languageRequirements: ['Mandarin'],
        tuitionRange: { min: 2000, max: 10000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['Mandarin'],
        averageCostOfLiving: 1200,
        popularExpatAreas: ['Shanghai', 'Beijing', 'Shenzhen'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 800, medium: 1200, high: 2000 }
    },
    {
      code: 'RU',
      name: 'Russia',
      flag: '🇷🇺',
      visaFreeStays: { tourist: 30, business: 30, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '102', medical: '103', fire: '101' },
      currency: 'RUB',
      languages: ['Russian'],
      timeZones: ['MSK', 'KRAT', 'IRKT'],
      commonVisaTypes: ['Tourist Visa', 'Business Visa', 'Work Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 13, max: 15 }, corporate: 20 },
      officialWebsites: {
        government: 'https://www.government.ru',
        visa: 'https://www.mid.ru/en/foreign_policy/consular_service/',
        visaApplication: 'https://www.mid.ru',
        passport: 'https://гувм.мвд.рф',
        passportApplication: 'https://гувм.мвд.рф',
        tourism: 'https://www.russia.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: false,
        languageRequirements: ['Russian'],
        tuitionRange: { min: 2000, max: 6000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 200000,
        languageRequirements: ['Russian'],
        averageCostOfLiving: 1000,
        popularExpatAreas: ['Moscow', 'St. Petersburg', 'Novosibirsk'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 600, medium: 1000, high: 1800 }
    },
    {
      code: 'TR',
      name: 'Turkey',
      flag: '🇹🇷',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '155', medical: '112', fire: '110' },
      currency: 'TRY',
      languages: ['Turkish'],
      timeZones: ['TRT'],
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Permit'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 15, max: 40 }, corporate: 23 },
      officialWebsites: {
        government: 'https://www.turkiye.gov.tr',
        visa: 'https://www.evisa.gov.tr',
        visaApplication: 'https://www.evisa.gov.tr',
        passport: 'https://www.nvi.gov.tr',
        passportApplication: 'https://www.nvi.gov.tr',
        tourism: 'https://www.goturkiye.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Turkish'],
        tuitionRange: { min: 600, max: 20000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 250000,
        languageRequirements: ['Turkish'],
        averageCostOfLiving: 1000,
        popularExpatAreas: ['Istanbul', 'Ankara', 'Antalya'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 600, medium: 1000, high: 1600 }
    },
    {
      code: 'ZA',
      name: 'South Africa',
      flag: '🇿🇦',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '10111', medical: '10177', fire: '10111' },
      currency: 'ZAR',
      languages: ['English', 'Afrikaans'],
      timeZones: ['SAST'],
      commonVisaTypes: ['Visitor Visa', 'Study Visa', 'Work Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 18, max: 45 }, corporate: 28 },
      officialWebsites: {
        government: 'https://www.gov.za',
        visa: 'https://www.dha.gov.za/index.php/immigration-services',
        visaApplication: 'https://www.dha.gov.za',
        passport: 'https://www.dha.gov.za/index.php/civic-services/passports',
        passportApplication: 'https://www.dha.gov.za',
        tourism: 'https://www.southafrica.net'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 3000, max: 20000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 350000,
        languageRequirements: ['English'],
        averageCostOfLiving: 1200,
        popularExpatAreas: ['Cape Town', 'Johannesburg', 'Durban'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 800, medium: 1200, high: 2000 }
    },
    {
      code: 'IL',
      name: 'Israel',
      flag: '🇮🇱',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '100', medical: '101', fire: '102' },
      currency: 'ILS',
      languages: ['Hebrew', 'Arabic'],
      timeZones: ['IST'],
      commonVisaTypes: ['B/2 Tourist', 'Student Visa', 'Work Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 10, max: 50 }, corporate: 23 },
      officialWebsites: {
        government: 'https://www.gov.il',
        visa: 'https://www.gov.il/en/departments/ministry_of_interior',
        visaApplication: 'https://www.gov.il',
        passport: 'https://www.gov.il/en/service/passport_request',
        passportApplication: 'https://www.gov.il',
        tourism: 'https://www.goisrael.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Hebrew'],
        tuitionRange: { min: 3000, max: 20000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 500000,
        languageRequirements: ['Hebrew'],
        averageCostOfLiving: 2800,
        popularExpatAreas: ['Tel Aviv', 'Jerusalem', 'Haifa'],
        residencyRequirementDays: 1095,
        permanentResidencyDays: 1095,
        citizenshipRequirementDays: 1095
      },
      costOfLiving: { low: 2000, medium: 2800, high: 4000 }
    },
    {
      code: 'AE',
      name: 'United Arab Emirates',
      flag: '🇦🇪',
      visaFreeStays: { tourist: 30, business: 30, transit: 96 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: true,
      emergencyNumbers: { police: '999', medical: '999', fire: '997' },
      currency: 'AED',
      languages: ['Arabic', 'English'],
      timeZones: ['GST'],
      commonVisaTypes: ['Visit Visa', 'Student Visa', 'Work Visa', 'Golden Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 0 }, corporate: 9 },
      officialWebsites: {
        government: 'https://u.ae',
        visa: 'https://www.ica.gov.ae/en',
        visaApplication: 'https://www.ica.gov.ae',
        passport: 'https://www.ica.gov.ae/en/services/passport-services',
        passportApplication: 'https://www.ica.gov.ae',
        tourism: 'https://www.visitdubai.com'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['English'],
        tuitionRange: { min: 15000, max: 60000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 2000000,
        languageRequirements: ['English'],
        averageCostOfLiving: 3000,
        popularExpatAreas: ['Dubai', 'Abu Dhabi', 'Sharjah'],
        residencyRequirementDays: 183,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 2200, medium: 3000, high: 4500 }
    },
    {
      code: 'CL',
      name: 'Chile',
      flag: '🇨🇱',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '133', medical: '131', fire: '132' },
      currency: 'CLP',
      languages: ['Spanish'],
      timeZones: ['CLT'],
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 40 }, corporate: 27 },
      officialWebsites: {
        government: 'https://www.gob.cl',
        visa: 'https://www.extranjeria.gob.cl',
        visaApplication: 'https://www.extranjeria.gob.cl',
        passport: 'https://www.registrocivil.cl',
        passportApplication: 'https://www.registrocivil.cl',
        tourism: 'https://chile.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Spanish'],
        tuitionRange: { min: 3000, max: 15000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 100000,
        languageRequirements: ['Spanish'],
        averageCostOfLiving: 1600,
        popularExpatAreas: ['Santiago', 'Valparaíso', 'La Serena'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 1200, medium: 1600, high: 2400 }
    },
    {
      code: 'AR',
      name: 'Argentina',
      flag: '🇦🇷',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '101', medical: '107', fire: '100' },
      currency: 'ARS',
      languages: ['Spanish'],
      timeZones: ['ART'],
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 5, max: 35 }, corporate: 30 },
      officialWebsites: {
        government: 'https://www.argentina.gob.ar',
        visa: 'https://www.migraciones.gov.ar',
        visaApplication: 'https://www.migraciones.gov.ar',
        passport: 'https://www.argentina.gob.ar/interior/pasaportes',
        passportApplication: 'https://www.argentina.gob.ar',
        tourism: 'https://www.argentina.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Spanish'],
        tuitionRange: { min: 0, max: 8000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 200000,
        languageRequirements: ['Spanish'],
        averageCostOfLiving: 1000,
        popularExpatAreas: ['Buenos Aires', 'Cordoba', 'Mendoza'],
        residencyRequirementDays: 730,
        permanentResidencyDays: 730,
        citizenshipRequirementDays: 730
      },
      costOfLiving: { low: 600, medium: 1000, high: 1600 }
    },
    {
      code: 'CO',
      name: 'Colombia',
      flag: '🇨🇴',
      visaFreeStays: { tourist: 90, business: 90, transit: 24 },
      taxResidencyDays: 183,
      workPermitRequired: true,
      healthInsuranceRequired: false,
      emergencyNumbers: { police: '123', medical: '125', fire: '119' },
      currency: 'COP',
      languages: ['Spanish'],
      timeZones: ['COT'],
      commonVisaTypes: ['Tourist Visa', 'Student Visa', 'Work Visa'],
      businessRegistrationRequired: true,
      taxRate: { personal: { min: 0, max: 39 }, corporate: 31 },
      officialWebsites: {
        government: 'https://www.gov.co',
        visa: 'https://www.migracioncolombia.gov.co',
        visaApplication: 'https://www.migracioncolombia.gov.co',
        passport: 'https://www.cancilleria.gov.co/tramites_servicios/pasaporte',
        passportApplication: 'https://www.cancilleria.gov.co',
        tourism: 'https://colombia.travel'
      },
      studentInfo: {
        studentVisaRequired: true,
        maxStudyDuration: 4,
        maxStudyDays: 1460,
        workPermitWhileStudying: true,
        languageRequirements: ['Spanish'],
        tuitionRange: { min: 2000, max: 10000 }
      },
      expatInfo: {
        residencyPermitRequired: true,
        minimumInvestment: 170000,
        languageRequirements: ['Spanish'],
        averageCostOfLiving: 800,
        popularExpatAreas: ['Bogota', 'Medellin', 'Cartagena'],
        residencyRequirementDays: 1825,
        permanentResidencyDays: 1825,
        citizenshipRequirementDays: 1825
      },
      costOfLiving: { low: 500, medium: 800, high: 1400 }
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
      'AED': 'د.إ', 'SAR': 'ر.س', 'QAR': 'ر.ق', 'ILS': '₪',
      'CLP': '$', 'ARS': '$', 'COP': '$', 'PEN': 'S/', 'MYR': 'RM',
      'PHP': '₱', 'VND': '₫', 'IDR': 'Rp'
    };
    return symbols[currencyCode] || currencyCode;
  }
}

export default CountryInfoService;
