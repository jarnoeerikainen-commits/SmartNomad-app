import { PitchDeckSlide } from '../PitchDeckSlide';
import { FinancialsData } from '@/types/pitchDeck';
import { LineChart, Calculator } from 'lucide-react';
import { LineChart as RechartsLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';

interface FinancialsSlideProps {
  data: FinancialsData;
  onUpdate: (updates: Partial<FinancialsData>) => void;
  onOpenModeling: () => void;
}

export const FinancialsSlide = ({ data, onUpdate, onOpenModeling }: FinancialsSlideProps) => {
  return (
    <PitchDeckSlide>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LineChart className="h-12 w-12 text-primary" />
            <h2 className="text-5xl font-bold">Financial Projections</h2>
          </div>
          <Button onClick={onOpenModeling} variant="outline" size="sm">
            <Calculator className="h-4 w-4 mr-2" />
            Open Model
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Revenue Growth</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsLine data={data.projections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="costs" stroke="#ef4444" strokeWidth={2} name="Costs" />
              </RechartsLine>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Profitability</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.projections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                <Legend />
                <Bar dataKey="profit" fill="#10b981" name="Net Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {data.projections.map((p) => (
            <div key={p.year} className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg p-4 space-y-2 border border-border/50">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{p.year}</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-bold text-foreground">{(p.users / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">${(p.revenue / 1000000).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Costs</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">${(p.costs / 1000000).toFixed(0)}M</span>
                </div>
                <div className="flex justify-between items-center border-t border-border/50 pt-2 mt-2">
                  <span className="text-muted-foreground font-medium">Net Profit</span>
                  <span className={`font-bold text-lg ${p.profit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {p.profit > 0 ? '+' : ''}${(p.profit / 1000000).toFixed(0)}M
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-muted-foreground mb-2">Key Assumptions</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>User Growth Rate</span>
                  <span className="font-medium">{data.assumptions.userGrowthRate}%/year</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Conversion</span>
                  <span className="font-medium">{data.assumptions.conversionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>ARPU (Annual)</span>
                  <span className="font-medium">${data.assumptions.arpu}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-2">Revenue Streams</div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Premium Subscriptions</span>
                  <span className="font-medium">~5%</span>
                </div>
                <div className="flex justify-between">
                  <span>Affiliate Income</span>
                  <span className="font-medium">~57%</span>
                </div>
                <div className="flex justify-between">
                  <span>Advertising</span>
                  <span className="font-medium">~38%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
