import { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { FinancialAssumptions, YearlyProjection } from '@/types/pitchDeck';

interface FinancialModelingPanelProps {
  assumptions: FinancialAssumptions;
  onUpdate: (assumptions: FinancialAssumptions) => void;
  onClose: () => void;
}

export const FinancialModelingPanel = ({
  assumptions,
  onUpdate,
  onClose,
}: FinancialModelingPanelProps) => {
  const [localAssumptions, setLocalAssumptions] = useState(assumptions);

  const updateAssumption = (key: keyof FinancialAssumptions, value: number) => {
    const updated = { ...localAssumptions, [key]: value };
    setLocalAssumptions(updated);
    onUpdate(updated);
  };

  const calculateProjections = (): YearlyProjection[] => {
    const projections: YearlyProjection[] = [];
    let currentUsers = 10000;

    for (let year = 2024; year <= 2026; year++) {
      const paidUsers = Math.round(currentUsers * (localAssumptions.conversionRate / 100));
      const revenue = Math.round(paidUsers * localAssumptions.arpu * 12);
      const acquisitionCosts = Math.round(currentUsers * localAssumptions.cpa);
      const teamCosts = localAssumptions.teamSize * 80000;
      const costs = acquisitionCosts + teamCosts + localAssumptions.infrastructureCosts * 12;
      const profit = revenue - costs;

      projections.push({
        year,
        users: currentUsers,
        revenue,
        costs,
        profit,
      });

      currentUsers = Math.round(currentUsers * (1 + localAssumptions.userGrowthRate / 100));
    }

    return projections;
  };

  const projections = calculateProjections();

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card border-l shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Financial Modeling</h3>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Assumptions */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Adjust Assumptions</h4>

          <div className="space-y-3">
            <div>
              <Label className="text-xs">User Growth Rate: {localAssumptions.userGrowthRate}%</Label>
              <Slider
                value={[localAssumptions.userGrowthRate]}
                onValueChange={([v]) => updateAssumption('userGrowthRate', v)}
                min={10}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">Conversion Rate: {localAssumptions.conversionRate}%</Label>
              <Slider
                value={[localAssumptions.conversionRate]}
                onValueChange={([v]) => updateAssumption('conversionRate', v)}
                min={1}
                max={20}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">ARPU (Monthly): ${localAssumptions.arpu}</Label>
              <Slider
                value={[localAssumptions.arpu]}
                onValueChange={([v]) => updateAssumption('arpu', v)}
                min={5}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">Cost Per Acquisition: ${localAssumptions.cpa}</Label>
              <Slider
                value={[localAssumptions.cpa]}
                onValueChange={([v]) => updateAssumption('cpa', v)}
                min={10}
                max={100}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">Infrastructure (Monthly): ${localAssumptions.infrastructureCosts}</Label>
              <Slider
                value={[localAssumptions.infrastructureCosts]}
                onValueChange={([v]) => updateAssumption('infrastructureCosts', v)}
                min={1000}
                max={20000}
                step={1000}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-xs">Team Size: {localAssumptions.teamSize}</Label>
              <Slider
                value={[localAssumptions.teamSize]}
                onValueChange={([v]) => updateAssumption('teamSize', v)}
                min={3}
                max={20}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Projections */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">3-Year Projections</h4>
          {projections.map((p) => (
            <Card key={p.year} className="p-4 space-y-2">
              <div className="font-semibold text-primary">{p.year}</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Users</div>
                  <div className="font-medium">{p.users.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Revenue</div>
                  <div className="font-medium text-green-600">${(p.revenue / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Costs</div>
                  <div className="font-medium text-orange-600">${(p.costs / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Profit</div>
                  <div className={`font-medium ${p.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(p.profit / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
