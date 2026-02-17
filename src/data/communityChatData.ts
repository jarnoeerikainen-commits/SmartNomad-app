import { NomadUser, ChatGroup, AIMatch } from '@/types/communityChat';

// Beautiful, professional avatar URLs using Unsplash - diverse and attractive
export const AVATAR_URLS = {
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
  you: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
};

export const DEMO_USERS: NomadUser[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: AVATAR_URLS.sarah,
    profession: 'UX Designer',
    location: 'Dubai',
    interests: ['design', 'yoga', 'photography'],
    isOnline: true,
    expertise: ['Product Design', 'User Research'],
    socialPreference: 'ambivert'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: AVATAR_URLS.mike,
    profession: 'Software Developer',
    location: 'Dubai',
    interests: ['coding', 'gaming', 'hiking'],
    isOnline: true,
    expertise: ['React', 'Node.js', 'AI'],
    socialPreference: 'introvert'
  },
  {
    id: '3',
    name: 'Lena Martinez',
    avatar: AVATAR_URLS.lena,
    profession: 'Digital Marketer',
    location: 'Dubai',
    interests: ['marketing', 'content', 'travel'],
    isOnline: true,
    expertise: ['SEO', 'Social Media', 'Analytics'],
    socialPreference: 'extrovert'
  },
  {
    id: '4',
    name: 'Tom Anderson',
    avatar: AVATAR_URLS.tom,
    profession: 'Data Analyst',
    location: 'Dubai',
    interests: ['data', 'finance', 'running'],
    isOnline: true,
    expertise: ['Python', 'SQL', 'Tableau'],
    socialPreference: 'ambivert'
  },
  {
    id: '5',
    name: 'Elena Rossi',
    avatar: AVATAR_URLS.elena,
    profession: 'Content Creator',
    location: 'Dubai',
    interests: ['photography', 'travel', 'food'],
    isOnline: true,
    expertise: ['Video Editing', 'Social Media', 'Branding'],
    socialPreference: 'extrovert'
  },
  {
    id: '6',
    name: 'Alex Kumar',
    avatar: AVATAR_URLS.alex,
    profession: 'Product Manager',
    location: 'Dubai',
    interests: ['startups', 'tech', 'fitness'],
    isOnline: true,
    expertise: ['Product Strategy', 'Agile', 'User Research'],
    socialPreference: 'ambivert'
  }
];

export const DEMO_GROUPS: ChatGroup[] = [
  {
    id: '1',
    name: 'Dubai Marina Co-workers',
    category: 'Professional',
    members: DEMO_USERS.slice(0, 3),
    lastMessage: 'Lena: The wifi here is insane — 200mbps 🚀',
    unreadCount: 3,
    icon: '💼'
  },
  {
    id: '2',
    name: 'AI & Web3 Builders',
    category: 'Networking',
    members: DEMO_USERS,
    lastMessage: 'Alex: Who\'s coming to the demo night at 7pm?',
    unreadCount: 7,
    icon: '🤖'
  },
  {
    id: '3',
    name: 'Sunset Rooftop Social',
    category: 'Social',
    members: DEMO_USERS.slice(1, 5),
    lastMessage: 'Elena: Brought my camera — golden hour in 20min!',
    unreadCount: 1,
    icon: '🌅'
  },
  {
    id: '4',
    name: 'Morning Run Crew',
    category: 'Fitness',
    members: DEMO_USERS.slice(2, 6),
    lastMessage: 'Tom: 6am at the Marina walk tomorrow?',
    unreadCount: 0,
    icon: '🏃'
  }
];

export const AI_SUGGESTIONS: AIMatch[] = [
  {
    type: 'co-working',
    count: 4,
    description: '4 designers need UX feedback — join the session at 2pm',
    icon: '🎨'
  },
  {
    type: 'dining',
    count: 6,
    description: '6 foodies organizing rooftop dinner tonight at 8pm',
    icon: '🍽️'
  },
  {
    type: 'fitness',
    count: 9,
    description: '9 runners meeting at Marina Walk — 6am tomorrow',
    icon: '🏃'
  },
  {
    type: 'tech',
    count: 12,
    description: '12 developers at AI demo night — starts in 3 hours',
    icon: '🤖'
  }
];
