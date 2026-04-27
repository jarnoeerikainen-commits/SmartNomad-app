import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEMO_PERSONAS, DemoPersona, refreshDemoPersonas } from '@/data/demoPersonas';
import { MEGHAN_AWARD_CARDS, JOHN_AWARD_CARDS, getAwardCardsAIContext } from '@/data/awardProgramsData';
import { CalendarService } from '@/services/CalendarService';

interface DemoPersonaContextType {
  activePersona: DemoPersona | null;
  activePersonaId: string | null;
  setPersona: (id: 'meghan' | 'john' | null) => void;
  isDemo: boolean;
}

const DemoPersonaContext = createContext<DemoPersonaContextType>({
  activePersona: null,
  activePersonaId: null,
  setPersona: () => {},
  isDemo: false,
});

export const useDemoPersona = () => useContext(DemoPersonaContext);

export const DemoPersonaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePersonaId, setActivePersonaId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('supernomad_active_demo_persona');
    return stored === 'meghan' || stored === 'john' ? stored : null;
  });

  const setPersona = useCallback((id: 'meghan' | 'john' | null) => {
    setActivePersonaId(id);
    // Publish to window so non-React services (e.g. ExpenseHubService) can read it
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__demoPersonaId = id;
    }
    if (id && DEMO_PERSONAS[id]) {
      // Store profile in localStorage so existing app systems pick it up
      const p = DEMO_PERSONAS[id];
      localStorage.setItem('supernomad_active_demo_persona', id);
      localStorage.setItem('demoPersona', JSON.stringify({
        id,
        name: `${p.profile.firstName} ${p.profile.lastName}`,
        profile: p.profile,
      }));
      localStorage.setItem('demoUserLocation', JSON.stringify({
        city: p.profile.city,
        country: p.profile.country,
        source: 'demo_persona',
      }));
      localStorage.removeItem('concierge_memory');
      const profileData = {
        firstName: p.profile.firstName,
        lastName: p.profile.lastName,
        email: p.profile.email,
        phone: p.profile.phone,
        nationality: p.profile.nationality,
        currentLocation: `${p.profile.city}, ${p.profile.country}`,
        occupation: p.profile.occupation,
        travelFrequency: p.travel.averageTravelDays > 100 ? 'very-frequent' : 'frequent',
        travelPurpose: [p.travel.style],
        preferredLanguages: ['en'],
        citizenship: p.profile.nationality,
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      // Store enhanced profile
      const enhancedProfile = {
        core: {
          personal: {
            firstName: p.profile.firstName,
            lastName: p.profile.lastName,
            email: p.profile.email,
            phone: p.profile.phone,
            birthDate: '',
            age: p.profile.age,
            gender: p.profile.gender,
            bio: p.profile.bio,
          },
          legal: {
            passportCountries: [p.profile.nationality],
            taxResidencyCountry: p.profile.country,
            currentResidencyCountry: p.profile.country,
            visaStatus: p.profile.nationality === 'British' ? 'citizen' : 'resident',
          },
        },
        lifestyle: {
          professional: {
            jobTitle: p.profile.occupation,
            company: p.profile.company,
            industry: p.profile.industry,
            incomeBracket: p.profile.incomeBracket,
          },
          family: {
            maritalStatus: p.family.status.toLowerCase(),
            dependents: {
              children: p.family.children.length,
              adults: p.family.status === 'Married' ? 1 : 0,
              ages: p.family.children.map(c => c.age),
            },
          },
        },
          travel: {
            preferences: {
              favoriteDestinations: {
                cities: p.travel.frequentDestinations,
                countries: [],
                regions: [],
                types: [],
              },
              budget: {
                transportation: p.travel.flightClass === 'Business Class' ? 'business' : 'economy',
                accommodation: 'luxury',
              },
              travelStyle: {
                purpose: [p.travel.style],
              },
            },
          },
          aviation: p.aviation,
          hotels: p.hotels,
          rewards: p.rewards,
          dining: p.dining,
          events: p.events,
          personal: {
          sports: {
            active: p.lifestyle.sports,
            spectator: p.lifestyle.spectatorSports,
          },
          dietary: {
            favoriteCuisines: p.lifestyle.favoriteCuisines,
            alcoholPreference: p.lifestyle.alcoholPreference,
            cookingHabits: p.lifestyle.cookingHabits,
          },
          accommodation: {
            amenities: p.accommodation.mustHave,
          },
        },
      };
      localStorage.setItem('enhancedProfile', JSON.stringify(enhancedProfile));

      // Store calendar
      localStorage.setItem('demoCalendar', JSON.stringify(p.calendar));
      // Store AI context (dynamically built from today's date)
      localStorage.setItem('demoAiContext', p.aiContext);
      // Re-seed the unified calendar so reminders + concierge stay future-anchored
      try {
        CalendarService.reseedDemoPersona(id);
      } catch { /* ignore */ }
      // Demo personas are always adults — bypass age gate
      localStorage.setItem('ageGroup', 'adult');
      localStorage.setItem('hasSeenOnboarding', 'true');
      localStorage.setItem('cookieConsent', JSON.stringify({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: true,
      }));
      localStorage.setItem('supernomad_demo_consent', 'true');
      window.dispatchEvent(new CustomEvent('supernomad:demo-consent'));
      // Store award cards AI context for concierge
      const awardCards = id === 'meghan' ? MEGHAN_AWARD_CARDS : JOHN_AWARD_CARDS;
      localStorage.setItem('awardCardsAIContext', getAwardCardsAIContext(awardCards));
    } else {
      // Clear demo data
      localStorage.removeItem('supernomad_active_demo_persona');
      localStorage.removeItem('demoPersona');
      localStorage.removeItem('demoUserLocation');
      localStorage.removeItem('demoAiContext');
      localStorage.removeItem('demoCalendar');
      localStorage.removeItem('awardCardsAIContext');
      // Don't clear userProfile/enhancedProfile — let user keep their own data
    }
  }, []);

  // Day-rollover watcher: when local date changes, regenerate the persona
  // snapshot so calendar + AI context always speak in future tense.
  useEffect(() => {
    if (!activePersonaId) return;
    const dayKey = () => {
      const t = new Date();
      return `${t.getFullYear()}-${t.getMonth()}-${t.getDate()}`;
    };
    let lastDay = dayKey();
    const interval = window.setInterval(() => {
      const current = dayKey();
      if (current !== lastDay) {
        lastDay = current;
        refreshDemoPersonas();
        // Re-apply the persona to refresh localStorage + calendar seed
        setPersona(activePersonaId as 'meghan' | 'john');
      }
    }, 60_000); // check every minute — cheap
    return () => window.clearInterval(interval);
  }, [activePersonaId, setPersona]);

  useEffect(() => {
    if (activePersonaId === 'meghan' || activePersonaId === 'john') {
      setPersona(activePersonaId);
    }
  }, [activePersonaId, setPersona]);

  const activePersona = activePersonaId ? DEMO_PERSONAS[activePersonaId] || null : null;

  return (
    <DemoPersonaContext.Provider value={{
      activePersona,
      activePersonaId,
      setPersona,
      isDemo: !!activePersona,
    }}>
      {children}
    </DemoPersonaContext.Provider>
  );
};
