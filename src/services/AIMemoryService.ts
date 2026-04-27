import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/utils/deviceId';

// ═══════════════════════════════════════════════════════════
// AI Memory Service — pgvector Hybrid Search Layer
// Combines: vector similarity + tsvector keywords + confidence + importance + recency
// ═══════════════════════════════════════════════════════════

const TOKEN_BUDGET = 6000;
const COMPRESSION_THRESHOLD = 12;

class AIMemoryService {
  private deviceId: string;
  private sessionRegistered = false;

  constructor() {
    this.deviceId = getDeviceId();
  }

  private isDemoPersonaActive(): boolean {
    try {
      const stored = localStorage.getItem('supernomad_active_demo_persona');
      return stored === 'meghan' || stored === 'john' || !!localStorage.getItem('demoAiContext');
    } catch {
      return false;
    }
  }

  // ─── Session Management ────────────────────────────────
  async ensureSession(): Promise<void> {
    if (this.isDemoPersonaActive()) return;
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
      console.warn('Session registration failed:', e);
    }
  }

  // ─── Conversation CRUD ─────────────────────────────────
  async createConversation(title?: string): Promise<string | null> {
    if (this.isDemoPersonaActive()) return null;
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
      console.warn('Create conversation failed:', e);
      return null;
    }
  }

  async saveMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    if (this.isDemoPersonaActive()) return;
    try {
      await supabase
        .from('chat_messages' as any)
        .insert({ conversation_id: conversationId, role, content } as any);
    } catch (e) {
      console.warn('Save message failed:', e);
    }
  }

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
    } catch {
      return [];
    }
  }

  async getConversationMessages(conversationId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages' as any)
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return (data as any[]) || [];
    } catch {
      return [];
    }
  }

  // ─── Generate Query Embedding (via edge function) ──────
  private async generateQueryEmbedding(query: string): Promise<number[] | null> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-embedding', {
        body: { text: query },
      });
      if (error || !data?.embedding) return null;
      return data.embedding;
    } catch {
      return null;
    }
  }

  // ─── Hybrid Search (pgvector + tsvector) ───────────────
  async searchMemoriesHybrid(query: string, category?: string, limit = 20): Promise<any[]> {
    try {
      // Generate embedding for semantic search
      const embedding = query ? await this.generateQueryEmbedding(query) : null;

      const { data, error } = await supabase
        .rpc('search_memories_hybrid', {
          p_device_id: this.deviceId,
          p_embedding: embedding ? `[${embedding.join(',')}]` : null,
          p_query: query || '',
          p_category: category || null,
          p_limit: limit,
        } as any);
      if (error) throw error;
      return (data as any[]) || [];
    } catch (e) {
      console.warn('Hybrid search failed, falling back:', e);
      return this.searchMemoriesWeighted(query, category, limit);
    }
  }

  // ─── Legacy Weighted Search (fallback) ─────────────────
  async searchMemoriesWeighted(query: string, category?: string, limit = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .rpc('search_memories_weighted', {
          p_device_id: this.deviceId,
          p_query: query || '',
          p_category: category || null,
          p_limit: limit,
        } as any);
      if (error) throw error;
      return (data as any[]) || [];
    } catch {
      return this.searchMemories(query, category, limit);
    }
  }

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
    } catch {
      return [];
    }
  }

  async getAllMemories(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('ai_memories' as any)
        .select('fact, category, confidence, importance, semantic_tags')
        .eq('device_id', this.deviceId)
        .eq('durability', 'durable')
        .order('confidence', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as any[]) || [];
    } catch {
      return [];
    }
  }

  // ─── Smart Context Builder (Token-Budget Aware) ────────
  async buildSmartContext(userQuery: string): Promise<{
    persistentMemories: string;
    conversationSummary: string;
    tokenEstimate: number;
  }> {
    if (this.isDemoPersonaActive()) {
      return { persistentMemories: '', conversationSummary: '', tokenEstimate: 0 };
    }
    let persistentMemories = '';
    let conversationSummary = '';
    let tokenEstimate = 0;

    // 1. Use hybrid search (pgvector + tsvector) for best results
    try {
      const memories = userQuery
        ? await this.searchMemoriesHybrid(userQuery, undefined, 15)
        : await this.getAllMemories();

      if (memories.length > 0) {
        const grouped: Record<string, string[]> = {};
        for (const m of memories) {
          if (!grouped[m.category]) grouped[m.category] = [];
          grouped[m.category].push(m.fact);
        }

        persistentMemories = '**🧠 PERSISTENT USER MEMORIES (from database):**\n';
        for (const [cat, facts] of Object.entries(grouped)) {
          persistentMemories += `- **${cat}:** ${facts.join('; ')}\n`;
        }
        tokenEstimate += Math.ceil(persistentMemories.length / 4);
      }
    } catch {}

    // 2. Get latest conversation summary
    try {
      const convs = await this.getRecentConversations(1);
      if (convs.length > 0) {
        const { data } = await supabase
          .from('conversation_summaries' as any)
          .select('summary')
          .eq('conversation_id', convs[0].id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (data) {
          conversationSummary = `**📋 PREVIOUS CONVERSATION SUMMARY:**\n${(data as any).summary}\n`;
          tokenEstimate += Math.ceil(conversationSummary.length / 4);
        }
      }
    } catch {}

    // 3. Trim if over budget
    if (tokenEstimate > TOKEN_BUDGET) {
      const ratio = TOKEN_BUDGET / tokenEstimate;
      if (persistentMemories.length > 500) {
        persistentMemories = persistentMemories.slice(0, Math.floor(persistentMemories.length * ratio));
      }
      if (conversationSummary.length > 500) {
        conversationSummary = conversationSummary.slice(0, Math.floor(conversationSummary.length * ratio));
      }
      tokenEstimate = TOKEN_BUDGET;
    }

    return { persistentMemories, conversationSummary, tokenEstimate };
  }

  // ─── Conversation Compression ──────────────────────────
  async shouldCompress(messageCount: number): Promise<boolean> {
    return messageCount >= COMPRESSION_THRESHOLD;
  }

  async compressConversation(
    conversationId: string,
    messages: { role: string; content: string }[]
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('conversation-compress', {
        body: { conversationId, messages, deviceId: this.deviceId }
      });
      if (error) { console.warn('Compression failed:', error); return null; }
      return data?.summary || null;
    } catch (e) {
      console.warn('Compression error:', e);
      return null;
    }
  }

  // ─── Memory Distillation ──────────────────────────────
  async distillMemories(
    messages: { role: string; content: string }[],
    conversationId?: string
  ): Promise<void> {
    if (this.isDemoPersonaActive()) return;
    try {
      const { data, error } = await supabase.functions.invoke('memory-distill', {
        body: { messages, deviceId: this.deviceId, conversationId: conversationId || null }
      });
      if (error) { console.warn('Distillation failed:', error); return; }
      if (data?.stored > 0) {
        console.log(`🧠 Distilled ${data.stored} memories with vector embeddings`);
      }
    } catch (e) {
      console.warn('Distillation error:', e);
    }
  }

  // ─── AI Cache ──────────────────────────────────────────
  async checkCache(queryHash: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('ai_cache' as any)
        .select('response_text, id, hit_count')
        .eq('cache_key', queryHash)
        .gt('expires_at', new Date().toISOString())
        .single();
      if (error || !data) return null;
      await supabase
        .from('ai_cache' as any)
        .update({ hit_count: ((data as any).hit_count || 0) + 1 } as any)
        .eq('id', (data as any).id);
      return (data as any).response_text;
    } catch {
      return null;
    }
  }

  async storeCache(queryHash: string, queryText: string, responseText: string, ttlHours = 24): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + ttlHours * 3600000).toISOString();
      await supabase
        .from('ai_cache' as any)
        .upsert({
          cache_key: queryHash,
          query_text: queryText.slice(0, 500),
          response_text: responseText,
          token_count: Math.ceil(responseText.length / 4),
          expires_at: expiresAt,
        } as any, { onConflict: 'cache_key' });
    } catch (e) {
      console.warn('Cache store failed:', e);
    }
  }

  // ─── Usage Analytics ───────────────────────────────────
  async logUsage(params: {
    functionName: string; model?: string; inputTokens?: number;
    outputTokens?: number; latencyMs?: number; cacheHit?: boolean;
    reasoning?: string; error?: string;
  }): Promise<void> {
    try {
      await supabase.rpc('log_ai_usage', {
        p_device_id: this.deviceId,
        p_function_name: params.functionName,
        p_model: params.model || 'gemini-3-flash',
        p_input_tokens: params.inputTokens || 0,
        p_output_tokens: params.outputTokens || 0,
        p_latency_ms: params.latencyMs || 0,
        p_cache_hit: params.cacheHit || false,
        p_reasoning: params.reasoning || null,
        p_error: params.error || null,
      } as any);
    } catch {}
  }

  // ─── Query Hash ────────────────────────────────────────
  generateQueryHash(query: string, context?: string): string {
    const normalized = (query + (context || '')).toLowerCase().replace(/\s+/g, ' ').trim().slice(0, 200);
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `q_${Math.abs(hash).toString(36)}`;
  }

  getDeviceId(): string {
    return this.deviceId;
  }
}

export const aiMemoryService = new AIMemoryService();
