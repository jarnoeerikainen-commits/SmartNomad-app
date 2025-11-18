import { PitchDeckSlide } from '../PitchDeckSlide';
import { EditableText } from '../EditableText';
import { CoverData } from '@/types/pitchDeck';

interface CoverSlideProps {
  data: CoverData;
  onUpdate: (updates: Partial<CoverData>) => void;
}

export const CoverSlide = ({ data, onUpdate }: CoverSlideProps) => {
  return (
    <PitchDeckSlide background="bg-gradient-to-br from-primary/20 via-background to-accent/20">
      <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
        <div className="space-y-4">
          <EditableText
            value={data.company}
            onSave={(v) => onUpdate({ company: v })}
            className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          />
          <EditableText
            value={data.tagline}
            onSave={(v) => onUpdate({ tagline: v })}
            className="text-3xl text-muted-foreground"
          />
        </div>

        <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-6xl">🌍</span>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <EditableText
            value={data.contact.email}
            onSave={(v) => onUpdate({ contact: { ...data.contact, email: v } })}
          />
          <EditableText
            value={data.contact.website}
            onSave={(v) => onUpdate({ contact: { ...data.contact, website: v } })}
          />
        </div>
      </div>
    </PitchDeckSlide>
  );
};
