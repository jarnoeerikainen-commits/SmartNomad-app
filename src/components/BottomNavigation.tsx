import React from 'react';
import { Home, BarChart3, AlertCircle, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();
  
  const tabs = [
    { id: 'home', labelKey: 'bottomnav.home', icon: Home },
    { id: 'tracking', labelKey: 'bottomnav.tracking', icon: BarChart3 },
    { id: 'emergency', labelKey: 'bottomnav.emergency', icon: AlertCircle },
    { id: 'ai', labelKey: 'bottomnav.ai', icon: Bot },
    { id: 'profile', labelKey: 'bottomnav.profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isEmergency = tab.id === 'emergency';
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center h-full flex-1 rounded-none transition-all duration-200",
                isActive && "text-primary",
                isEmergency && "text-destructive hover:text-destructive"
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 mb-1 transition-transform",
                  isActive && "scale-110",
                  isEmergency && "animate-pulse"
                )} 
              />
              <span className={cn(
                "text-xs font-medium",
                isActive && "font-semibold"
              )}>
                {t(tab.labelKey)}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
