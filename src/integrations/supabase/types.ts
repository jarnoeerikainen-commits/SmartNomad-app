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
      admin_ai_agent_controls: {
        Row: {
          agent_key: string
          agent_type: string
          automation_level: string
          can_write_to_user_surfaces: boolean
          created_at: string
          daily_run_limit: number
          daily_token_budget: number
          description: string
          director: Database["public"]["Enums"]["director_role"] | null
          disabled_reason: string | null
          display_name: string
          escalation_rules: Json
          feature_flags: Json
          id: string
          input_sources: Json
          last_run_at: string | null
          last_run_status: string | null
          metadata: Json
          model_tier: string
          next_run_at: string | null
          output_targets: Json
          owner_role: string
          requires_approval: boolean
          schedule_cron: string | null
          schedule_label: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_key: string
          agent_type?: string
          automation_level?: string
          can_write_to_user_surfaces?: boolean
          created_at?: string
          daily_run_limit?: number
          daily_token_budget?: number
          description?: string
          director?: Database["public"]["Enums"]["director_role"] | null
          disabled_reason?: string | null
          display_name: string
          escalation_rules?: Json
          feature_flags?: Json
          id?: string
          input_sources?: Json
          last_run_at?: string | null
          last_run_status?: string | null
          metadata?: Json
          model_tier?: string
          next_run_at?: string | null
          output_targets?: Json
          owner_role?: string
          requires_approval?: boolean
          schedule_cron?: string | null
          schedule_label?: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_key?: string
          agent_type?: string
          automation_level?: string
          can_write_to_user_surfaces?: boolean
          created_at?: string
          daily_run_limit?: number
          daily_token_budget?: number
          description?: string
          director?: Database["public"]["Enums"]["director_role"] | null
          disabled_reason?: string | null
          display_name?: string
          escalation_rules?: Json
          feature_flags?: Json
          id?: string
          input_sources?: Json
          last_run_at?: string | null
          last_run_status?: string | null
          metadata?: Json
          model_tier?: string
          next_run_at?: string | null
          output_targets?: Json
          owner_role?: string
          requires_approval?: boolean
          schedule_cron?: string | null
          schedule_label?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_ai_agent_daily_reports: {
        Row: {
          agent_key: string
          created_at: string
          director: Database["public"]["Enums"]["director_role"] | null
          estimated_cost_usd: number
          generated_by_run_id: string | null
          id: string
          issues: Json
          metadata: Json
          metrics: Json
          next_actions: Json
          performance_score: number
          report_date: string
          suggestions: Json
          summary: string
          title: string
          token_usage: number
          wins: Json
        }
        Insert: {
          agent_key: string
          created_at?: string
          director?: Database["public"]["Enums"]["director_role"] | null
          estimated_cost_usd?: number
          generated_by_run_id?: string | null
          id?: string
          issues?: Json
          metadata?: Json
          metrics?: Json
          next_actions?: Json
          performance_score?: number
          report_date?: string
          suggestions?: Json
          summary: string
          title: string
          token_usage?: number
          wins?: Json
        }
        Update: {
          agent_key?: string
          created_at?: string
          director?: Database["public"]["Enums"]["director_role"] | null
          estimated_cost_usd?: number
          generated_by_run_id?: string | null
          id?: string
          issues?: Json
          metadata?: Json
          metrics?: Json
          next_actions?: Json
          performance_score?: number
          report_date?: string
          suggestions?: Json
          summary?: string
          title?: string
          token_usage?: number
          wins?: Json
        }
        Relationships: [
          {
            foreignKeyName: "admin_ai_agent_daily_reports_agent_key_fkey"
            columns: ["agent_key"]
            isOneToOne: false
            referencedRelation: "admin_ai_agent_controls"
            referencedColumns: ["agent_key"]
          },
        ]
      }
      admin_ai_agent_runs: {
        Row: {
          agent_key: string
          completed_at: string | null
          created_by: string | null
          director: Database["public"]["Enums"]["director_role"] | null
          error: string | null
          id: string
          input_tokens: number
          latency_ms: number
          metadata: Json
          output_tokens: number
          outputs: Json
          scope: string
          signals_scanned: Json
          started_at: string
          status: string
          suggested_improvements: Json
          trigger: string
        }
        Insert: {
          agent_key: string
          completed_at?: string | null
          created_by?: string | null
          director?: Database["public"]["Enums"]["director_role"] | null
          error?: string | null
          id?: string
          input_tokens?: number
          latency_ms?: number
          metadata?: Json
          output_tokens?: number
          outputs?: Json
          scope?: string
          signals_scanned?: Json
          started_at?: string
          status?: string
          suggested_improvements?: Json
          trigger?: string
        }
        Update: {
          agent_key?: string
          completed_at?: string | null
          created_by?: string | null
          director?: Database["public"]["Enums"]["director_role"] | null
          error?: string | null
          id?: string
          input_tokens?: number
          latency_ms?: number
          metadata?: Json
          output_tokens?: number
          outputs?: Json
          scope?: string
          signals_scanned?: Json
          started_at?: string
          status?: string
          suggested_improvements?: Json
          trigger?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_ai_agent_runs_agent_key_fkey"
            columns: ["agent_key"]
            isOneToOne: false
            referencedRelation: "admin_ai_agent_controls"
            referencedColumns: ["agent_key"]
          },
        ]
      }
      admin_ai_agent_suggestions: {
        Row: {
          agent_key: string
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          director: Database["public"]["Enums"]["director_role"] | null
          evidence: Json
          expected_impact: string | null
          expires_at: string | null
          id: string
          priority: string
          rationale: string
          requires_approval: boolean
          risk_level: string
          source_report_id: string | null
          status: string
          suggested_action: string
          suggestion_type: string
          title: string
        }
        Insert: {
          agent_key: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          director?: Database["public"]["Enums"]["director_role"] | null
          evidence?: Json
          expected_impact?: string | null
          expires_at?: string | null
          id?: string
          priority?: string
          rationale: string
          requires_approval?: boolean
          risk_level?: string
          source_report_id?: string | null
          status?: string
          suggested_action: string
          suggestion_type?: string
          title: string
        }
        Update: {
          agent_key?: string
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          director?: Database["public"]["Enums"]["director_role"] | null
          evidence?: Json
          expected_impact?: string | null
          expires_at?: string | null
          id?: string
          priority?: string
          rationale?: string
          requires_approval?: boolean
          risk_level?: string
          source_report_id?: string | null
          status?: string
          suggested_action?: string
          suggestion_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_ai_agent_suggestions_agent_key_fkey"
            columns: ["agent_key"]
            isOneToOne: false
            referencedRelation: "admin_ai_agent_controls"
            referencedColumns: ["agent_key"]
          },
        ]
      }
      admin_ai_brain_runs: {
        Row: {
          completed_at: string | null
          error: string | null
          id: string
          input_tokens: number | null
          insights_created: number | null
          latency_ms: number | null
          model: string | null
          output_tokens: number | null
          recommendations_created: number | null
          reports_created: number | null
          scope: string
          signals_scanned: Json
          started_at: string
          status: string
          trigger: string
          triggered_by: string | null
        }
        Insert: {
          completed_at?: string | null
          error?: string | null
          id?: string
          input_tokens?: number | null
          insights_created?: number | null
          latency_ms?: number | null
          model?: string | null
          output_tokens?: number | null
          recommendations_created?: number | null
          reports_created?: number | null
          scope?: string
          signals_scanned?: Json
          started_at?: string
          status?: string
          trigger?: string
          triggered_by?: string | null
        }
        Update: {
          completed_at?: string | null
          error?: string | null
          id?: string
          input_tokens?: number | null
          insights_created?: number | null
          latency_ms?: number | null
          model?: string | null
          output_tokens?: number | null
          recommendations_created?: number | null
          reports_created?: number | null
          scope?: string
          signals_scanned?: Json
          started_at?: string
          status?: string
          trigger?: string
          triggered_by?: string | null
        }
        Relationships: []
      }
      admin_ai_ceo_permissions: {
        Row: {
          can_affect_costs: boolean
          can_affect_pricing: boolean
          can_affect_user_surfaces: boolean
          decision_area: string
          description: string
          max_daily_actions: number
          metadata: Json
          permission_key: string
          requires_master_password: boolean
          risk_level: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          can_affect_costs?: boolean
          can_affect_pricing?: boolean
          can_affect_user_surfaces?: boolean
          decision_area?: string
          description?: string
          max_daily_actions?: number
          metadata?: Json
          permission_key: string
          requires_master_password?: boolean
          risk_level?: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          can_affect_costs?: boolean
          can_affect_pricing?: boolean
          can_affect_user_surfaces?: boolean
          decision_area?: string
          description?: string
          max_daily_actions?: number
          metadata?: Json
          permission_key?: string
          requires_master_password?: boolean
          risk_level?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      admin_ai_ceo_reports: {
        Row: {
          business_health: Json
          created_at: string
          customer_experience: Json
          executive_summary: string
          generated_by_run_id: string | null
          id: string
          learning_updates: Json
          metadata: Json
          narrative: string | null
          product_opportunities: Json
          report_date: string
          revenue_opportunities: Json
          risk_register: Json
          source_rollups: Json
          title: string
        }
        Insert: {
          business_health?: Json
          created_at?: string
          customer_experience?: Json
          executive_summary: string
          generated_by_run_id?: string | null
          id?: string
          learning_updates?: Json
          metadata?: Json
          narrative?: string | null
          product_opportunities?: Json
          report_date?: string
          revenue_opportunities?: Json
          risk_register?: Json
          source_rollups?: Json
          title: string
        }
        Update: {
          business_health?: Json
          created_at?: string
          customer_experience?: Json
          executive_summary?: string
          generated_by_run_id?: string | null
          id?: string
          learning_updates?: Json
          metadata?: Json
          narrative?: string | null
          product_opportunities?: Json
          report_date?: string
          revenue_opportunities?: Json
          risk_register?: Json
          source_rollups?: Json
          title?: string
        }
        Relationships: []
      }
      admin_ai_ceo_suggestions: {
        Row: {
          category: string
          confidence: number
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          evidence: Json
          expected_impact: string | null
          id: string
          priority: string
          rationale: string
          requires_master_approval: boolean
          source_report_id: string | null
          status: string
          suggested_action: string
          title: string
        }
        Insert: {
          category?: string
          confidence?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          evidence?: Json
          expected_impact?: string | null
          id?: string
          priority?: string
          rationale: string
          requires_master_approval?: boolean
          source_report_id?: string | null
          status?: string
          suggested_action: string
          title: string
        }
        Update: {
          category?: string
          confidence?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          evidence?: Json
          expected_impact?: string | null
          id?: string
          priority?: string
          rationale?: string
          requires_master_approval?: boolean
          source_report_id?: string | null
          status?: string
          suggested_action?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_ai_ceo_suggestions_source_report_id_fkey"
            columns: ["source_report_id"]
            isOneToOne: false
            referencedRelation: "admin_ai_ceo_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_ai_daily_briefings: {
        Row: {
          briefing_date: string
          concerns: Json
          created_at: string
          director_rollup: Json
          executive_summary: string
          generated_by_run_id: string | null
          highlights: Json
          id: string
          kpi_snapshot: Json
          metadata: Json
          narrative: string | null
          pending_approvals: Json
          title: string
        }
        Insert: {
          briefing_date?: string
          concerns?: Json
          created_at?: string
          director_rollup?: Json
          executive_summary: string
          generated_by_run_id?: string | null
          highlights?: Json
          id?: string
          kpi_snapshot?: Json
          metadata?: Json
          narrative?: string | null
          pending_approvals?: Json
          title: string
        }
        Update: {
          briefing_date?: string
          concerns?: Json
          created_at?: string
          director_rollup?: Json
          executive_summary?: string
          generated_by_run_id?: string | null
          highlights?: Json
          id?: string
          kpi_snapshot?: Json
          metadata?: Json
          narrative?: string | null
          pending_approvals?: Json
          title?: string
        }
        Relationships: []
      }
      admin_ai_director_runs: {
        Row: {
          completed_at: string | null
          director: Database["public"]["Enums"]["director_role"]
          error: string | null
          id: string
          input_tokens: number
          latency_ms: number
          model: string | null
          notes: Json
          opportunities_created: number
          output_tokens: number
          pushed_recommendations: number
          scope: string
          sponsor_packages_created: number
          started_at: string
          status: string
          trigger: string
        }
        Insert: {
          completed_at?: string | null
          director: Database["public"]["Enums"]["director_role"]
          error?: string | null
          id?: string
          input_tokens?: number
          latency_ms?: number
          model?: string | null
          notes?: Json
          opportunities_created?: number
          output_tokens?: number
          pushed_recommendations?: number
          scope?: string
          sponsor_packages_created?: number
          started_at?: string
          status?: string
          trigger?: string
        }
        Update: {
          completed_at?: string | null
          director?: Database["public"]["Enums"]["director_role"]
          error?: string | null
          id?: string
          input_tokens?: number
          latency_ms?: number
          model?: string | null
          notes?: Json
          opportunities_created?: number
          output_tokens?: number
          pushed_recommendations?: number
          scope?: string
          sponsor_packages_created?: number
          started_at?: string
          status?: string
          trigger?: string
        }
        Relationships: []
      }
      admin_ai_insights: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          affected_count: number | null
          category: string
          confidence: number
          created_at: string
          evidence: Json
          expires_at: string | null
          id: string
          metric_snapshot: Json
          severity: string
          source_run_id: string | null
          status: string
          summary: string
          title: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          affected_count?: number | null
          category: string
          confidence?: number
          created_at?: string
          evidence?: Json
          expires_at?: string | null
          id?: string
          metric_snapshot?: Json
          severity?: string
          source_run_id?: string | null
          status?: string
          summary: string
          title: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          affected_count?: number | null
          category?: string
          confidence?: number
          created_at?: string
          evidence?: Json
          expires_at?: string | null
          id?: string
          metric_snapshot?: Json
          severity?: string
          source_run_id?: string | null
          status?: string
          summary?: string
          title?: string
        }
        Relationships: []
      }
      admin_ai_opportunities: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category: string
          city: string | null
          concierge_offer: Json
          country: string | null
          created_at: string
          currency: string
          decision_note: string | null
          director: Database["public"]["Enums"]["director_role"]
          end_at: string | null
          est_audience: number | null
          est_ticket_price_max: number | null
          est_ticket_price_min: number | null
          exclusivity_score: number
          expires_at: string | null
          id: string
          metadata: Json
          popularity_score: number
          pushed_to_concierge: boolean
          pushed_to_sales: boolean
          rejected_at: string | null
          rejected_by: string | null
          requires_approval: boolean
          sales_target_segments: Json
          source: string | null
          source_run_id: string | null
          sponsor_packages: Json
          start_at: string | null
          status: string
          summary: string
          tags: string[]
          title: string
          url: string | null
          venue: string | null
          vip_packages: Json
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category: string
          city?: string | null
          concierge_offer?: Json
          country?: string | null
          created_at?: string
          currency?: string
          decision_note?: string | null
          director: Database["public"]["Enums"]["director_role"]
          end_at?: string | null
          est_audience?: number | null
          est_ticket_price_max?: number | null
          est_ticket_price_min?: number | null
          exclusivity_score?: number
          expires_at?: string | null
          id?: string
          metadata?: Json
          popularity_score?: number
          pushed_to_concierge?: boolean
          pushed_to_sales?: boolean
          rejected_at?: string | null
          rejected_by?: string | null
          requires_approval?: boolean
          sales_target_segments?: Json
          source?: string | null
          source_run_id?: string | null
          sponsor_packages?: Json
          start_at?: string | null
          status?: string
          summary: string
          tags?: string[]
          title: string
          url?: string | null
          venue?: string | null
          vip_packages?: Json
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string
          city?: string | null
          concierge_offer?: Json
          country?: string | null
          created_at?: string
          currency?: string
          decision_note?: string | null
          director?: Database["public"]["Enums"]["director_role"]
          end_at?: string | null
          est_audience?: number | null
          est_ticket_price_max?: number | null
          est_ticket_price_min?: number | null
          exclusivity_score?: number
          expires_at?: string | null
          id?: string
          metadata?: Json
          popularity_score?: number
          pushed_to_concierge?: boolean
          pushed_to_sales?: boolean
          rejected_at?: string | null
          rejected_by?: string | null
          requires_approval?: boolean
          sales_target_segments?: Json
          source?: string | null
          source_run_id?: string | null
          sponsor_packages?: Json
          start_at?: string | null
          status?: string
          summary?: string
          tags?: string[]
          title?: string
          url?: string | null
          venue?: string | null
          vip_packages?: Json
        }
        Relationships: []
      }
      admin_ai_recommendations: {
        Row: {
          confidence: number
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          evidence: Json | null
          expected_impact: string | null
          expires_at: string | null
          id: string
          kind: string
          priority: string
          rationale: string
          requires_approval: boolean
          source_insight_id: string | null
          source_run_id: string | null
          status: string
          suggested_action: string
          target_segment: Json | null
          title: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          evidence?: Json | null
          expected_impact?: string | null
          expires_at?: string | null
          id?: string
          kind: string
          priority?: string
          rationale: string
          requires_approval?: boolean
          source_insight_id?: string | null
          source_run_id?: string | null
          status?: string
          suggested_action: string
          target_segment?: Json | null
          title: string
        }
        Update: {
          confidence?: number
          created_at?: string
          decided_at?: string | null
          decided_by?: string | null
          decision_note?: string | null
          evidence?: Json | null
          expected_impact?: string | null
          expires_at?: string | null
          id?: string
          kind?: string
          priority?: string
          rationale?: string
          requires_approval?: boolean
          source_insight_id?: string | null
          source_run_id?: string | null
          status?: string
          suggested_action?: string
          target_segment?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_ai_recommendations_source_insight_id_fkey"
            columns: ["source_insight_id"]
            isOneToOne: false
            referencedRelation: "admin_ai_insights"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_ai_reports: {
        Row: {
          concerns: Json
          created_at: string
          executive_summary: string
          generated_by_run_id: string | null
          highlights: Json
          id: string
          kpi_snapshot: Json
          metadata: Json
          narrative: string | null
          period_end: string
          period_start: string
          timeframe: string
          title: string
        }
        Insert: {
          concerns?: Json
          created_at?: string
          executive_summary: string
          generated_by_run_id?: string | null
          highlights?: Json
          id?: string
          kpi_snapshot?: Json
          metadata?: Json
          narrative?: string | null
          period_end: string
          period_start: string
          timeframe: string
          title: string
        }
        Update: {
          concerns?: Json
          created_at?: string
          executive_summary?: string
          generated_by_run_id?: string | null
          highlights?: Json
          id?: string
          kpi_snapshot?: Json
          metadata?: Json
          narrative?: string | null
          period_end?: string
          period_start?: string
          timeframe?: string
          title?: string
        }
        Relationships: []
      }
      admin_concierge_performance_daily: {
        Row: {
          avg_quality_score: number
          conversion_events: number
          created_at: string
          escalation_rate: number
          estimated_cost_usd: number
          id: string
          notes: Json
          report_date: string
          revenue_signal_usd: number
          segment: string
          token_usage: number
          total_sessions: number
        }
        Insert: {
          avg_quality_score?: number
          conversion_events?: number
          created_at?: string
          escalation_rate?: number
          estimated_cost_usd?: number
          id?: string
          notes?: Json
          report_date?: string
          revenue_signal_usd?: number
          segment?: string
          token_usage?: number
          total_sessions?: number
        }
        Update: {
          avg_quality_score?: number
          conversion_events?: number
          created_at?: string
          escalation_rate?: number
          estimated_cost_usd?: number
          id?: string
          notes?: Json
          report_date?: string
          revenue_signal_usd?: number
          segment?: string
          token_usage?: number
          total_sessions?: number
        }
        Relationships: []
      }
      admin_concierge_rules: {
        Row: {
          applies_to: string[]
          category: string
          created_at: string
          metadata: Json
          priority: number
          rule_key: string
          rule_text: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          applies_to?: string[]
          category?: string
          created_at?: string
          metadata?: Json
          priority?: number
          rule_key: string
          rule_text: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          applies_to?: string[]
          category?: string
          created_at?: string
          metadata?: Json
          priority?: number
          rule_key?: string
          rule_text?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      ai_action_execution_audit: {
        Row: {
          action_fingerprint: string
          action_type: string
          created_at: string
          denial_reason: string | null
          device_id: string
          function_name: string
          id: string
          mode: string
          payload_summary: Json
          permission_id: string | null
          provider: string | null
          result_summary: Json
          status: string
          user_id: string | null
        }
        Insert: {
          action_fingerprint: string
          action_type: string
          created_at?: string
          denial_reason?: string | null
          device_id: string
          function_name?: string
          id?: string
          mode?: string
          payload_summary?: Json
          permission_id?: string | null
          provider?: string | null
          result_summary?: Json
          status?: string
          user_id?: string | null
        }
        Update: {
          action_fingerprint?: string
          action_type?: string
          created_at?: string
          denial_reason?: string | null
          device_id?: string
          function_name?: string
          id?: string
          mode?: string
          payload_summary?: Json
          permission_id?: string | null
          provider?: string | null
          result_summary?: Json
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_action_execution_audit_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "ai_action_permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_action_permissions: {
        Row: {
          action_fingerprint: string
          action_type: string
          approval_note: string | null
          approval_source: string
          approved_by: string | null
          consumed_at: string | null
          created_at: string
          device_id: string
          execution_count: number
          expires_at: string
          id: string
          max_executions: number
          metadata: Json
          requested_payload: Json
          risk_level: string
          scope: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_fingerprint: string
          action_type: string
          approval_note?: string | null
          approval_source?: string
          approved_by?: string | null
          consumed_at?: string | null
          created_at?: string
          device_id: string
          execution_count?: number
          expires_at?: string
          id?: string
          max_executions?: number
          metadata?: Json
          requested_payload?: Json
          risk_level?: string
          scope?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_fingerprint?: string
          action_type?: string
          approval_note?: string | null
          approval_source?: string
          approved_by?: string | null
          consumed_at?: string | null
          created_at?: string
          device_id?: string
          execution_count?: number
          expires_at?: string
          id?: string
          max_executions?: number
          metadata?: Json
          requested_payload?: Json
          risk_level?: string
          scope?: string
          status?: string
          updated_at?: string
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
          user_scope: string
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
          user_scope?: string
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
          user_scope?: string
        }
        Relationships: []
      }
      ai_execution_proofs: {
        Row: {
          answer_agents: Json
          answer_sources: Json
          audit_schema_version: number
          cache_hit: boolean
          command: string
          completed_at: string | null
          confidence_policy: string
          confidence_status: string
          created_at: string
          data_sources: Json
          directors: Json
          error: string | null
          escalation_reason: string | null
          escalation_type: string | null
          estimated_cost_usd: number
          function_name: string | null
          human_approval_actor: string | null
          human_approval_at: string | null
          human_approval_state: string
          id: string
          immutable_locked: boolean
          input_tokens: number
          latency_ms: number
          model: string | null
          output_tokens: number
          persona: string
          primary_agent: string
          proof_hash: string
          request_category: string
          response_excerpt: string | null
          retention_until: string
          route: string
          run_ref: string
          sources: Json
          started_at: string
          status: string
          steps: Json
          surface: string
          tools_actions: Json
          updated_at: string
          user_alias: string
          verification_note: string | null
          websites: Json
        }
        Insert: {
          answer_agents?: Json
          answer_sources?: Json
          audit_schema_version?: number
          cache_hit?: boolean
          command: string
          completed_at?: string | null
          confidence_policy?: string
          confidence_status?: string
          created_at?: string
          data_sources?: Json
          directors?: Json
          error?: string | null
          escalation_reason?: string | null
          escalation_type?: string | null
          estimated_cost_usd?: number
          function_name?: string | null
          human_approval_actor?: string | null
          human_approval_at?: string | null
          human_approval_state?: string
          id?: string
          immutable_locked?: boolean
          input_tokens?: number
          latency_ms?: number
          model?: string | null
          output_tokens?: number
          persona?: string
          primary_agent: string
          proof_hash: string
          request_category?: string
          response_excerpt?: string | null
          retention_until?: string
          route: string
          run_ref: string
          sources?: Json
          started_at?: string
          status?: string
          steps?: Json
          surface: string
          tools_actions?: Json
          updated_at?: string
          user_alias?: string
          verification_note?: string | null
          websites?: Json
        }
        Update: {
          answer_agents?: Json
          answer_sources?: Json
          audit_schema_version?: number
          cache_hit?: boolean
          command?: string
          completed_at?: string | null
          confidence_policy?: string
          confidence_status?: string
          created_at?: string
          data_sources?: Json
          directors?: Json
          error?: string | null
          escalation_reason?: string | null
          escalation_type?: string | null
          estimated_cost_usd?: number
          function_name?: string | null
          human_approval_actor?: string | null
          human_approval_at?: string | null
          human_approval_state?: string
          id?: string
          immutable_locked?: boolean
          input_tokens?: number
          latency_ms?: number
          model?: string | null
          output_tokens?: number
          persona?: string
          primary_agent?: string
          proof_hash?: string
          request_category?: string
          response_excerpt?: string | null
          retention_until?: string
          route?: string
          run_ref?: string
          sources?: Json
          started_at?: string
          status?: string
          steps?: Json
          surface?: string
          tools_actions?: Json
          updated_at?: string
          user_alias?: string
          verification_note?: string | null
          websites?: Json
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
          real_calling_enabled: boolean
          require_auth: boolean
          require_mfa_for_payments: boolean
          require_mfa_for_sensitive: boolean
          updated_at: string
        }
        Insert: {
          demo_mode_enabled?: boolean
          id?: number
          real_calling_enabled?: boolean
          require_auth?: boolean
          require_mfa_for_payments?: boolean
          require_mfa_for_sensitive?: boolean
          updated_at?: string
        }
        Update: {
          demo_mode_enabled?: boolean
          id?: number
          real_calling_enabled?: boolean
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
      business_trip_expenses: {
        Row: {
          amount: number
          amount_base: number | null
          category: string
          created_at: string
          currency: string
          description: string
          expense_date: string
          id: string
          is_billable: boolean
          is_reimbursable: boolean
          metadata: Json
          organization_id: string
          payment_method: string | null
          receipt_url: string | null
          trip_id: string
          user_id: string
          vendor: string | null
        }
        Insert: {
          amount: number
          amount_base?: number | null
          category: string
          created_at?: string
          currency?: string
          description: string
          expense_date?: string
          id?: string
          is_billable?: boolean
          is_reimbursable?: boolean
          metadata?: Json
          organization_id: string
          payment_method?: string | null
          receipt_url?: string | null
          trip_id: string
          user_id: string
          vendor?: string | null
        }
        Update: {
          amount?: number
          amount_base?: number | null
          category?: string
          created_at?: string
          currency?: string
          description?: string
          expense_date?: string
          id?: string
          is_billable?: boolean
          is_reimbursable?: boolean
          metadata?: Json
          organization_id?: string
          payment_method?: string | null
          receipt_url?: string | null
          trip_id?: string
          user_id?: string
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_trip_expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_trip_expenses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_trip_expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "business_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      business_trips: {
        Row: {
          actual_cost: number
          approved_at: string | null
          approver_id: string | null
          booking_refs: Json
          created_at: string
          currency: string
          destination_city: string | null
          destination_country: string | null
          end_date: string
          estimated_cost: number
          id: string
          member_id: string
          metadata: Json
          notes: string | null
          organization_id: string
          origin_city: string | null
          policy_violations: Json
          purpose: string
          rejection_reason: string | null
          start_date: string
          status: string
          trip_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_cost?: number
          approved_at?: string | null
          approver_id?: string | null
          booking_refs?: Json
          created_at?: string
          currency?: string
          destination_city?: string | null
          destination_country?: string | null
          end_date: string
          estimated_cost?: number
          id?: string
          member_id: string
          metadata?: Json
          notes?: string | null
          organization_id: string
          origin_city?: string | null
          policy_violations?: Json
          purpose: string
          rejection_reason?: string | null
          start_date: string
          status?: string
          trip_code?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_cost?: number
          approved_at?: string | null
          approver_id?: string | null
          booking_refs?: Json
          created_at?: string
          currency?: string
          destination_city?: string | null
          destination_country?: string | null
          end_date?: string
          estimated_cost?: number
          id?: string
          member_id?: string
          metadata?: Json
          notes?: string | null
          organization_id?: string
          origin_city?: string | null
          policy_violations?: Json
          purpose?: string
          rejection_reason?: string | null
          start_date?: string
          status?: string
          trip_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_trips_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_trips_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_trips_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      call_messages: {
        Row: {
          call_id: string | null
          ciphertext: string | null
          conversation_key: string | null
          created_at: string
          id: string
          is_demo: boolean
          message_type: string
          metadata: Json
          plaintext: string | null
          recipient_id: string
          recipient_kind: string
          recipient_persona_id: string | null
          recipient_user_id: string | null
          sender_id: string
          sender_kind: string
          sender_persona_id: string | null
          sender_user_id: string | null
        }
        Insert: {
          call_id?: string | null
          ciphertext?: string | null
          conversation_key?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          message_type?: string
          metadata?: Json
          plaintext?: string | null
          recipient_id: string
          recipient_kind: string
          recipient_persona_id?: string | null
          recipient_user_id?: string | null
          sender_id: string
          sender_kind: string
          sender_persona_id?: string | null
          sender_user_id?: string | null
        }
        Update: {
          call_id?: string | null
          ciphertext?: string | null
          conversation_key?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          message_type?: string
          metadata?: Json
          plaintext?: string | null
          recipient_id?: string
          recipient_kind?: string
          recipient_persona_id?: string | null
          recipient_user_id?: string | null
          sender_id?: string
          sender_kind?: string
          sender_persona_id?: string | null
          sender_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_messages_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      call_participants: {
        Row: {
          call_id: string
          created_at: string
          display_name: string | null
          id: string
          is_muted: boolean
          is_video_on: boolean
          joined_at: string | null
          left_at: string | null
          metadata: Json
          participant_id: string
          participant_kind: string
          persona_id: string | null
          state: string
          user_id: string | null
        }
        Insert: {
          call_id: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_muted?: boolean
          is_video_on?: boolean
          joined_at?: string | null
          left_at?: string | null
          metadata?: Json
          participant_id: string
          participant_kind: string
          persona_id?: string | null
          state?: string
          user_id?: string | null
        }
        Update: {
          call_id?: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_muted?: boolean
          is_video_on?: boolean
          joined_at?: string | null
          left_at?: string | null
          metadata?: Json
          participant_id?: string
          participant_kind?: string
          persona_id?: string | null
          state?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_participants_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      call_permissions: {
        Row: {
          can_call: boolean
          can_message: boolean
          can_video: boolean
          created_at: string
          expires_at: string | null
          grantee_id: string
          grantee_kind: string
          id: string
          is_demo: boolean
          metadata: Json
          owner_device_id: string | null
          owner_persona_id: string | null
          owner_user_id: string | null
          reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          can_call?: boolean
          can_message?: boolean
          can_video?: boolean
          created_at?: string
          expires_at?: string | null
          grantee_id: string
          grantee_kind: string
          id?: string
          is_demo?: boolean
          metadata?: Json
          owner_device_id?: string | null
          owner_persona_id?: string | null
          owner_user_id?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          can_call?: boolean
          can_message?: boolean
          can_video?: boolean
          created_at?: string
          expires_at?: string | null
          grantee_id?: string
          grantee_kind?: string
          id?: string
          is_demo?: boolean
          metadata?: Json
          owner_device_id?: string | null
          owner_persona_id?: string | null
          owner_user_id?: string | null
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      call_presence: {
        Row: {
          active_call_id: string | null
          device_id: string | null
          last_seen_at: string
          metadata: Json
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active_call_id?: string | null
          device_id?: string | null
          last_seen_at?: string
          metadata?: Json
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active_call_id?: string | null
          device_id?: string | null
          last_seen_at?: string
          metadata?: Json
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_presence_active_call_id_fkey"
            columns: ["active_call_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sessions: {
        Row: {
          ai_actions: Json
          ai_summary: string | null
          answered_at: string | null
          billed_to: string | null
          call_kind: string
          callee_id: string
          callee_kind: string
          callee_persona_id: string | null
          callee_phone: string | null
          callee_user_id: string | null
          caller_device_id: string | null
          caller_id: string
          caller_kind: string
          caller_persona_id: string | null
          caller_user_id: string | null
          cost_cents: number
          cost_currency: string
          created_at: string
          direction: string
          duration_seconds: number
          end_reason: string | null
          ended_at: string | null
          id: string
          initiated_at: string
          is_demo: boolean
          lane: string
          metadata: Json
          provider: string | null
          provider_call_sid: string | null
          recording_consent: boolean
          recording_url: string | null
          status: string
          transcript: Json
          updated_at: string
        }
        Insert: {
          ai_actions?: Json
          ai_summary?: string | null
          answered_at?: string | null
          billed_to?: string | null
          call_kind?: string
          callee_id: string
          callee_kind: string
          callee_persona_id?: string | null
          callee_phone?: string | null
          callee_user_id?: string | null
          caller_device_id?: string | null
          caller_id: string
          caller_kind: string
          caller_persona_id?: string | null
          caller_user_id?: string | null
          cost_cents?: number
          cost_currency?: string
          created_at?: string
          direction?: string
          duration_seconds?: number
          end_reason?: string | null
          ended_at?: string | null
          id?: string
          initiated_at?: string
          is_demo?: boolean
          lane: string
          metadata?: Json
          provider?: string | null
          provider_call_sid?: string | null
          recording_consent?: boolean
          recording_url?: string | null
          status?: string
          transcript?: Json
          updated_at?: string
        }
        Update: {
          ai_actions?: Json
          ai_summary?: string | null
          answered_at?: string | null
          billed_to?: string | null
          call_kind?: string
          callee_id?: string
          callee_kind?: string
          callee_persona_id?: string | null
          callee_phone?: string | null
          callee_user_id?: string | null
          caller_device_id?: string | null
          caller_id?: string
          caller_kind?: string
          caller_persona_id?: string | null
          caller_user_id?: string | null
          cost_cents?: number
          cost_currency?: string
          created_at?: string
          direction?: string
          duration_seconds?: number
          end_reason?: string | null
          ended_at?: string | null
          id?: string
          initiated_at?: string
          is_demo?: boolean
          lane?: string
          metadata?: Json
          provider?: string | null
          provider_call_sid?: string | null
          recording_consent?: boolean
          recording_url?: string | null
          status?: string
          transcript?: Json
          updated_at?: string
        }
        Relationships: []
      }
      call_signals: {
        Row: {
          call_id: string
          consumed_at: string | null
          created_at: string
          id: string
          payload: Json
          recipient_user_id: string | null
          sender_user_id: string
          signal_type: string
        }
        Insert: {
          call_id: string
          consumed_at?: string | null
          created_at?: string
          id?: string
          payload?: Json
          recipient_user_id?: string | null
          sender_user_id: string
          signal_type: string
        }
        Update: {
          call_id?: string
          consumed_at?: string | null
          created_at?: string
          id?: string
          payload?: Json
          recipient_user_id?: string | null
          sender_user_id?: string
          signal_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_signals_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "call_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      change_proposals: {
        Row: {
          ai_diff: Json
          ai_summary: string
          applied_at: string | null
          change_category: string
          created_at: string
          current_snapshot_id: string
          decided_at: string | null
          decided_by: string | null
          decision: string | null
          decision_note: string | null
          expires_at: string
          id: string
          injection_scan_findings: Json | null
          injection_scan_passed: boolean
          previous_snapshot_id: string | null
          proposed_patch: Json | null
          risk_level: string
          risk_score: number
          source_id: string
          status: string
          tls_verified: boolean
        }
        Insert: {
          ai_diff?: Json
          ai_summary: string
          applied_at?: string | null
          change_category: string
          created_at?: string
          current_snapshot_id: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string | null
          decision_note?: string | null
          expires_at?: string
          id?: string
          injection_scan_findings?: Json | null
          injection_scan_passed?: boolean
          previous_snapshot_id?: string | null
          proposed_patch?: Json | null
          risk_level: string
          risk_score: number
          source_id: string
          status?: string
          tls_verified?: boolean
        }
        Update: {
          ai_diff?: Json
          ai_summary?: string
          applied_at?: string | null
          change_category?: string
          created_at?: string
          current_snapshot_id?: string
          decided_at?: string | null
          decided_by?: string | null
          decision?: string | null
          decision_note?: string | null
          expires_at?: string
          id?: string
          injection_scan_findings?: Json | null
          injection_scan_passed?: boolean
          previous_snapshot_id?: string | null
          proposed_patch?: Json | null
          risk_level?: string
          risk_score?: number
          source_id?: string
          status?: string
          tls_verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "change_proposals_current_snapshot_id_fkey"
            columns: ["current_snapshot_id"]
            isOneToOne: false
            referencedRelation: "source_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_proposals_previous_snapshot_id_fkey"
            columns: ["previous_snapshot_id"]
            isOneToOne: false
            referencedRelation: "source_snapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "change_proposals_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "verified_sources"
            referencedColumns: ["id"]
          },
        ]
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
      curated_venues: {
        Row: {
          address: string | null
          category: string
          city: string
          country: string
          country_code: string | null
          discovered_at: string
          id: string
          last_verified_at: string
          metadata: Json
          name: string
          neighborhood: string | null
          price_band: string | null
          quality_score: number
          review_count: number
          review_score: number
          signature_offering: string | null
          source_urls: Json
          star_rating: number | null
          status: string
          tags: string[] | null
          why_recommended: string | null
        }
        Insert: {
          address?: string | null
          category: string
          city: string
          country: string
          country_code?: string | null
          discovered_at?: string
          id?: string
          last_verified_at?: string
          metadata?: Json
          name: string
          neighborhood?: string | null
          price_band?: string | null
          quality_score?: number
          review_count?: number
          review_score: number
          signature_offering?: string | null
          source_urls?: Json
          star_rating?: number | null
          status?: string
          tags?: string[] | null
          why_recommended?: string | null
        }
        Update: {
          address?: string | null
          category?: string
          city?: string
          country?: string
          country_code?: string | null
          discovered_at?: string
          id?: string
          last_verified_at?: string
          metadata?: Json
          name?: string
          neighborhood?: string | null
          price_band?: string | null
          quality_score?: number
          review_count?: number
          review_score?: number
          signature_offering?: string | null
          source_urls?: Json
          star_rating?: number | null
          status?: string
          tags?: string[] | null
          why_recommended?: string | null
        }
        Relationships: []
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
      data_package_fields: {
        Row: {
          bucket_strategy: Json | null
          created_at: string
          data_type: string
          description: string | null
          display_name: string | null
          field_name: string
          id: string
          is_identifier: boolean
          is_partition_key: boolean
          is_required: boolean
          package_id: string
          position: number
          recency_days: number | null
          transform: string
        }
        Insert: {
          bucket_strategy?: Json | null
          created_at?: string
          data_type: string
          description?: string | null
          display_name?: string | null
          field_name: string
          id?: string
          is_identifier?: boolean
          is_partition_key?: boolean
          is_required?: boolean
          package_id: string
          position?: number
          recency_days?: number | null
          transform?: string
        }
        Update: {
          bucket_strategy?: Json | null
          created_at?: string
          data_type?: string
          description?: string | null
          display_name?: string | null
          field_name?: string
          id?: string
          is_identifier?: boolean
          is_partition_key?: boolean
          is_required?: boolean
          package_id?: string
          position?: number
          recency_days?: number | null
          transform?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_package_fields_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "data_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      data_package_segments: {
        Row: {
          created_at: string
          estimated_size: number
          id: string
          is_active: boolean
          match_rule: Json
          package_id: string
          parent_segment_id: string | null
          recency_days: number
          segment_id: string
          segment_name: string
          source_type: string
          tier: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_size?: number
          id?: string
          is_active?: boolean
          match_rule?: Json
          package_id: string
          parent_segment_id?: string | null
          recency_days?: number
          segment_id: string
          segment_name: string
          source_type?: string
          tier?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_size?: number
          id?: string
          is_active?: boolean
          match_rule?: Json
          package_id?: string
          parent_segment_id?: string | null
          recency_days?: number
          segment_id?: string
          segment_name?: string
          source_type?: string
          tier?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_package_segments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "data_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      data_package_subscriptions: {
        Row: {
          contract_signed_at: string | null
          contract_url: string | null
          contracted_records: number | null
          cpm_rate_usd: number | null
          created_at: string
          expires_at: string | null
          flat_price_usd: number | null
          id: string
          last_invoice_at: string | null
          max_records_per_query: number
          metadata: Json
          monthly_fee_usd: number | null
          notes: string | null
          package_id: string
          partner_id: string
          records_delivered: number
          starts_at: string
          status: string
          tier: string
          total_billed_usd: number
          updated_at: string
        }
        Insert: {
          contract_signed_at?: string | null
          contract_url?: string | null
          contracted_records?: number | null
          cpm_rate_usd?: number | null
          created_at?: string
          expires_at?: string | null
          flat_price_usd?: number | null
          id?: string
          last_invoice_at?: string | null
          max_records_per_query?: number
          metadata?: Json
          monthly_fee_usd?: number | null
          notes?: string | null
          package_id: string
          partner_id: string
          records_delivered?: number
          starts_at?: string
          status?: string
          tier?: string
          total_billed_usd?: number
          updated_at?: string
        }
        Update: {
          contract_signed_at?: string | null
          contract_url?: string | null
          contracted_records?: number | null
          cpm_rate_usd?: number | null
          created_at?: string
          expires_at?: string | null
          flat_price_usd?: number | null
          id?: string
          last_invoice_at?: string | null
          max_records_per_query?: number
          metadata?: Json
          monthly_fee_usd?: number | null
          notes?: string | null
          package_id?: string
          partner_id?: string
          records_delivered?: number
          starts_at?: string
          status?: string
          tier?: string
          total_billed_usd?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "data_package_subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "data_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_package_subscriptions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "api_partners"
            referencedColumns: ["id"]
          },
        ]
      }
      data_packages: {
        Row: {
          category: string
          cookie_free: boolean
          cpm_usd: number | null
          created_at: string
          description: string | null
          estimated_universe_size: number | null
          flat_price_usd: number | null
          iab_taxonomy_id: string | null
          iab_taxonomy_version: string | null
          id: string
          legal_basis: string
          metadata: Json
          min_k_anonymity: number
          monthly_subscription_usd: number | null
          name: string
          pricing_model: string
          provider_domain: string
          provider_name: string
          recency_days: number
          refresh_cadence: string
          requires_consent: boolean
          slug: string
          source_type: string
          status: string
          updated_at: string
        }
        Insert: {
          category: string
          cookie_free?: boolean
          cpm_usd?: number | null
          created_at?: string
          description?: string | null
          estimated_universe_size?: number | null
          flat_price_usd?: number | null
          iab_taxonomy_id?: string | null
          iab_taxonomy_version?: string | null
          id?: string
          legal_basis?: string
          metadata?: Json
          min_k_anonymity?: number
          monthly_subscription_usd?: number | null
          name: string
          pricing_model?: string
          provider_domain?: string
          provider_name?: string
          recency_days?: number
          refresh_cadence?: string
          requires_consent?: boolean
          slug: string
          source_type?: string
          status?: string
          updated_at?: string
        }
        Update: {
          category?: string
          cookie_free?: boolean
          cpm_usd?: number | null
          created_at?: string
          description?: string | null
          estimated_universe_size?: number | null
          flat_price_usd?: number | null
          iab_taxonomy_id?: string | null
          iab_taxonomy_version?: string | null
          id?: string
          legal_basis?: string
          metadata?: Json
          min_k_anonymity?: number
          monthly_subscription_usd?: number | null
          name?: string
          pricing_model?: string
          provider_domain?: string
          provider_name?: string
          recency_days?: number
          refresh_cadence?: string
          requires_consent?: boolean
          slug?: string
          source_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
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
      e2e_identity_keys: {
        Row: {
          algorithm: string
          created_at: string
          device_id: string
          id: string
          identity_key_public: string
          one_time_prekeys: Json
          rotated_at: string | null
          signed_prekey_public: string
          signed_prekey_signature: string
          user_id: string | null
        }
        Insert: {
          algorithm?: string
          created_at?: string
          device_id: string
          id?: string
          identity_key_public: string
          one_time_prekeys?: Json
          rotated_at?: string | null
          signed_prekey_public: string
          signed_prekey_signature: string
          user_id?: string | null
        }
        Update: {
          algorithm?: string
          created_at?: string
          device_id?: string
          id?: string
          identity_key_public?: string
          one_time_prekeys?: Json
          rotated_at?: string | null
          signed_prekey_public?: string
          signed_prekey_signature?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expense_audit_log: {
        Row: {
          action: string
          after_state: Json | null
          before_state: Json | null
          created_at: string
          device_id: string
          expense_id: string | null
          id: string
          metadata: Json
          user_id: string | null
        }
        Insert: {
          action: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          device_id: string
          expense_id?: string | null
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Update: {
          action?: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          device_id?: string
          expense_id?: string | null
          id?: string
          metadata?: Json
          user_id?: string | null
        }
        Relationships: []
      }
      expense_receipts: {
        Row: {
          created_at: string
          device_id: string
          expense_id: string | null
          file_size_bytes: number | null
          id: string
          mime_type: string
          ocr_completed_at: string | null
          ocr_confidence: number | null
          ocr_extracted: Json | null
          ocr_model: string | null
          ocr_raw: Json | null
          ocr_status: string
          sha256: string | null
          storage_path: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id: string
          expense_id?: string | null
          file_size_bytes?: number | null
          id?: string
          mime_type?: string
          ocr_completed_at?: string | null
          ocr_confidence?: number | null
          ocr_extracted?: Json | null
          ocr_model?: string | null
          ocr_raw?: Json | null
          ocr_status?: string
          sha256?: string | null
          storage_path: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string
          expense_id?: string | null
          file_size_bytes?: number | null
          id?: string
          mime_type?: string
          ocr_completed_at?: string | null
          ocr_confidence?: number | null
          ocr_extracted?: Json | null
          ocr_model?: string | null
          ocr_raw?: Json | null
          ocr_status?: string
          sha256?: string | null
          storage_path?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_receipts_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "expenses"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_terms_acceptance: {
        Row: {
          accepted_at: string
          device_id: string
          id: string
          ip_address: string | null
          terms_version: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          accepted_at?: string
          device_id: string
          id?: string
          ip_address?: string | null
          terms_version: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          accepted_at?: string
          device_id?: string
          id?: string
          ip_address?: string | null
          terms_version?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      expense_trips: {
        Row: {
          business_percentage: number
          countries: string[]
          created_at: string
          device_id: string
          end_date: string
          id: string
          notes: string | null
          per_diem_country_code: string | null
          per_diem_mode: boolean
          primary_country_code: string | null
          purpose: string
          start_date: string
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_percentage?: number
          countries?: string[]
          created_at?: string
          device_id: string
          end_date: string
          id?: string
          notes?: string | null
          per_diem_country_code?: string | null
          per_diem_mode?: boolean
          primary_country_code?: string | null
          purpose?: string
          start_date: string
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_percentage?: number
          countries?: string[]
          created_at?: string
          device_id?: string
          end_date?: string
          id?: string
          notes?: string | null
          per_diem_country_code?: string | null
          per_diem_mode?: boolean
          primary_country_code?: string | null
          purpose?: string
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          amount_home: number | null
          business_percentage: number
          category: string
          created_at: string
          currency: string
          description: string
          device_id: string
          expense_date: string
          fx_rate: number | null
          fx_rate_date: string | null
          fx_source: string | null
          home_currency: string | null
          id: string
          is_business: boolean
          metadata: Json
          payment_method: string | null
          receipt_id: string | null
          reclaim_status: string
          source: string
          source_ref: string | null
          status: string
          supplier_vat_id: string | null
          tags: string[]
          trip_id: string | null
          updated_at: string
          user_id: string | null
          vat_amount: number
          vat_rate: number | null
          vat_reclaim_pct: number
          vat_reclaimable: boolean
          vendor: string | null
          vendor_country_code: string | null
        }
        Insert: {
          amount: number
          amount_home?: number | null
          business_percentage?: number
          category?: string
          created_at?: string
          currency?: string
          description?: string
          device_id: string
          expense_date: string
          fx_rate?: number | null
          fx_rate_date?: string | null
          fx_source?: string | null
          home_currency?: string | null
          id?: string
          is_business?: boolean
          metadata?: Json
          payment_method?: string | null
          receipt_id?: string | null
          reclaim_status?: string
          source?: string
          source_ref?: string | null
          status?: string
          supplier_vat_id?: string | null
          tags?: string[]
          trip_id?: string | null
          updated_at?: string
          user_id?: string | null
          vat_amount?: number
          vat_rate?: number | null
          vat_reclaim_pct?: number
          vat_reclaimable?: boolean
          vendor?: string | null
          vendor_country_code?: string | null
        }
        Update: {
          amount?: number
          amount_home?: number | null
          business_percentage?: number
          category?: string
          created_at?: string
          currency?: string
          description?: string
          device_id?: string
          expense_date?: string
          fx_rate?: number | null
          fx_rate_date?: string | null
          fx_source?: string | null
          home_currency?: string | null
          id?: string
          is_business?: boolean
          metadata?: Json
          payment_method?: string | null
          receipt_id?: string | null
          reclaim_status?: string
          source?: string
          source_ref?: string | null
          status?: string
          supplier_vat_id?: string | null
          tags?: string[]
          trip_id?: string | null
          updated_at?: string
          user_id?: string | null
          vat_amount?: number
          vat_rate?: number | null
          vat_reclaim_pct?: number
          vat_reclaimable?: boolean
          vendor?: string | null
          vendor_country_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "expense_trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_expenses_receipt"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "expense_receipts"
            referencedColumns: ["id"]
          },
        ]
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
      mileage_rates_official: {
        Row: {
          country_code: string
          currency: string
          fetched_at: string
          id: string
          rate_per_km: number | null
          rate_per_mile: number | null
          source: string
          source_url: string
          vehicle_type: string
          year: number
        }
        Insert: {
          country_code: string
          currency: string
          fetched_at?: string
          id?: string
          rate_per_km?: number | null
          rate_per_mile?: number | null
          source: string
          source_url: string
          vehicle_type?: string
          year: number
        }
        Update: {
          country_code?: string
          currency?: string
          fetched_at?: string
          id?: string
          rate_per_km?: number | null
          rate_per_mile?: number | null
          source?: string
          source_url?: string
          vehicle_type?: string
          year?: number
        }
        Relationships: []
      }
      oauth_connections: {
        Row: {
          access_token_expires_at: string | null
          created_at: string
          encrypted_refresh_token: string | null
          encryption_version: number
          id: string
          last_synced_at: string | null
          lookback_days: number
          provider: string
          provider_email: string | null
          refresh_token: string | null
          scope: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token_expires_at?: string | null
          created_at?: string
          encrypted_refresh_token?: string | null
          encryption_version?: number
          id?: string
          last_synced_at?: string | null
          lookback_days?: number
          provider: string
          provider_email?: string | null
          refresh_token?: string | null
          scope?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token_expires_at?: string | null
          created_at?: string
          encrypted_refresh_token?: string | null
          encryption_version?: number
          id?: string
          last_synced_at?: string | null
          lookback_days?: number
          provider?: string
          provider_email?: string | null
          refresh_token?: string | null
          scope?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          department: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          organization_id: string
          role: string
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          department?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          organization_id: string
          role?: string
          status?: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          department?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          organization_id?: string
          role?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          cost_center: string | null
          department: string | null
          employee_id: string | null
          id: string
          invited_by: string | null
          is_active: boolean
          job_title: string | null
          joined_at: string
          metadata: Json
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          cost_center?: string | null
          department?: string | null
          employee_id?: string | null
          id?: string
          invited_by?: string | null
          is_active?: boolean
          job_title?: string | null
          joined_at?: string
          metadata?: Json
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          cost_center?: string | null
          department?: string | null
          employee_id?: string | null
          id?: string
          invited_by?: string | null
          is_active?: boolean
          job_title?: string | null
          joined_at?: string
          metadata?: Json
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations_public"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          billing_currency: string
          billing_email: string
          billing_method: string
          country_code: string | null
          created_at: string
          created_by: string
          demo: boolean
          id: string
          industry: string | null
          is_active: boolean
          join_code: string
          legal_name: string | null
          logo_url: string | null
          metadata: Json
          name: string
          size_band: string | null
          slug: string
          tax_id: string | null
          travel_policy: Json
          updated_at: string
        }
        Insert: {
          billing_currency?: string
          billing_email: string
          billing_method?: string
          country_code?: string | null
          created_at?: string
          created_by: string
          demo?: boolean
          id?: string
          industry?: string | null
          is_active?: boolean
          join_code: string
          legal_name?: string | null
          logo_url?: string | null
          metadata?: Json
          name: string
          size_band?: string | null
          slug: string
          tax_id?: string | null
          travel_policy?: Json
          updated_at?: string
        }
        Update: {
          billing_currency?: string
          billing_email?: string
          billing_method?: string
          country_code?: string | null
          created_at?: string
          created_by?: string
          demo?: boolean
          id?: string
          industry?: string | null
          is_active?: boolean
          join_code?: string
          legal_name?: string | null
          logo_url?: string | null
          metadata?: Json
          name?: string
          size_band?: string | null
          slug?: string
          tax_id?: string | null
          travel_policy?: Json
          updated_at?: string
        }
        Relationships: []
      }
      package_delivery_jobs: {
        Row: {
          consent_verified_count: number
          cost_usd: number
          cpm_used: number | null
          created_at: string
          fields_requested: string[]
          id: string
          ip_address: string | null
          job_type: string
          k_anonymity_passed: boolean
          k_anonymity_value: number | null
          latency_ms: number | null
          package_id: string
          partner_id: string
          records_delivered: number
          rejection_reason: string | null
          request_params: Json
          segments_requested: string[]
          status: string
          subscription_id: string | null
        }
        Insert: {
          consent_verified_count?: number
          cost_usd?: number
          cpm_used?: number | null
          created_at?: string
          fields_requested?: string[]
          id?: string
          ip_address?: string | null
          job_type: string
          k_anonymity_passed?: boolean
          k_anonymity_value?: number | null
          latency_ms?: number | null
          package_id: string
          partner_id: string
          records_delivered?: number
          rejection_reason?: string | null
          request_params?: Json
          segments_requested?: string[]
          status?: string
          subscription_id?: string | null
        }
        Update: {
          consent_verified_count?: number
          cost_usd?: number
          cpm_used?: number | null
          created_at?: string
          fields_requested?: string[]
          id?: string
          ip_address?: string | null
          job_type?: string
          k_anonymity_passed?: boolean
          k_anonymity_value?: number | null
          latency_ms?: number | null
          package_id?: string
          partner_id?: string
          records_delivered?: number
          rejection_reason?: string | null
          request_params?: Json
          segments_requested?: string[]
          status?: string
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "package_delivery_jobs_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "data_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_delivery_jobs_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "api_partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_delivery_jobs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "data_package_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      per_diem_rates: {
        Row: {
          city: string | null
          country_code: string
          country_name: string
          currency: string
          daily_total: number | null
          effective_from: string
          effective_to: string | null
          fetched_at: string
          id: string
          incidentals_rate: number
          lodging_rate: number
          meals_rate: number
          notes: string | null
          region: string | null
          source: string
          source_url: string
          year: number
        }
        Insert: {
          city?: string | null
          country_code: string
          country_name: string
          currency?: string
          daily_total?: number | null
          effective_from: string
          effective_to?: string | null
          fetched_at?: string
          id?: string
          incidentals_rate?: number
          lodging_rate?: number
          meals_rate?: number
          notes?: string | null
          region?: string | null
          source: string
          source_url: string
          year: number
        }
        Update: {
          city?: string | null
          country_code?: string
          country_name?: string
          currency?: string
          daily_total?: number | null
          effective_from?: string
          effective_to?: string | null
          fetched_at?: string
          id?: string
          incidentals_rate?: number
          lodging_rate?: number
          meals_rate?: number
          notes?: string | null
          region?: string | null
          source?: string
          source_url?: string
          year?: number
        }
        Relationships: []
      }
      production_resilience_checks: {
        Row: {
          backup_region: string | null
          check_key: string
          check_type: string
          created_at: string
          environment: string
          evidence: Json
          id: string
          last_checked_at: string | null
          next_due_at: string | null
          notes: string | null
          owner_role: string
          primary_region: string | null
          provider: string
          runbook_url: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          backup_region?: string | null
          check_key: string
          check_type: string
          created_at?: string
          environment?: string
          evidence?: Json
          id?: string
          last_checked_at?: string | null
          next_due_at?: string | null
          notes?: string | null
          owner_role?: string
          primary_region?: string | null
          provider?: string
          runbook_url?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Update: {
          backup_region?: string | null
          check_key?: string
          check_type?: string
          created_at?: string
          environment?: string
          evidence?: Json
          id?: string
          last_checked_at?: string | null
          next_due_at?: string | null
          notes?: string | null
          owner_role?: string
          primary_region?: string | null
          provider?: string
          runbook_url?: string | null
          severity?: string
          status?: string
          updated_at?: string
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
      source_audit_log: {
        Row: {
          actor_id: string | null
          actor_role: string | null
          created_at: string
          details: Json
          event_type: string
          id: string
          proposal_id: string | null
          source_id: string | null
        }
        Insert: {
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          details?: Json
          event_type: string
          id?: string
          proposal_id?: string | null
          source_id?: string | null
        }
        Update: {
          actor_id?: string | null
          actor_role?: string | null
          created_at?: string
          details?: Json
          event_type?: string
          id?: string
          proposal_id?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "source_audit_log_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "change_proposals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_audit_log_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "verified_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      source_snapshots: {
        Row: {
          content_hash: string
          content_length: number
          content_markdown: string | null
          http_status: number | null
          id: string
          metadata: Json
          scrape_latency_ms: number | null
          scraped_at: string
          source_id: string
          tls_valid: boolean | null
        }
        Insert: {
          content_hash: string
          content_length?: number
          content_markdown?: string | null
          http_status?: number | null
          id?: string
          metadata?: Json
          scrape_latency_ms?: number | null
          scraped_at?: string
          source_id: string
          tls_valid?: boolean | null
        }
        Update: {
          content_hash?: string
          content_length?: number
          content_markdown?: string | null
          http_status?: number | null
          id?: string
          metadata?: Json
          scrape_latency_ms?: number | null
          scraped_at?: string
          source_id?: string
          tls_valid?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "source_snapshots_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "verified_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_role: string | null
          after_state: Json | null
          before_state: Json | null
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json
          target_id: string | null
          target_type: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_role?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_role?: string | null
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      staff_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          metadata: Json
          role: Database["public"]["Enums"]["app_role"]
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          metadata?: Json
          role: Database["public"]["Enums"]["app_role"]
          status?: string
          token?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          metadata?: Json
          role?: Database["public"]["Enums"]["app_role"]
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_ticket_messages: {
        Row: {
          attachments: Json
          author_id: string | null
          author_role: string
          body: string
          created_at: string
          id: string
          is_internal: boolean
          ticket_id: string
        }
        Insert: {
          attachments?: Json
          author_id?: string | null
          author_role?: string
          body: string
          created_at?: string
          id?: string
          is_internal?: boolean
          ticket_id: string
        }
        Update: {
          attachments?: Json
          author_id?: string | null
          author_role?: string
          body?: string
          created_at?: string
          id?: string
          is_internal?: boolean
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          closed_at: string | null
          created_at: string
          description: string
          device_id: string | null
          id: string
          metadata: Json
          priority: string
          requester_email: string | null
          requester_name: string | null
          resolved_at: string | null
          satisfaction_rating: number | null
          source: string
          status: string
          subject: string
          tags: string[]
          ticket_number: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string
          closed_at?: string | null
          created_at?: string
          description: string
          device_id?: string | null
          id?: string
          metadata?: Json
          priority?: string
          requester_email?: string | null
          requester_name?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          source?: string
          status?: string
          subject: string
          tags?: string[]
          ticket_number?: never
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string
          closed_at?: string | null
          created_at?: string
          description?: string
          device_id?: string | null
          id?: string
          metadata?: Json
          priority?: string
          requester_email?: string | null
          requester_name?: string | null
          resolved_at?: string | null
          satisfaction_rating?: number | null
          source?: string
          status?: string
          subject?: string
          tags?: string[]
          ticket_number?: never
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
      vat_reclaim_rules: {
        Row: {
          business_only: boolean
          category: string
          conditions: string | null
          country_code: string
          country_name: string
          fetched_at: string
          id: string
          reclaim_pct: number
          source: string
          source_url: string
          standard_vat_rate: number
        }
        Insert: {
          business_only?: boolean
          category: string
          conditions?: string | null
          country_code: string
          country_name: string
          fetched_at?: string
          id?: string
          reclaim_pct?: number
          source: string
          source_url: string
          standard_vat_rate?: number
        }
        Update: {
          business_only?: boolean
          category?: string
          conditions?: string | null
          country_code?: string
          country_name?: string
          fetched_at?: string
          id?: string
          reclaim_pct?: number
          source?: string
          source_url?: string
          standard_vat_rate?: number
        }
        Relationships: []
      }
      venue_discovery_runs: {
        Row: {
          candidates_evaluated: number
          cities_processed: number
          duration_ms: number | null
          errors: Json
          finished_at: string | null
          id: string
          started_at: string
          status: string
          trigger_source: string
          venues_added: number
          venues_updated: number
        }
        Insert: {
          candidates_evaluated?: number
          cities_processed?: number
          duration_ms?: number | null
          errors?: Json
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: string
          trigger_source?: string
          venues_added?: number
          venues_updated?: number
        }
        Update: {
          candidates_evaluated?: number
          cities_processed?: number
          duration_ms?: number | null
          errors?: Json
          finished_at?: string | null
          id?: string
          started_at?: string
          status?: string
          trigger_source?: string
          venues_added?: number
          venues_updated?: number
        }
        Relationships: []
      }
      verified_sources: {
        Row: {
          category: string
          consecutive_failures: number
          country_code: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_name: string
          domain: string
          id: string
          is_active: boolean
          last_error: string | null
          last_scraped_at: string | null
          last_status: string | null
          metadata: Json
          refresh_cadence_hours: number
          risk_policy: string
          source_type: string
          target_feature_id: string | null
          tls_required: boolean
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          consecutive_failures?: number
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name: string
          domain: string
          id?: string
          is_active?: boolean
          last_error?: string | null
          last_scraped_at?: string | null
          last_status?: string | null
          metadata?: Json
          refresh_cadence_hours?: number
          risk_policy?: string
          source_type: string
          target_feature_id?: string | null
          tls_required?: boolean
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          consecutive_failures?: number
          country_code?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_name?: string
          domain?: string
          id?: string
          is_active?: boolean
          last_error?: string | null
          last_scraped_at?: string | null
          last_status?: string | null
          metadata?: Json
          refresh_cadence_hours?: number
          risk_policy?: string
          source_type?: string
          target_feature_id?: string | null
          tls_required?: boolean
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      affiliate_referral_clicks_safe: {
        Row: {
          affiliate_id: string | null
          click_id: string | null
          converted: boolean | null
          converted_at: string | null
          country_code: string | null
          created_at: string | null
          expires_at: string | null
          id: string | null
          landing_path: string | null
          referral_code: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          affiliate_id?: string | null
          click_id?: string | null
          converted?: boolean | null
          converted_at?: string | null
          country_code?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          landing_path?: string | null
          referral_code?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          affiliate_id?: string | null
          click_id?: string | null
          converted?: boolean | null
          converted_at?: string | null
          country_code?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string | null
          landing_path?: string | null
          referral_code?: string | null
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
      ai_transparency_audit_view: {
        Row: {
          audit_schema_version: number | null
          completed_at: string | null
          confidence_status: string | null
          created_at: string | null
          data_sources: Json | null
          error: string | null
          escalation_reason: string | null
          escalation_type: string | null
          estimated_cost_usd: number | null
          function_name: string | null
          human_approval_actor: string | null
          human_approval_at: string | null
          human_approval_state: string | null
          id: string | null
          immutable_locked: boolean | null
          input_tokens: number | null
          latency_ms: number | null
          model: string | null
          output_tokens: number | null
          primary_agent: string | null
          proof_hash: string | null
          request_category: string | null
          response_excerpt: string | null
          retention_until: string | null
          route: string | null
          run_ref: string | null
          status: string | null
          surface: string | null
          tools_actions: Json | null
          verification_note: string | null
        }
        Insert: {
          audit_schema_version?: number | null
          completed_at?: string | null
          confidence_status?: string | null
          created_at?: string | null
          data_sources?: Json | null
          error?: string | null
          escalation_reason?: string | null
          escalation_type?: string | null
          estimated_cost_usd?: number | null
          function_name?: string | null
          human_approval_actor?: string | null
          human_approval_at?: string | null
          human_approval_state?: string | null
          id?: string | null
          immutable_locked?: boolean | null
          input_tokens?: number | null
          latency_ms?: number | null
          model?: string | null
          output_tokens?: number | null
          primary_agent?: string | null
          proof_hash?: string | null
          request_category?: string | null
          response_excerpt?: string | null
          retention_until?: string | null
          route?: string | null
          run_ref?: string | null
          status?: string | null
          surface?: string | null
          tools_actions?: Json | null
          verification_note?: string | null
        }
        Update: {
          audit_schema_version?: number | null
          completed_at?: string | null
          confidence_status?: string | null
          created_at?: string | null
          data_sources?: Json | null
          error?: string | null
          escalation_reason?: string | null
          escalation_type?: string | null
          estimated_cost_usd?: number | null
          function_name?: string | null
          human_approval_actor?: string | null
          human_approval_at?: string | null
          human_approval_state?: string | null
          id?: string | null
          immutable_locked?: boolean | null
          input_tokens?: number | null
          latency_ms?: number | null
          model?: string | null
          output_tokens?: number | null
          primary_agent?: string | null
          proof_hash?: string | null
          request_category?: string | null
          response_excerpt?: string | null
          retention_until?: string | null
          route?: string | null
          run_ref?: string | null
          status?: string | null
          surface?: string | null
          tools_actions?: Json | null
          verification_note?: string | null
        }
        Relationships: []
      }
      oauth_connections_safe: {
        Row: {
          access_token_expires_at: string | null
          created_at: string | null
          has_refresh_token: boolean | null
          id: string | null
          last_synced_at: string | null
          lookback_days: number | null
          provider: string | null
          provider_email: string | null
          scope: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token_expires_at?: string | null
          created_at?: string | null
          has_refresh_token?: never
          id?: string | null
          last_synced_at?: string | null
          lookback_days?: number | null
          provider?: string | null
          provider_email?: string | null
          scope?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token_expires_at?: string | null
          created_at?: string | null
          has_refresh_token?: never
          id?: string | null
          last_synced_at?: string | null
          lookback_days?: number | null
          provider?: string | null
          provider_email?: string | null
          scope?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      organizations_public: {
        Row: {
          created_at: string | null
          demo: boolean | null
          id: string | null
          logo_url: string | null
          name: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          demo?: boolean | null
          id?: string | null
          logo_url?: string | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          demo?: boolean | null
          id?: string | null
          logo_url?: string | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
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
      check_package_access: {
        Args: { p_package_slug: string; p_partner_id: string }
        Returns: Json
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
      decide_admin_ai_ceo_suggestion: {
        Args: {
          p_decision_note?: string
          p_status: string
          p_suggestion_id: string
        }
        Returns: {
          category: string
          confidence: number
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          evidence: Json
          expected_impact: string | null
          id: string
          priority: string
          rationale: string
          requires_master_approval: boolean
          source_report_id: string | null
          status: string
          suggested_action: string
          title: string
        }
        SetofOptions: {
          from: "*"
          to: "admin_ai_ceo_suggestions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      decide_opportunity: {
        Args: {
          p_approve: boolean
          p_id: string
          p_note?: string
          p_push_concierge?: boolean
          p_push_sales?: boolean
        }
        Returns: {
          approved_at: string | null
          approved_by: string | null
          category: string
          city: string | null
          concierge_offer: Json
          country: string | null
          created_at: string
          currency: string
          decision_note: string | null
          director: Database["public"]["Enums"]["director_role"]
          end_at: string | null
          est_audience: number | null
          est_ticket_price_max: number | null
          est_ticket_price_min: number | null
          exclusivity_score: number
          expires_at: string | null
          id: string
          metadata: Json
          popularity_score: number
          pushed_to_concierge: boolean
          pushed_to_sales: boolean
          rejected_at: string | null
          rejected_by: string | null
          requires_approval: boolean
          sales_target_segments: Json
          source: string | null
          source_run_id: string | null
          sponsor_packages: Json
          start_at: string | null
          status: string
          summary: string
          tags: string[]
          title: string
          url: string | null
          venue: string | null
          vip_packages: Json
        }
        SetofOptions: {
          from: "*"
          to: "admin_ai_opportunities"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      decide_recommendation: {
        Args: { p_approve: boolean; p_id: string; p_note?: string }
        Returns: {
          confidence: number
          created_at: string
          decided_at: string | null
          decided_by: string | null
          decision_note: string | null
          evidence: Json | null
          expected_impact: string | null
          expires_at: string | null
          id: string
          kind: string
          priority: string
          rationale: string
          requires_approval: boolean
          source_insight_id: string | null
          source_run_id: string | null
          status: string
          suggested_action: string
          target_segment: Json | null
          title: string
        }
        SetofOptions: {
          from: "*"
          to: "admin_ai_recommendations"
          isOneToOne: true
          isSetofReturn: false
        }
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
      expire_stale_ai_action_permissions: { Args: never; Returns: number }
      generate_org_join_code: { Args: never; Returns: string }
      generate_snomad_id: { Args: never; Returns: string }
      get_admin_agent_control_summary: {
        Args: never
        Returns: {
          active_agents: number
          autonomous_agents: number
          computed_at: string
          disabled_agents: number
          failed_runs_24h: number
          high_priority_suggestions: number
          paused_agents: number
          pending_suggestions: number
          recommend_only_agents: number
          reports_today: number
          runs_24h: number
          tokens_24h: number
          total_agents: number
        }[]
      }
      get_admin_brain_summary: {
        Args: never
        Returns: {
          critical_insights: number
          last_run_at: string
          last_run_status: string
          open_insights: number
          pending_recommendations: number
          reports_last_30d: number
          urgent_recommendations: number
        }[]
      }
      get_ai_ceo_summary: {
        Args: never
        Returns: {
          active_ceo_agents: number
          critical_suggestions: number
          daily_token_budget: number
          latest_report_at: string
          latest_report_title: string
          locked_permissions: number
          pending_suggestions: number
        }[]
      }
      get_ai_execution_daily: {
        Args: { p_since?: string }
        Returns: {
          avg_latency_ms: number
          day: string
          estimated_cost_usd: number
          failures: number
          runs: number
          tokens: number
        }[]
      }
      get_ai_execution_summary: {
        Args: { p_since?: string }
        Returns: {
          avg_latency_ms: number
          cache_hit_rate: number
          completed_runs: number
          estimated_cost_usd: number
          failed_runs: number
          functions_used: number
          models_used: number
          total_runs: number
          total_tokens: number
          verified_runs: number
        }[]
      }
      get_ai_transparency_summary: {
        Args: { p_since?: string }
        Returns: {
          approved_by_human: number
          denied_by_human: number
          escalated_runs: number
          failed_runs: number
          logged_completed: number
          partially_verified_runs: number
          pending_human_approval: number
          retention_covered: number
          sources_recorded: number
          tools_recorded: number
          total_runs: number
          unverified_runs: number
          verified_runs: number
        }[]
      }
      get_concierge_control_summary: {
        Args: never
        Returns: {
          active_agents: number
          active_rules: number
          last_report_at: string
          paused_agents: number
          pending_suggestions: number
          total_agents: number
          total_daily_token_budget: number
        }[]
      }
      get_directors_ecosystem_summary: {
        Args: never
        Returns: {
          active_opportunities: number
          approved_24h: number
          director: string
          last_run_at: string
          last_run_status: string
          pending_approval: number
          pushed_to_concierge: number
          pushed_to_sales: number
          rejected_24h: number
          total_runs_7d: number
        }[]
      }
      get_directors_summary: { Args: never; Returns: Json }
      get_latest_admin_report: {
        Args: { p_timeframe?: string }
        Returns: {
          concerns: Json
          created_at: string
          executive_summary: string
          generated_by_run_id: string | null
          highlights: Json
          id: string
          kpi_snapshot: Json
          metadata: Json
          narrative: string | null
          period_end: string
          period_start: string
          timeframe: string
          title: string
        }
        SetofOptions: {
          from: "*"
          to: "admin_ai_reports"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_latest_agent_daily_reports: {
        Args: { p_limit?: number }
        Returns: {
          agent_key: string
          created_at: string
          director: Database["public"]["Enums"]["director_role"] | null
          estimated_cost_usd: number
          generated_by_run_id: string | null
          id: string
          issues: Json
          metadata: Json
          metrics: Json
          next_actions: Json
          performance_score: number
          report_date: string
          suggestions: Json
          summary: string
          title: string
          token_usage: number
          wins: Json
        }[]
        SetofOptions: {
          from: "*"
          to: "admin_ai_agent_daily_reports"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_latest_daily_briefing: {
        Args: never
        Returns: {
          briefing_date: string
          concerns: Json
          created_at: string
          director_rollup: Json
          executive_summary: string
          generated_by_run_id: string | null
          highlights: Json
          id: string
          kpi_snapshot: Json
          metadata: Json
          narrative: string | null
          pending_approvals: Json
          title: string
        }
        SetofOptions: {
          from: "*"
          to: "admin_ai_daily_briefings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
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
      get_org_dashboard_stats: { Args: { p_org_id: string }; Returns: Json }
      get_platform_stats: {
        Args: never
        Returns: {
          active_affiliates: number
          active_partners: number
          ai_calls_24h: number
          ai_tokens_30d: number
          b2b_revenue_30d: number
          computed_at: string
          dau_24h: number
          mau_30d: number
          open_tickets: number
          pending_affiliate_payouts: number
          total_users: number
          urgent_tickets: number
        }[]
      }
      get_request_device_id: { Args: never; Returns: string }
      get_source_monitor_summary: {
        Args: never
        Returns: {
          active_sources: number
          approved_24h: number
          auto_applied_24h: number
          high_risk_pending: number
          injection_blocks_24h: number
          last_run_at: string
          pending_proposals: number
          rejected_24h: number
          scrape_errors_24h: number
          total_sources: number
        }[]
      }
      get_sources_due_for_refresh: {
        Args: { p_limit?: number }
        Returns: {
          category: string
          consecutive_failures: number
          country_code: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_name: string
          domain: string
          id: string
          is_active: boolean
          last_error: string | null
          last_scraped_at: string | null
          last_status: string | null
          metadata: Json
          refresh_cadence_hours: number
          risk_policy: string
          source_type: string
          target_feature_id: string | null
          tls_required: boolean
          updated_at: string
          url: string
        }[]
        SetofOptions: {
          from: "*"
          to: "verified_sources"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      has_active_consent: {
        Args: { p_partner_id?: string; p_purpose: string; p_user_id: string }
        Returns: boolean
      }
      has_admin_or_support: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_staff_role: { Args: { _user_id: string }; Returns: boolean }
      has_verified_mfa: { Args: never; Returns: boolean }
      is_demo_mode: { Args: never; Returns: boolean }
      is_org_admin: { Args: { p_org_id: string }; Returns: boolean }
      is_org_approver: { Args: { p_org_id: string }; Returns: boolean }
      is_org_member: { Args: { p_org_id: string }; Returns: boolean }
      is_real_calling_enabled: { Args: never; Returns: boolean }
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
      log_staff_action: {
        Args: {
          p_action: string
          p_after?: Json
          p_before?: Json
          p_metadata?: Json
          p_target_id?: string
          p_target_type?: string
        }
        Returns: string
      }
      migrate_device_to_user: {
        Args: { p_device_id: string; p_user_id: string }
        Returns: Json
      }
      record_admin_ai_agent_run: {
        Args: {
          p_agent_key: string
          p_error?: string
          p_input_tokens?: number
          p_latency_ms?: number
          p_output_tokens?: number
          p_outputs?: Json
          p_scope?: string
          p_signals_scanned?: Json
          p_status: string
          p_suggested_improvements?: Json
          p_trigger: string
        }
        Returns: string
      }
      record_package_delivery: {
        Args: {
          p_consent_verified: number
          p_cost: number
          p_cpm: number
          p_fields: string[]
          p_ip: string
          p_job_type: string
          p_k_passed: boolean
          p_k_value: number
          p_latency_ms: number
          p_package_id: string
          p_partner_id: string
          p_records: number
          p_rejection: string
          p_request_params: Json
          p_segments: string[]
          p_status: string
          p_subscription_id: string
        }
        Returns: string
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
      reverse_affiliate_earnings_for_source: {
        Args: { p_reason?: string; p_source_id: string; p_source_type: string }
        Returns: Json
      }
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
      update_admin_ai_agent_control: {
        Args: {
          p_agent_key: string
          p_automation_level?: string
          p_can_write_to_user_surfaces?: boolean
          p_daily_run_limit?: number
          p_daily_token_budget?: number
          p_disabled_reason?: string
          p_requires_approval?: boolean
          p_status?: string
        }
        Returns: {
          agent_key: string
          agent_type: string
          automation_level: string
          can_write_to_user_surfaces: boolean
          created_at: string
          daily_run_limit: number
          daily_token_budget: number
          description: string
          director: Database["public"]["Enums"]["director_role"] | null
          disabled_reason: string | null
          display_name: string
          escalation_rules: Json
          feature_flags: Json
          id: string
          input_sources: Json
          last_run_at: string | null
          last_run_status: string | null
          metadata: Json
          model_tier: string
          next_run_at: string | null
          output_targets: Json
          owner_role: string
          requires_approval: boolean
          schedule_cron: string | null
          schedule_label: string
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "admin_ai_agent_controls"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_admin_ai_ceo_permission: {
        Args: {
          p_max_daily_actions?: number
          p_metadata?: Json
          p_permission_key: string
          p_requires_master_password?: boolean
          p_status?: string
        }
        Returns: {
          can_affect_costs: boolean
          can_affect_pricing: boolean
          can_affect_user_surfaces: boolean
          decision_area: string
          description: string
          max_daily_actions: number
          metadata: Json
          permission_key: string
          requires_master_password: boolean
          risk_level: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        SetofOptions: {
          from: "*"
          to: "admin_ai_ceo_permissions"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_admin_concierge_rule: {
        Args: {
          p_metadata?: Json
          p_priority?: number
          p_rule_key: string
          p_rule_text?: string
          p_status?: string
        }
        Returns: {
          applies_to: string[]
          category: string
          created_at: string
          metadata: Json
          priority: number
          rule_key: string
          rule_text: string
          status: string
          title: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "admin_concierge_rules"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      user_owns_row: { Args: { row_user_id: string }; Returns: boolean }
      verify_and_consume_ai_action_permission: {
        Args: {
          p_action_fingerprint: string
          p_action_type: string
          p_device_id: string
          p_function_name?: string
          p_user_id: string
        }
        Returns: Json
      }
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
      director_role:
        | "events"
        | "sports"
        | "vip"
        | "affiliate"
        | "loyalty"
        | "sponsorship"
        | "b2b_sales"
        | "pricing"
        | "aviation"
        | "happiness"
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
      director_role: [
        "events",
        "sports",
        "vip",
        "affiliate",
        "loyalty",
        "sponsorship",
        "b2b_sales",
        "pricing",
        "aviation",
        "happiness",
      ],
    },
  },
} as const
