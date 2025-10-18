import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{selectedLanguage.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 p-0 bg-background border shadow-lg z-50">
        <ScrollArea className="h-[400px]">
          <div className="p-1">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => setLanguage(language.code)}
                className={`cursor-pointer ${
                  selectedLanguage.code === language.code ? 'bg-accent' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{language.name}</span>
                  <span className="text-xs text-muted-foreground">{language.nativeName}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};