import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Calendar, ArrowRight, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroPulse from '@/assets/hero-pulse.jpg';
import heroVibe from '@/assets/hero-vibe.jpg';
import heroEvents from '@/assets/hero-events.jpg';

interface DashboardHeroCardsProps {
  onNavigate: (section: string) => void;
}

const DashboardHeroCards: React.FC<DashboardHeroCardsProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const heroCards = [
    {
      id: 'nomad-chat',
      title: 'SuperNomad Pulse',
      subtitle: 'Supernomad Pulse uses advanced AI to instantly connect you with your perfect adventure partners, wherever you are. Fast ID & Face Match verification in 1 min.',
      buttonText: 'Explore Groups',
      icon: MessageSquare,
      image: heroPulse,
      accentClass: 'from-primary to-primary/80',
      badgeText: 'AI-Powered Matching',
    },
    {
      id: 'social-chat',
      title: 'SuperNomad Vibe',
      subtitle: 'AI Breaks the Ice, Not Your Privacy. Fast ID & Face Match verification in 1 min. Experience spontaneous chats with verified nomads, backed by intelligent safety systems that let you be yourself, freely and securely.',
      buttonText: 'Start Chatting',
      icon: Users,
      image: heroVibe,
      accentClass: 'from-accent to-accent/80',
      badgeText: 'Privacy-First Chat',
    },
    {
      id: 'explore-local-life',
      title: 'Local Events & Markets',
      subtitle: 'Discover workshops, meetups, and hidden gems.',
      buttonText: 'Discover Events',
      icon: Calendar,
      image: heroEvents,
      accentClass: 'from-secondary to-secondary/80',
      badgeText: 'Curated Locally',
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {heroCards.map((card, index) => {
        const Icon = card.icon;
        const isReversed = index % 2 === 1;

        return (
          <div
            key={card.id}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-large hover:shadow-glow transition-all duration-500"
            onClick={() => onNavigate(card.id)}
          >
            {/* Full-bleed image */}
            <div className="relative h-[320px] md:h-[380px] overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Cinematic overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/50 to-foreground/10" />
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accentClass} opacity-[0.12] mix-blend-overlay`} />

              {/* Content positioned over image */}
              <div className={`absolute inset-0 flex flex-col justify-end p-6 md:p-10 ${isReversed ? 'md:items-end md:text-right' : ''}`}>
                {/* Badge */}
                <div className={`flex items-center gap-2 mb-4 ${isReversed ? 'md:justify-end' : ''}`}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground text-xs font-semibold tracking-wide uppercase">
                    <Shield className="w-3 h-3" />
                    {card.badgeText}
                  </span>
                </div>

                {/* Title */}
                <div className={`flex items-center gap-3 mb-3 ${isReversed ? 'md:flex-row-reverse' : ''}`}>
                  <div className="p-2.5 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/20">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-primary-foreground font-display">
                    {card.title}
                  </h2>
                </div>

                {/* Subtitle */}
                <p className={`text-sm md:text-base text-primary-foreground/80 max-w-lg mb-5 leading-relaxed ${isReversed ? 'md:ml-auto' : ''}`}>
                  {card.subtitle}
                </p>

                {/* CTA Button */}
                <div className={isReversed ? 'md:ml-auto' : ''}>
                  <Button
                    size="lg"
                    className="group/btn gap-2 shadow-medium hover:shadow-large transition-all duration-300 text-sm font-semibold px-6 rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(card.id);
                    }}
                  >
                    {card.buttonText}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardHeroCards;
