import { PitchDeckSlide } from '../PitchDeckSlide';
import { GoToMarketData } from '@/types/pitchDeck';
import { Target, Calendar } from 'lucide-react';

interface GoToMarketSlideProps {
  data: GoToMarketData;
  onUpdate: (updates: Partial<GoToMarketData>) => void;
}

export const GoToMarketSlide = ({ data, onUpdate }: GoToMarketSlideProps) => {
  return (
    <PitchDeckSlide>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Target className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">Go-to-Market Strategy</h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Acquisition Channels</h3>
            {data.channels.map((channel, i) => (
              <div key={i} className="bg-accent/10 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{channel.name}</span>
                  <span className="text-sm font-medium text-primary">{channel.cost}</span>
                </div>
                <p className="text-sm text-muted-foreground">{channel.description}</p>
              </div>
            ))}

            <div className="bg-primary/10 rounded-lg p-4 mt-6">
              <div className="text-sm text-muted-foreground">Total Marketing Budget</div>
              <div className="text-3xl font-bold text-primary">$11K/month</div>
              <div className="text-xs text-muted-foreground mt-1">
                Target CAC: $25 | LTV: $400+ (16:1 ratio)
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-semibold">Roadmap</h3>
            </div>
            {data.timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{i + 1}</span>
                  </div>
                  {i < data.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-primary/20 my-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="text-sm font-medium text-primary mb-1">{item.quarter}</div>
                  <div className="text-lg">{item.milestone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
