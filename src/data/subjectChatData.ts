import { ChatRoom, ChatCategory, ChatDuration, SkillLevel } from '@/types/subjectChat';

export const DEMO_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'chat-001',
    creator: 'Sarah Chen',
    creatorAvatar: '👩‍💼',
    subject: 'Padel Tennis Beginners',
    category: ChatCategory.SPORTS_ACTIVITIES,
    description: 'Looking for padel partners in Barcelona. Beginners welcome! Let\'s learn together and have fun.',
    settings: {
      privacy: 'public',
      ageRange: { min: 25, max: 45 },
      skillLevel: [SkillLevel.BEGINNER],
      capacity: 8,
      duration: ChatDuration.THREE_DAYS,
      locationRadius: 5
    },
    participants: ['sarah', 'mike', 'you'],
    participantDetails: [
      { id: 'sarah', name: 'Sarah', avatar: '👩‍💼', skillLevel: SkillLevel.BEGINNER },
      { id: 'mike', name: 'Mike', avatar: '👨‍💻', skillLevel: SkillLevel.BEGINNER },
      { id: 'you', name: 'You', avatar: '👤', skillLevel: SkillLevel.BEGINNER }
    ],
    waitingList: [],
    aiModerator: {
      enabled: true,
      strictness: 'moderate',
      topicEnforcement: true,
      summaryFrequency: 'daily',
      welcomeNewUsers: true
    },
    activity: {
      messages: 24,
      activeParticipants: 3,
      created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    messages: [
      {
        id: 'm1',
        senderId: 'sarah',
        senderName: 'Sarah',
        senderAvatar: '👩‍💼',
        content: 'Anyone free for padel tomorrow morning? I found a great court!',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 'm2',
        senderId: 'mike',
        senderName: 'Mike',
        senderAvatar: '👨‍💻',
        content: 'I\'m available! Which courts are you thinking?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
      },
      {
        id: 'm3',
        senderId: 'ai',
        senderName: 'AI Moderator',
        senderAvatar: '🤖',
        content: 'Based on your locations, there are 3 courts available at Sports Center Barcelona from 9-11 AM tomorrow. I can help coordinate if needed!',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        isAI: true,
        type: 'message'
      }
    ],
    topicAdherence: 95
  },
  {
    id: 'chat-002',
    creator: 'Alex Kumar',
    creatorAvatar: '👨‍💼',
    subject: 'React & TypeScript Study Group',
    category: ChatCategory.TECH_INNOVATION,
    description: 'Daily co-learning session for React and TypeScript. Intermediate developers welcome. We discuss best practices, solve challenges together.',
    settings: {
      privacy: 'approval-required',
      ageRange: 'all-ages',
      skillLevel: [SkillLevel.INTERMEDIATE, SkillLevel.ADVANCED],
      capacity: 15,
      duration: ChatDuration.ONE_WEEK,
      locationRadius: 10
    },
    participants: ['alex', 'maria', 'john', 'lisa', 'tom'],
    participantDetails: [
      { id: 'alex', name: 'Alex', avatar: '👨‍💼', skillLevel: SkillLevel.ADVANCED },
      { id: 'maria', name: 'Maria', avatar: '👩‍💻', skillLevel: SkillLevel.INTERMEDIATE },
      { id: 'john', name: 'John', avatar: '👨‍💻', skillLevel: SkillLevel.INTERMEDIATE },
      { id: 'lisa', name: 'Lisa', avatar: '👩‍🎨', skillLevel: SkillLevel.INTERMEDIATE },
      { id: 'tom', name: 'Tom', avatar: '👨‍🔧', skillLevel: SkillLevel.ADVANCED }
    ],
    waitingList: ['user1', 'user2'],
    aiModerator: {
      enabled: true,
      strictness: 'moderate',
      topicEnforcement: true,
      summaryFrequency: 'daily',
      welcomeNewUsers: true
    },
    activity: {
      messages: 156,
      activeParticipants: 5,
      created: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    messages: [
      {
        id: 'm1',
        senderId: 'ai',
        senderName: 'AI Moderator',
        senderAvatar: '🤖',
        content: 'Good morning! Today\'s focus: React hooks optimization. The group has been discussing useCallback and useMemo best practices.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        isAI: true,
        type: 'summary'
      },
      {
        id: 'm2',
        senderId: 'alex',
        senderName: 'Alex',
        senderAvatar: '👨‍💼',
        content: 'I found a great pattern for optimizing re-renders. Let me share a code snippet...',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    ],
    topicAdherence: 92
  },
  {
    id: 'chat-003',
    creator: 'Elena Martinez',
    creatorAvatar: '👩‍🍳',
    subject: 'Weekend Food Tour - Local Markets',
    category: ChatCategory.FOOD_DINING,
    description: 'Exploring authentic local markets and street food in Dubai this weekend. Food lovers and photographers welcome!',
    settings: {
      privacy: 'public',
      ageRange: 'all-ages',
      skillLevel: [],
      capacity: 10,
      duration: ChatDuration.TWO_HOURS,
      locationRadius: 3
    },
    participants: ['elena', 'raj', 'sophie'],
    participantDetails: [
      { id: 'elena', name: 'Elena', avatar: '👩‍🍳' },
      { id: 'raj', name: 'Raj', avatar: '👨‍🍳' },
      { id: 'sophie', name: 'Sophie', avatar: '👩‍🎨' }
    ],
    waitingList: [],
    aiModerator: {
      enabled: true,
      strictness: 'relaxed',
      topicEnforcement: false,
      summaryFrequency: 'manual',
      welcomeNewUsers: true
    },
    activity: {
      messages: 45,
      activeParticipants: 3,
      created: new Date(Date.now() - 1 * 60 * 60 * 1000),
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000)
    },
    messages: [
      {
        id: 'm1',
        senderId: 'elena',
        senderName: 'Elena',
        senderAvatar: '👩‍🍳',
        content: 'Meeting at Deira Fish Market at 10 AM! Who\'s in?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000)
      },
      {
        id: 'm2',
        senderId: 'raj',
        senderName: 'Raj',
        senderAvatar: '👨‍🍳',
        content: 'Count me in! I know some great spots nearby too.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: 'm3',
        senderId: 'ai',
        senderName: 'AI Moderator',
        senderAvatar: '🤖',
        content: 'Weather looks perfect! Temperature will be 28°C. I\'ve marked some popular photo spots on the map.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        isAI: true,
        type: 'message'
      }
    ],
    topicAdherence: 88
  },
  {
    id: 'chat-004',
    creator: 'Marcus Johnson',
    creatorAvatar: '👨‍💼',
    subject: 'Startup Founders Mastermind',
    category: ChatCategory.BUSINESS_COLLABORATION,
    description: 'Monthly mastermind for startup founders. Share challenges, celebrate wins, get feedback. Continuous group for serious entrepreneurs.',
    settings: {
      privacy: 'approval-required',
      ageRange: { min: 25, max: 55 },
      skillLevel: [SkillLevel.PROFESSIONAL],
      capacity: 12,
      duration: ChatDuration.CONTINUOUS,
      locationRadius: 20
    },
    participants: ['marcus', 'sarah', 'david', 'nina', 'chris', 'emma'],
    participantDetails: [
      { id: 'marcus', name: 'Marcus', avatar: '👨‍💼', skillLevel: SkillLevel.PROFESSIONAL },
      { id: 'sarah', name: 'Sarah', avatar: '👩‍💼', skillLevel: SkillLevel.PROFESSIONAL },
      { id: 'david', name: 'David', avatar: '👨‍💻', skillLevel: SkillLevel.PROFESSIONAL },
      { id: 'nina', name: 'Nina', avatar: '👩‍💻', skillLevel: SkillLevel.PROFESSIONAL },
      { id: 'chris', name: 'Chris', avatar: '👨‍🎨', skillLevel: SkillLevel.PROFESSIONAL },
      { id: 'emma', name: 'Emma', avatar: '👩‍🔬', skillLevel: SkillLevel.PROFESSIONAL }
    ],
    waitingList: ['user3', 'user4', 'user5'],
    aiModerator: {
      enabled: true,
      strictness: 'strict',
      topicEnforcement: true,
      summaryFrequency: 'daily',
      welcomeNewUsers: true
    },
    activity: {
      messages: 1247,
      activeParticipants: 6,
      created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      expires: null
    },
    messages: [
      {
        id: 'm1',
        senderId: 'marcus',
        senderName: 'Marcus',
        senderAvatar: '👨‍💼',
        content: 'Hit $50K MRR this month! The marketing strategy we discussed really worked.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 'm2',
        senderId: 'sarah',
        senderName: 'Sarah',
        senderAvatar: '👩‍💼',
        content: 'Congratulations Marcus! Can you share more details about the implementation?',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 'm3',
        senderId: 'ai',
        senderName: 'AI Moderator',
        senderAvatar: '🤖',
        content: 'Great milestone! This aligns with our discussion from 2 weeks ago about scaling customer acquisition. Would you like me to pull up those notes?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isAI: true,
        type: 'message'
      }
    ],
    topicAdherence: 96
  }
];

export const CHAT_CATEGORIES = Object.values(ChatCategory);
export const CHAT_DURATIONS = Object.values(ChatDuration);
export const SKILL_LEVELS = Object.values(SkillLevel);
