import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw, ArrowRightLeft, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change: number;
  lastUpdated: Date;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
];

// Mock exchange rates - in production, this would fetch from a real API
const getMockExchangeRate = (from: string, to: string): ExchangeRate => {
  const rates: Record<string, Record<string, number>> = {
    USD: { EUR: 0.92, GBP: 0.79, JPY: 149.50, CAD: 1.35, AUD: 1.52, CHF: 0.88, CNY: 7.24, INR: 83.12, SGD: 1.34, HKD: 7.82, AED: 3.67, MXN: 17.08, BRL: 4.95, ZAR: 18.72 },
    EUR: { USD: 1.09, GBP: 0.86, JPY: 162.50, CAD: 1.47, AUD: 1.65, CHF: 0.96, CNY: 7.88, INR: 90.45, SGD: 1.46, HKD: 8.52, AED: 4.00, MXN: 18.60, BRL: 5.39, ZAR: 20.37 },
    GBP: { USD: 1.27, EUR: 1.16, JPY: 189.24, CAD: 1.71, AUD: 1.93, CHF: 1.12, CNY: 9.18, INR: 105.56, SGD: 1.70, HKD: 9.93, AED: 4.66, MXN: 21.67, BRL: 6.28, ZAR: 23.75 },
  };

  if (from === to) return { from, to, rate: 1, change: 0, lastUpdated: new Date() };
  
  const rate = rates[from]?.[to] || (rates[to]?.[from] ? 1 / rates[to][from] : 1);
  const change = (Math.random() - 0.5) * 2; // Random change between -1% and +1%
  
  return { from, to, rate, change, lastUpdated: new Date() };
};

export const EnhancedCurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriteRates, setFavoriteRates] = useState<string[]>(['GBP', 'JPY', 'CAD']);

  const fetchExchangeRate = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const rate = getMockExchangeRate(fromCurrency, toCurrency);
    setExchangeRate(rate);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchExchangeRate();
    
    // Auto-refresh every minute
    const interval = setInterval(fetchExchangeRate, 60000);
    return () => clearInterval(interval);
  }, [fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = exchangeRate 
    ? (parseFloat(amount || '0') * exchangeRate.rate).toFixed(2)
    : '0.00';

  const fromCurrencyData = CURRENCIES.find(c => c.code === fromCurrency);
  const toCurrencyData = CURRENCIES.find(c => c.code === toCurrency);

  const addToFavorites = (currencyCode: string) => {
    if (!favoriteRates.includes(currencyCode) && currencyCode !== fromCurrency) {
      setFavoriteRates([...favoriteRates, currencyCode]);
    }
  };

  const removeFromFavorites = (currencyCode: string) => {
    setFavoriteRates(favoriteRates.filter(c => c !== currencyCode));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Live Currency Converter
        </CardTitle>
        <CardDescription>
          Real-time exchange rates updated every minute
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Converter */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 space-y-4">
              {/* From Currency */}
              <div className="space-y-2">
                <Label htmlFor="from-amount">From</Label>
                <div className="flex gap-2">
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-[180px] bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <span className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="from-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100"
                    className="flex-1 text-lg font-semibold bg-background"
                  />
                </div>
                {fromCurrencyData && (
                  <p className="text-sm text-muted-foreground">
                    {fromCurrencyData.flag} {fromCurrencyData.name}
                  </p>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapCurrencies}
                  className="rounded-full"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
                <Label htmlFor="to-amount">To</Label>
                <div className="flex gap-2">
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-[180px] bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <span className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.code}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-1 h-12 px-3 py-2 border rounded-md bg-background flex items-center">
                    <span className="text-lg font-bold text-primary">
                      {toCurrencyData?.symbol}{convertedAmount}
                    </span>
                  </div>
                </div>
                {toCurrencyData && (
                  <p className="text-sm text-muted-foreground">
                    {toCurrencyData.flag} {toCurrencyData.name}
                  </p>
                )}
              </div>

              {/* Exchange Rate Info */}
              {exchangeRate && (
                <Card className="bg-background/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Exchange Rate</div>
                        <div className="font-mono font-semibold">
                          1 {fromCurrency} = {exchangeRate.rate.toFixed(4)} {toCurrency}
                        </div>
                      </div>
                      <Badge variant={exchangeRate.change >= 0 ? "default" : "destructive"} className="gap-1">
                        {exchangeRate.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {(exchangeRate.change >= 0 ? '+' : '')}{exchangeRate.change.toFixed(2)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        Updated: {exchangeRate.lastUpdated.toLocaleTimeString()}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={fetchExchangeRate}
                        disabled={isLoading}
                      >
                        <RefreshCw className={`w-3 h-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Quick Reference Rates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Quick Reference</h4>
              <span className="text-xs text-muted-foreground">From {fromCurrency}</span>
            </div>
            
            <div className="grid gap-2">
              {favoriteRates.map((currencyCode) => {
                const currency = CURRENCIES.find(c => c.code === currencyCode);
                const rate = getMockExchangeRate(fromCurrency, currencyCode);
                
                if (!currency) return null;
                
                return (
                  <Card key={currencyCode} className="bg-muted/50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{currency.flag}</span>
                          <div>
                            <div className="font-semibold">{currency.code}</div>
                            <div className="text-xs text-muted-foreground">{currency.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-mono font-semibold">
                              {currency.symbol}{(parseFloat(amount || '100') * rate.rate).toFixed(2)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              1 = {rate.rate.toFixed(4)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromFavorites(currencyCode)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Add More Currencies */}
            {favoriteRates.length < CURRENCIES.length - 1 && (
              <Select onValueChange={addToFavorites}>
                <SelectTrigger>
                  <SelectValue placeholder="Add more currencies to quick reference..." />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES
                    .filter(c => c.code !== fromCurrency && !favoriteRates.includes(c.code))
                    .map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <span className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code} - {currency.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};