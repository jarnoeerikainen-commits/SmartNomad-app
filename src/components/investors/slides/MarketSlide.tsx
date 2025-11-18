import { PitchDeckSlide } from '../PitchDeckSlide';
import { MarketData } from '@/types/pitchDeck';
import { TrendingUp, Target, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';
import { useState } from 'react';

interface MarketSlideProps {
  data: MarketData;
  onUpdate: (updates: Partial<MarketData>) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg animate-fade-in">
        <p className="font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-primary font-bold text-lg">
          ${(payload[0].value / 1000000000).toFixed(1)}B
        </p>
        <p className="text-xs text-muted-foreground">
          {payload[0].name === 'TAM' && 'Total global market'}
          {payload[0].name === 'SAM' && 'Serviceable market'}
          {payload[0].name === 'SOM' && 'Obtainable in 5 years'}
        </p>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="transition-all duration-300"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 16}
        fill={fill}
        opacity={0.3}
      />
    </g>
  );
};

export const MarketSlide = ({ data, onUpdate }: MarketSlideProps) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const chartData = [
    { name: 'TAM', value: data.tam, color: '#8b5cf6', label: 'Total Addressable Market' },
    { name: 'SAM', value: data.sam, color: '#6366f1', label: 'Serviceable Addressable' },
    { name: 'SOM', value: data.som, color: '#3b82f6', label: 'Serviceable Obtainable' },
  ];

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <PitchDeckSlide background="bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-12 w-12 text-primary animate-pulse" />
          <h2 className="text-5xl font-bold">Capturing the $110B Market</h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            {chartData.map((item, index) => (
              <div
                key={item.name}
                className={`bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/50 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer ${
                  activeIndex === index ? 'scale-105 shadow-lg ring-2 ring-primary/50' : ''
                }`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
              >
                <div className="flex items-center gap-3 mb-2">
                  {index === 0 && <Globe className="h-6 w-6 text-purple-500" />}
                  {index === 1 && <Target className="h-6 w-6 text-blue-500" />}
                  {index === 2 && <TrendingUp className="h-6 w-6 text-primary" />}
                  <div className="text-sm text-muted-foreground font-medium">{item.label}</div>
                </div>
                <div 
                  className="text-4xl font-bold animate-fade-in"
                  style={{ color: item.color }}
                >
                  ${index === 2 
                    ? (item.value / 1000000).toFixed(0) + 'M'
                    : (item.value / 1000000000).toFixed(1) + 'B'
                  }
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {index === 0 && 'Digital nomad infrastructure'}
                  {index === 1 && 'Remote work compliance tools'}
                  {index === 2 && '5-year target (13.6% of SAM)'}
                </div>
              </div>
            ))}

            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-5 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Market CAGR</div>
                  <div className="text-5xl font-bold text-green-500 animate-fade-in">
                    {data.cagr}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
                  <div className="text-lg font-semibold text-green-500">Year {data.year}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={130}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  animationBegin={0}
                  animationDuration={800}
                  animationEasing="ease-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="text-center mt-4 space-y-2">
              <div className="text-sm text-muted-foreground">Market Accelerators</div>
              <div className="flex gap-3 text-xs">
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  74% Remote Adoption
                </div>
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  50+ Nomad Visas
                </div>
                <div className="bg-primary/10 px-3 py-1 rounded-full">
                  300% Travel Growth
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
