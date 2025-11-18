import { PitchDeckSlide } from '../PitchDeckSlide';
import { TractionData } from '@/types/pitchDeck';
import { Rocket, Users, TrendingUp, DollarSign, Zap, Target } from 'lucide-react';

interface TractionSlideProps {
  data: TractionData;
  onUpdate: (updates: Partial<TractionData>) => void;
}

export const TractionSlide = ({ data, onUpdate }: TractionSlideProps) => {
  const metrics = [
    {
      icon: Users,
      label: 'Total Users',
      value: data.users.toLocaleString(),
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: TrendingUp,
      label: 'Monthly Growth',
      value: `${data.growth}%`,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: DollarSign,
      label: 'Monthly Revenue',
      value: `$${(data.mrr / 1000).toFixed(1)}K`,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Zap,
      label: 'User Engagement',
      value: data.engagement,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      icon: Target,
      label: 'Retention Rate',
      value: `${data.retention}%`,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10',
    },
  ];

  return (
    <PitchDeckSlide background="bg-gradient-to-br from-green-500/10 via-background to-blue-500/10">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Rocket className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">Traction & Metrics</h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div
                key={i}
                className={`${metric.bgColor} rounded-xl p-8 space-y-4 hover:scale-105 transition-transform`}
              >
                <div className={`h-16 w-16 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-8 w-8 ${metric.color}`} />
                </div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className={`text-5xl font-bold ${metric.color}`}>{metric.value}</div>
              </div>
            );
          })}

          <div className="col-span-2 bg-accent/10 rounded-xl p-8 text-center">
            <div className="text-xl text-muted-foreground mb-2">Path to Profitability</div>
            <div className="text-4xl font-bold text-primary">Q4 2024</div>
            <div className="text-sm text-muted-foreground mt-2">
              At current growth rate, with $50K MRR target
            </div>
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
