
export interface Expense {
  id: string;
  user_id?: string;
  country_code: string;
  type: 'flight' | 'hotel' | 'meal' | 'transport' | 'mileage' | 'daily_allowance' | 'other';
  amount: number;
  currency: string;
  date: string;
  description: string;
  receipt_image?: string;
  category: string;
  is_business: boolean;
  payment_method?: string;
  vendor?: string;
  created_at: string;
}

export interface DailyAllowance {
  country_code: string;
  country_name: string;
  daily_rate_usd: number;
  meal_rate_usd: number;
  lodging_rate_usd: number;
  incidental_rate_usd: number;
  updated_at: string;
}

export interface MileageRate {
  country_code: string;
  rate_per_km: number;
  rate_per_mile: number;
  currency: string;
  year: number;
}

export interface ExpenseReport {
  id: string;
  user_id?: string;
  title: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  expenses: Expense[];
  created_at: string;
}
