export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_cache: {
        Row: {
          cache_key: string
          created_at: string
          expires_at: string
          hit_count: number
          id: string
          metadata: Json | null
          model: string
          query_text: string
          response_text: string
          token_count: number
        }
        Insert: {
          cache_key: string
          created_at?: string
          expires_at?: string
          hit_count?: number
          id?: string
          metadata?: Json | null
          model?: string
          query_text: string
          response_text: string
          token_count?: number
        }
        Update: {
          cache_key?: string
          created_at?: string
          expires_at?: string
          hit_count?: number
          id?: string
          metadata?: Json | null
          model?: string
          query_text?: string
          response_text?: string
          token_count?: number
        }
        Relationships: []
      }
      ai_memories: {
        Row: {
          category: string
          confidence: number
          created_at: string
          device_id: string
          durability: string
          embedding: string | null
          fact: string
          id: string
          importance: number
          search_vector: unknown
          semantic_tags: string[] | null
          source_conversation_id: string | null
        }
        Insert: {
          category?: string
          confidence?: number
          created_at?: string
          device_id: string
          durability?: string
          embedding?: string | null
          fact: string
          id?: string
          importance?: number
          search_vector?: unknown
          semantic_tags?: string[] | null
          source_conversation_id?: string | null
        }
        Update: {
          category?: string
          confidence?: number
          created_at?: string
          device_id?: string
          durability?: string
          embedding?: string | null
          fact?: string
          id?: string
          importance?: number
          search_vector?: unknown
          semantic_tags?: string[] | null
          source_conversation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_memories_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_sessions"
            referencedColumns: ["device_id"]
          },
          {
            foreignKeyName: "ai_memories_source_conversation_id_fkey"
            columns: ["source_conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          cache_hit: boolean
          created_at: string
          device_id: string
          error: string | null
          function_name: string
          id: string
          input_tokens: number
          latency_ms: number
          model: string
          output_tokens: number
          reasoning_used: string | null
        }
        Insert: {
          cache_hit?: boolean
          created_at?: string
          device_id: string
          error?: string | null
          function_name: string
          id?: string
          input_tokens?: number
          latency_ms?: number
          model?: string
          output_tokens?: number
          reasoning_used?: string | null
        }
        Update: {
          cache_hit?: boolean
          created_at?: string
          device_id?: string
          error?: string | null
          function_name?: string
          id?: string
          input_tokens?: number
          latency_ms?: number
          model?: string
          output_tokens?: number
          reasoning_used?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_summaries: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          messages_summarized: number
          summary: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          messages_summarized?: number
          summary: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          messages_summarized?: number
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_summaries_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          device_id: string
          id: string
          message_count: number
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          message_count?: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          message_count?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "device_sessions"
            referencedColumns: ["device_id"]
          },
        ]
      }
      device_sessions: {
        Row: {
          created_at: string
          device_id: string
          id: string
          last_seen_at: string
          metadata: Json | null
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          last_seen_at?: string
          metadata?: Json | null
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          last_seen_at?: string
          metadata?: Json | null
        }
        Relationships: []
      }
      knowledge_graph_edges: {
        Row: {
          created_at: string
          device_id: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          relationship: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          weight: number | null
        }
        Insert: {
          created_at?: string
          device_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          relationship: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          weight?: number | null
        }
        Update: {
          created_at?: string
          device_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          relationship?: string
          source_id?: string
          source_type?: string
          target_id?: string
          target_type?: string
          weight?: number | null
        }
        Relationships: []
      }
      snomad_profiles: {
        Row: {
          completeness_score: number | null
          created_at: string
          device_id: string
          encrypted_documents: Json | null
          encrypted_identity: Json | null
          id: string
          last_synced_at: string | null
          preference_count: number | null
          preferences: Json | null
          profile_embedding: string | null
          spending_patterns: Json | null
          updated_at: string
        }
        Insert: {
          completeness_score?: number | null
          created_at?: string
          device_id: string
          encrypted_documents?: Json | null
          encrypted_identity?: Json | null
          id?: string
          last_synced_at?: string | null
          preference_count?: number | null
          preferences?: Json | null
          profile_embedding?: string | null
          spending_patterns?: Json | null
          updated_at?: string
        }
        Update: {
          completeness_score?: number | null
          created_at?: string
          device_id?: string
          encrypted_documents?: Json | null
          encrypted_identity?: Json | null
          id?: string
          last_synced_at?: string | null
          preference_count?: number | null
          preferences?: Json | null
          profile_embedding?: string | null
          spending_patterns?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      travel_history: {
        Row: {
          ai_tags: string[] | null
          city: string | null
          country_code: string
          country_name: string
          created_at: string
          device_id: string
          entry_coordinates: Json | null
          entry_date: string
          exit_coordinates: Json | null
          exit_date: string | null
          id: string
          notes: string | null
          purpose: string | null
          source: string | null
          visa_type: string | null
        }
        Insert: {
          ai_tags?: string[] | null
          city?: string | null
          country_code: string
          country_name: string
          created_at?: string
          device_id: string
          entry_coordinates?: Json | null
          entry_date: string
          exit_coordinates?: Json | null
          exit_date?: string | null
          id?: string
          notes?: string | null
          purpose?: string | null
          source?: string | null
          visa_type?: string | null
        }
        Update: {
          ai_tags?: string[] | null
          city?: string | null
          country_code?: string
          country_name?: string
          created_at?: string
          device_id?: string
          entry_coordinates?: Json | null
          entry_date?: string
          exit_coordinates?: Json | null
          exit_date?: string | null
          id?: string
          notes?: string | null
          purpose?: string | null
          source?: string | null
          visa_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_cache: { Args: never; Returns: number }
      log_ai_usage: {
        Args: {
          p_cache_hit?: boolean
          p_device_id: string
          p_error?: string
          p_function_name: string
          p_input_tokens?: number
          p_latency_ms?: number
          p_model?: string
          p_output_tokens?: number
          p_reasoning?: string
        }
        Returns: undefined
      }
      search_memories: {
        Args: {
          p_category?: string
          p_device_id: string
          p_limit?: number
          p_query?: string
        }
        Returns: {
          category: string
          confidence: number
          fact: string
          id: string
          rank: number
        }[]
      }
      search_memories_hybrid: {
        Args: {
          p_category?: string
          p_device_id: string
          p_embedding?: string
          p_limit?: number
          p_query?: string
        }
        Returns: {
          category: string
          confidence: number
          fact: string
          id: string
          importance: number
          semantic_tags: string[]
          weighted_score: number
        }[]
      }
      search_memories_weighted: {
        Args: {
          p_category?: string
          p_device_id: string
          p_limit?: number
          p_query?: string
        }
        Returns: {
          category: string
          confidence: number
          fact: string
          id: string
          importance: number
          semantic_tags: string[]
          weighted_score: number
        }[]
      }
      traverse_knowledge_graph: {
        Args: {
          p_device_id: string
          p_max_depth?: number
          p_source_id: string
          p_source_type: string
        }
        Returns: {
          depth: number
          edge_id: string
          metadata: Json
          relationship: string
          source_id: string
          source_type: string
          target_id: string
          target_type: string
          weight: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
