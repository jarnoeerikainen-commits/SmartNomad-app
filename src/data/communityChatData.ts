import { NomadUser, ChatGroup, AIMatch } from '@/types/communityChat';

export const DEMO_USERS: NomadUser[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '👩‍💼',
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
    avatar: '👨‍💻',
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
    avatar: '👩‍🎨',
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
    avatar: '👨‍💼',
    profession: 'Data Analyst',
    location: 'Dubai',
    interests: ['data', 'finance', 'running'],
    isOnline: true,
    expertise: ['Python', 'SQL', 'Tableau'],
    socialPreference: 'ambivert'
  }
];

export const DEMO_GROUPS: ChatGroup[] = [
  {
    id: '1',
    name: 'Co-working Group',
    category: 'Professional',
    members: DEMO_USERS.slice(0, 3),
    lastMessage: 'Which co-working space today?',
    unreadCount: 2,
    icon: '💼'
  },
  {
    id: '2',
    name: 'Tech Meetup',
    category: 'Networking',
    members: DEMO_USERS,
    lastMessage: 'AI discussion at 7pm',
    unreadCount: 5,
    icon: '💻'
  },
  {
    id: '3',
    name: 'Weekend Explorers',
    category: 'Social',
    members: DEMO_USERS.slice(1, 4),
    lastMessage: 'Desert safari anyone?',
    unreadCount: 0,
    icon: '🏜️'
  }
];

export const AI_SUGGESTIONS: AIMatch[] = [
  {
    type: 'co-working',
    count: 3,
    description: '3 professionals looking for co-working',
    icon: '💼'
  },
  {
    type: 'exploration',
    count: 2,
    description: '2 artists planning gallery visit',
    icon: '🎨'
  },
  {
    type: 'fitness',
    count: 5,
    description: '5 runners for morning jog',
    icon: '🏃'
  },
  {
    type: 'tech',
    count: 8,
    description: 'Tech meetup forming (8 people)',
    icon: '💻'
  }
];
