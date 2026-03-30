import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/utils/deviceId';

// ═══════════════════════════════════════════════════════════
// AI Memory Service — Persistent conversation & memory layer
// ═══════════════════════════════════════════════════════════

class AIMemoryService {
  private deviceId: string;
  private sessionRegistered = false;

  constructor() {
    this.deviceId = getDeviceId();
  }

  // Ensure device session exists in DB
  async ensureSession(): Promise<void> {
    if (this.sessionRegistered) return;
    try {
      const { error } = await supabase
        .from('device_sessions' as any)
        .upsert(
          { device_id: this.deviceId, last_seen_at: new Date().toISOString() } as any,
          { onConflict: 'device_id' }
        );
      if (!error) this.sessionRegistered = true;
    } catch (e) {
      console.warn('Failed to register device session:', e);
    }
  }

  // Create a new conversation
  async createConversation(title?: string): Promise<string | null> {
    await this.ensureSession();
    try {
      const { data, error } = await supabase
        .from('conversations' as any)
        .insert({ device_id: this.deviceId, title: title || 'Concierge Chat' } as any)
        .select('id')
        .single();
      if (error) throw error;
      return (data as any)?.id || null;
    } catch (e) {
      console.warn('Failed to create conversation:', e);
      return null;
    }
  }

  // Save a message to a conversation
  async saveMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    try {
      await supabase
        .from('chat_messages' as any)
        .insert({ conversation_id: conversationId, role, content } as any);
    } catch (e) {
      console.warn('Failed to save message:', e);
    }
  }

  // Load recent conversations
  async getRecentConversations(limit = 10): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('conversations' as any)
        .select('*')
        .eq('device_id', this.deviceId)
        .order('updated_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data as any[]) || [];
    } catch (e) {
      console.warn('Failed to load conversations:', e);
      return [];
    }
  }

  // Load messages for a conversation
  async getConversationMessages(conversationId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages' as any)
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as any[]) || [];
    } catch (e) {
      console.warn('Failed to load messages:', e);
      return [];
    }
  }

  // Search memories using hybrid search (full-text + category)
  async searchMemories(query: string, category?: string, limit = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .rpc('search_memories', {
          p_device_id: this.deviceId,
          p_query: query || '',
          p_category: category || null,
          p_limit: limit,
        } as any);
      if (error) throw error;
      return (data as any[]) || [];
    } catch (e) {
      console.warn('Failed to search memories:', e);
      return [];
    }
  }

  // Get all memories for context injection
  async getAllMemories(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_memories' as any)
        .select('fact, category, confidence')
        .eq('device_id', this.deviceId)
        .eq('durability', 'durable')
        .order('confidence', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as any[]) || [];
    } catch (e) {
      console.warn('Failed to load memories:', e);
      return [];
    }
  }

  // Build memory context string for AI prompt injection
  async buildMemoryContext(query?: string): Promise<string> {
    // Get relevant memories via hybrid search if query provided, else get all
    const memories = query 
      ? await this.searchMemories(query, undefined, 15)
      : await this.getAllMemories();

    if (memories.length === 0) return '';

    const grouped: Record<string, string[]> = {};
    for (const m of memories) {
      if (!grouped[m.category]) grouped[m.category] = [];
      grouped[m.category].push(m.fact);
    }

    let context = '**🧠 PERSISTENT USER PREFERENCES (from database):**\n';
    for (const [cat, facts] of Object.entries(grouped)) {
      context += `- **${cat}:** ${facts.join('; ')}\n`;
    }
    return context;
  }

  // Trigger memory distillation after conversation
  async distillMemories(messages: { role: string; content: string }[], conversationId?: string): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('memory-distill', {
        body: {
          messages,
          deviceId: this.deviceId,
          conversationId: conversationId || null,
        }
      });
      if (error) {
        console.warn('Memory distillation failed:', error);
        return;
      }
      if (data?.stored > 0) {
        console.log(`🧠 Distilled ${data.stored} new memories`);
      }
    } catch (e) {
      console.warn('Memory distillation error:', e);
    }
  }

  getDeviceId(): string {
    return this.deviceId;
  }
}

// Singleton
export const aiMemoryService = new AIMemoryService();
