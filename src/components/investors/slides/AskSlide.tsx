import { PitchDeckSlide } from '../PitchDeckSlide';
import { AskData } from '@/types/pitchDeck';
import { Handshake, TrendingUp, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AskSlideProps {
  data: AskData;
  onUpdate: (updates: Partial<AskData>) => void;
}

export const AskSlide = ({ data, onUpdate }: AskSlideProps) => {
  const colors = ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981'];

  return (
    <PitchDeckSlide background="bg-gradient-to-br from-primary/20 via-background to-green-500/10">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Handshake className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">The Ask</h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-primary/10 rounded-xl p-6 space-y-2">
              <div className="text-sm text-muted-foreground">Raising</div>
              <div className="text-6xl font-bold text-primary">
                ${(data.amount / 1000).toFixed(0)}K
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="text-xs text-muted-foreground">Pre-Money Valuation</div>
                <div className="text-2xl font-bold">${(data.valuation / 1000000).toFixed(1)}M</div>
              </div>
              <div className="bg-accent/10 rounded-lg p-4">
                <div className="text-xs text-muted-foreground">Equity Offered</div>
                <div className="text-2xl font-bold text-primary">{data.equity}%</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5" />
                Use of Funds
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={data.useOfFunds}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="amount"
                    nameKey="category"
                  >
                    {data.useOfFunds.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${(value / 1000).toFixed(0)}K`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Milestones
              </h3>
              {data.milestones.map((m, i) => (
                <div key={i} className="bg-accent/10 rounded-lg p-4 space-y-1">
                  <div className="text-sm font-medium text-primary">{m.timeline}</div>
                  <div className="text-base">{m.goal}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Exit Strategy</h3>
              {data.exitStrategy.map((strategy, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">{i + 1}</span>
                  </div>
                  <span>{strategy}</span>
                </div>
              ))}
            </div>

            <div className="bg-green-500/10 rounded-lg p-4 text-center space-y-1">
              <div className="text-xs text-muted-foreground">Projected 5-Year Return</div>
              <div className="text-4xl font-bold text-green-600">8-12x</div>
            </div>
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
