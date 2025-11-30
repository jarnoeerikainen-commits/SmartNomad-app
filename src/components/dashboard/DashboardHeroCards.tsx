import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardHeroCardsProps {
  onNavigate: (section: string) => void;
}

const DashboardHeroCards: React.FC<DashboardHeroCardsProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  const heroCards = [
    {
      id: 'nomad-chat',
      title: 'SuperNomad Pulse',
      subtitle: 'Supernomad Pulse uses advanced AI to instantly connect you with your perfect adventure partners, wherever you are.',
      buttonText: 'Explore Groups',
      icon: MessageSquare,
      gradient: 'from-primary/20 via-primary/10 to-transparent',
      iconColor: 'text-primary',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'social-chat',
      title: 'Social Chat AI',
      subtitle: 'Spark spontaneous conversations. Meet nomads near you.',
      buttonText: 'Start Chatting',
      icon: Users,
      gradient: 'from-accent/20 via-accent/10 to-transparent',
      iconColor: 'text-accent',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 'explore-local-life',
      title: 'Local Events & Markets',
      subtitle: 'Discover workshops, meetups, and hidden gems.',
      buttonText: 'Discover Events',
      icon: Calendar,
      gradient: 'from-secondary/20 via-secondary/10 to-transparent',
      iconColor: 'text-secondary',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  return (
    <div className="space-y-4 pb-6">
      {heroCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card 
            key={card.id}
            className="relative overflow-hidden border-0 shadow-large hover:shadow-glow transition-all duration-500 cursor-pointer group"
            onClick={() => onNavigate(card.id)}
          >
            {/* Background Image with Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ 
                backgroundImage: `url(${card.image})`,
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} backdrop-blur-[2px]`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/20" />
            </div>

            {/* Content */}
            <CardContent className="relative z-10 p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-soft ${card.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        {card.title}
                      </h2>
                      <p className="text-sm md:text-base text-muted-foreground mt-1 max-w-md">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  className="w-full md:w-auto shadow-medium hover:shadow-large transition-all duration-300 text-base font-semibold px-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(card.id);
                  }}
                >
                  {card.buttonText}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardHeroCards;
