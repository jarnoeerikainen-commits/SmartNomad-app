
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
  currency: {
    code: string;
    symbol: string;
    exchangeRate?: number;
  };
  timeZones: string[];
  commonVisaTypes: string[];
  businessRegistrationRequired: boolean;
  taxRate: {
    personal: number;
    corporate: number;
  };
}
