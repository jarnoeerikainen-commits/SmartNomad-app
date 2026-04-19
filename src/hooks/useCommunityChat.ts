import { useState, useCallback, useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/communityChat';
import { DEMO_USERS, AVATAR_URLS, PULSE_PROFILES } from '@/data/communityChatData';
import { supabase } from '@/integrations/supabase/client';

const CURRENT_USER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face';

const FALLBACK_REPLIES = [
  'Totally agree! 🙌 Let\'s do it.',
  'Great idea — I was about to suggest the same thing!',
  'I\'m in! What time works best?',
  'Love it! Just sent you a DM with more details.',
  'Perfect. I know a great spot nearby — I\'ll share the location.',
  'Count me in! Can I bring a friend who just arrived in town?',
];

const FALLBACK_QUICK = ['Count me in!', 'What time?', 'Tell me more 👀'];

const pickRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

interface TypingMember { id: string; name: string; avatar: string }

export const useCommunityChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', senderId: '3', senderName: 'Lena Martinez', senderAvatar: AVATAR_URLS.lena, content: 'Good morning everyone! ☀️ Just arrived at the co-working space near Marina. The wifi here is insane — 200mbps down.', timestamp: new Date(Date.now() - 5400000) },
    { id: '2', senderId: '2', senderName: 'Mike Johnson', senderAvatar: AVATAR_URLS.mike, content: 'Nice! I was thinking of heading there too. Anyone want to grab lunch after? I found an amazing Lebanese place nearby.', timestamp: new Date(Date.now() - 4200000) },
    { id: '3', senderId: '1', senderName: 'Sarah Chen', senderAvatar: AVATAR_URLS.sarah, content: 'Count me in! I need to step away from Figma for a bit 😅 Also — has anyone tried the new rooftop café on the 40th floor?', timestamp: new Date(Date.now() - 3600000) },
    { id: '4', senderId: 'ai', senderName: 'SuperNomad AI', senderAvatar: '🤖', content: '📍 Based on your locations, I suggest meeting at Salt Café, Dubai Marina at 12:30pm — it\'s a 5-min walk for everyone and has great reviews from 847 nomads. I can reserve a table for 4 if you\'d like!', timestamp: new Date(Date.now() - 3000000), isAI: true },
    { id: '5', senderId: '5', senderName: 'Elena Rossi', senderAvatar: AVATAR_URLS.elena, content: 'Yes please! Reserve it 🙌 Also, anyone up for a sunset photography walk after? The light here is unreal this time of year.', timestamp: new Date(Date.now() - 1800000) },
    { id: '6', senderId: '2', senderName: 'Mike Johnson', senderAvatar: AVATAR_URLS.mike, content: 'I\'m in for both! This is why I love this community — best spontaneous plans ever.', timestamp: new Date(Date.now() - 900000) },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [typing, setTyping] = useState<TypingMember[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [quickLoading, setQuickLoading] = useState(false);
  const lastActivityRef = useRef<number>(Date.now());
  const nudgeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addMessage = (m: ChatMessage) => {
    setMessages(prev => [...prev, m]);
    lastActivityRef.current = Date.now();
  };

  const memberPool = () => DEMO_USERS.map(u => ({ id: u.id, name: u.name, profession: u.profession, interests: u.interests }));

  // ── Quick reply suggestions: refresh after each non-user message ──
  const refreshQuickReplies = useCallback(async (lastMsg: ChatMessage) => {
    if (lastMsg.senderId === 'current-user') return;
    setQuickLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('community-orchestrator', {
        body: {
          mode: 'quick_replies',
          location: 'Dubai Marina',
          lastMessage: lastMsg.content,
          lastSenderName: lastMsg.senderName,
          recentMessages: messages.slice(-6).map(m => ({ senderName: m.senderName, content: m.content, isAI: m.isAI })),
        },
      });
      if (error) throw error;
      const s = (data?.suggestions as string[] | undefined)?.filter(x => typeof x === 'string' && x.trim().length > 0).slice(0, 3) || FALLBACK_QUICK;
      setQuickReplies(s);
    } catch {
      setQuickReplies(FALLBACK_QUICK);
    } finally {
      setQuickLoading(false);
    }
  }, [messages]);

  // ── AI host nudge after silence (15s) ──
  const scheduleNudge = useCallback(() => {
    if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current);
    nudgeTimerRef.current = setTimeout(async () => {
      // Only nudge if still quiet and last msg wasn't an AI nudge
      const last = messages[messages.length - 1];
      if (last?.isAI || Date.now() - lastActivityRef.current < 14000) return;
      try {
        const { data } = await supabase.functions.invoke('community-orchestrator', {
          body: {
            mode: 'ai_nudge',
            location: 'Dubai Marina',
            recentMessages: messages.slice(-8).map(m => ({ senderName: m.senderName, content: m.content, isAI: m.isAI })),
            members: memberPool(),
          },
        });
        const text = (data?.message as string | undefined)?.trim();
        if (text) {
          addMessage({
            id: `nudge-${Date.now()}`,
            senderId: 'ai',
            senderName: 'SuperNomad AI',
            senderAvatar: '🤖',
            content: text,
            timestamp: new Date(),
            isAI: true,
          });
        }
      } catch { /* silent */ }
    }, 15000);
  }, [messages]);

  useEffect(() => {
    scheduleNudge();
    return () => { if (nudgeTimerRef.current) clearTimeout(nudgeTimerRef.current); };
  }, [scheduleNudge]);

  // Initial quick replies for last message
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last && quickReplies.length === 0 && !quickLoading) {
      refreshQuickReplies(last);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderAvatar: CURRENT_USER_AVATAR,
      content,
      timestamp: new Date(),
    };
    addMessage(userMessage);
    setQuickReplies([]);

    // 1) Member replies via orchestrator (with typing indicators)
    const members = memberPool();
    const fakeTypers: TypingMember[] = [pickRandom(DEMO_USERS), pickRandom(DEMO_USERS)]
      .filter((v, i, a) => a.findIndex(x => x.id === v.id) === i)
      .slice(0, 2)
      .map(u => ({ id: u.id, name: u.name, avatar: u.avatar }));
    setTyping(fakeTypers);

    let replies: Array<{ memberId: string; memberName: string; content: string }> = [];
    try {
      const { data, error } = await supabase.functions.invoke('community-orchestrator', {
        body: {
          mode: 'replies',
          location: 'Dubai Marina',
          lastMessage: content,
          lastSenderName: 'You',
          recentMessages: messages.slice(-8).map(m => ({ senderName: m.senderName, content: m.content, isAI: m.isAI })),
          members,
        },
      });
      if (error) throw error;
      replies = (data?.replies as any[] | undefined) || [];
    } catch {
      const u = pickRandom(DEMO_USERS);
      replies = [{ memberId: u.id, memberName: u.name, content: pickRandom(FALLBACK_REPLIES) }];
    }

    // Stagger member replies
    let cumulative = 1200;
    replies.forEach((r, idx) => {
      const delay = cumulative + Math.random() * 800;
      cumulative += 1400;
      setTimeout(() => {
        const profile = DEMO_USERS.find(u => u.id === r.memberId) || DEMO_USERS.find(u => u.name === r.memberName) || DEMO_USERS[idx % DEMO_USERS.length];
        addMessage({
          id: `m-${Date.now()}-${idx}`,
          senderId: profile.id,
          senderName: profile.name,
          senderAvatar: profile.avatar,
          content: r.content,
          timestamp: new Date(),
        });
        setTyping(prev => prev.filter(t => t.id !== profile.id));
      }, delay);
    });
    setTimeout(() => setTyping([]), cumulative + 200);

    // 2) AI host follow-up (uses old community-chat function for compatibility)
    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('community-chat', {
        body: { message: content, context: { recentMessages: messages.slice(-5), users: DEMO_USERS, location: 'Dubai Marina' } },
      });
      setTimeout(() => {
        const aiContent = data?.response || 'Great idea! I\'ve found 3 people nearby who are interested. Want me to create a group? 📍';
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          senderId: 'ai',
          senderName: 'SuperNomad AI',
          senderAvatar: '🤖',
          content: aiContent,
          timestamp: new Date(),
          isAI: true,
        };
        addMessage(aiMessage);
        setIsLoading(false);
        // refresh quick replies based on the AI message
        refreshQuickReplies(aiMessage);
      }, cumulative + 600);
    } catch {
      setIsLoading(false);
    }
  }, [messages, refreshQuickReplies]);

  const pickQuickReply = useCallback((text: string) => {
    sendMessage(text);
  }, [sendMessage]);

  return {
    messages,
    sendMessage,
    isLoading,
    typing,
    quickReplies,
    quickLoading,
    pickQuickReply,
  };
};
