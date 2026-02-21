import { NomadUser, ChatGroup, AIMatch } from '@/types/communityChat';

// Professional avatar URLs using Unsplash - diverse and attractive
const A = (id: string) => `https://images.unsplash.com/photo-${id}?w=150&h=150&fit=crop&crop=face`;

// 50 unique profiles with diverse hobbies
export const PULSE_PROFILES: NomadUser[] = [
  { id: 'p1', name: 'Sarah Chen', avatar: A('1494790108377-be9c29b29330'), profession: 'UX Designer', location: 'Dubai', interests: ['yoga', 'photography', 'design'], isOnline: true, expertise: ['Product Design'], socialPreference: 'ambivert' },
  { id: 'p2', name: 'Mike Johnson', avatar: A('1507003211169-0a1dd7228f2d'), profession: 'Software Developer', location: 'Dubai', interests: ['rock climbing', 'gaming', 'hiking'], isOnline: true, expertise: ['React', 'AI'], socialPreference: 'introvert' },
  { id: 'p3', name: 'Lena Martinez', avatar: A('1438761681033-6461ffad8d80'), profession: 'Digital Marketer', location: 'Dubai', interests: ['surfing', 'content creation', 'travel'], isOnline: true, expertise: ['SEO', 'Analytics'], socialPreference: 'extrovert' },
  { id: 'p4', name: 'Tom Anderson', avatar: A('1472099645785-5658abf4ff4e'), profession: 'Data Analyst', location: 'Dubai', interests: ['marathon running', 'finance', 'chess'], isOnline: true, expertise: ['Python', 'Tableau'], socialPreference: 'ambivert' },
  { id: 'p5', name: 'Elena Rossi', avatar: A('1534528741775-53994a69daeb'), profession: 'Content Creator', location: 'Dubai', interests: ['pottery', 'food blogging', 'painting'], isOnline: true, expertise: ['Video Editing', 'Branding'], socialPreference: 'extrovert' },
  { id: 'p6', name: 'Alex Kumar', avatar: A('1500648767791-00dcc994a43e'), profession: 'Product Manager', location: 'Dubai', interests: ['kickboxing', 'startups', 'fitness'], isOnline: true, expertise: ['Agile', 'Strategy'], socialPreference: 'ambivert' },
  { id: 'p7', name: 'Maria Santos', avatar: A('1517841905240-472988babdf9'), profession: 'Freelance Writer', location: 'Lisbon', interests: ['sailing', 'poetry', 'wine tasting'], isOnline: true, expertise: ['Copywriting'], socialPreference: 'introvert' },
  { id: 'p8', name: 'Raj Patel', avatar: A('1506794778202-cad84cf45f1d'), profession: 'Blockchain Developer', location: 'Bali', interests: ['scuba diving', 'crypto', 'meditation'], isOnline: true, expertise: ['Solidity', 'Web3'], socialPreference: 'introvert' },
  { id: 'p9', name: 'Sophie Dubois', avatar: A('1544005313-94ddf0286df2'), profession: 'Interior Designer', location: 'Paris', interests: ['sketching', 'architecture', 'antiques'], isOnline: true, expertise: ['3D Rendering'], socialPreference: 'ambivert' },
  { id: 'p10', name: 'Marcus Brown', avatar: A('1519345182560-3f2917c472ef'), profession: 'Videographer', location: 'Cape Town', interests: ['paragliding', 'filmmaking', 'djing'], isOnline: true, expertise: ['Drone Ops'], socialPreference: 'extrovert' },
  { id: 'p11', name: 'Nina Johansson', avatar: A('1487412720507-e7ab37603c6f'), profession: 'Nutritionist', location: 'Stockholm', interests: ['cross-country skiing', 'meal prep', 'herbalism'], isOnline: true, expertise: ['Wellness'], socialPreference: 'ambivert' },
  { id: 'p12', name: 'Chris Walker', avatar: A('1463453091185-61582044d556'), profession: 'Cybersecurity Analyst', location: 'Berlin', interests: ['bouldering', 'CTF hacking', 'board games'], isOnline: true, expertise: ['Pen Testing'], socialPreference: 'introvert' },
  { id: 'p13', name: 'Emma Laurent', avatar: A('1531746020798-e6953c6e8e04'), profession: 'Fashion Designer', location: 'Milan', interests: ['figure skating', 'sewing', 'vintage fashion'], isOnline: true, expertise: ['Pattern Making'], socialPreference: 'extrovert' },
  { id: 'p14', name: 'David Kim', avatar: A('1492562080023-ab3db95bfbce'), profession: 'Mobile Developer', location: 'Seoul', interests: ['taekwondo', 'k-pop dance', 'esports'], isOnline: true, expertise: ['Flutter', 'Swift'], socialPreference: 'introvert' },
  { id: 'p15', name: 'Lisa Müller', avatar: A('1489424731084-a5d8b219a5bb'), profession: 'Graphic Designer', location: 'Vienna', interests: ['ballroom dancing', 'calligraphy', 'opera'], isOnline: true, expertise: ['Typography'], socialPreference: 'ambivert' },
  { id: 'p16', name: 'James Wright', avatar: A('1560250097-0b93528c311a'), profession: 'Investment Analyst', location: 'London', interests: ['rowing', 'whiskey tasting', 'golf'], isOnline: true, expertise: ['FinTech'], socialPreference: 'extrovert' },
  { id: 'p17', name: 'Yuki Tanaka', avatar: A('1529626455594-4ff0802cfb7e'), profession: 'Animator', location: 'Tokyo', interests: ['kendo', 'manga drawing', 'cosplay'], isOnline: true, expertise: ['Motion Graphics'], socialPreference: 'introvert' },
  { id: 'p18', name: 'Carlos Mendez', avatar: A('1519085360753-af0119f7cbe7'), profession: 'Architect', location: 'Barcelona', interests: ['trail running', 'ceramics', 'flamenco'], isOnline: true, expertise: ['AutoCAD'], socialPreference: 'ambivert' },
  { id: 'p19', name: 'Rachel Green', avatar: A('1508214751196-bcfd4ca60f91'), profession: 'Psychologist', location: 'Melbourne', interests: ['horseback riding', 'journaling', 'mindfulness'], isOnline: true, expertise: ['CBT'], socialPreference: 'ambivert' },
  { id: 'p20', name: 'Lucas Silva', avatar: A('1539571696357-5a69c17a67c6'), profession: 'DJ & Producer', location: 'Rio de Janeiro', interests: ['capoeira', 'music production', 'skateboarding'], isOnline: true, expertise: ['Ableton'], socialPreference: 'extrovert' },
  { id: 'p21', name: 'Anna Petrov', avatar: A('1499887142886-791eca5918cd'), profession: 'Data Scientist', location: 'Tbilisi', interests: ['fencing', 'wine making', 'oil painting'], isOnline: true, expertise: ['ML/AI'], socialPreference: 'introvert' },
  { id: 'p22', name: 'Omar Hassan', avatar: A('1504257432389-52343af06ae3'), profession: 'Civil Engineer', location: 'Marrakech', interests: ['desert trekking', 'astronomy', 'tea ceremonies'], isOnline: true, expertise: ['Structural'], socialPreference: 'ambivert' },
  { id: 'p23', name: 'Priya Sharma', avatar: A('1573496359142-b8d87734a5a2'), profession: 'Biotech Researcher', location: 'Bangalore', interests: ['classical dance', 'birdwatching', 'cooking'], isOnline: true, expertise: ['Genomics'], socialPreference: 'introvert' },
  { id: 'p24', name: 'Miguel Torres', avatar: A('1534030347209-467a5b0ad3e6'), profession: 'Chef', location: 'Mexico City', interests: ['boxing', 'fermentation', 'street food'], isOnline: true, expertise: ['Gastronomy'], socialPreference: 'extrovert' },
  { id: 'p25', name: 'Fatima Al-Rashid', avatar: A('1580489944761-15a19d654956'), profession: 'Sustainability Consultant', location: 'Abu Dhabi', interests: ['falconry', 'desert camping', 'calligraphy'], isOnline: true, expertise: ['ESG'], socialPreference: 'ambivert' },
  { id: 'p26', name: 'Noah Fischer', avatar: A('1507591064344-4c6ce005b128'), profession: 'Mechanical Engineer', location: 'Munich', interests: ['mountain biking', 'woodworking', 'brewing'], isOnline: true, expertise: ['CAD/CAM'], socialPreference: 'introvert' },
  { id: 'p27', name: 'Chloe Martin', avatar: A('1499887142886-791eca5918cd'), profession: 'Yoga Instructor', location: 'Chiang Mai', interests: ['aerial yoga', 'vegan cooking', 'sound healing'], isOnline: true, expertise: ['Wellness'], socialPreference: 'extrovert' },
  { id: 'p28', name: 'Daniel Okafor', avatar: A('1519345182560-3f2917c472ef'), profession: 'Fintech Founder', location: 'Lagos', interests: ['basketball', 'afrobeats', 'mentoring'], isOnline: true, expertise: ['Payments'], socialPreference: 'extrovert' },
  { id: 'p29', name: 'Isabella Ricci', avatar: A('1534528741775-53994a69daeb'), profession: 'Sommelier', location: 'Florence', interests: ['wine pairing', 'truffle hunting', 'cycling'], isOnline: true, expertise: ['Oenology'], socialPreference: 'ambivert' },
  { id: 'p30', name: 'Leo Chang', avatar: A('1500648767791-00dcc994a43e'), profession: 'AI Researcher', location: 'Taipei', interests: ['table tennis', 'origami', 'bubble tea tasting'], isOnline: true, expertise: ['Deep Learning'], socialPreference: 'introvert' },
  { id: 'p31', name: 'Zara Osei', avatar: A('1438761681033-6461ffad8d80'), profession: 'Photographer', location: 'Accra', interests: ['street photography', 'drumming', 'batik art'], isOnline: true, expertise: ['Portraiture'], socialPreference: 'ambivert' },
  { id: 'p32', name: 'Viktor Petrov', avatar: A('1472099645785-5658abf4ff4e'), profession: 'Game Developer', location: 'Warsaw', interests: ['speedcubing', 'pixel art', 'archery'], isOnline: true, expertise: ['Unity', 'C#'], socialPreference: 'introvert' },
  { id: 'p33', name: 'Amira Khalil', avatar: A('1517841905240-472988babdf9'), profession: 'Translator', location: 'Cairo', interests: ['belly dancing', 'Arabic poetry', 'snorkeling'], isOnline: true, expertise: ['Languages'], socialPreference: 'ambivert' },
  { id: 'p34', name: 'Felix Wagner', avatar: A('1463453091185-61582044d556'), profession: 'Sound Engineer', location: 'Amsterdam', interests: ['vinyl collecting', 'kayaking', 'jazz piano'], isOnline: true, expertise: ['Mastering'], socialPreference: 'introvert' },
  { id: 'p35', name: 'Luna Park', avatar: A('1544005313-94ddf0286df2'), profession: 'UX Researcher', location: 'Singapore', interests: ['bouldering', 'bullet journaling', 'thai cooking'], isOnline: true, expertise: ['User Testing'], socialPreference: 'ambivert' },
  { id: 'p36', name: 'Mateo Herrera', avatar: A('1506794778202-cad84cf45f1d'), profession: 'Renewable Energy Engineer', location: 'Medellín', interests: ['salsa dancing', 'coffee roasting', 'bird photography'], isOnline: true, expertise: ['Solar Tech'], socialPreference: 'extrovert' },
  { id: 'p37', name: 'Aisha Mohammed', avatar: A('1487412720507-e7ab37603c6f'), profession: 'Public Health Specialist', location: 'Nairobi', interests: ['marathon running', 'beadwork', 'safari guiding'], isOnline: true, expertise: ['Epidemiology'], socialPreference: 'ambivert' },
  { id: 'p38', name: 'Liam O\'Brien', avatar: A('1560250097-0b93528c311a'), profession: 'Music Producer', location: 'Dublin', interests: ['traditional Irish music', 'surfing', 'pub quizzes'], isOnline: true, expertise: ['Pro Tools'], socialPreference: 'extrovert' },
  { id: 'p39', name: 'Mei Lin', avatar: A('1531746020798-e6953c6e8e04'), profession: 'Tea Master', location: 'Hangzhou', interests: ['tea ceremony', 'tai chi', 'silk painting'], isOnline: true, expertise: ['Chinese Tea'], socialPreference: 'introvert' },
  { id: 'p40', name: 'Sven Eriksson', avatar: A('1492562080023-ab3db95bfbce'), profession: 'Marine Biologist', location: 'Reykjavik', interests: ['ice climbing', 'aurora photography', 'cold water swimming'], isOnline: true, expertise: ['Oceanography'], socialPreference: 'introvert' },
  { id: 'p41', name: 'Jade Williams', avatar: A('1529626455594-4ff0802cfb7e'), profession: 'Pilates Instructor', location: 'Byron Bay', interests: ['paddle boarding', 'macramé', 'beach yoga'], isOnline: true, expertise: ['Movement'], socialPreference: 'extrovert' },
  { id: 'p42', name: 'Ravi Krishnan', avatar: A('1519085360753-af0119f7cbe7'), profession: 'Ethical Hacker', location: 'Goa', interests: ['kitesurfing', 'electronic music', 'spice trading'], isOnline: true, expertise: ['Bug Bounty'], socialPreference: 'ambivert' },
  { id: 'p43', name: 'Clara Bianchi', avatar: A('1508214751196-bcfd4ca60f91'), profession: 'Ceramicist', location: 'Lisbon', interests: ['pottery', 'tile painting', 'fado music'], isOnline: true, expertise: ['Glazing'], socialPreference: 'introvert' },
  { id: 'p44', name: 'Kwame Asante', avatar: A('1504257432389-52343af06ae3'), profession: 'Social Entrepreneur', location: 'Kigali', interests: ['basketball', 'community gardening', 'storytelling'], isOnline: true, expertise: ['Impact'], socialPreference: 'extrovert' },
  { id: 'p45', name: 'Elsa Nordström', avatar: A('1489424731084-a5d8b219a5bb'), profession: 'Textile Artist', location: 'Copenhagen', interests: ['knitting', 'foraging', 'hygge hosting'], isOnline: true, expertise: ['Sustainable Fashion'], socialPreference: 'ambivert' },
  { id: 'p46', name: 'Tomás Oliveira', avatar: A('1539571696357-5a69c17a67c6'), profession: 'Surf Coach', location: 'Ericeira', interests: ['surfing', 'spearfishing', 'guitar'], isOnline: true, expertise: ['Wave Reading'], socialPreference: 'extrovert' },
  { id: 'p47', name: 'Nadia Volkov', avatar: A('1573496359142-b8d87734a5a2'), profession: 'Ballet Dancer', location: 'Tbilisi', interests: ['ballet', 'contemporary dance', 'Pilates'], isOnline: true, expertise: ['Choreography'], socialPreference: 'introvert' },
  { id: 'p48', name: 'Hugo Reyes', avatar: A('1534030347209-467a5b0ad3e6'), profession: 'Street Artist', location: 'Buenos Aires', interests: ['graffiti art', 'tango', 'mate culture'], isOnline: true, expertise: ['Muralism'], socialPreference: 'extrovert' },
  { id: 'p49', name: 'Ingrid Larsen', avatar: A('1580489944761-15a19d654956'), profession: 'Wilderness Guide', location: 'Tromsø', interests: ['dog sledding', 'northern lights', 'ice fishing'], isOnline: true, expertise: ['Survival'], socialPreference: 'ambivert' },
  { id: 'p50', name: 'Kenji Mori', avatar: A('1507591064344-4c6ce005b128'), profession: 'Robotics Engineer', location: 'Osaka', interests: ['karate', 'model building', 'ramen crafting'], isOnline: true, expertise: ['Automation'], socialPreference: 'introvert' },
];

// Keep backward-compat exports
export const AVATAR_URLS = {
  sarah: A('1494790108377-be9c29b29330'),
  mike: A('1507003211169-0a1dd7228f2d'),
  lena: A('1438761681033-6461ffad8d80'),
  tom: A('1472099645785-5658abf4ff4e'),
  elena: A('1534528741775-53994a69daeb'),
  alex: A('1500648767791-00dcc994a43e'),
  you: A('1535713875002-d1d0cf377fde'),
};

export const DEMO_USERS: NomadUser[] = PULSE_PROFILES.slice(0, 6);

export const DEMO_GROUPS: ChatGroup[] = [
  { id: '1', name: 'Dubai Marina Co-workers', category: 'Professional', members: DEMO_USERS.slice(0, 3), lastMessage: 'Lena: The wifi here is insane — 200mbps 🚀', unreadCount: 3, icon: '💼' },
  { id: '2', name: 'AI & Web3 Builders', category: 'Networking', members: DEMO_USERS, lastMessage: 'Alex: Who\'s coming to the demo night at 7pm?', unreadCount: 7, icon: '🤖' },
  { id: '3', name: 'Sunset Rooftop Social', category: 'Social', members: DEMO_USERS.slice(1, 5), lastMessage: 'Elena: Brought my camera — golden hour in 20min!', unreadCount: 1, icon: '🌅' },
  { id: '4', name: 'Morning Run Crew', category: 'Fitness', members: DEMO_USERS.slice(2, 6), lastMessage: 'Tom: 6am at the Marina walk tomorrow?', unreadCount: 0, icon: '🏃' },
];

export const AI_SUGGESTIONS: AIMatch[] = [
  { type: 'co-working', count: 4, description: '4 designers need UX feedback — join the session at 2pm', icon: '🎨' },
  { type: 'dining', count: 6, description: '6 foodies organizing rooftop dinner tonight at 8pm', icon: '🍽️' },
  { type: 'fitness', count: 9, description: '9 runners meeting at Marina Walk — 6am tomorrow', icon: '🏃' },
  { type: 'tech', count: 12, description: '12 developers at AI demo night — starts in 3 hours', icon: '🤖' },
];
