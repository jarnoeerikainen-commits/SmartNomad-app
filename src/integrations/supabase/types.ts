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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      api_access_policies: {
        Row: {
          anonymize_pii: boolean
          created_at: string
          enabled: boolean
          field_restrictions: string[] | null
          filter_conditions: Json | null
          id: string
          max_records_per_request: number | null
          partner_id: string
          permission: string
          resource_category: string | null
          resource_type: string
          updated_at: string
        }
        Insert: {
          anonymize_pii?: boolean
          created_at?: string
          enabled?: boolean
          field_restrictions?: string[] | null
          filter_conditions?: Json | null
          id?: string
          max_records_per_request?: number | null
          partner_id: string
          permission?: string
          resource_category?: string | null
          resource_type: string
          updated_at?: string
        }
        Update: {
          anonymize_pii?: boolean
          created_at?: string
          enabled?: boolean
          field_restrictions?: string[] | null
          filter_conditions?: Json | null
          id?: string
          max_records_per_request?: number | null
          partner_id?: string
          permission?: string
          resource_category?: string | null
          resource_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_access_policies_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "api_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      api_audit_logs: {
        Row: {
          created_at: string
          endpoint: string
          error_message: string | null
          id: string
          ip_address: string | null
          latency_ms: number | null
          method: string
          partner_id: string
          records_returned: number | null
          request_params: Json | null
          request_path: string | null
          response_size_bytes: number | null
          response_status: number
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          endpoint: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          latency_ms?: number | null
          method: string
          partner_id: string
          records_returned?: number | null
          request_params?: Json | null
          request_path?: string | null
          response_size_bytes?: number | null
          response_status: number
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          endpoint?: string
          error_message?: string | null
          id?: string
          ip_address?: string | null
          latency_ms?: number | null
          method?: string
          partner_id?: string
          records_returned?: number | null
          request_params?: Json | null
          request_path?: string | null
          response_size_bytes?: number | null
          response_status?: number
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_audit_logs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "api_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      api_partners: {
        Row: {
          allowed_ips: string[] | null
          api_key_hash: string
          api_key_prefix: string
          company_url: string | null
          contact_email: string
          contact_name: string | null
          created_at: string
          expires_at: string | null
          id: string
          last_request_at: string | null
          metadata: Json | null
          partner_name: string
          partner_slug: string
          rate_limit_per_day: number
          rate_limit_per_minute: number
          status: string
          tier: string
          updated_at: string
        }
        Insert: {
          allowed_ips?: string[] | null
          api_key_hash: string
          api_key_prefix: string
          company_url?: string | null
          contact_email: string
          contact_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_request_at?: string | null
          metadata?: Json | null
          partner_name: string
          partner_slug: string
          rate_limit_per_day?: number
          rate_limit_per_minute?: number
          status?: string
          tier?: string
          updated_at?: string
        }
        Update: {
          allowed_ips?: string[] | null
          api_key_hash?: string
          api_key_prefix?: string
          company_url?: string | null
          contact_email?: string
          contact_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_request_at?: string | null
          metadata?: Json | null
          partner_name?: string
          partner_slug?: string
          rate_limit_per_day?: number
          rate_limit_per_minute?: number
          status?: string
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          demo_mode_enabled: boolean
          id: number
          require_auth: boolean
          require_mfa_for_payments: boolean
          require_mfa_for_sensitive: boolean
          updated_at: string
        }
        Insert: {
          demo_mode_enabled?: boolean
          id?: number
          require_auth?: boolean
          require_mfa_for_payments?: boolean
          require_mfa_for_sensitive?: boolean
          updated_at?: string
        }
        Update: {
          demo_mode_enabled?: boolean
          id?: number
          require_auth?: boolean
          require_mfa_for_payments?: boolean
          require_mfa_for_sensitive?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          device_id: string
          id: string
          ip_address: string | null
          metadata: Json
          resource: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          device_id: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          resource?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          device_id?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          resource?: string | null
          user_agent?: string | null
          user_id?: string | null
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          message_count?: number
          title?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          message_count?: number
          title?: string | null
          updated_at?: string
          user_id?: string | null
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
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          last_seen_at?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          last_seen_at?: string
          metadata?: Json | null
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          device_id: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          device_id?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          device_id?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
          visa_type?: string | null
        }
        Relationships: []
      }
      trust_pass_credentials: {
        Row: {
          created_at: string
          credential_id: string
          credential_type: string
          device_id: string
          did: string
          disclosed: string[]
          expires_at: string
          id: string
          issued_at: string
          issuer: string
          jwt: string
          status: string
          subject: Json
          tier: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credential_id: string
          credential_type: string
          device_id: string
          did: string
          disclosed?: string[]
          expires_at: string
          id?: string
          issued_at?: string
          issuer: string
          jwt: string
          status?: string
          subject?: Json
          tier: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credential_id?: string
          credential_type?: string
          device_id?: string
          did?: string
          disclosed?: string[]
          expires_at?: string
          id?: string
          issued_at?: string
          issuer?: string
          jwt?: string
          status?: string
          subject?: Json
          tier?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_data_access: {
        Args: { row_device_id: string; row_user_id: string }
        Returns: boolean
      }
      cleanup_expired_cache: { Args: never; Returns: number }
      get_request_device_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_verified_mfa: { Args: never; Returns: boolean }
      is_demo_mode: { Args: never; Returns: boolean }
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
      migrate_device_to_user: {
        Args: { p_device_id: string; p_user_id: string }
        Returns: Json
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
      user_owns_row: { Args: { row_user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "premium" | "user"
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
    Enums: {
      app_role: ["admin", "premium", "user"],
    },
  },
} as const
