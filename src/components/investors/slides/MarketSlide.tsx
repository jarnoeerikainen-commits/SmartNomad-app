import { PitchDeckSlide } from '../PitchDeckSlide';
import { MarketData } from '@/types/pitchDeck';
import { TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MarketSlideProps {
  data: MarketData;
  onUpdate: (updates: Partial<MarketData>) => void;
}

export const MarketSlide = ({ data, onUpdate }: MarketSlideProps) => {
  const chartData = [
    { name: 'TAM', value: data.tam, color: '#8b5cf6' },
    { name: 'SAM', value: data.sam, color: '#6366f1' },
    { name: 'SOM', value: data.som, color: '#3b82f6' },
  ];

  return (
    <PitchDeckSlide>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">Market Opportunity</h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Addressable Market</div>
              <div className="text-4xl font-bold text-purple-500">
                ${(data.tam / 1000000000).toFixed(1)}B
              </div>
              <div className="text-xs text-muted-foreground">Global travel tech market</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Serviceable Addressable Market</div>
              <div className="text-4xl font-bold text-blue-500">
                ${(data.sam / 1000000000).toFixed(1)}B
              </div>
              <div className="text-xs text-muted-foreground">Digital nomad tools segment</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Serviceable Obtainable Market</div>
              <div className="text-4xl font-bold text-primary">
                ${(data.som / 1000000).toFixed(0)}M
              </div>
              <div className="text-xs text-muted-foreground">5-year target (5% of SAM)</div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground">Market CAGR</div>
              <div className="text-3xl font-bold text-green-500">{data.cagr}%</div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${(value / 1000000000).toFixed(1)}B`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
