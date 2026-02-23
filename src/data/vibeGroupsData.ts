// Persona-specific groups for SuperNomad Vibe
import { ChatRoom, ChatMessage } from '@/types/socialChat';

const AVATAR_URLS = {
  sarah: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  emma: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
  mike: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  alex: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  priya: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  james: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
  sophie: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  nina: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
  carlos: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
  tom: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  david: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face',
  lucas: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
};

// ─── Meghan Groups ────────────────────────────────────────────
const meghanYogaMessages: ChatMessage[] = [
  { id: 'my1', senderId: 'sophie_y', senderName: 'Sophie Laurent', senderAvatar: AVATAR_URLS.sophie, content: 'Anyone tried the new Vinyasa studio near Marylebone? Just had the best class there 🧘‍♀️', timestamp: new Date(Date.now() - 86400000 * 2), type: 'message' },
  { id: 'my2', senderId: 'nina_y', senderName: 'Nina Petrov', senderAvatar: AVATAR_URLS.nina, content: 'Yes! The 7am flow class is incredible. The teacher trained in Mysore.', timestamp: new Date(Date.now() - 86400000 * 2 + 3600000), type: 'message' },
  { id: 'my3', senderId: 'sarah_y', senderName: 'Sarah Chen', senderAvatar: AVATAR_URLS.sarah, content: 'I need a good yoga studio in Lisbon too — anyone know one?', timestamp: new Date(Date.now() - 86400000), type: 'message' },
  { id: 'my4', senderId: 'ai', senderName: 'SuperNomad AI', senderAvatar: '', content: '🧘 Sarah — "Yoga Lab Lisboa" in Príncipe Real is amazing. 4.9★ on Google, English classes daily at 8am. Several SuperNomad members go there.', timestamp: new Date(Date.now() - 86400000 + 1800000), type: 'ai_suggestion', isAI: true },
  { id: 'my5', senderId: 'sophie_y', senderName: 'Sophie Laurent', senderAvatar: AVATAR_URLS.sophie, content: 'London ladies — there\'s a pop-up yoga + brunch event at Soho House White City next Saturday. Shall we go? Max 20 spots.', timestamp: new Date(Date.now() - 3600000 * 5), type: 'message' },
];

const meghanF1Messages: ChatMessage[] = [
  { id: 'mf1', senderId: 'carlos_f', senderName: 'Carlos Mendez', senderAvatar: AVATAR_URLS.carlos, content: 'Bahrain testing session in 2 weeks! Who else is going? I managed to get paddock passes 🏎️', timestamp: new Date(Date.now() - 86400000 * 3), type: 'message' },
  { id: 'mf2', senderId: 'tom_f', senderName: 'Tom Anderson', senderAvatar: AVATAR_URLS.tom, content: 'Me! Flying in from Stockholm on March 7. Do we have a group dinner plan?', timestamp: new Date(Date.now() - 86400000 * 3 + 7200000), type: 'message' },
  { id: 'mf3', senderId: 'james_f', senderName: 'James Rodriguez', senderAvatar: AVATAR_URLS.james, content: 'I\'ll be in Bahrain for business, staying at the Four Seasons. Count me in for dinner and race viewing.', timestamp: new Date(Date.now() - 86400000 * 2), type: 'message' },
  { id: 'mf4', senderId: 'ai', senderName: 'SuperNomad AI', senderAvatar: '', content: '🏎️ F1 Bahrain Testing: March 8-9. I found 6 SuperNomad members attending. The Gulf Hotel has a VIP rooftop viewing — shall I reserve a table for the group on March 8?', timestamp: new Date(Date.now() - 86400000), type: 'ai_suggestion', isAI: true },
  { id: 'mf5', senderId: 'carlos_f', senderName: 'Carlos Mendez', senderAvatar: AVATAR_URLS.carlos, content: 'Perfect! Book it. Also — who\'s going to Silverstone in June? We should start planning the hospitality tent early.', timestamp: new Date(Date.now() - 3600000 * 8), type: 'message' },
];

const meghanExpatsLondonMessages: ChatMessage[] = [
  { id: 'mel1', senderId: 'sophie_e', senderName: 'Sophie Laurent', senderAvatar: AVATAR_URLS.sophie, content: 'Best private GP in London? Need one who understands expat health needs and does same-day appointments.', timestamp: new Date(Date.now() - 86400000 * 4), type: 'message' },
  { id: 'mel2', senderId: 'nina_e', senderName: 'Nina Petrov', senderAvatar: AVATAR_URLS.nina, content: 'Dr. Sarah at The London General Practice, Sloane St. She\'s phenomenal and speaks 4 languages. Can usually get seen same day.', timestamp: new Date(Date.now() - 86400000 * 4 + 3600000), type: 'message' },
  { id: 'mel3', senderId: 'james_e', senderName: 'James Rodriguez', senderAvatar: AVATAR_URLS.james, content: 'Quick question — anyone know how to set up a UK SIPP pension as a non-dom? My accountant is clueless.', timestamp: new Date(Date.now() - 86400000 * 2), type: 'message' },
  { id: 'mel4', senderId: 'ai', senderName: 'SuperNomad AI', senderAvatar: '', content: '💡 James — for non-dom UK pension, you want a specialist. "Pitcher Partners London" specializes in expat tax & pensions. Also, HMRC has updated non-dom rules for 2026 — worth a review. Want me to share the key changes?', timestamp: new Date(Date.now() - 86400000 * 2 + 1800000), type: 'ai_suggestion', isAI: true },
  { id: 'mel5', senderId: 'tom_e', senderName: 'Tom Anderson', senderAvatar: AVATAR_URLS.tom, content: 'Also useful: the free British Expat Forum at BAFTA on March 28. Last year had excellent speakers on dual taxation.', timestamp: new Date(Date.now() - 86400000), type: 'message' },
  { id: 'mel6', senderId: 'sophie_e', senderName: 'Sophie Laurent', senderAvatar: AVATAR_URLS.sophie, content: 'Thanks everyone! Love this group — always quick answers. Anyone want to meet at The Ned for drinks on Friday?', timestamp: new Date(Date.now() - 3600000 * 6), type: 'message' },
];

// ─── John Groups ──────────────────────────────────────────────
const johnTriathlonMessages: ChatMessage[] = [
  { id: 'jt1', senderId: 'mike_t', senderName: 'Mike Thompson', senderAvatar: AVATAR_URLS.mike, content: 'Bintan Ironman 70.3 is April 4! Who\'s racing? I\'m doing my first one — any tips for the swim leg? 🏊', timestamp: new Date(Date.now() - 86400000 * 5), type: 'message' },
  { id: 'jt2', senderId: 'david_t', senderName: 'David Okonkwo', senderAvatar: AVATAR_URLS.david, content: 'Practice open water! The currents in Bintan can be tricky. I did it last year — finished in 5:42.', timestamp: new Date(Date.now() - 86400000 * 5 + 7200000), type: 'message' },
  { id: 'jt3', senderId: 'lucas_t', senderName: 'Lucas Silva', senderAvatar: AVATAR_URLS.lucas, content: 'Training update: just did a brick session — 40km bike + 10km run in 2:15. Feeling good for Bintan!', timestamp: new Date(Date.now() - 86400000 * 3), type: 'message' },
  { id: 'jt4', senderId: 'ai', senderName: 'SuperNomad AI', senderAvatar: '', content: '🏊 Bintan 70.3 prep group: The OCBC Aquatic Centre in Singapore has a "Race Prep" session every Saturday at 6am — coached by ex-Olympic swimmer. 4 SuperNomad members train there. Also, East Coast Park has a group ride every Sunday at 6:30am.', timestamp: new Date(Date.now() - 86400000 * 2), type: 'ai_suggestion', isAI: true },
  { id: 'jt5', senderId: 'mike_t', senderName: 'Mike Thompson', senderAvatar: AVATAR_URLS.mike, content: 'Amazing! I\'ll be at the Saturday swim. Also — Challenge Roth in June, anyone? It\'s the best-supported IM distance race in the world.', timestamp: new Date(Date.now() - 86400000), type: 'message' },
  { id: 'jt6', senderId: 'david_t', senderName: 'David Okonkwo', senderAvatar: AVATAR_URLS.david, content: 'Signed up for Roth! Let\'s book accommodation together — the town fills up fast. I know a great Airbnb near T2.', timestamp: new Date(Date.now() - 3600000 * 4), type: 'message' },
];

const johnExpatsSGMessages: ChatMessage[] = [
  { id: 'jes1', senderId: 'priya_e', senderName: 'Priya Sharma', senderAvatar: AVATAR_URLS.priya, content: 'Welcome to Singapore John! The expat transition can be overwhelming. What do you need help with first?', timestamp: new Date(Date.now() - 86400000 * 7), type: 'message' },
  { id: 'jes2', senderId: 'alex_e', senderName: 'Alex Kim', senderAvatar: AVATAR_URLS.alex, content: 'School tips: UWC Dover is excellent for the older one. For the little one, check Chatsworth International — they have great nursery programs.', timestamp: new Date(Date.now() - 86400000 * 6), type: 'message' },
  { id: 'jes3', senderId: 'priya_e', senderName: 'Priya Sharma', senderAvatar: AVATAR_URLS.priya, content: 'For the dependent pass — make sure you have the employment letter stamped, not just emailed. MOM is strict about originals.', timestamp: new Date(Date.now() - 86400000 * 5), type: 'message' },
  { id: 'jes4', senderId: 'ai', senderName: 'SuperNomad AI', senderAvatar: '', content: '📋 John, here\'s your Singapore Settling-In Checklist: 1) SingPass registration (online, 2 days) 2) Bank account (DBS Treasures for expats — Orchard branch is fastest) 3) Health screening at Raffles Medical 4) Mobile: Singtel/StarHub postpaid plans. Want me to create a detailed guide?', timestamp: new Date(Date.now() - 86400000 * 4), type: 'ai_suggestion', isAI: true },
  { id: 'jes5', senderId: 'alex_e', senderName: 'Alex Kim', senderAvatar: AVATAR_URLS.alex, content: 'Pro tip: Join the "American Association Singapore" — they do monthly brunches and have a great kids playgroup. Perfect for Leo.', timestamp: new Date(Date.now() - 86400000 * 2), type: 'message' },
  { id: 'jes6', senderId: 'priya_e', senderName: 'Priya Sharma', senderAvatar: AVATAR_URLS.priya, content: 'Also — the European Expats & Families group meets every first Sunday at Dempsey Hill. Great for your wife to make connections. 🤗', timestamp: new Date(Date.now() - 86400000), type: 'message' },
];

const johnSkiGroupMessages: ChatMessage[] = [
  { id: 'jsk1', senderId: 'tom_s', senderName: 'Tom Anderson', senderAvatar: AVATAR_URLS.tom, content: 'Verbier snow report is looking INCREDIBLE for April. 3m base at the summit. Who\'s booking? ⛷️', timestamp: new Date(Date.now() - 86400000 * 4), type: 'message' },
  { id: 'jsk2', senderId: 'nina_s', senderName: 'Nina Petrov', senderAvatar: AVATAR_URLS.nina, content: 'We\'re doing Zermatt in August — yes, summer skiing on the glacier! Kids loved it last year.', timestamp: new Date(Date.now() - 86400000 * 3), type: 'message' },
  { id: 'jsk3', senderId: 'carlos_s', senderName: 'Carlos Mendez', senderAvatar: AVATAR_URLS.carlos, content: 'Any family-friendly ski instructors in Verbier? Need someone good with 4-year-olds.', timestamp: new Date(Date.now() - 86400000 * 2), type: 'message' },
  { id: 'jsk4', senderId: 'ai', senderName: 'SuperNomad AI', senderAvatar: '', content: '⛷️ For young kids in Verbier: "Verbier Ski School" has a "Snowflakes" program for ages 3-5 — small groups, very gentle. Also, "Altitude Ski School" does private lessons for families. I can book a family package if you want!', timestamp: new Date(Date.now() - 86400000), type: 'ai_suggestion', isAI: true },
  { id: 'jsk5', senderId: 'tom_s', senderName: 'Tom Anderson', senderAvatar: AVATAR_URLS.tom, content: 'Group chalet? I found a stunning one near Médran lift — 5 bedrooms, hot tub, sleeps 12. CHF 8,500/week. Split between 3 families?', timestamp: new Date(Date.now() - 3600000 * 6), type: 'message' },
];

// ─── Group Definitions ──────────────────────────────────────────
export interface VibeGroup {
  id: string;
  name: string;
  emoji: string;
  category: 'sports' | 'expat' | 'interest' | 'location';
  description: string;
  memberCount: number;
  personaIds: ('meghan' | 'john')[]; // which demo personas auto-join
  chatRoom: ChatRoom;
}

export const VIBE_GROUPS: VibeGroup[] = [
  // Meghan groups
  {
    id: 'grp-yoga-wellness',
    name: 'Yoga & Wellness',
    emoji: '🧘‍♀️',
    category: 'sports',
    description: 'Daily practice, studio recommendations, retreat planning',
    memberCount: 847,
    personaIds: ['meghan'],
    chatRoom: {
      id: 'grp-yoga-wellness',
      type: 'interest',
      name: '🧘‍♀️ Yoga & Wellness',
      participants: ['sophie_y', 'nina_y', 'sarah_y'],
      participantDetails: [
        { id: 'sophie_y', name: 'Sophie Laurent', avatar: AVATAR_URLS.sophie },
        { id: 'nina_y', name: 'Nina Petrov', avatar: AVATAR_URLS.nina },
        { id: 'sarah_y', name: 'Sarah Chen', avatar: AVATAR_URLS.sarah },
      ],
      messages: meghanYogaMessages,
      unreadCount: 3,
      lastMessage: 'Anyone want to meet at Soho House for yoga + brunch?',
      lastActivity: new Date(Date.now() - 3600000 * 5),
      metadata: { purpose: 'Yoga & wellness community' },
    },
  },
  {
    id: 'grp-f1-fans',
    name: 'F1 Fans Club',
    emoji: '🏎️',
    category: 'sports',
    description: 'Race weekends, trackside meetups, F1 travel planning',
    memberCount: 1243,
    personaIds: ['meghan'],
    chatRoom: {
      id: 'grp-f1-fans',
      type: 'interest',
      name: '🏎️ F1 Fans Club',
      participants: ['carlos_f', 'tom_f', 'james_f'],
      participantDetails: [
        { id: 'carlos_f', name: 'Carlos Mendez', avatar: AVATAR_URLS.carlos },
        { id: 'tom_f', name: 'Tom Anderson', avatar: AVATAR_URLS.tom },
        { id: 'james_f', name: 'James Rodriguez', avatar: AVATAR_URLS.james },
      ],
      messages: meghanF1Messages,
      unreadCount: 2,
      lastMessage: 'Who\'s going to Silverstone in June?',
      lastActivity: new Date(Date.now() - 3600000 * 8),
      metadata: { purpose: 'F1 race weekends & meetups' },
    },
  },
  {
    id: 'grp-expats-london',
    name: 'Expats London',
    emoji: '🇬🇧',
    category: 'expat',
    description: 'London expat life, tax tips, healthcare, social events',
    memberCount: 3421,
    personaIds: ['meghan'],
    chatRoom: {
      id: 'grp-expats-london',
      type: 'location',
      name: '🇬🇧 Expats London',
      participants: ['sophie_e', 'nina_e', 'james_e', 'tom_e'],
      participantDetails: [
        { id: 'sophie_e', name: 'Sophie Laurent', avatar: AVATAR_URLS.sophie },
        { id: 'nina_e', name: 'Nina Petrov', avatar: AVATAR_URLS.nina },
        { id: 'james_e', name: 'James Rodriguez', avatar: AVATAR_URLS.james },
        { id: 'tom_e', name: 'Tom Anderson', avatar: AVATAR_URLS.tom },
      ],
      messages: meghanExpatsLondonMessages,
      unreadCount: 4,
      lastMessage: 'Anyone want to meet at The Ned for drinks on Friday?',
      lastActivity: new Date(Date.now() - 3600000 * 6),
      metadata: { location: 'London', purpose: 'London expat community' },
    },
  },
  // John groups
  {
    id: 'grp-triathlon',
    name: 'Triathlon Training',
    emoji: '🏊',
    category: 'sports',
    description: 'Swim-bike-run training, race planning, gear reviews',
    memberCount: 562,
    personaIds: ['john'],
    chatRoom: {
      id: 'grp-triathlon',
      type: 'interest',
      name: '🏊 Triathlon Training',
      participants: ['mike_t', 'david_t', 'lucas_t'],
      participantDetails: [
        { id: 'mike_t', name: 'Mike Thompson', avatar: AVATAR_URLS.mike },
        { id: 'david_t', name: 'David Okonkwo', avatar: AVATAR_URLS.david },
        { id: 'lucas_t', name: 'Lucas Silva', avatar: AVATAR_URLS.lucas },
      ],
      messages: johnTriathlonMessages,
      unreadCount: 4,
      lastMessage: 'Let\'s book accommodation for Roth together!',
      lastActivity: new Date(Date.now() - 3600000 * 4),
      metadata: { purpose: 'Triathlon community & race planning' },
    },
  },
  {
    id: 'grp-expats-sg',
    name: 'Expats Singapore',
    emoji: '🇸🇬',
    category: 'expat',
    description: 'Settling in, visas, schools, family life in SG',
    memberCount: 4892,
    personaIds: ['john'],
    chatRoom: {
      id: 'grp-expats-sg',
      type: 'location',
      name: '🇸🇬 Expats Singapore',
      participants: ['priya_e', 'alex_e'],
      participantDetails: [
        { id: 'priya_e', name: 'Priya Sharma', avatar: AVATAR_URLS.priya },
        { id: 'alex_e', name: 'Alex Kim', avatar: AVATAR_URLS.alex },
      ],
      messages: johnExpatsSGMessages,
      unreadCount: 5,
      lastMessage: 'European Expats & Families group meets every first Sunday at Dempsey Hill',
      lastActivity: new Date(Date.now() - 86400000),
      metadata: { location: 'Singapore', purpose: 'Singapore expat settling in' },
    },
  },
  {
    id: 'grp-ski-families',
    name: 'Ski Families',
    emoji: '⛷️',
    category: 'sports',
    description: 'Family ski trips, kids lessons, chalet shares',
    memberCount: 389,
    personaIds: ['john'],
    chatRoom: {
      id: 'grp-ski-families',
      type: 'interest',
      name: '⛷️ Ski Families',
      participants: ['tom_s', 'nina_s', 'carlos_s'],
      participantDetails: [
        { id: 'tom_s', name: 'Tom Anderson', avatar: AVATAR_URLS.tom },
        { id: 'nina_s', name: 'Nina Petrov', avatar: AVATAR_URLS.nina },
        { id: 'carlos_s', name: 'Carlos Mendez', avatar: AVATAR_URLS.carlos },
      ],
      messages: johnSkiGroupMessages,
      unreadCount: 2,
      lastMessage: 'Group chalet near Médran lift — 5 bedrooms, hot tub!',
      lastActivity: new Date(Date.now() - 3600000 * 6),
      metadata: { purpose: 'Family ski trip planning' },
    },
  },
];

export function getPersonaGroups(personaId: 'meghan' | 'john' | null): VibeGroup[] {
  if (!personaId) return [];
  return VIBE_GROUPS.filter(g => g.personaIds.includes(personaId));
}
