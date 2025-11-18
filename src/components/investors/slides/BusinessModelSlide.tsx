import { PitchDeckSlide } from '../PitchDeckSlide';
import { BusinessModelData } from '@/types/pitchDeck';
import { DollarSign, Check } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface BusinessModelSlideProps {
  data: BusinessModelData;
  onUpdate: (updates: Partial<BusinessModelData>) => void;
}

export const BusinessModelSlide = ({ data, onUpdate }: BusinessModelSlideProps) => {
  const colors = ['#8b5cf6', '#6366f1', '#3b82f6'];

  return (
    <PitchDeckSlide>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <DollarSign className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">Business Model</h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Revenue Streams</h3>
            {data.streams.map((stream, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">{stream.name}</span>
                  <span className="text-2xl font-bold text-primary">{stream.percentage}%</span>
                </div>
                <p className="text-sm text-muted-foreground">{stream.description}</p>
              </div>
            ))}

            <div className="pt-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data.streams} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="percentage" radius={[0, 8, 8, 0]}>
                    {data.streams.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Pricing Tiers</h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-muted/30">
                <div className="font-semibold text-lg mb-2">Free</div>
                {data.pricing.free.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-semibold text-lg">Pro</span>
                  <span className="text-3xl font-bold text-primary">${data.pricing.pro.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                {data.pricing.pro.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="border rounded-lg p-4 bg-accent/10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-semibold text-lg">Business</span>
                  <span className="text-3xl font-bold">${data.pricing.business.price}</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                {data.pricing.business.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
