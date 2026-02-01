import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/communityChat';
import { DEMO_USERS, AVATAR_URLS } from '@/data/communityChatData';

// Hardcoded Supabase config for consistent API calls
const SUPABASE_URL = 'https://xeunjlpzvitnrepyzatg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldW5qbHB6dml0bnJlcHl6YXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjUxMDUsImV4cCI6MjA3Njg0MTEwNX0.eiTYJpSpLpY7o860HSFDB7wQPPt5y9bIYRfzmPGEgU0';

// Current user avatar - professional photo
const CURRENT_USER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';

export const useCommunityChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '2',
      senderName: 'Mike Johnson',
      senderAvatar: AVATAR_URLS.mike,
      content: 'Anyone up for focused work session at WeWork today?',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: '2',
      senderId: 'ai',
      senderName: 'AI Assistant',
      senderAvatar: '🤖',
      content: 'Based on your profiles, I recommend meeting at WeWork Dubai Mall - it has excellent facilities and is convenient for all members.',
      timestamp: new Date(Date.now() - 3000000),
      isAI: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: 'Sarah Chen',
      senderAvatar: AVATAR_URLS.sarah,
      content: 'Perfect! I can be there by 10am. Anyone interested in a design feedback session?',
      timestamp: new Date(Date.now() - 1800000)
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
    setIsLoading(true);

    try {
      // Call AI with consistent authentication
      const response = await fetch(`${SUPABASE_URL}/functions/v1/community-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          message: content,
          context: {
            recentMessages: messages.slice(-5),
            users: DEMO_USERS,
            location: 'Dubai'
          }
        })
      });

      if (!response.ok) throw new Error('AI response failed');

      const data = await response.json();

      // Add AI response
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        senderName: 'AI Assistant',
        senderAvatar: '🤖',
        content: data.response,
        timestamp: new Date(),
        isAI: true
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback demo response
      const demoResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: 'ai',
        senderName: 'AI Assistant',
        senderAvatar: '🤖',
        content: 'Great suggestion! I can help coordinate with the group. Would you like me to create a poll for the best time and location?',
        timestamp: new Date(),
        isAI: true
      };

      setMessages(prev => [...prev, demoResponse]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    sendMessage,
    isLoading
  };
};
