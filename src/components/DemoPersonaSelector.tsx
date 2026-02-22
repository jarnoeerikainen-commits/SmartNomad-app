import React from 'react';
import { Button } from '@/components/ui/button';
import { UserCircle } from 'lucide-react';
import { useDemoPersona } from '@/contexts/DemoPersonaContext';

export const DemoPersonaSelector: React.FC = () => {
  const { activePersonaId, setPersona } = useDemoPersona();

  return (
    <div className="flex items-center gap-1 px-0 sm:px-2">
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
