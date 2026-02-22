import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';
import { Badge } from '@/components/ui/badge';

export const DemoPersonaSelector: React.FC = () => {
  const { activePersonaId, setPersona } = useDemoPersona();

  return (
    <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-4">
      <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-border/50 px-2 py-0.5">
        Demo
      </Badge>
      
      <Button
        variant={activePersonaId === 'meghan' ? 'default' : 'outline'}
        size="sm"
        className={`h-8 text-xs gap-1.5 ${
          activePersonaId === 'meghan'
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'hover:bg-accent/20'
        }`}
        onClick={() => setPersona(activePersonaId === 'meghan' ? null : 'meghan')}
      >
        <span>👩‍💼</span>
        <span className="hidden xl:inline">Meghan</span>
        <span className="xl:hidden">Business</span>
      </Button>

      <Button
        variant={activePersonaId === 'john' ? 'default' : 'outline'}
        size="sm"
        className={`h-8 text-xs gap-1.5 ${
          activePersonaId === 'john'
            ? 'bg-primary text-primary-foreground shadow-md'
            : 'hover:bg-accent/20'
        }`}
        onClick={() => setPersona(activePersonaId === 'john' ? null : 'john')}
      >
        <span>👨‍💼</span>
        <span className="hidden xl:inline">John</span>
        <span className="xl:hidden">Expat</span>
      </Button>

      {activePersonaId && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => setPersona(null)}
        >
          <UserCircle className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Empty Profile</span>
          <span className="xl:hidden">Reset</span>
        </Button>
      )}
    </div>
  );
};
