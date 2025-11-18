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
            <div key={p.year} className="bg-accent/10 rounded-lg p-4 space-y-2">
              <div className="text-2xl font-bold text-primary">{p.year}</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">{p.users.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-medium text-green-600">${(p.revenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Costs</span>
                  <span className="font-medium text-orange-600">${(p.costs / 1000).toFixed(0)}K</span>
                </div>
                <div className="flex justify-between border-t pt-1">
                  <span className="text-muted-foreground">Profit</span>
                  <span className={`font-bold ${p.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(p.profit / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PitchDeckSlide>
  );
};
