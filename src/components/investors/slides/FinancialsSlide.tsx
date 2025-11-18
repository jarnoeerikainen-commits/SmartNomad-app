import { PitchDeckSlide } from '../PitchDeckSlide';
import { FinancialsData } from '@/types/pitchDeck';
import { LineChart, Calculator, TrendingUp, Users, DollarSign } from 'lucide-react';
import { 
  LineChart as RechartsLine, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Area,
  AreaChart,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface FinancialsSlideProps {
  data: FinancialsData;
  onUpdate: (updates: Partial<FinancialsData>) => void;
  onOpenModeling: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg animate-fade-in">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="font-bold" style={{ color: entry.color }}>
              ${(entry.value / 1000000).toFixed(1)}M
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const FinancialsSlide = ({ data, onUpdate, onOpenModeling }: FinancialsSlideProps) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  return (
    <PitchDeckSlide background="bg-gradient-to-br from-emerald-500/10 via-background to-blue-500/10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LineChart className="h-12 w-12 text-primary" />
            <h2 className="text-5xl font-bold">Path to $150M ARR</h2>
          </div>
          <Button 
            onClick={onOpenModeling} 
            variant="outline" 
            size="sm"
            className="hover:scale-105 transition-transform"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Open Model
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue & Cost Trajectory
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.projections}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="year" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="line"
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Area 
                  type="monotone" 
                  dataKey="costs" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  fill="url(#colorCosts)"
                  name="Costs"
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              Profitability Timeline
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart 
                data={data.projections}
                onMouseMove={(state) => {
                  if (state.isTooltipActive) {
                    setHoveredBar(state.activeTooltipIndex ?? null);
                  } else {
                    setHoveredBar(null);
                  }
                }}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="rect"
                />
                <Bar 
                  dataKey="profit" 
                  name="Net Profit"
                  radius={[8, 8, 0, 0]}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {data.projections.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.profit > 0 ? '#10b981' : '#ef4444'}
                      className={`transition-all ${hoveredBar === index ? 'opacity-80' : 'opacity-100'}`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {data.projections.map((p, index) => (
            <div 
              key={p.year} 
              className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm rounded-xl p-5 border border-border/50 hover:scale-105 hover:shadow-lg transition-all duration-300 animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {p.year}
                </div>
                <Users className="h-6 w-6 text-primary/60" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-bold text-foreground">
                    {(p.users / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Revenue</span>
                  <span className="font-bold text-emerald-500">
                    ${(p.revenue / 1000000).toFixed(0)}M
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Costs</span>
                  <span className="font-medium text-orange-500">
                    ${(p.costs / 1000000).toFixed(0)}M
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-border/50 pt-2 mt-2">
                  <span className="text-muted-foreground font-medium">Net Profit</span>
                  <span className={`font-bold text-lg ${p.profit > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {p.profit > 0 ? '+' : ''}${(p.profit / 1000000).toFixed(0)}M
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl p-5 border border-primary/30">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Key Assumptions</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">User Growth</div>
                <div className="text-2xl font-bold text-primary">{data.assumptions.userGrowthRate}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Conversion Rate</div>
                <div className="text-2xl font-bold text-primary">{data.assumptions.conversionRate}%</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">ARPU</div>
                <div className="text-2xl font-bold text-primary">${data.assumptions.arpu}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">CAC</div>
                <div className="text-2xl font-bold text-primary">${data.assumptions.cpa}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-xl p-5 border border-emerald-500/30">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Year 3 Highlights</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ARR</span>
                <span className="font-bold text-emerald-500">$150M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gross Margin</span>
                <span className="font-bold text-emerald-500">60%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team Size</span>
                <span className="font-bold text-foreground">{data.assumptions.teamSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profitability</span>
                <span className="font-bold text-emerald-500">Month 18</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
