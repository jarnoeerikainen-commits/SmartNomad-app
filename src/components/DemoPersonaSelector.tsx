import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle, MapPin, Briefcase, Plane, Dumbbell, Users, Calendar } from 'lucide-react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { DEMO_PERSONAS } from '@/data/demoPersonas';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

interface ProfileCardProps {
  personaId: 'meghan' | 'john';
  children: React.ReactNode;
}

const ProfileHoverCard: React.FC<ProfileCardProps> = ({ personaId, children }) => {
  const persona = DEMO_PERSONAS[personaId];
  if (!persona) return <>{children}</>;

  const p = persona.profile;
  const t = persona.travel;
  const l = persona.lifestyle;
  const f = persona.family;

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="center" className="w-80 p-0 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-primary/90 to-accent/90 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{persona.icon}</div>
            <div>
              <p className="font-bold text-lg">{p.firstName} {p.lastName}</p>
              <p className="text-xs opacity-90">{p.occupation} at {p.company}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span>{p.city}, {p.country}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Age:</span>
              <span>{p.age}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <span>{p.industry}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">Income:</span>
              <span>{p.incomeBracket}</span>
            </div>
          </div>

          {/* Travel Style */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-1.5 mb-2">
              <Plane className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide">Travel Profile</p>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{t.flightClass}</Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{t.averageTravelDays} days/year</Badge>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">{t.style}</Badge>
            </div>
            <div className="text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">Frequent: </span>
              {t.frequentDestinations.slice(0, 4).join(', ')}
            </div>
          </div>

          {/* Lifestyle */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-1.5 mb-2">
              <Dumbbell className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide">Lifestyle</p>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {l.sports.slice(0, 3).map(sport => (
                <Badge key={sport} variant="outline" className="text-[10px] px-1.5 py-0.5 capitalize">{sport}</Badge>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-2">{l.dietary}</p>
          </div>

          {/* Family */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide">Family</p>
            </div>
            <p className="text-xs">{f.status} {f.children.length > 0 && `• ${f.children.length} children`}</p>
            {f.children.length > 0 && (
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {f.children.map(c => `${c.name} (${c.age})`).join(', ')}
              </p>
            )}
          </div>

          {/* Upcoming Trips */}
          <div className="pt-2 border-t">
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide">Upcoming Trips</p>
            </div>
            <div className="space-y-1">
              {t.upcomingTrips.slice(0, 3).map((trip, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="font-medium">{trip.destination}</span>
                  <span className="text-muted-foreground">{trip.dates}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="pt-2 border-t">
            <p className="text-[11px] text-muted-foreground leading-relaxed">{p.bio}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export const DemoPersonaSelector: React.FC = () => {
  const { activePersonaId, setPersona } = useDemoPersona();

  return (
    <div className="flex items-center gap-1 px-0 sm:px-2">
      <ProfileHoverCard personaId="meghan">
        <Button
          variant={activePersonaId === 'meghan' ? 'default' : 'outline'}
          size="sm"
          className={`h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3 gap-1 ${
            activePersonaId === 'meghan'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'hover:bg-accent/20'
          }`}
          onClick={() => setPersona(activePersonaId === 'meghan' ? null : 'meghan')}
        >
          <span>👩‍💼</span>
          <span className="hidden sm:inline">Meghan</span>
        </Button>
      </ProfileHoverCard>

      <ProfileHoverCard personaId="john">
        <Button
          variant={activePersonaId === 'john' ? 'default' : 'outline'}
          size="sm"
          className={`h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3 gap-1 ${
            activePersonaId === 'john'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'hover:bg-accent/20'
          }`}
          onClick={() => setPersona(activePersonaId === 'john' ? null : 'john')}
        >
          <span>👨‍💼</span>
          <span className="hidden sm:inline">John</span>
        </Button>
      </ProfileHoverCard>

      {activePersonaId && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 sm:h-8 text-[10px] sm:text-xs px-1.5 sm:px-2 gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => setPersona(null)}
        >
          <UserCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span className="hidden sm:inline">Reset</span>
          <span className="sm:hidden">✕</span>
        </Button>
      )}
    </div>
  );
};
