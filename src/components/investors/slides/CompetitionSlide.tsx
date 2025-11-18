import { PitchDeckSlide } from '../PitchDeckSlide';
import { CompetitionData } from '@/types/pitchDeck';
import { Shield, ThumbsUp, ThumbsDown, Star } from 'lucide-react';

interface CompetitionSlideProps {
  data: CompetitionData;
  onUpdate: (updates: Partial<CompetitionData>) => void;
}

export const CompetitionSlide = ({ data, onUpdate }: CompetitionSlideProps) => {
  return (
    <PitchDeckSlide>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Shield className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">Competition</h2>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {data.competitors.map((comp, i) => (
            <div key={i} className="bg-accent/10 rounded-xl p-6 space-y-4">
              <h3 className="text-2xl font-semibold">{comp.name}</h3>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Strengths</span>
                </div>
                {comp.strengths.map((s, j) => (
                  <div key={j} className="text-sm pl-6">
                    • {s}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <ThumbsDown className="h-4 w-4" />
                  <span>Weaknesses</span>
                </div>
                {comp.weaknesses.map((w, j) => (
                  <div key={j} className="text-sm pl-6">
                    • {w}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-primary/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-xl font-semibold">
            <Star className="h-6 w-6 text-primary" />
            <span>Our Competitive Advantages</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {data.advantages.map((adv, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs font-bold">{i + 1}</span>
                </div>
                <span className="text-lg">{adv}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
