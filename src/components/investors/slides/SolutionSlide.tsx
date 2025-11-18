import { PitchDeckSlide } from '../PitchDeckSlide';
import { EditableText } from '../EditableText';
import { SolutionData } from '@/types/pitchDeck';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

interface SolutionSlideProps {
  data: SolutionData;
  onUpdate: (updates: Partial<SolutionData>) => void;
}

export const SolutionSlide = ({ data, onUpdate }: SolutionSlideProps) => {
  return (
    <PitchDeckSlide background="bg-gradient-to-br from-green-500/10 via-background to-primary/10">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Lightbulb className="h-12 w-12 text-green-500" />
          <EditableText
            value={data.title}
            onSave={(v) => onUpdate({ title: v })}
            className="text-5xl font-bold"
          />
        </div>

        <EditableText
          value={data.description}
          onSave={(v) => onUpdate({ description: v })}
          className="text-2xl text-muted-foreground"
          multiline
        />

        <div className="grid gap-3 pt-4">
          {data.benefits.map((benefit, i) => (
            <div key={i} className="flex items-start gap-3 bg-green-500/10 rounded-lg p-4">
              <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
              <EditableText
                value={benefit}
                onSave={(v) => {
                  const updated = [...data.benefits];
                  updated[i] = v;
                  onUpdate({ benefits: updated });
                }}
                className="text-lg flex-1"
              />
            </div>
          ))}
        </div>
      </div>
    </PitchDeckSlide>
  );
};
