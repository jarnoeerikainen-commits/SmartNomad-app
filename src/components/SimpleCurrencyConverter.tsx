import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeftRight, TrendingUp, TrendingDown, DollarSign, Bitcoin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  type: 'fiat' | 'crypto';
  icon?: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change24h: number;
  lastUpdated: string;
}

// Combined currency list with both fiat and crypto
const CURRENCIES: Currency[] = [
  // Major Fiat Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat' },
  { code: 'EUR', name: 'Euro', symbol: '€', type: 'fiat' },
  { code: 'GBP', name: 'British Pound', symbol: '£', type: 'fiat' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', type: 'fiat' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', type: 'fiat' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', type: 'fiat' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', type: 'fiat' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', type: 'fiat' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', type: 'fiat' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', type: 'fiat' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', type: 'fiat' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', type: 'fiat' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', type: 'fiat' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', type: 'fiat' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', type: 'fiat' },
  
  // Major Cryptocurrencies
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto' },
  { code: 'USDT', name: 'Tether', symbol: 'USDT', type: 'crypto' },
  { code: 'BNB', name: 'Binance Coin', symbol: 'BNB', type: 'crypto' },
  { code: 'SOL', name: 'Solana', symbol: 'SOL', type: 'crypto' },
  { code: 'XRP', name: 'Ripple', symbol: 'XRP', type: 'crypto' },
  { code: 'ADA', name: 'Cardano', symbol: 'ADA', type: 'crypto' },
  { code: 'DOGE', name: 'Dogecoin', symbol: 'DOGE', type: 'crypto' },
  { code: 'MATIC', name: 'Polygon', symbol: 'MATIC', type: 'crypto' },
  { code: 'DOT', name: 'Polkadot', symbol: 'DOT', type: 'crypto' },
];

// Mock exchange rates that update once per day
const generateMockRates = (from: string, to: string): ExchangeRate => {
  // Use current date as seed for consistent daily rates
  const today = new Date().toDateString();
  const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (Math.sin(seed + from.charCodeAt(0) + to.charCodeAt(0)) + 1) / 2;
  
  // Base rates (approximate real-world values)
  const baseRates: Record<string, number> = {
    'USD': 1,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 149.5,
    'CHF': 0.88,
    'CAD': 1.36,
    'AUD': 1.52,
    'NZD': 1.67,
    'SGD': 1.34,
    'HKD': 7.82,
    'CNY': 7.24,
    'INR': 83.12,
    'BRL': 4.97,
    'MXN': 17.08,
    'ZAR': 18.45,
    'BTC': 0.000023,
    'ETH': 0.00031,
    'USDT': 1.0,
    'BNB': 0.0026,
    'SOL': 0.0089,
    'XRP': 1.89,
    'ADA': 2.33,
    'DOGE': 12.5,
    'MATIC': 1.43,
    'DOT': 0.189,
  };
  
  const fromRate = baseRates[from] || 1;
  const toRate = baseRates[to] || 1;
  const rate = toRate / fromRate;
  
  // Generate realistic 24h change (-5% to +5%)
  const change24h = (random - 0.5) * 10;
  
  return {
    from,
    to,
    rate,
    change24h,
    lastUpdated: new Date().toLocaleString(),
  };
};

export const SimpleCurrencyConverter: React.FC = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['EUR', 'GBP', 'BTC']);

  // Helper functions defined first
  const getCurrency = (code: string) => CURRENCIES.find(c => c.code === code);

  const getCurrencyDecimals = (code: string): number => {
    const currency = getCurrency(code);
    if (currency?.type === 'crypto') {
      if (['BTC', 'ETH'].includes(code)) return 8;
      return 6;
    }
    if (['JPY', 'KRW'].includes(code)) return 0;
    return 2;
  };

  const fetchExchangeRate = async () => {
    setLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const rate = generateMockRates(fromCurrency, toCurrency);
    setExchangeRate(rate);
    setLoading(false);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = exchangeRate && amount 
    ? (parseFloat(amount) * exchangeRate.rate).toFixed(getCurrencyDecimals(toCurrency))
    : '0';

  useEffect(() => {
    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  const formatAmount = (value: string, currencyCode: string) => {
    const currency = getCurrency(currencyCode);
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;
    
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: getCurrencyDecimals(currencyCode),
      maximumFractionDigits: getCurrencyDecimals(currencyCode),
    }).format(numValue);
  };

  const toggleFavorite = (code: string) => {
    setFavorites(prev => 
      prev.includes(code) 
        ? prev.filter(c => c !== code)
        : [...prev, code]
    );
  };

  const quickConvert = (targetCode: string) => {
    const rate = generateMockRates(fromCurrency, targetCode);
    const converted = parseFloat(amount) * rate.rate;
    return converted.toFixed(getCurrencyDecimals(targetCode));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Currency Converter</h1>
          <p className="text-muted-foreground mt-1">
            Convert between fiat currencies and cryptocurrencies
          </p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <DollarSign className="h-4 w-4" />
          Fiat & Crypto
        </Badge>
      </div>

      {/* Main Converter */}
      <Card className="shadow-large border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
            Quick Conversion
          </CardTitle>
          <CardDescription>
            Real-time exchange rates updated daily
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="text-xl font-semibold h-14"
            />
          </div>

          {/* From Currency */}
          <div className="space-y-2">
            <Label htmlFor="from-currency">From</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger id="from-currency" className="h-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] bg-card z-[100]">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  Fiat Currencies
                </div>
                {CURRENCIES.filter(c => c.type === 'fiat').map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{currency.code}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-sm">{currency.name}</span>
                      <span className="text-muted-foreground ml-auto">{currency.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                  <Bitcoin className="inline h-3 w-3 mr-1" />
                  Cryptocurrencies
                </div>
                {CURRENCIES.filter(c => c.type === 'crypto').map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <Bitcoin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{currency.code}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-sm">{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={swapCurrencies}
              className="rounded-full h-12 w-12 shadow-medium hover:shadow-large transition-all hover:rotate-180 duration-300"
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <Label htmlFor="to-currency">To</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger id="to-currency" className="h-14">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] bg-card z-[100]">
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                  Fiat Currencies
                </div>
                {CURRENCIES.filter(c => c.type === 'fiat').map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{currency.code}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-sm">{currency.name}</span>
                      <span className="text-muted-foreground ml-auto">{currency.symbol}</span>
                    </div>
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-xs font-semibold text-muted-foreground border-t mt-1 pt-2">
                  <Bitcoin className="inline h-3 w-3 mr-1" />
                  Cryptocurrencies
                </div>
                {CURRENCIES.filter(c => c.type === 'crypto').map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <Bitcoin className="h-4 w-4 text-primary" />
                      <span className="font-semibold">{currency.code}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-sm">{currency.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Result */}
          {exchangeRate && (
            <div className="gradient-trust p-6 rounded-xl space-y-3">
              <div className="text-center">
                <p className="text-sm text-primary-foreground/70 mb-2">You get</p>
                <p className="text-4xl font-bold text-primary-foreground">
                  {getCurrency(toCurrency)?.symbol} {formatAmount(convertedAmount, toCurrency)}
                </p>
                <p className="text-sm text-primary-foreground/70 mt-1">
                  {getCurrency(toCurrency)?.name}
                </p>
              </div>
              
              <div className="border-t border-primary-foreground/20 pt-3 text-center">
                <p className="text-sm text-primary-foreground/80">
                  1 {fromCurrency} = {exchangeRate.rate.toFixed(getCurrencyDecimals(toCurrency))} {toCurrency}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {exchangeRate.change24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${
                    exchangeRate.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {exchangeRate.change24h >= 0 ? '+' : ''}{exchangeRate.change24h.toFixed(2)}% (24h)
                  </span>
                </div>
                <p className="text-xs text-primary-foreground/60 mt-2">
                  Last updated: {exchangeRate.lastUpdated}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Quick Reference</CardTitle>
          <CardDescription>
            Common conversions from {amount} {fromCurrency}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((currencyCode) => {
              const currency = getCurrency(currencyCode);
              if (!currency || currencyCode === fromCurrency) return null;
              
              const converted = quickConvert(currencyCode);
              
              return (
                <div
                  key={currencyCode}
                  className="p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => setToCurrency(currencyCode)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {currency.type === 'crypto' && (
                        <Bitcoin className="h-4 w-4 text-primary" />
                      )}
                      <span className="font-semibold">{currencyCode}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(currencyCode);
                      }}
                      className="h-6 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-2xl font-bold">
                    {currency.symbol} {formatAmount(converted, currencyCode)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {currency.name}
                  </p>
                </div>
              );
            })}
            
            {/* Add More Button */}
            <div className="p-4 rounded-lg border-2 border-dashed border-accent hover:border-primary transition-colors">
              <Select
                value=""
                onValueChange={(value) => {
                  if (value && !favorites.includes(value)) {
                    toggleFavorite(value);
                  }
                }}
              >
                <SelectTrigger className="border-0 bg-transparent h-full">
                  <div className="flex flex-col items-center justify-center gap-2 h-full">
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Add Currency</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-card z-[100]">
                  {CURRENCIES.filter(c => !favorites.includes(c.code) && c.code !== fromCurrency).map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        {currency.type === 'crypto' && (
                          <Bitcoin className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-semibold">{currency.code}</span>
                        <span className="text-sm text-muted-foreground">- {currency.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Banner */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Demo Mode</p>
              <p className="text-xs text-muted-foreground mt-1">
                Exchange rates are updated once per day for demonstration purposes. 
                In production, you can integrate with live APIs like ExchangeRate-API, CoinGecko, or similar services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleCurrencyConverter;
