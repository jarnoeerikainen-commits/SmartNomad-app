import React, { createContext, useContext, useState, useCallback } from 'react';
import { DEMO_PERSONAS, DemoPersona } from '@/data/demoPersonas';

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
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);

  const setPersona = useCallback((id: 'meghan' | 'john' | null) => {
    setActivePersonaId(id);
    if (id && DEMO_PERSONAS[id]) {
      // Store profile in localStorage so existing app systems pick it up
      const p = DEMO_PERSONAS[id];
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
      // Store AI context
      localStorage.setItem('demoAiContext', p.aiContext);
    } else {
      // Clear demo data
      localStorage.removeItem('demoAiContext');
      localStorage.removeItem('demoCalendar');
      // Don't clear userProfile/enhancedProfile — let user keep their own data
    }
  }, []);

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
