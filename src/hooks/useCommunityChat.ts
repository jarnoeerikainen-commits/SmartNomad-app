import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/communityChat';
import { DEMO_USERS, AVATAR_URLS } from '@/data/communityChatData';

// Current user avatar - professional photo
const CURRENT_USER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';

const MEMBER_REPLIES = [
  'Totally agree! 🙌 Let\'s do it.',
  'Great idea — I was about to suggest the same thing!',
  'I\'m in! What time works best?',
  'Love it! Just sent you a DM with more details.',
  'Perfect. I know a great spot nearby — I\'ll share the location.',
  'Count me in! Can I bring a friend who just arrived in town?',
  'This is exactly why I love this community ❤️',
  'Sounds fun! I\'ll be there in 15 minutes.',
];

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const useCommunityChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '3',
      senderName: 'Lena Martinez',
      senderAvatar: AVATAR_URLS.lena,
      content: 'Good morning everyone! ☀️ Just arrived at the co-working space near Marina. The wifi here is insane — 200mbps down.',
      timestamp: new Date(Date.now() - 5400000)
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'Mike Johnson',
      senderAvatar: AVATAR_URLS.mike,
      content: 'Nice! I was thinking of heading there too. Anyone want to grab lunch after? I found an amazing Lebanese place nearby.',
      timestamp: new Date(Date.now() - 4200000)
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Sarah Chen',
      senderAvatar: AVATAR_URLS.sarah,
      content: 'Count me in! I need to step away from Figma for a bit 😅 Also — has anyone tried the new rooftop café on the 40th floor?',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '4',
      senderId: 'ai',
      senderName: 'SuperNomad AI',
      senderAvatar: '🤖',
      content: '📍 Based on your locations, I suggest meeting at Salt Café, Dubai Marina at 12:30pm — it\'s a 5-min walk for everyone and has great reviews from 847 nomads. I can reserve a table for 4 if you\'d like!',
      timestamp: new Date(Date.now() - 3000000),
      isAI: true
    },
    {
      id: '5',
      senderId: '5',
      senderName: 'Elena Rossi',
      senderAvatar: AVATAR_URLS.elena,
      content: 'Yes please! Reserve it 🙌 Also, anyone up for a sunset photography walk after? The light here is unreal this time of year.',
      timestamp: new Date(Date.now() - 1800000)
    },
    {
      id: '6',
      senderId: '2',
      senderName: 'Mike Johnson',
      senderAvatar: AVATAR_URLS.mike,
      content: 'I\'m in for both! This is why I love this community — best spontaneous plans ever.',
      timestamp: new Date(Date.now() - 900000)
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message with professional avatar
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: CURRENT_USER_AVATAR,
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate a member reply after 1–2s
    const replier = pickRandom(DEMO_USERS.filter(u => u.id !== 'current-user'));
    setTimeout(() => {
      const memberReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: replier.id,
        senderName: replier.name,
        senderAvatar: replier.avatar,
        content: pickRandom(MEMBER_REPLIES),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, memberReply]);
    }, 1200 + Math.random() * 1200);

    // Get AI response
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/community-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          message: content,
          context: { recentMessages: messages.slice(-5), users: DEMO_USERS, location: 'Dubai' }
        })
      });

      if (!response.ok) throw new Error('AI response failed');
      const data = await response.json();

      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          senderId: 'ai',
          senderName: 'SuperNomad AI',
          senderAvatar: '🤖',
          content: data.response,
          timestamp: new Date(),
          isAI: true
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 2500 + Math.random() * 1000);
    } catch {
      setTimeout(() => {
        const demoResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          senderId: 'ai',
          senderName: 'SuperNomad AI',
          senderAvatar: '🤖',
          content: 'Great idea! I\'ve found 3 people nearby who are interested. Want me to create a group and suggest a meeting spot based on everyone\'s location? 📍',
          timestamp: new Date(),
          isAI: true
        };
        setMessages(prev => [...prev, demoResponse]);
        setIsLoading(false);
      }, 2500);
    }
  }, [messages]);

  return {
    messages,
    sendMessage,
    isLoading
  };
};
