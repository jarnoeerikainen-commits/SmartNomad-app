import React from 'react';
import { ExternalLink, Landmark, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BankService {
  name: string;
  description: string;
  url: string;
  logo: string;
  features: string[];
}

const banks: BankService[] = [
  {
    name: 'Wise',
    description: 'Multi-currency account with real exchange rates',
    url: 'https://wise.com',
    logo: '💳',
    features: ['50+ currencies', 'Low fees', 'International transfers', 'Debit card'],
  },
  {
    name: 'Revolut',
    description: 'Digital banking for global citizens',
    url: 'https://revolut.com',
    logo: '🏦',
    features: ['Multi-currency accounts', 'Crypto trading', 'Stock trading', 'Premium cards'],
  },
  {
    name: 'N26',
    description: 'Simple, secure mobile banking',
    url: 'https://n26.com',
    logo: '🌐',
    features: ['Free basic account', 'European banking', 'Mobile-first', 'Instant notifications'],
  },
];

const DigitalBanks: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Landmark className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Digital Banks</h1>
          <p className="text-muted-foreground">
            Modern banking solutions for digital nomads and travelers
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {banks.map((bank) => (
          <Card key={bank.name} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{bank.logo}</span>
                <div>
                  <CardTitle>{bank.name}</CardTitle>
                  <CardDescription className="mt-1">{bank.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Key Features:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {bank.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <Button 
                className="w-full gap-2" 
                onClick={() => window.open(bank.url, '_blank')}
              >
                <Globe className="h-4 w-4" />
                Visit {bank.name}
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-accent/50">
        <CardHeader>
          <CardTitle className="text-lg">Why Digital Banks?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Digital banks offer unique advantages for travelers and digital nomads:
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Multi-currency accounts with competitive exchange rates</li>
            <li>• Low or no international transaction fees</li>
            <li>• Mobile-first experience accessible anywhere</li>
            <li>• Instant notifications and modern security features</li>
            <li>• Easy account setup without traditional banking requirements</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalBanks;
