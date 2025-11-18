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
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <span className="text-5xl">🛡️</span>
        </div>

        <div className="space-y-3">
          <EditableText
            value={data.company}
            onSave={(v) => onUpdate({ company: v })}
            className="text-7xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          />
          <EditableText
            value={data.tagline}
            onSave={(v) => onUpdate({ tagline: v })}
            className="text-2xl text-muted-foreground uppercase tracking-wide"
          />
        </div>

        <div className="border-t border-b border-border/50 py-4 px-8 bg-card/30 backdrop-blur-sm rounded-lg">
          <div className="text-lg font-semibold text-foreground mb-2">Series A | Q1 2025</div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <div className="text-left">
            <div className="text-muted-foreground">Current Traction</div>
            <div className="text-primary font-bold">150,000+ Waitlist</div>
          </div>
          <div className="text-left">
            <div className="text-muted-foreground">Product</div>
            <div className="text-primary font-bold">150+ Components Built</div>
          </div>
          <div className="text-left">
            <div className="text-muted-foreground">Market</div>
            <div className="text-primary font-bold">$110B Infrastructure</div>
          </div>
          <div className="text-left">
            <div className="text-muted-foreground">Team</div>
            <div className="text-primary font-bold">Ex-Google, Travel Tech</div>
          </div>
        </div>

        <div className="space-y-1 text-xs text-muted-foreground pt-4">
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
