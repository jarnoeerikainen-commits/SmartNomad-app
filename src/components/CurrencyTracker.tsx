import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, RefreshCw, Plus } from 'lucide-react';

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
  symbol: string;
}

const POPULAR_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' }
];

export const CurrencyTracker: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [trackedCurrencies, setTrackedCurrencies] = useState<string[]>(['EUR', 'GBP', 'JPY']);
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [amount, setAmount] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Mock exchange rates (in real app, would fetch from API)
  const mockRates: Record<string, { rate: number; change: number }> = {
    'EUR': { rate: 0.92, change: -0.015 },
    'GBP': { rate: 0.79, change: 0.008 },
    'JPY': { rate: 149.50, change: 0.45 },
    'CAD': { rate: 1.35, change: -0.002 },
    'AUD': { rate: 1.52, change: 0.012 },
    'CHF': { rate: 0.88, change: -0.005 },
    'CNY': { rate: 7.24, change: 0.018 }
  };

  const fetchRates = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const currencyRates: CurrencyRate[] = trackedCurrencies.map(code => {
      const currency = POPULAR_CURRENCIES.find(c => c.code === code);
      const rateData = mockRates[code] || { rate: 1, change: 0 };
      
      return {
        code,
        name: currency?.name || code,
        symbol: currency?.symbol || code,
        rate: rateData.rate,
        change: rateData.change
      };
    });

    setRates(currencyRates);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRates();
  }, [trackedCurrencies, baseCurrency]);

  const addCurrency = (currencyCode: string) => {
    if (!trackedCurrencies.includes(currencyCode)) {
      setTrackedCurrencies(prev => [...prev, currencyCode]);
    }
  };

  const removeCurrency = (currencyCode: string) => {
    setTrackedCurrencies(prev => prev.filter(code => code !== currencyCode));
  };

  const formatCurrency = (amount: number, currency: CurrencyRate) => {
    const convertedAmount = amount * currency.rate;
    return `${currency.symbol}${convertedAmount.toFixed(2)}`;
  };

  const availableCurrencies = POPULAR_CURRENCIES.filter(
    c => c.code !== baseCurrency && !trackedCurrencies.includes(c.code)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Currency Tracker
        </CardTitle>
        <CardDescription>
          Real-time exchange rates for your travels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Currency Converter */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="base-currency">Base Currency</Label>
                <select
                  id="base-currency"
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {POPULAR_CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated?.toLocaleTimeString() || 'Never'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchRates}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>

          {/* Exchange Rates */}
          <div className="space-y-3">
            {rates.map((currency) => (
              <Card key={currency.code}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-semibold">{currency.code}</div>
                        <div className="text-sm text-muted-foreground">{currency.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono">1 {baseCurrency} = {currency.rate.toFixed(4)} {currency.code}</div>
                        <div className="text-lg font-semibold">
                          {formatCurrency(amount, currency)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={currency.change >= 0 ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {currency.change >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {(currency.change >= 0 ? '+' : '')}{(currency.change * 100).toFixed(2)}%
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCurrency(currency.code)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add Currency */}
          {availableCurrencies.length > 0 && (
            <div className="space-y-3">
              <Label>Add Currency</Label>
              <div className="flex flex-wrap gap-2">
                {availableCurrencies.map((currency) => (
                  <Button
                    key={currency.code}
                    variant="outline"
                    size="sm"
                    onClick={() => addCurrency(currency.code)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {currency.code}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};