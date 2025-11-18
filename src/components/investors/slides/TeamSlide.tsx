import { PitchDeckSlide } from '../PitchDeckSlide';
import { TeamData } from '@/types/pitchDeck';
import { Users } from 'lucide-react';

interface TeamSlideProps {
  data: TeamData;
  onUpdate: (updates: Partial<TeamData>) => void;
}

export const TeamSlide = ({ data, onUpdate }: TeamSlideProps) => {
  return (
    <PitchDeckSlide>
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <Users className="h-12 w-12 text-primary" />
          <h2 className="text-5xl font-bold">The Team</h2>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {data.members.map((member, i) => (
            <div key={i} className="space-y-4">
              <div className="h-40 w-40 mx-auto rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold">{member.name}</h3>
                <div className="text-lg text-primary font-medium">{member.role}</div>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent/10 rounded-xl p-6 text-center space-y-2">
          <div className="text-xl font-semibold">Combined Experience</div>
          <div className="text-4xl font-bold text-primary">30+ years</div>
          <div className="text-sm text-muted-foreground">
            in SaaS, travel tech, and digital nomad communities
          </div>
        </div>
      </div>
    </PitchDeckSlide>
  );
};
