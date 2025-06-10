
export interface CountryDetails {
  code: string;
  name: string;
  flag: string;
  visaFreeStays: {
    tourist: number;
    business: number;
    transit: number;
  };
  taxResidencyDays: number;
  workPermitRequired: boolean;
  healthInsuranceRequired: boolean;
  emergencyNumbers: {
    police: string;
    medical: string;
    fire: string;
  };
  currency: string;
  languages: string[];
  timeZones: string[];
  commonVisaTypes: string[];
  businessRegistrationRequired: boolean;
  taxRate: {
    personal: { min: number; max: number };
    corporate: number;
  };
  officialWebsites: OfficialWebsites;
  studentInfo: StudentInfo;
  expatInfo: ExpatInfo;
  costOfLiving: {
    low: number;
    medium: number;
    high: number;
  };
}

export interface OfficialWebsites {
  government: string;
  visa: string;
  passport: string;
  tourism: string;
}

export interface StudentInfo {
  studentVisaRequired: boolean;
  maxStudyDuration: number;
  workPermitWhileStudying: boolean;
  languageRequirements: string[];
  tuitionRange: { min: number; max: number };
}

export interface ExpatInfo {
  residencyPermitRequired: boolean;
  minimumInvestment: number;
  languageRequirements: string[];
  averageCostOfLiving: number;
  popularExpatAreas: string[];
}

export interface TrackingRecommendation {
  type: 'visa_free_limit' | 'study_visa' | 'residency_permit' | 'business_travel' | 'tax_residency' | 'substantial_presence';
  title: string;
  description: string;
  countries: string[];
  dayLimit: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}
