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
      affiliate_accounts: {
        Row: {
          cleared_balance: number
          created_at: string
          id: string
          metadata: Json
          paid_lifetime: number
          parent_affiliate_id: string | null
          parent_user_id: string | null
          payout_address: string | null
          payout_currency: string
          payout_method: string
          pending_balance: number
          referral_code: string
          reversed_lifetime: number
          status: string
          tax_form_submitted: boolean
          tax_form_type: string | null
          terms_accepted_at: string | null
          terms_accepted_version: string | null
          tier: string
          total_clicks: number
          total_paying_referrals: number
          total_signups: number
          updated_at: string
          user_id: string
          wallet_credit_balance: number
        }
        Insert: {
          cleared_balance?: number
          created_at?: string
          id?: string
          metadata?: Json
          paid_lifetime?: number
          parent_affiliate_id?: string | null
          parent_user_id?: string | null
          payout_address?: string | null
          payout_currency?: string
          payout_method?: string
          pending_balance?: number
          referral_code: string
          reversed_lifetime?: number
          status?: string
          tax_form_submitted?: boolean
          tax_form_type?: string | null
          terms_accepted_at?: string | null
          terms_accepted_version?: string | null
          tier?: string
          total_clicks?: number
          total_paying_referrals?: number
          total_signups?: number
          updated_at?: string
          user_id: string
          wallet_credit_balance?: number
        }
        Update: {
          cleared_balance?: number
          created_at?: string
          id?: string
          metadata?: Json
          paid_lifetime?: number
          parent_affiliate_id?: string | null
          parent_user_id?: string | null
          payout_address?: string | null
          payout_currency?: string
          payout_method?: string
          pending_balance?: number
          referral_code?: string
          reversed_lifetime?: number
          status?: string
          tax_form_submitted?: boolean
          tax_form_type?: string | null
          terms_accepted_at?: string | null
          terms_accepted_version?: string | null
          tier?: string
          total_clicks?: number
          total_paying_referrals?: number
          total_signups?: number
          updated_at?: string
          user_id?: string
          wallet_credit_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_accounts_parent_affiliate_id_fkey"
            columns: ["parent_affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_earnings: {
        Row: {
          affiliate_id: string
          affiliate_user_id: string
          base_amount: number
          cleared_at: string | null
          commission_amount: number
          commission_rate: number
          created_at: string
          currency: string
          description: string | null
          hold_until: string
          id: string
          level: number
          metadata: Json
          paid_at: string | null
          payout_id: string | null
          referral_id: string | null
          referred_user_id: string
          reversal_reason: string | null
          reversed_at: string | null
          source_id: string | null
          source_type: string
          status: string
          wallet_credit_amount: number
          withdrawable_amount: number
        }
        Insert: {
          affiliate_id: string
          affiliate_user_id: string
          base_amount: number
          cleared_at?: string | null
          commission_amount: number
          commission_rate: number
          created_at?: string
          currency?: string
          description?: string | null
          hold_until?: string
          id?: string
          level: number
          metadata?: Json
          paid_at?: string | null
          payout_id?: string | null
          referral_id?: string | null
          referred_user_id: string
          reversal_reason?: string | null
          reversed_at?: string | null
          source_id?: string | null
          source_type: string
          status?: string
          wallet_credit_amount: number
          withdrawable_amount: number
        }
        Update: {
          affiliate_id?: string
          affiliate_user_id?: string
          base_amount?: number
          cleared_at?: string | null
          commission_amount?: number
          commission_rate?: number
          created_at?: string
          currency?: string
          description?: string | null
          hold_until?: string
          id?: string
          level?: number
          metadata?: Json
          paid_at?: string | null
          payout_id?: string | null
          referral_id?: string | null
          referred_user_id?: string
          reversal_reason?: string | null
          reversed_at?: string | null
          source_id?: string | null
          source_type?: string
          status?: string
          wallet_credit_amount?: number
          withdrawable_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_earnings_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_earnings_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          affiliate_user_id: string
          amount: number
          completed_at: string | null
          currency: string
          earnings_count: number
          external_tx_hash: string | null
          external_tx_id: string | null
          failure_reason: string | null
          fee_amount: number
          id: string
          metadata: Json
          net_amount: number
          payout_address: string | null
          payout_method: string
          processed_at: string | null
          requested_at: string
          status: string
        }
        Insert: {
          affiliate_id: string
          affiliate_user_id: string
          amount: number
          completed_at?: string | null
          currency?: string
          earnings_count?: number
          external_tx_hash?: string | null
          external_tx_id?: string | null
          failure_reason?: string | null
          fee_amount?: number
          id?: string
          metadata?: Json
          net_amount: number
          payout_address?: string | null
          payout_method: string
          processed_at?: string | null
          requested_at?: string
          status?: string
        }
        Update: {
          affiliate_id?: string
          affiliate_user_id?: string
          amount?: number
          completed_at?: string | null
          currency?: string
          earnings_count?: number
          external_tx_hash?: string | null
          external_tx_id?: string | null
          failure_reason?: string | null
          fee_amount?: number
          id?: string
          metadata?: Json
          net_amount?: number
          payout_address?: string | null
          payout_method?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_program_settings: {
        Row: {
          cookie_window_days: number
          hold_days: number
          id: number
          is_active: boolean
          l1_commission_rate: number
          l2_commission_rate: number
          max_levels: number
          min_payout_usd: number
          recurring_months: number
          terms_url: string | null
          terms_version: string
          updated_at: string
          wallet_credit_split: number
          withdrawable_split: number
        }
        Insert: {
          cookie_window_days?: number
          hold_days?: number
          id?: number
          is_active?: boolean
          l1_commission_rate?: number
          l2_commission_rate?: number
          max_levels?: number
          min_payout_usd?: number
          recurring_months?: number
          terms_url?: string | null
          terms_version?: string
          updated_at?: string
          wallet_credit_split?: number
          withdrawable_split?: number
        }
        Update: {
          cookie_window_days?: number
          hold_days?: number
          id?: number
          is_active?: boolean
          l1_commission_rate?: number
          l2_commission_rate?: number
          max_levels?: number
          min_payout_usd?: number
          recurring_months?: number
          terms_url?: string | null
          terms_version?: string
          updated_at?: string
          wallet_credit_split?: number
          withdrawable_split?: number
        }
        Relationships: []
      }
      agentic_guardrails: {
        Row: {
          allowed_categories: string[]
          allowed_protocols: string[]
          approval_threshold: number
          blocked_categories: string[]
          created_at: string
          currency: string
          description: string | null
          device_id: string
          id: string
          is_active: boolean
          max_daily: number
          max_per_transaction: number
          max_weekly: number
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          allowed_categories?: string[]
          allowed_protocols?: string[]
          approval_threshold?: number
          blocked_categories?: string[]
          created_at?: string
          currency?: string
          description?: string | null
          device_id: string
          id?: string
          is_active?: boolean
          max_daily?: number
          max_per_transaction?: number
          max_weekly?: number
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          allowed_categories?: string[]
          allowed_protocols?: string[]
          approval_threshold?: number
          blocked_categories?: string[]
          created_at?: string
          currency?: string
          description?: string | null
          device_id?: string
          id?: string
          is_active?: boolean
          max_daily?: number
          max_per_transaction?: number
          max_weekly?: number
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      agentic_payment_intents: {
        Row: {
          ai_initiated: boolean
          amount: number
          authorized_at: string | null
          category: string
          completed_at: string | null
          created_at: string
          currency: string
          description: string
          device_id: string
          expires_at: string
          failure_reason: string | null
          guardrail_id: string | null
          id: string
          intent_id: string
          merchant: string | null
          merchant_url: string | null
          protocol: string
          protocol_payload: Json
          receipt: Json | null
          status: string
          trust_score: number | null
          user_approved: boolean
          user_id: string
          virtual_card_id: string | null
        }
        Insert: {
          ai_initiated?: boolean
          amount: number
          authorized_at?: string | null
          category: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          description: string
          device_id: string
          expires_at?: string
          failure_reason?: string | null
          guardrail_id?: string | null
          id?: string
          intent_id: string
          merchant?: string | null
          merchant_url?: string | null
          protocol: string
          protocol_payload?: Json
          receipt?: Json | null
          status?: string
          trust_score?: number | null
          user_approved?: boolean
          user_id: string
          virtual_card_id?: string | null
        }
        Update: {
          ai_initiated?: boolean
          amount?: number
          authorized_at?: string | null
          category?: string
          completed_at?: string | null
          created_at?: string
          currency?: string
          description?: string
          device_id?: string
          expires_at?: string
          failure_reason?: string | null
          guardrail_id?: string | null
          id?: string
          intent_id?: string
          merchant?: string | null
          merchant_url?: string | null
          protocol?: string
          protocol_payload?: Json
          receipt?: Json | null
          status?: string
          trust_score?: number | null
          user_approved?: boolean
          user_id?: string
          virtual_card_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agentic_payment_intents_guardrail_id_fkey"
            columns: ["guardrail_id"]
            isOneToOne: false
            referencedRelation: "agentic_guardrails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agentic_payment_intents_virtual_card_id_fkey"
            columns: ["virtual_card_id"]
            isOneToOne: false
            referencedRelation: "agentic_virtual_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      agentic_transactions: {
        Row: {
          ai_initiated: boolean
          amount: number
          category: string
          crypto_network: string | null
          crypto_tx_hash: string | null
          currency: string
          description: string
          device_id: string
          id: string
          intent_id: string | null
          merchant: string | null
          protocol: string
          receipt: Json
          settled_at: string
          status: string
          trust_score: number | null
          user_approved: boolean
          user_id: string
          virtual_card_last4: string | null
        }
        Insert: {
          ai_initiated?: boolean
          amount: number
          category: string
          crypto_network?: string | null
          crypto_tx_hash?: string | null
          currency: string
          description: string
          device_id: string
          id?: string
          intent_id?: string | null
          merchant?: string | null
          protocol: string
          receipt?: Json
          settled_at?: string
          status: string
          trust_score?: number | null
          user_approved?: boolean
          user_id: string
          virtual_card_last4?: string | null
        }
        Update: {
          ai_initiated?: boolean
          amount?: number
          category?: string
          crypto_network?: string | null
          crypto_tx_hash?: string | null
          currency?: string
          description?: string
          device_id?: string
          id?: string
          intent_id?: string | null
          merchant?: string | null
          protocol?: string
          receipt?: Json
          settled_at?: string
          status?: string
          trust_score?: number | null
          user_approved?: boolean
          user_id?: string
          virtual_card_last4?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agentic_transactions_intent_id_fkey"
            columns: ["intent_id"]
            isOneToOne: false
            referencedRelation: "agentic_payment_intents"
            referencedColumns: ["id"]
          },
        ]
      }
      agentic_virtual_cards: {
        Row: {
          amount_authorized: number
          amount_spent: number
          card_token: string
          card_type: string
          category_lock: string | null
          created_at: string
          currency: string
          device_id: string
          expires_at: string
          id: string
          last4: string
          merchant_lock: string | null
          metadata: Json
          network: string
          provider: string
          provider_card_id: string | null
          status: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          amount_authorized: number
          amount_spent?: number
          card_token: string
          card_type: string
          category_lock?: string | null
          created_at?: string
          currency?: string
          device_id: string
          expires_at: string
          id?: string
          last4: string
          merchant_lock?: string | null
          metadata?: Json
          network: string
          provider?: string
          provider_card_id?: string | null
          status?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          amount_authorized?: number
          amount_spent?: number
          card_token?: string
          card_type?: string
          category_lock?: string | null
          created_at?: string
          currency?: string
          device_id?: string
          expires_at?: string
          id?: string
          last4?: string
          merchant_lock?: string | null
          metadata?: Json
          network?: string
          provider?: string
          provider_card_id?: string | null
          status?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
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
      consent_ledger: {
        Row: {
          consent_text_hash: string
          consent_text_version: string
          created_at: string
          expires_at: string | null
          granted: boolean
          id: string
          ip_address: string | null
          metadata: Json
          partner_id: string | null
          purpose: string
          snomad_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          consent_text_hash: string
          consent_text_version: string
          created_at?: string
          expires_at?: string | null
          granted: boolean
          id?: string
          ip_address?: string | null
          metadata?: Json
          partner_id?: string | null
          purpose: string
          snomad_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          consent_text_hash?: string
          consent_text_version?: string
          created_at?: string
          expires_at?: string | null
          granted?: boolean
          id?: string
          ip_address?: string | null
          metadata?: Json
          partner_id?: string | null
          purpose?: string
          snomad_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
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
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          id?: string
          message_count?: number
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          id?: string
          message_count?: number
          title?: string | null
          updated_at?: string
          user_id?: string
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
      data_access_requests: {
        Row: {
          consent_id: string | null
          consent_verified: boolean
          created_at: string
          fields_requested: string[]
          fields_returned: string[]
          id: string
          ip_address: string | null
          legal_basis: string
          partner_id: string
          purpose: string
          records_count: number
          resource_type: string
          snomad_id: string | null
        }
        Insert: {
          consent_id?: string | null
          consent_verified?: boolean
          created_at?: string
          fields_requested?: string[]
          fields_returned?: string[]
          id?: string
          ip_address?: string | null
          legal_basis: string
          partner_id: string
          purpose: string
          records_count?: number
          resource_type: string
          snomad_id?: string | null
        }
        Update: {
          consent_id?: string | null
          consent_verified?: boolean
          created_at?: string
          fields_requested?: string[]
          fields_returned?: string[]
          id?: string
          ip_address?: string | null
          legal_basis?: string
          partner_id?: string
          purpose?: string
          records_count?: number
          resource_type?: string
          snomad_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_access_requests_consent_id_fkey"
            columns: ["consent_id"]
            isOneToOne: false
            referencedRelation: "consent_ledger"
            referencedColumns: ["id"]
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
          snomad_id: string | null
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
          snomad_id?: string | null
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
          snomad_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referral_clicks: {
        Row: {
          affiliate_id: string
          click_id: string
          converted: boolean
          converted_at: string | null
          converted_user_id: string | null
          country_code: string | null
          created_at: string
          expires_at: string
          fingerprint: string | null
          id: string
          ip_address: string | null
          landing_path: string | null
          referer_url: string | null
          referral_code: string
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          affiliate_id: string
          click_id: string
          converted?: boolean
          converted_at?: string | null
          converted_user_id?: string | null
          country_code?: string | null
          created_at?: string
          expires_at?: string
          fingerprint?: string | null
          id?: string
          ip_address?: string | null
          landing_path?: string | null
          referer_url?: string | null
          referral_code: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          affiliate_id?: string
          click_id?: string
          converted?: boolean
          converted_at?: string | null
          converted_user_id?: string | null
          country_code?: string | null
          created_at?: string
          expires_at?: string
          fingerprint?: string | null
          id?: string
          ip_address?: string | null
          landing_path?: string | null
          referer_url?: string | null
          referral_code?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_clicks_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          affiliate_id: string
          affiliate_user_id: string
          click_id: string | null
          created_at: string
          expires_at: string
          first_payment_at: string | null
          id: string
          level: number
          metadata: Json
          referred_user_id: string
          signup_at: string
          source_referral_id: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          affiliate_user_id: string
          click_id?: string | null
          created_at?: string
          expires_at?: string
          first_payment_at?: string | null
          id?: string
          level: number
          metadata?: Json
          referred_user_id: string
          signup_at?: string
          source_referral_id?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          affiliate_user_id?: string
          click_id?: string | null
          created_at?: string
          expires_at?: string
          first_payment_at?: string | null
          id?: string
          level?: number
          metadata?: Json
          referred_user_id?: string
          signup_at?: string
          source_referral_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_source_referral_id_fkey"
            columns: ["source_referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
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
          revocation_reason: string | null
          revoked_at: string | null
          status: string
          subject: Json
          tier: string
          user_id: string
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
          revocation_reason?: string | null
          revoked_at?: string | null
          status?: string
          subject?: Json
          tier: string
          user_id: string
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
          revocation_reason?: string | null
          revoked_at?: string | null
          status?: string
          subject?: Json
          tier?: string
          user_id?: string
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
      v_active_trust_credentials: {
        Row: {
          credential_type: string | null
          expires_at: string | null
          issued_at: string | null
          issuer: string | null
          snomad_id: string | null
          status: string | null
          tier: string | null
        }
        Relationships: []
      }
      v_partner_profile_signals: {
        Row: {
          age_bracket: string | null
          budget_tier: string | null
          completeness_score: number | null
          income_bracket: string | null
          industry: string | null
          preference_count: number | null
          snomad_id: string | null
          travel_style: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      attribute_referral: {
        Args: { p_click_id: string; p_referred_user_id: string }
        Returns: Json
      }
      check_data_access: {
        Args: { row_device_id: string; row_user_id: string }
        Returns: boolean
      }
      cleanup_expired_cache: { Args: never; Returns: number }
      clear_matured_earnings: { Args: never; Returns: number }
      credit_commission: {
        Args: {
          p_base_amount: number
          p_currency: string
          p_description?: string
          p_referred_user_id: string
          p_source_id: string
          p_source_type: string
        }
        Returns: Json
      }
      evaluate_agentic_guardrail: {
        Args: {
          p_amount: number
          p_category: string
          p_currency: string
          p_protocol: string
          p_user_id: string
        }
        Returns: Json
      }
      generate_snomad_id: { Args: never; Returns: string }
      get_my_snomad_id: { Args: never; Returns: string }
      get_or_create_affiliate_account: {
        Args: { p_user_id: string }
        Returns: {
          cleared_balance: number
          created_at: string
          id: string
          metadata: Json
          paid_lifetime: number
          parent_affiliate_id: string | null
          parent_user_id: string | null
          payout_address: string | null
          payout_currency: string
          payout_method: string
          pending_balance: number
          referral_code: string
          reversed_lifetime: number
          status: string
          tax_form_submitted: boolean
          tax_form_type: string | null
          terms_accepted_at: string | null
          terms_accepted_version: string | null
          tier: string
          total_clicks: number
          total_paying_referrals: number
          total_signups: number
          updated_at: string
          user_id: string
          wallet_credit_balance: number
        }
        SetofOptions: {
          from: "*"
          to: "affiliate_accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_request_device_id: { Args: never; Returns: string }
      has_active_consent: {
        Args: { p_partner_id?: string; p_purpose: string; p_user_id: string }
        Returns: boolean
      }
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
      record_referral_click: {
        Args: {
          p_click_id: string
          p_country?: string
          p_fingerprint?: string
          p_ip?: string
          p_landing?: string
          p_referer?: string
          p_referral_code: string
          p_user_agent?: string
          p_utm_campaign?: string
          p_utm_medium?: string
          p_utm_source?: string
        }
        Returns: string
      }
      request_affiliate_payout: {
        Args: { p_address?: string; p_amount: number; p_method: string }
        Returns: Json
      }
      resolve_snomad_id: { Args: { p_snomad_id: string }; Returns: string }
      revoke_trust_credential: {
        Args: { p_credential_id: string; p_reason?: string }
        Returns: boolean
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
      verify_trust_tier: {
        Args: {
          p_partner_id: string
          p_required_tier: string
          p_snomad_id: string
        }
        Returns: Json
      }
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
