
import { DailyAllowance, MileageRate } from '@/types/expense';

const DAILY_ALLOWANCES: Record<string, DailyAllowance> = {
  'US': {
    country_code: 'US',
    country_name: 'United States',
    daily_rate_usd: 150,
    meal_rate_usd: 60,
    lodging_rate_usd: 180,
    incidental_rate_usd: 20,
    updated_at: '2024-01-01'
  },
  'GB': {
    country_code: 'GB',
    country_name: 'United Kingdom',
    daily_rate_usd: 140,
    meal_rate_usd: 55,
    lodging_rate_usd: 170,
    incidental_rate_usd: 18,
    updated_at: '2024-01-01'
  },
  'DE': {
    country_code: 'DE',
    country_name: 'Germany',
    daily_rate_usd: 130,
    meal_rate_usd: 50,
    lodging_rate_usd: 160,
    incidental_rate_usd: 15,
    updated_at: '2024-01-01'
  },
  'FR': {
    country_code: 'FR',
    country_name: 'France',
    daily_rate_usd: 135,
    meal_rate_usd: 52,
    lodging_rate_usd: 165,
    incidental_rate_usd: 16,
    updated_at: '2024-01-01'
  },
  'ES': {
    country_code: 'ES',
    country_name: 'Spain',
    daily_rate_usd: 125,
    meal_rate_usd: 48,
    lodging_rate_usd: 150,
    incidental_rate_usd: 14,
    updated_at: '2024-01-01'
  },
  'IT': {
    country_code: 'IT',
    country_name: 'Italy',
    daily_rate_usd: 138,
    meal_rate_usd: 53,
    lodging_rate_usd: 168,
    incidental_rate_usd: 17,
    updated_at: '2024-01-01'
  },
  'NL': {
    country_code: 'NL',
    country_name: 'Netherlands',
    daily_rate_usd: 145,
    meal_rate_usd: 57,
    lodging_rate_usd: 175,
    incidental_rate_usd: 19,
    updated_at: '2024-01-01'
  },
  'CH': {
    country_code: 'CH',
    country_name: 'Switzerland',
    daily_rate_usd: 180,
    meal_rate_usd: 75,
    lodging_rate_usd: 220,
    incidental_rate_usd: 25,
    updated_at: '2024-01-01'
  },
  'AT': {
    country_code: 'AT',
    country_name: 'Austria',
    daily_rate_usd: 132,
    meal_rate_usd: 51,
    lodging_rate_usd: 162,
    incidental_rate_usd: 16,
    updated_at: '2024-01-01'
  },
  'BE': {
    country_code: 'BE',
    country_name: 'Belgium',
    daily_rate_usd: 135,
    meal_rate_usd: 52,
    lodging_rate_usd: 165,
    incidental_rate_usd: 16,
    updated_at: '2024-01-01'
  },
  'SE': {
    country_code: 'SE',
    country_name: 'Sweden',
    daily_rate_usd: 155,
    meal_rate_usd: 62,
    lodging_rate_usd: 185,
    incidental_rate_usd: 21,
    updated_at: '2024-01-01'
  },
  'NO': {
    country_code: 'NO',
    country_name: 'Norway',
    daily_rate_usd: 170,
    meal_rate_usd: 68,
    lodging_rate_usd: 200,
    incidental_rate_usd: 23,
    updated_at: '2024-01-01'
  },
  'DK': {
    country_code: 'DK',
    country_name: 'Denmark',
    daily_rate_usd: 165,
    meal_rate_usd: 65,
    lodging_rate_usd: 195,
    incidental_rate_usd: 22,
    updated_at: '2024-01-01'
  },
  'FI': {
    country_code: 'FI',
    country_name: 'Finland',
    daily_rate_usd: 148,
    meal_rate_usd: 58,
    lodging_rate_usd: 178,
    incidental_rate_usd: 20,
    updated_at: '2024-01-01'
  },
  'JP': {
    country_code: 'JP',
    country_name: 'Japan',
    daily_rate_usd: 160,
    meal_rate_usd: 65,
    lodging_rate_usd: 190,
    incidental_rate_usd: 22,
    updated_at: '2024-01-01'
  },
  'KR': {
    country_code: 'KR',
    country_name: 'South Korea',
    daily_rate_usd: 145,
    meal_rate_usd: 58,
    lodging_rate_usd: 175,
    incidental_rate_usd: 19,
    updated_at: '2024-01-01'
  },
  'SG': {
    country_code: 'SG',
    country_name: 'Singapore',
    daily_rate_usd: 145,
    meal_rate_usd: 58,
    lodging_rate_usd: 175,
    incidental_rate_usd: 19,
    updated_at: '2024-01-01'
  },
  'HK': {
    country_code: 'HK',
    country_name: 'Hong Kong',
    daily_rate_usd: 140,
    meal_rate_usd: 55,
    lodging_rate_usd: 170,
    incidental_rate_usd: 18,
    updated_at: '2024-01-01'
  },
  'AU': {
    country_code: 'AU',
    country_name: 'Australia',
    daily_rate_usd: 155,
    meal_rate_usd: 62,
    lodging_rate_usd: 185,
    incidental_rate_usd: 21,
    updated_at: '2024-01-01'
  },
  'NZ': {
    country_code: 'NZ',
    country_name: 'New Zealand',
    daily_rate_usd: 150,
    meal_rate_usd: 60,
    lodging_rate_usd: 180,
    incidental_rate_usd: 20,
    updated_at: '2024-01-01'
  },
  'CA': {
    country_code: 'CA',
    country_name: 'Canada',
    daily_rate_usd: 142,
    meal_rate_usd: 56,
    lodging_rate_usd: 172,
    incidental_rate_usd: 18,
    updated_at: '2024-01-01'
  },
  'TH': {
    country_code: 'TH',
    country_name: 'Thailand',
    daily_rate_usd: 85,
    meal_rate_usd: 35,
    lodging_rate_usd: 95,
    incidental_rate_usd: 12,
    updated_at: '2024-01-01'
  },
  'MY': {
    country_code: 'MY',
    country_name: 'Malaysia',
    daily_rate_usd: 75,
    meal_rate_usd: 30,
    lodging_rate_usd: 85,
    incidental_rate_usd: 10,
    updated_at: '2024-01-01'
  },
  'PH': {
    country_code: 'PH',
    country_name: 'Philippines',
    daily_rate_usd: 70,
    meal_rate_usd: 28,
    lodging_rate_usd: 80,
    incidental_rate_usd: 9,
    updated_at: '2024-01-01'
  },
  'ID': {
    country_code: 'ID',
    country_name: 'Indonesia',
    daily_rate_usd: 68,
    meal_rate_usd: 27,
    lodging_rate_usd: 78,
    incidental_rate_usd: 8,
    updated_at: '2024-01-01'
  },
  'VN': {
    country_code: 'VN',
    country_name: 'Vietnam',
    daily_rate_usd: 65,
    meal_rate_usd: 25,
    lodging_rate_usd: 75,
    incidental_rate_usd: 8,
    updated_at: '2024-01-01'
  },
  'IN': {
    country_code: 'IN',
    country_name: 'India',
    daily_rate_usd: 60,
    meal_rate_usd: 22,
    lodging_rate_usd: 70,
    incidental_rate_usd: 7,
    updated_at: '2024-01-01'
  },
  'CN': {
    country_code: 'CN',
    country_name: 'China',
    daily_rate_usd: 110,
    meal_rate_usd: 45,
    lodging_rate_usd: 130,
    incidental_rate_usd: 15,
    updated_at: '2024-01-01'
  },
  'AE': {
    country_code: 'AE',
    country_name: 'United Arab Emirates',
    daily_rate_usd: 165,
    meal_rate_usd: 65,
    lodging_rate_usd: 195,
    incidental_rate_usd: 22,
    updated_at: '2024-01-01'
  },
  'SA': {
    country_code: 'SA',
    country_name: 'Saudi Arabia',
    daily_rate_usd: 155,
    meal_rate_usd: 62,
    lodging_rate_usd: 185,
    incidental_rate_usd: 21,
    updated_at: '2024-01-01'
  },
  'IL': {
    country_code: 'IL',
    country_name: 'Israel',
    daily_rate_usd: 175,
    meal_rate_usd: 70,
    lodging_rate_usd: 205,
    incidental_rate_usd: 24,
    updated_at: '2024-01-01'
  },
  'TR': {
    country_code: 'TR',
    country_name: 'Turkey',
    daily_rate_usd: 95,
    meal_rate_usd: 38,
    lodging_rate_usd: 105,
    incidental_rate_usd: 13,
    updated_at: '2024-01-01'
  },
  'RU': {
    country_code: 'RU',
    country_name: 'Russia',
    daily_rate_usd: 105,
    meal_rate_usd: 42,
    lodging_rate_usd: 125,
    incidental_rate_usd: 14,
    updated_at: '2024-01-01'
  },
  'MX': {
    country_code: 'MX',
    country_name: 'Mexico',
    daily_rate_usd: 90,
    meal_rate_usd: 36,
    lodging_rate_usd: 100,
    incidental_rate_usd: 12,
    updated_at: '2024-01-01'
  },
  'BR': {
    country_code: 'BR',
    country_name: 'Brazil',
    daily_rate_usd: 88,
    meal_rate_usd: 35,
    lodging_rate_usd: 98,
    incidental_rate_usd: 12,
    updated_at: '2024-01-01'
  },
  'AR': {
    country_code: 'AR',
    country_name: 'Argentina',
    daily_rate_usd: 82,
    meal_rate_usd: 33,
    lodging_rate_usd: 92,
    incidental_rate_usd: 11,
    updated_at: '2024-01-01'
  },
  'CL': {
    country_code: 'CL',
    country_name: 'Chile',
    daily_rate_usd: 95,
    meal_rate_usd: 38,
    lodging_rate_usd: 105,
    incidental_rate_usd: 13,
    updated_at: '2024-01-01'
  },
  'CO': {
    country_code: 'CO',
    country_name: 'Colombia',
    daily_rate_usd: 75,
    meal_rate_usd: 30,
    lodging_rate_usd: 85,
    incidental_rate_usd: 10,
    updated_at: '2024-01-01'
  },
  'PE': {
    country_code: 'PE',
    country_name: 'Peru',
    daily_rate_usd: 72,
    meal_rate_usd: 29,
    lodging_rate_usd: 82,
    incidental_rate_usd: 9,
    updated_at: '2024-01-01'
  },
  'ZA': {
    country_code: 'ZA',
    country_name: 'South Africa',
    daily_rate_usd: 85,
    meal_rate_usd: 34,
    lodging_rate_usd: 95,
    incidental_rate_usd: 12,
    updated_at: '2024-01-01'
  },
  'EG': {
    country_code: 'EG',
    country_name: 'Egypt',
    daily_rate_usd: 65,
    meal_rate_usd: 26,
    lodging_rate_usd: 75,
    incidental_rate_usd: 8,
    updated_at: '2024-01-01'
  },
  'MA': {
    country_code: 'MA',
    country_name: 'Morocco',
    daily_rate_usd: 70,
    meal_rate_usd: 28,
    lodging_rate_usd: 80,
    incidental_rate_usd: 9,
    updated_at: '2024-01-01'
  },
  'KE': {
    country_code: 'KE',
    country_name: 'Kenya',
    daily_rate_usd: 68,
    meal_rate_usd: 27,
    lodging_rate_usd: 78,
    incidental_rate_usd: 8,
    updated_at: '2024-01-01'
  },
  'NG': {
    country_code: 'NG',
    country_name: 'Nigeria',
    daily_rate_usd: 75,
    meal_rate_usd: 30,
    lodging_rate_usd: 85,
    incidental_rate_usd: 10,
    updated_at: '2024-01-01'
  },
  'PT': {
    country_code: 'PT',
    country_name: 'Portugal',
    daily_rate_usd: 120,
    meal_rate_usd: 47,
    lodging_rate_usd: 145,
    incidental_rate_usd: 15,
    updated_at: '2024-01-01'
  },
  'GR': {
    country_code: 'GR',
    country_name: 'Greece',
    daily_rate_usd: 115,
    meal_rate_usd: 45,
    lodging_rate_usd: 135,
    incidental_rate_usd: 14,
    updated_at: '2024-01-01'
  },
  'PL': {
    country_code: 'PL',
    country_name: 'Poland',
    daily_rate_usd: 100,
    meal_rate_usd: 40,
    lodging_rate_usd: 115,
    incidental_rate_usd: 13,
    updated_at: '2024-01-01'
  },
  'CZ': {
    country_code: 'CZ',
    country_name: 'Czech Republic',
    daily_rate_usd: 105,
    meal_rate_usd: 42,
    lodging_rate_usd: 125,
    incidental_rate_usd: 14,
    updated_at: '2024-01-01'
  },
  'HU': {
    country_code: 'HU',
    country_name: 'Hungary',
    daily_rate_usd: 95,
    meal_rate_usd: 38,
    lodging_rate_usd: 105,
    incidental_rate_usd: 13,
    updated_at: '2024-01-01'
  },
  'IE': {
    country_code: 'IE',
    country_name: 'Ireland',
    daily_rate_usd: 150,
    meal_rate_usd: 60,
    lodging_rate_usd: 180,
    incidental_rate_usd: 20,
    updated_at: '2024-01-01'
  },
  'IS': {
    country_code: 'IS',
    country_name: 'Iceland',
    daily_rate_usd: 175,
    meal_rate_usd: 70,
    lodging_rate_usd: 205,
    incidental_rate_usd: 24,
    updated_at: '2024-01-01'
  }
};

const MILEAGE_RATES: Record<string, MileageRate> = {
  'US': {
    country_code: 'US',
    rate_per_km: 0.404,
    rate_per_mile: 0.65,
    currency: 'USD',
    year: 2024
  },
  'GB': {
    country_code: 'GB',
    rate_per_km: 0.31,
    rate_per_mile: 0.50,
    currency: 'GBP',
    year: 2024
  },
  'DE': {
    country_code: 'DE',
    rate_per_km: 0.30,
    rate_per_mile: 0.48,
    currency: 'EUR',
    year: 2024
  },
  'FR': {
    country_code: 'FR',
    rate_per_km: 0.29,
    rate_per_mile: 0.47,
    currency: 'EUR',
    year: 2024
  },
  'ES': {
    country_code: 'ES',
    rate_per_km: 0.28,
    rate_per_mile: 0.45,
    currency: 'EUR',
    year: 2024
  },
  'IT': {
    country_code: 'IT',
    rate_per_km: 0.32,
    rate_per_mile: 0.52,
    currency: 'EUR',
    year: 2024
  },
  'NL': {
    country_code: 'NL',
    rate_per_km: 0.35,
    rate_per_mile: 0.56,
    currency: 'EUR',
    year: 2024
  },
  'CH': {
    country_code: 'CH',
    rate_per_km: 0.42,
    rate_per_mile: 0.68,
    currency: 'CHF',
    year: 2024
  },
  'AT': {
    country_code: 'AT',
    rate_per_km: 0.31,
    rate_per_mile: 0.50,
    currency: 'EUR',
    year: 2024
  },
  'BE': {
    country_code: 'BE',
    rate_per_km: 0.30,
    rate_per_mile: 0.48,
    currency: 'EUR',
    year: 2024
  },
  'SE': {
    country_code: 'SE',
    rate_per_km: 0.38,
    rate_per_mile: 0.61,
    currency: 'SEK',
    year: 2024
  },
  'NO': {
    country_code: 'NO',
    rate_per_km: 0.45,
    rate_per_mile: 0.72,
    currency: 'NOK',
    year: 2024
  },
  'DK': {
    country_code: 'DK',
    rate_per_km: 0.40,
    rate_per_mile: 0.64,
    currency: 'DKK',
    year: 2024
  },
  'FI': {
    country_code: 'FI',
    rate_per_km: 0.36,
    rate_per_mile: 0.58,
    currency: 'EUR',
    year: 2024
  },
  'JP': {
    country_code: 'JP',
    rate_per_km: 0.25,
    rate_per_mile: 0.40,
    currency: 'JPY',
    year: 2024
  },
  'KR': {
    country_code: 'KR',
    rate_per_km: 0.22,
    rate_per_mile: 0.35,
    currency: 'KRW',
    year: 2024
  },
  'SG': {
    country_code: 'SG',
    rate_per_km: 0.35,
    rate_per_mile: 0.56,
    currency: 'SGD',
    year: 2024
  },
  'HK': {
    country_code: 'HK',
    rate_per_km: 0.32,
    rate_per_mile: 0.52,
    currency: 'HKD',
    year: 2024
  },
  'AU': {
    country_code: 'AU',
    rate_per_km: 0.48,
    rate_per_mile: 0.77,
    currency: 'AUD',
    year: 2024
  },
  'NZ': {
    country_code: 'NZ',
    rate_per_km: 0.46,
    rate_per_mile: 0.74,
    currency: 'NZD',
    year: 2024
  },
  'CA': {
    country_code: 'CA',
    rate_per_km: 0.38,
    rate_per_mile: 0.61,
    currency: 'CAD',
    year: 2024
  },
  'TH': {
    country_code: 'TH',
    rate_per_km: 0.08,
    rate_per_mile: 0.13,
    currency: 'THB',
    year: 2024
  },
  'MY': {
    country_code: 'MY',
    rate_per_km: 0.12,
    rate_per_mile: 0.19,
    currency: 'MYR',
    year: 2024
  },
  'PH': {
    country_code: 'PH',
    rate_per_km: 0.10,
    rate_per_mile: 0.16,
    currency: 'PHP',
    year: 2024
  },
  'ID': {
    country_code: 'ID',
    rate_per_km: 0.09,
    rate_per_mile: 0.14,
    currency: 'IDR',
    year: 2024
  },
  'VN': {
    country_code: 'VN',
    rate_per_km: 0.07,
    rate_per_mile: 0.11,
    currency: 'VND',
    year: 2024
  },
  'IN': {
    country_code: 'IN',
    rate_per_km: 0.06,
    rate_per_mile: 0.10,
    currency: 'INR',
    year: 2024
  },
  'CN': {
    country_code: 'CN',
    rate_per_km: 0.15,
    rate_per_mile: 0.24,
    currency: 'CNY',
    year: 2024
  },
  'AE': {
    country_code: 'AE',
    rate_per_km: 0.25,
    rate_per_mile: 0.40,
    currency: 'AED',
    year: 2024
  }
};

class ExpenseService {
  static getDailyAllowance(countryCode: string): DailyAllowance | null {
    return DAILY_ALLOWANCES[countryCode] || null;
  }

  static getMileageRate(countryCode: string): MileageRate | null {
    return MILEAGE_RATES[countryCode] || null;
  }

  static getAllDailyAllowances(): DailyAllowance[] {
    return Object.values(DAILY_ALLOWANCES);
  }

  static calculateMileageExpense(distance: number, countryCode: string, unit: 'km' | 'mile' = 'km'): number {
    const rates = this.getMileageRate(countryCode);
    if (!rates) return 0;

    return unit === 'km' ? distance * rates.rate_per_km : distance * rates.rate_per_mile;
  }

  static generateExpenseReport(expenses: Record<string, any>[], startDate: string, endDate: string) {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      total_expenses: totalAmount,
      expense_count: expenses.length,
      by_category: this.groupExpensesByCategory(expenses),
      by_country: this.groupExpensesByCountry(expenses),
      period: { start_date: startDate, end_date: endDate }
    };
  }

  private static groupExpensesByCategory(expenses: Record<string, any>[]) {
    return expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {});
  }

  private static groupExpensesByCountry(expenses: Record<string, any>[]) {
    return expenses.reduce((acc, expense) => {
      acc[expense.country_code] = (acc[expense.country_code] || 0) + expense.amount;
      return acc;
    }, {});
  }
}

export default ExpenseService;
