import { PitchDeckSlide } from '../PitchDeckSlide';
import { EditableText } from '../EditableText';
import { ProblemData } from '@/types/pitchDeck';
import { AlertTriangle } from 'lucide-react';

interface ProblemSlideProps {
  data: ProblemData;
  onUpdate: (updates: Partial<ProblemData>) => void;
}

export const ProblemSlide = ({ data, onUpdate }: ProblemSlideProps) => {
  return (
    <PitchDeckSlide>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <EditableText
            value={data.title}
            onSave={(v) => onUpdate({ title: v })}
            className="text-5xl font-bold"
          />
        </div>

        <div className="grid gap-4">
          {data.points.map((point, i) => (
            <div key={i} className="flex items-start gap-3 bg-destructive/10 rounded-lg p-4">
              <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-destructive font-bold">{i + 1}</span>
              </div>
              <EditableText
                value={point}
                onSave={(v) => {
                  const updated = [...data.points];
                  updated[i] = v;
                  onUpdate({ points: updated });
                }}
                className="text-xl flex-1"
                multiline
              />
            </div>
          ))}
        </div>

        <div className="flex justify-around pt-4">
          {data.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <EditableText
                value={stat.value}
                onSave={(v) => {
                  const updated = [...data.stats];
                  updated[i].value = v;
                  onUpdate({ stats: updated });
                }}
                className="text-4xl font-bold text-primary"
              />
              <EditableText
                value={stat.label}
                onSave={(v) => {
                  const updated = [...data.stats];
                  updated[i].label = v;
                  onUpdate({ stats: updated });
                }}
                className="text-sm text-muted-foreground"
              />
            </div>
          ))}
        </div>
      </div>
    </PitchDeckSlide>
  );
};
