import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/communityChat';
import { DEMO_USERS } from '@/data/communityChatData';

export const useCommunityChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '2',
      senderName: 'Mike Johnson',
      senderAvatar: '👨‍💻',
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
      senderAvatar: '👩‍💼',
      content: 'Perfect! I can be there by 10am. Anyone interested in a design feedback session?',
      timestamp: new Date(Date.now() - 1800000)
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: '👤',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call Lovable AI for intelligent response
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/community-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
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
