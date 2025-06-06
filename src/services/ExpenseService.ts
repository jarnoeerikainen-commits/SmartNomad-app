
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
  'JP': {
    country_code: 'JP',
    country_name: 'Japan',
    daily_rate_usd: 160,
    meal_rate_usd: 65,
    lodging_rate_usd: 190,
    incidental_rate_usd: 22,
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
  'AU': {
    country_code: 'AU',
    country_name: 'Australia',
    daily_rate_usd: 155,
    meal_rate_usd: 62,
    lodging_rate_usd: 185,
    incidental_rate_usd: 21,
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

  static generateExpenseReport(expenses: any[], startDate: string, endDate: string) {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      total_expenses: totalAmount,
      expense_count: expenses.length,
      by_category: this.groupExpensesByCategory(expenses),
      by_country: this.groupExpensesByCountry(expenses),
      period: { start_date: startDate, end_date: endDate }
    };
  }

  private static groupExpensesByCategory(expenses: any[]) {
    return expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {});
  }

  private static groupExpensesByCountry(expenses: any[]) {
    return expenses.reduce((acc, expense) => {
      acc[expense.country_code] = (acc[expense.country_code] || 0) + expense.amount;
      return acc;
    }, {});
  }
}

export default ExpenseService;
