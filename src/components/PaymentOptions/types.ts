export type PaymentMethodType = 
  | 'visa' | 'mastercard' | 'amex' 
  | 'paypal' | 'google-pay' | 'apple-pay' 
  | 'stripe' | 'crypto' | 'bank-transfer' | 'wise';

export type CryptoType = 'bitcoin' | 'ethereum' | 'usdt' | 'usdc' | 'solana' | 'bnb';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  lastFour?: string;
  expiryDate?: string;
  holderName?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  // Crypto specific
  cryptoType?: CryptoType;
  walletAddress?: string;
  // Bank specific
  bankName?: string;
  iban?: string;
  // PayPal
  email?: string;
  // Encrypted flag
  isEncrypted: boolean;
}

export interface PaymentPreference {
  id: string;
  name: string;
  description: string;
  primaryMethodId: string;
  fallbackMethodId?: string;
  maxAmount?: number;
  currency: string;
  isActive: boolean;
}

export const PAYMENT_METHOD_CONFIG: Record<PaymentMethodType, {
  label: string;
  icon: string;
  color: string;
  bgClass: string;
}> = {
  'visa': { label: 'Visa', icon: '💳', color: '#1A1F71', bgClass: 'bg-blue-50 dark:bg-blue-950/30' },
  'mastercard': { label: 'Mastercard', icon: '💳', color: '#EB001B', bgClass: 'bg-red-50 dark:bg-red-950/30' },
  'amex': { label: 'American Express', icon: '💳', color: '#006FCF', bgClass: 'bg-sky-50 dark:bg-sky-950/30' },
  'paypal': { label: 'PayPal', icon: '🅿️', color: '#003087', bgClass: 'bg-indigo-50 dark:bg-indigo-950/30' },
  'google-pay': { label: 'Google Pay', icon: '🔵', color: '#4285F4', bgClass: 'bg-blue-50 dark:bg-blue-950/30' },
  'apple-pay': { label: 'Apple Pay', icon: '🍎', color: '#000000', bgClass: 'bg-gray-50 dark:bg-gray-950/30' },
  'stripe': { label: 'Stripe', icon: '⚡', color: '#635BFF', bgClass: 'bg-violet-50 dark:bg-violet-950/30' },
  'crypto': { label: 'Crypto Wallet', icon: '🪙', color: '#F7931A', bgClass: 'bg-amber-50 dark:bg-amber-950/30' },
  'bank-transfer': { label: 'Bank Transfer', icon: '🏦', color: '#2E7D32', bgClass: 'bg-emerald-50 dark:bg-emerald-950/30' },
  'wise': { label: 'Wise', icon: '🌍', color: '#9FE870', bgClass: 'bg-lime-50 dark:bg-lime-950/30' },
};

export const CRYPTO_CONFIG: Record<CryptoType, { label: string; symbol: string; icon: string }> = {
  'bitcoin': { label: 'Bitcoin', symbol: 'BTC', icon: '₿' },
  'ethereum': { label: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
  'usdt': { label: 'Tether', symbol: 'USDT', icon: '₮' },
  'usdc': { label: 'USD Coin', symbol: 'USDC', icon: '$' },
  'solana': { label: 'Solana', symbol: 'SOL', icon: '◎' },
  'bnb': { label: 'BNB', symbol: 'BNB', icon: '🔶' },
};
