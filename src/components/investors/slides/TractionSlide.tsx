import { PitchDeckSlide } from '../PitchDeckSlide';
import { TractionData } from '@/types/pitchDeck';
import { Rocket, Users, TrendingUp, Activity, Target } from 'lucide-react';

interface TractionSlideProps {
  data: TractionData;
  onUpdate: (updates: Partial<TractionData>) => void;
}

export const TractionSlide = ({ data, onUpdate }: TractionSlideProps) => {
  return (
    <PitchDeckSlide background="bg-gradient-to-br from-green-500/10 via-background to-blue-500/10">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Rocket className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">Explosive Pre-Launch Momentum</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-10 w-10 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Waitlist Growth</div>
                <div className="text-5xl font-bold text-foreground">
                  {data.users.toLocaleString()}+
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  12,000 → 150,000 in 90 days
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/50 text-center">
              <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">MoM Growth</div>
              <div className="text-3xl font-bold text-green-500">{data.growth}%</div>
              <div className="text-xs text-muted-foreground mt-1">Organic</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/50 text-center">
              <Activity className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">Beta Satisfaction</div>
              <div className="text-3xl font-bold text-foreground">{data.retention}%</div>
              <div className="text-xs text-muted-foreground mt-1">High engagement</div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-5 border border-border/50 text-center">
              <Target className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">NPS Score</div>
              <div className="text-3xl font-bold text-foreground">7.2/10</div>
              <div className="text-xs text-muted-foreground mt-1">Strong product-market fit</div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-4">Partnership Pipeline</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">LOIs from Co-working</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Service Providers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Gov't</div>
                <div className="text-sm text-muted-foreground">Partnerships in Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50">
            <h3 className="text-xl font-bold mb-4">Technical Milestones</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-muted-foreground">150+ production-ready components</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-muted-foreground">13 language internationalization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-muted-foreground">195+ country compliance database</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span className="text-muted-foreground">4 AI assistants trained & integrated</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
