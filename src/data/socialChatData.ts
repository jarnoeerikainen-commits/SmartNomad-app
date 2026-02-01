import { SocialProfile, ChatRoom } from '@/types/socialChat';

// Beautiful, professional avatar URLs using Unsplash - diverse and attractive
const AVATAR_URLS = {
  // Women - beautiful and professional
  sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  lena: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  elena: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  maria: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
  sophie: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  nina: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
  emma: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
  lisa: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face',
  yuki: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop&crop=face',
  rachel: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
  anna: 'https://images.unsplash.com/photo-1499887142886-791eca5918cd?w=150&h=150&fit=crop&crop=face',
  priya: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  fatima: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
  
  // Men - handsome and professional
  mike: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  tom: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  alex: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  raj: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  marcus: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
  chris: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
  david: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
  john: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
  james: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  carlos: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  lucas: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
  omar: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&h=150&fit=crop&crop=face',
  miguel: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=150&h=150&fit=crop&crop=face',
};

export const socialProfiles: SocialProfile[] = [
  {
    id: '1',
    basicInfo: {
      name: 'Sarah Chen',
      avatar: AVATAR_URLS.sarah,
      age: 29,
      languages: ['English', 'Mandarin', 'Portuguese'],
      tagline: 'UX designer building the future of remote work'
    },
    travelerType: 'digital_nomad',
    professional: {
      industry: 'Tech',
      company: 'Remote Startup',
      skills: ['UX Design', 'Frontend Development', 'Product Strategy'],
      interests: ['Co-working', 'Hiking', 'Photography', 'Coffee Culture']
    },
    mobility: {
      currentLocation: {
        city: 'Lisbon',
        country: 'Portugal',
        since: new Date('2024-06-01')
      },
      nextDestinations: [
        {
          city: 'Bangkok',
          country: 'Thailand',
          arrivalDate: new Date('2024-09-01'),
          departureDate: new Date('2024-11-15'),
          purpose: 'Digital nomad work',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Co-working partners, local insights, hiking buddies',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['SuperNomad Member', 'Frequent Traveler', 'Community Endorsed'],
      trustScore: 92
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '2',
    basicInfo: {
      name: 'James Rodriguez',
      avatar: AVATAR_URLS.james,
      age: 42,
      languages: ['English', 'Spanish'],
      tagline: 'Investment banker connecting global markets'
    },
    travelerType: 'business_traveler',
    professional: {
      industry: 'Finance',
      company: 'Global Bank Inc',
      skills: ['Investment Banking', 'Market Analysis', 'M&A'],
      interests: ['Golf', 'Fine Dining', 'Networking Events', 'Wine']
    },
    mobility: {
      currentLocation: {
        city: 'New York',
        country: 'USA',
        since: new Date('2024-07-15')
      },
      nextDestinations: [
        {
          city: 'London',
          country: 'UK',
          arrivalDate: new Date('2024-08-20'),
          departureDate: new Date('2024-08-25'),
          purpose: 'Client meetings',
          visibility: 'connections'
        },
        {
          city: 'Singapore',
          country: 'Singapore',
          arrivalDate: new Date('2024-09-05'),
          departureDate: new Date('2024-09-10'),
          purpose: 'Finance conference',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional'],
      lookingFor: 'Industry contacts, business networking, local insights',
      visibility: 'public'
    },
    verification: {
      level: 'premium',
      badges: ['Professional Verified', 'Business Traveler', 'Industry Leader'],
      trustScore: 95
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '3',
    basicInfo: {
      name: 'Lena Schmidt',
      avatar: AVATAR_URLS.lena,
      age: 23,
      languages: ['German', 'English', 'Spanish'],
      tagline: 'Exchange student discovering the world'
    },
    travelerType: 'student',
    professional: {
      industry: 'Education',
      company: 'University of Berlin',
      skills: ['Research', 'Languages', 'Cultural Studies'],
      interests: ['Cultural Exchange', 'Student Life', 'Budget Travel', 'Museums']
    },
    mobility: {
      currentLocation: {
        city: 'Berlin',
        country: 'Germany',
        since: new Date('2024-01-01')
      },
      nextDestinations: [
        {
          city: 'Barcelona',
          country: 'Spain',
          arrivalDate: new Date('2024-09-10'),
          departureDate: new Date('2025-06-30'),
          purpose: 'Exchange program',
          visibility: 'public'
        }
      ],
      travelFrequency: 'occasional'
    },
    socialPreferences: {
      connectionTypes: ['friendship', 'mentorship'],
      lookingFor: 'Student groups, local friends, study partners',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Student Verified', 'SuperNomad Member'],
      trustScore: 88
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '4',
    basicInfo: {
      name: 'Captain Mike Thompson',
      avatar: AVATAR_URLS.mike,
      age: 38,
      languages: ['English', 'Arabic'],
      tagline: 'Airline pilot connecting continents'
    },
    travelerType: 'aviation',
    professional: {
      industry: 'Aviation',
      company: 'Global Airlines',
      skills: ['Commercial Pilot', 'Crew Management', 'Safety'],
      interests: ['Aviation Tech', 'Travel Hacking', 'Layover Exploration', 'Photography']
    },
    mobility: {
      currentLocation: {
        city: 'Dubai',
        country: 'UAE',
        since: new Date('2024-08-10')
      },
      nextDestinations: [
        {
          city: 'Tokyo',
          country: 'Japan',
          arrivalDate: new Date('2024-08-18'),
          departureDate: new Date('2024-08-20'),
          purpose: 'Layover',
          visibility: 'connections'
        },
        {
          city: 'Sydney',
          country: 'Australia',
          arrivalDate: new Date('2024-08-25'),
          departureDate: new Date('2024-08-27'),
          purpose: 'Flight crew',
          visibility: 'connections'
        }
      ],
      travelFrequency: 'constant'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Crew connections, layover activities, aviation enthusiasts',
      visibility: 'public'
    },
    verification: {
      level: 'premium',
      badges: ['Professional Verified', 'Aviation Crew', 'Frequent Traveler'],
      trustScore: 96
    },
    status: 'away',
    lastActive: new Date(Date.now() - 30 * 60000)
  },
  {
    id: '5',
    basicInfo: {
      name: 'Maria Gonzalez',
      avatar: AVATAR_URLS.maria,
      age: 35,
      languages: ['Spanish', 'English'],
      tagline: 'Tech sales bringing innovation to market'
    },
    travelerType: 'trade_show_visitor',
    professional: {
      industry: 'Tech Hardware',
      company: 'Innovation Tech Corp',
      skills: ['Product Demos', 'B2B Sales', 'Market Strategy'],
      interests: ['Tech Innovations', 'Industry Trends', 'Networking']
    },
    mobility: {
      currentLocation: {
        city: 'San Francisco',
        country: 'USA',
        since: new Date('2024-07-01')
      },
      nextDestinations: [
        {
          city: 'Las Vegas',
          country: 'USA',
          arrivalDate: new Date('2024-09-15'),
          departureDate: new Date('2024-09-18'),
          purpose: 'CES exhibition',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional'],
      lookingFor: 'Industry contacts, potential clients, trade show partners',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Professional Verified', 'Trade Show Regular'],
      trustScore: 91
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '6',
    basicInfo: {
      name: 'Alex Kim',
      avatar: AVATAR_URLS.alex,
      age: 31,
      languages: ['Korean', 'English', 'Japanese'],
      tagline: 'Software engineer living the nomad dream'
    },
    travelerType: 'digital_nomad',
    professional: {
      industry: 'Tech',
      company: 'Freelance Developer',
      skills: ['Full Stack Development', 'DevOps', 'AI/ML'],
      interests: ['Coding', 'Gaming', 'Street Food', 'Martial Arts']
    },
    mobility: {
      currentLocation: {
        city: 'Seoul',
        country: 'South Korea',
        since: new Date('2024-05-15')
      },
      nextDestinations: [
        {
          city: 'Tokyo',
          country: 'Japan',
          arrivalDate: new Date('2024-09-01'),
          purpose: 'Work and explore',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Tech meetups, coding buddies, local food guides',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['SuperNomad Member', 'Tech Professional'],
      trustScore: 89
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '7',
    basicInfo: {
      name: 'Emma Wilson',
      avatar: AVATAR_URLS.emma,
      age: 27,
      languages: ['English', 'French'],
      tagline: 'Expat teacher sharing knowledge across borders'
    },
    travelerType: 'expat',
    professional: {
      industry: 'Education',
      company: 'International School Bangkok',
      skills: ['Teaching', 'Curriculum Development', 'ESL'],
      interests: ['Reading', 'Yoga', 'Local Culture', 'Cooking Classes']
    },
    mobility: {
      currentLocation: {
        city: 'Bangkok',
        country: 'Thailand',
        since: new Date('2023-08-01')
      },
      nextDestinations: [],
      travelFrequency: 'occasional'
    },
    socialPreferences: {
      connectionTypes: ['friendship', 'mentorship'],
      lookingFor: 'Expat community, local events, language exchange',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Expat', 'Community Leader', 'Long-term Resident'],
      trustScore: 94
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '8',
    basicInfo: {
      name: 'Carlos Mendez',
      avatar: AVATAR_URLS.carlos,
      age: 45,
      languages: ['Spanish', 'English', 'Portuguese'],
      tagline: 'Entrepreneur building bridges across Latin America'
    },
    travelerType: 'business_traveler',
    professional: {
      industry: 'Consulting',
      company: 'Own Consulting Firm',
      skills: ['Business Strategy', 'Market Entry', 'Partnership Development'],
      interests: ['Entrepreneurship', 'Salsa Dancing', 'Local Cuisine']
    },
    mobility: {
      currentLocation: {
        city: 'Mexico City',
        country: 'Mexico',
        since: new Date('2024-08-01')
      },
      nextDestinations: [
        {
          city: 'Buenos Aires',
          country: 'Argentina',
          arrivalDate: new Date('2024-09-20'),
          purpose: 'Business development',
          visibility: 'connections'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional'],
      lookingFor: 'Business partners, investors, local entrepreneurs',
      visibility: 'public'
    },
    verification: {
      level: 'premium',
      badges: ['Professional Verified', 'Entrepreneur', 'Industry Expert'],
      trustScore: 93
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '9',
    basicInfo: {
      name: 'Yuki Tanaka',
      avatar: AVATAR_URLS.yuki,
      age: 26,
      languages: ['Japanese', 'English'],
      tagline: 'Conference organizer connecting tech communities'
    },
    travelerType: 'conference_attendee',
    professional: {
      industry: 'Tech Events',
      company: 'Tech Conferences Asia',
      skills: ['Event Planning', 'Community Building', 'Public Speaking'],
      interests: ['Tech Trends', 'Networking', 'Japanese Culture', 'Anime']
    },
    mobility: {
      currentLocation: {
        city: 'Tokyo',
        country: 'Japan',
        since: new Date('2024-01-01')
      },
      nextDestinations: [
        {
          city: 'Singapore',
          country: 'Singapore',
          arrivalDate: new Date('2024-09-05'),
          departureDate: new Date('2024-09-08'),
          purpose: 'Tech conference',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Conference attendees, speakers, tech enthusiasts',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Professional Verified', 'Event Organizer'],
      trustScore: 90
    },
    status: 'away',
    lastActive: new Date(Date.now() - 15 * 60000)
  },
  {
    id: '10',
    basicInfo: {
      name: 'Sophie Laurent',
      avatar: AVATAR_URLS.sophie,
      age: 33,
      languages: ['French', 'English', 'Italian'],
      tagline: 'Fashion buyer discovering global trends'
    },
    travelerType: 'business_traveler',
    professional: {
      industry: 'Fashion',
      company: 'Luxury Brand Paris',
      skills: ['Fashion Buying', 'Trend Forecasting', 'Negotiations'],
      interests: ['Fashion Shows', 'Art Galleries', 'Wine Tasting', 'Shopping']
    },
    mobility: {
      currentLocation: {
        city: 'Paris',
        country: 'France',
        since: new Date('2024-07-20')
      },
      nextDestinations: [
        {
          city: 'Milan',
          country: 'Italy',
          arrivalDate: new Date('2024-09-22'),
          departureDate: new Date('2024-09-26'),
          purpose: 'Fashion week',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Fashion industry contacts, art lovers, culture enthusiasts',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Professional Verified', 'Fashion Industry'],
      trustScore: 91
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '11',
    basicInfo: {
      name: 'David Okonkwo',
      avatar: AVATAR_URLS.david,
      age: 29,
      languages: ['English', 'Yoruba', 'French'],
      tagline: 'Tech entrepreneur building Africa\'s digital future'
    },
    travelerType: 'digital_nomad',
    professional: {
      industry: 'Tech Startup',
      company: 'African Fintech Startup',
      skills: ['Entrepreneurship', 'Fintech', 'Product Management'],
      interests: ['Startups', 'African Music', 'Football', 'Innovation']
    },
    mobility: {
      currentLocation: {
        city: 'Lagos',
        country: 'Nigeria',
        since: new Date('2024-06-15')
      },
      nextDestinations: [
        {
          city: 'Nairobi',
          country: 'Kenya',
          arrivalDate: new Date('2024-09-10'),
          purpose: 'Tech hub exploration',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Startup founders, investors, tech community',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Entrepreneur', 'Tech Professional', 'SuperNomad Member'],
      trustScore: 88
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '12',
    basicInfo: {
      name: 'Anna Kowalski',
      avatar: AVATAR_URLS.anna,
      age: 24,
      languages: ['Polish', 'English', 'German'],
      tagline: 'Master\'s student exploring European opportunities'
    },
    travelerType: 'student',
    professional: {
      industry: 'Engineering',
      company: 'Technical University Munich',
      skills: ['Mechanical Engineering', 'CAD Design', 'Research'],
      interests: ['Cycling', 'Beer Gardens', 'Mountain Hiking', 'Tech Meetups']
    },
    mobility: {
      currentLocation: {
        city: 'Munich',
        country: 'Germany',
        since: new Date('2023-10-01')
      },
      nextDestinations: [],
      travelFrequency: 'occasional'
    },
    socialPreferences: {
      connectionTypes: ['friendship', 'professional'],
      lookingFor: 'Study groups, outdoor activities, career mentorship',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Student Verified', 'SuperNomad Member'],
      trustScore: 87
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '13',
    basicInfo: {
      name: 'Rachel Cohen',
      avatar: AVATAR_URLS.rachel,
      age: 36,
      languages: ['English', 'Hebrew'],
      tagline: 'Marketing director scaling global brands'
    },
    travelerType: 'business_traveler',
    professional: {
      industry: 'Marketing',
      company: 'Global Consumer Brand',
      skills: ['Digital Marketing', 'Brand Strategy', 'Campaign Management'],
      interests: ['Marketing Tech', 'Fitness', 'Healthy Eating', 'Podcasts']
    },
    mobility: {
      currentLocation: {
        city: 'Tel Aviv',
        country: 'Israel',
        since: new Date('2024-08-05')
      },
      nextDestinations: [
        {
          city: 'New York',
          country: 'USA',
          arrivalDate: new Date('2024-09-12'),
          departureDate: new Date('2024-09-18'),
          purpose: 'Marketing summit',
          visibility: 'connections'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional'],
      lookingFor: 'Marketing professionals, industry events, networking',
      visibility: 'public'
    },
    verification: {
      level: 'premium',
      badges: ['Professional Verified', 'Marketing Expert', 'Industry Leader'],
      trustScore: 94
    },
    status: 'away',
    lastActive: new Date(Date.now() - 45 * 60000)
  },
  {
    id: '14',
    basicInfo: {
      name: 'Lucas Silva',
      avatar: AVATAR_URLS.lucas,
      age: 28,
      languages: ['Portuguese', 'English', 'Spanish'],
      tagline: 'Remote developer coding from paradise'
    },
    travelerType: 'digital_nomad',
    professional: {
      industry: 'Tech',
      company: 'Remote Agency',
      skills: ['React', 'Node.js', 'Cloud Architecture'],
      interests: ['Beach Life', 'Surfing', 'Electronic Music', 'Co-working']
    },
    mobility: {
      currentLocation: {
        city: 'Florianopolis',
        country: 'Brazil',
        since: new Date('2024-07-01')
      },
      nextDestinations: [
        {
          city: 'Medellin',
          country: 'Colombia',
          arrivalDate: new Date('2024-10-01'),
          purpose: 'Digital nomad community',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['friendship', 'professional'],
      lookingFor: 'Co-working buddies, beach activities, tech community',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Tech Professional', 'Digital Nomad', 'Community Endorsed'],
      trustScore: 90
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '15',
    basicInfo: {
      name: 'Priya Sharma',
      avatar: AVATAR_URLS.priya,
      age: 32,
      languages: ['Hindi', 'English', 'Tamil'],
      tagline: 'Expat HR leader building diverse teams'
    },
    travelerType: 'expat',
    professional: {
      industry: 'Human Resources',
      company: 'Multinational Tech Corp',
      skills: ['Talent Acquisition', 'DEI', 'Leadership Development'],
      interests: ['Yoga', 'Indian Cooking', 'Cultural Events', 'Reading']
    },
    mobility: {
      currentLocation: {
        city: 'Singapore',
        country: 'Singapore',
        since: new Date('2022-03-01')
      },
      nextDestinations: [],
      travelFrequency: 'occasional'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Expat community, professional networking, cultural exchange',
      visibility: 'public'
    },
    verification: {
      level: 'premium',
      badges: ['Professional Verified', 'Expat', 'Long-term Resident', 'HR Professional'],
      trustScore: 95
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '16',
    basicInfo: {
      name: 'Tom Anderson',
      avatar: AVATAR_URLS.tom,
      age: 41,
      languages: ['English', 'Swedish'],
      tagline: 'Investment analyst exploring Nordic markets'
    },
    travelerType: 'business_traveler',
    professional: {
      industry: 'Finance',
      company: 'Nordic Investment Fund',
      skills: ['Financial Analysis', 'Portfolio Management', 'Due Diligence'],
      interests: ['Skiing', 'Scandinavian Design', 'Sauna Culture', 'Nordic Noir']
    },
    mobility: {
      currentLocation: {
        city: 'Stockholm',
        country: 'Sweden',
        since: new Date('2024-08-08')
      },
      nextDestinations: [
        {
          city: 'Copenhagen',
          country: 'Denmark',
          arrivalDate: new Date('2024-08-28'),
          departureDate: new Date('2024-08-30'),
          purpose: 'Investor meetings',
          visibility: 'connections'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional'],
      lookingFor: 'Investment opportunities, financial professionals, Nordic business culture',
      visibility: 'public'
    },
    verification: {
      level: 'premium',
      badges: ['Professional Verified', 'Finance Expert', 'Business Traveler'],
      trustScore: 93
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '17',
    basicInfo: {
      name: 'Fatima Al-Hassan',
      avatar: AVATAR_URLS.fatima,
      age: 30,
      languages: ['Arabic', 'English', 'French'],
      tagline: 'Architect designing sustainable cities'
    },
    travelerType: 'conference_attendee',
    professional: {
      industry: 'Architecture',
      company: 'Sustainable Design Studio',
      skills: ['Sustainable Architecture', 'Urban Planning', '3D Modeling'],
      interests: ['Green Building', 'Art', 'Desert Hiking', 'Photography']
    },
    mobility: {
      currentLocation: {
        city: 'Dubai',
        country: 'UAE',
        since: new Date('2024-06-01')
      },
      nextDestinations: [
        {
          city: 'Amsterdam',
          country: 'Netherlands',
          arrivalDate: new Date('2024-09-18'),
          departureDate: new Date('2024-09-22'),
          purpose: 'Architecture conference',
          visibility: 'public'
        }
      ],
      travelFrequency: 'occasional'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Architecture professionals, sustainable design enthusiasts',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Professional Verified', 'Architecture Industry'],
      trustScore: 89
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '18',
    basicInfo: {
      name: 'Miguel Santos',
      avatar: AVATAR_URLS.miguel,
      age: 25,
      languages: ['Portuguese', 'English'],
      tagline: 'Backpacker exploring Southeast Asia'
    },
    travelerType: 'tourist',
    professional: {
      industry: 'Gap Year',
      company: 'Traveling',
      skills: ['Photography', 'Content Creation', 'Budget Travel'],
      interests: ['Backpacking', 'Street Food', 'Local Culture', 'Diving']
    },
    mobility: {
      currentLocation: {
        city: 'Chiang Mai',
        country: 'Thailand',
        since: new Date('2024-08-01')
      },
      nextDestinations: [
        {
          city: 'Hanoi',
          country: 'Vietnam',
          arrivalDate: new Date('2024-09-01'),
          purpose: 'Backpacking',
          visibility: 'public'
        }
      ],
      travelFrequency: 'constant'
    },
    socialPreferences: {
      connectionTypes: ['friendship'],
      lookingFor: 'Travel buddies, local experiences, budget tips',
      visibility: 'public'
    },
    verification: {
      level: 'basic',
      badges: ['Traveler', 'SuperNomad Member'],
      trustScore: 85
    },
    status: 'online',
    lastActive: new Date()
  },
  {
    id: '19',
    basicInfo: {
      name: 'Nina Petrov',
      avatar: AVATAR_URLS.nina,
      age: 37,
      languages: ['Russian', 'English', 'German'],
      tagline: 'Medical professional serving global health'
    },
    travelerType: 'expat',
    professional: {
      industry: 'Healthcare',
      company: 'International Medical Center',
      skills: ['Internal Medicine', 'Public Health', 'Medical Research'],
      interests: ['Healthcare Innovation', 'Running', 'Classical Music', 'Volunteering']
    },
    mobility: {
      currentLocation: {
        city: 'Geneva',
        country: 'Switzerland',
        since: new Date('2023-01-15')
      },
      nextDestinations: [],
      travelFrequency: 'rare'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Healthcare professionals, expat community, running groups',
      visibility: 'public'
    },
    verification: {
      level: 'premium',
      badges: ['Professional Verified', 'Healthcare', 'Expat', 'Long-term Resident'],
      trustScore: 96
    },
    status: 'away',
    lastActive: new Date(Date.now() - 20 * 60000)
  },
  {
    id: '20',
    basicInfo: {
      name: 'Omar Abdullah',
      avatar: AVATAR_URLS.omar,
      age: 34,
      languages: ['Arabic', 'English'],
      tagline: 'E-commerce entrepreneur scaling globally'
    },
    travelerType: 'digital_nomad',
    professional: {
      industry: 'E-commerce',
      company: 'Own Online Store',
      skills: ['E-commerce', 'Digital Marketing', 'Logistics'],
      interests: ['Entrepreneurship', 'Fitness', 'Traveling', 'Food Blogging']
    },
    mobility: {
      currentLocation: {
        city: 'Bali',
        country: 'Indonesia',
        since: new Date('2024-05-01')
      },
      nextDestinations: [
        {
          city: 'Ho Chi Minh City',
          country: 'Vietnam',
          arrivalDate: new Date('2024-09-15'),
          purpose: 'Business expansion',
          visibility: 'public'
        }
      ],
      travelFrequency: 'frequent'
    },
    socialPreferences: {
      connectionTypes: ['professional', 'friendship'],
      lookingFor: 'Entrepreneurs, e-commerce community, fitness buddies',
      visibility: 'public'
    },
    verification: {
      level: 'verified',
      badges: ['Entrepreneur', 'Digital Nomad', 'E-commerce Expert'],
      trustScore: 91
    },
    status: 'online',
    lastActive: new Date()
  }
];

export const demoChatRooms: ChatRoom[] = [
  {
    id: '1',
    type: 'location',
    name: 'Bangkok Digital Nomads',
    participants: ['1', '7'],
    participantDetails: [
      {
        id: '1',
        name: 'Sarah Chen',
        avatar: AVATAR_URLS.sarah
      },
      {
        id: '7',
        name: 'Emma Wilson',
        avatar: AVATAR_URLS.emma
      }
    ],
    messages: [],
    unreadCount: 0,
    lastMessage: 'Hey! Planning to arrive in Bangkok September...',
    lastActivity: new Date(),
    metadata: {
      location: 'Bangkok',
      purpose: 'Digital nomad networking'
    }
  },
  {
    id: '2',
    type: 'professional',
    name: 'Finance Professionals Network',
    participants: ['2', '13', '16'],
    participantDetails: [
      {
        id: '2',
        name: 'James Rodriguez',
        avatar: AVATAR_URLS.james
      },
      {
        id: '13',
        name: 'Rachel Cohen',
        avatar: AVATAR_URLS.rachel
      },
      {
        id: '16',
        name: 'Tom Anderson',
        avatar: AVATAR_URLS.tom
      }
    ],
    messages: [],
    unreadCount: 2,
    lastMessage: 'Great insights on the European market...',
    lastActivity: new Date(Date.now() - 2 * 60 * 60000),
    metadata: {
      purpose: 'Financial industry networking'
    }
  },
  {
    id: '3',
    type: 'event',
    name: 'Singapore Tech Conference 2024',
    participants: ['2', '9', '15'],
    participantDetails: [
      {
        id: '2',
        name: 'James Rodriguez',
        avatar: AVATAR_URLS.james
      },
      {
        id: '9',
        name: 'Yuki Tanaka',
        avatar: AVATAR_URLS.yuki
      },
      {
        id: '15',
        name: 'Priya Sharma',
        avatar: AVATAR_URLS.priya
      }
    ],
    messages: [],
    unreadCount: 5,
    lastMessage: 'Who\'s attending the AI panel tomorrow?',
    lastActivity: new Date(Date.now() - 30 * 60000),
    metadata: {
      event: 'Singapore Tech Conference',
      location: 'Singapore'
    }
  }
];

// Export avatar URLs for reuse across components
export { AVATAR_URLS };
