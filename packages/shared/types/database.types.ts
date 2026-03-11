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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_actions: {
        Row: {
          action_type: string
          created_at: string | null
          external_id: string | null
          id: string
          payload: Json | null
          run_id: string | null
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          payload?: Json | null
          run_id?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          payload?: Json | null
          run_id?: string | null
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_actions_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_performance: {
        Row: {
          actions_created: number | null
          agent_id: string | null
          avg_duration_ms: number | null
          avg_tokens_input: number | null
          avg_tokens_output: number | null
          id: string
          period_end: string
          period_start: string
          runs_failed: number | null
          runs_success: number | null
          runs_total: number | null
          total_cost: number | null
        }
        Insert: {
          actions_created?: number | null
          agent_id?: string | null
          avg_duration_ms?: number | null
          avg_tokens_input?: number | null
          avg_tokens_output?: number | null
          id?: string
          period_end: string
          period_start: string
          runs_failed?: number | null
          runs_success?: number | null
          runs_total?: number | null
          total_cost?: number | null
        }
        Update: {
          actions_created?: number | null
          agent_id?: string | null
          avg_duration_ms?: number | null
          avg_tokens_input?: number | null
          avg_tokens_output?: number | null
          id?: string
          period_end?: string
          period_start?: string
          runs_failed?: number | null
          runs_success?: number | null
          runs_total?: number | null
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_performance_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_runs: {
        Row: {
          agent_id: string | null
          agent_name: string
          completed_at: string | null
          cost_cents: number | null
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          input_context: Json | null
          input_data: Json | null
          output_data: Json | null
          started_at: string | null
          status: string | null
          tokens_input: number | null
          tokens_output: number | null
          tokens_used: number | null
          trigger_type: string | null
        }
        Insert: {
          agent_id?: string | null
          agent_name: string
          completed_at?: string | null
          cost_cents?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_context?: Json | null
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          status?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          tokens_used?: number | null
          trigger_type?: string | null
        }
        Update: {
          agent_id?: string | null
          agent_name?: string
          completed_at?: string | null
          cost_cents?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_context?: Json | null
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          status?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          tokens_used?: number | null
          trigger_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string | null
          department: Database["public"]["Enums"]["department"]
          description: string | null
          enabled: boolean | null
          id: string
          input_sources: Json | null
          max_tokens: number | null
          model: string | null
          name: string
          output_actions: Json | null
          schedule: string | null
          slug: string
          system_prompt: string
          updated_at: string | null
          user_prompt_template: string | null
        }
        Insert: {
          created_at?: string | null
          department: Database["public"]["Enums"]["department"]
          description?: string | null
          enabled?: boolean | null
          id?: string
          input_sources?: Json | null
          max_tokens?: number | null
          model?: string | null
          name: string
          output_actions?: Json | null
          schedule?: string | null
          slug: string
          system_prompt: string
          updated_at?: string | null
          user_prompt_template?: string | null
        }
        Update: {
          created_at?: string | null
          department?: Database["public"]["Enums"]["department"]
          description?: string | null
          enabled?: boolean | null
          id?: string
          input_sources?: Json | null
          max_tokens?: number | null
          model?: string | null
          name?: string
          output_actions?: Json | null
          schedule?: string | null
          slug?: string
          system_prompt?: string
          updated_at?: string | null
          user_prompt_template?: string | null
        }
        Relationships: []
      }
      analytics_snapshots: {
        Row: {
          active_ventures: number | null
          agent_cost_24h: number | null
          agent_cost_30d: number | null
          agent_runs_24h: number | null
          agent_runs_failed: number | null
          agent_runs_success: number | null
          content_published_30d: number | null
          content_scheduled: number | null
          conversions_30d: number | null
          created_at: string | null
          emails_action_required: number | null
          emails_received_24h: number | null
          emails_sent_24h: number | null
          id: string
          mrr_growth: number | null
          newsletter_subscribers: number | null
          pipeline_by_stage: Json | null
          pipeline_count: number | null
          relationships_critical: number | null
          relationships_healthy: number | null
          relationships_warning: number | null
          runway_months: number | null
          snapshot_date: string
          total_arr: number | null
          total_monthly_expenses: number | null
          total_mrr: number | null
          total_relationships: number | null
          total_revenue_30d: number | null
        }
        Insert: {
          active_ventures?: number | null
          agent_cost_24h?: number | null
          agent_cost_30d?: number | null
          agent_runs_24h?: number | null
          agent_runs_failed?: number | null
          agent_runs_success?: number | null
          content_published_30d?: number | null
          content_scheduled?: number | null
          conversions_30d?: number | null
          created_at?: string | null
          emails_action_required?: number | null
          emails_received_24h?: number | null
          emails_sent_24h?: number | null
          id?: string
          mrr_growth?: number | null
          newsletter_subscribers?: number | null
          pipeline_by_stage?: Json | null
          pipeline_count?: number | null
          relationships_critical?: number | null
          relationships_healthy?: number | null
          relationships_warning?: number | null
          runway_months?: number | null
          snapshot_date: string
          total_arr?: number | null
          total_monthly_expenses?: number | null
          total_mrr?: number | null
          total_relationships?: number | null
          total_revenue_30d?: number | null
        }
        Update: {
          active_ventures?: number | null
          agent_cost_24h?: number | null
          agent_cost_30d?: number | null
          agent_runs_24h?: number | null
          agent_runs_failed?: number | null
          agent_runs_success?: number | null
          content_published_30d?: number | null
          content_scheduled?: number | null
          conversions_30d?: number | null
          created_at?: string | null
          emails_action_required?: number | null
          emails_received_24h?: number | null
          emails_sent_24h?: number | null
          id?: string
          mrr_growth?: number | null
          newsletter_subscribers?: number | null
          pipeline_by_stage?: Json | null
          pipeline_count?: number | null
          relationships_critical?: number | null
          relationships_healthy?: number | null
          relationships_warning?: number | null
          runway_months?: number | null
          snapshot_date?: string
          total_arr?: number | null
          total_monthly_expenses?: number | null
          total_mrr?: number | null
          total_relationships?: number | null
          total_revenue_30d?: number | null
        }
        Relationships: []
      }
      booking_links: {
        Row: {
          availability_rules: Json | null
          calendar_account_id: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_active: boolean | null
          requires_confirmation: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          availability_rules?: Json | null
          calendar_account_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          requires_confirmation?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          availability_rules?: Json | null
          calendar_account_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_active?: boolean | null
          requires_confirmation?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_links_calendar_account_id_fkey"
            columns: ["calendar_account_id"]
            isOneToOne: false
            referencedRelation: "calendar_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_link_id: string | null
          calendar_account_id: string | null
          calendar_event_id: string | null
          created_at: string | null
          duration_minutes: number
          guest_email: string
          guest_name: string
          guest_notes: string | null
          id: string
          meet_link: string | null
          reminder_1h_sent: boolean | null
          reminder_24h_sent: boolean | null
          scheduled_at: string
          status: string | null
          timezone: string
          updated_at: string | null
        }
        Insert: {
          booking_link_id?: string | null
          calendar_account_id?: string | null
          calendar_event_id?: string | null
          created_at?: string | null
          duration_minutes: number
          guest_email: string
          guest_name: string
          guest_notes?: string | null
          id?: string
          meet_link?: string | null
          reminder_1h_sent?: boolean | null
          reminder_24h_sent?: boolean | null
          scheduled_at: string
          status?: string | null
          timezone: string
          updated_at?: string | null
        }
        Update: {
          booking_link_id?: string | null
          calendar_account_id?: string | null
          calendar_event_id?: string | null
          created_at?: string | null
          duration_minutes?: number
          guest_email?: string
          guest_name?: string
          guest_notes?: string | null
          id?: string
          meet_link?: string | null
          reminder_1h_sent?: boolean | null
          reminder_24h_sent?: boolean | null
          scheduled_at?: string
          status?: string | null
          timezone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_booking_link_id_fkey"
            columns: ["booking_link_id"]
            isOneToOne: false
            referencedRelation: "booking_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_calendar_account_id_fkey"
            columns: ["calendar_account_id"]
            isOneToOne: false
            referencedRelation: "calendar_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_accounts: {
        Row: {
          access_token: string | null
          color: string | null
          created_at: string | null
          display_name: string | null
          email: string
          id: string
          last_sync_at: string | null
          provider: string | null
          refresh_token: string | null
          sync_enabled: boolean | null
          token_expires_at: string | null
        }
        Insert: {
          access_token?: string | null
          color?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          id?: string
          last_sync_at?: string | null
          provider?: string | null
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
        }
        Update: {
          access_token?: string | null
          color?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          id?: string
          last_sync_at?: string | null
          provider?: string | null
          refresh_token?: string | null
          sync_enabled?: boolean | null
          token_expires_at?: string | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          account_id: string | null
          ai_prep_doc_id: string | null
          ai_prep_generated: boolean | null
          all_day: boolean | null
          attendees: Json | null
          created_at: string | null
          description: string | null
          end_at: string
          external_id: string
          google_calendar_id: string | null
          id: string
          is_time_block: boolean | null
          location: string | null
          meeting_link: string | null
          organizer_email: string | null
          recurrence_rule: string | null
          recurring: boolean | null
          start_at: string
          status: string | null
          sub_account_id: string | null
          task_id: string | null
          timezone: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          ai_prep_doc_id?: string | null
          ai_prep_generated?: boolean | null
          all_day?: boolean | null
          attendees?: Json | null
          created_at?: string | null
          description?: string | null
          end_at: string
          external_id: string
          google_calendar_id?: string | null
          id?: string
          is_time_block?: boolean | null
          location?: string | null
          meeting_link?: string | null
          organizer_email?: string | null
          recurrence_rule?: string | null
          recurring?: boolean | null
          start_at: string
          status?: string | null
          sub_account_id?: string | null
          task_id?: string | null
          timezone?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          ai_prep_doc_id?: string | null
          ai_prep_generated?: boolean | null
          all_day?: boolean | null
          attendees?: Json | null
          created_at?: string | null
          description?: string | null
          end_at?: string
          external_id?: string
          google_calendar_id?: string | null
          id?: string
          is_time_block?: boolean | null
          location?: string | null
          meeting_link?: string | null
          organizer_email?: string | null
          recurrence_rule?: string | null
          recurring?: boolean | null
          start_at?: string
          status?: string | null
          sub_account_id?: string | null
          task_id?: string | null
          timezone?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "calendar_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_ai_prep_doc_id_fkey"
            columns: ["ai_prep_doc_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_sub_account_id_fkey"
            columns: ["sub_account_id"]
            isOneToOne: false
            referencedRelation: "calendar_sub_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_sub_accounts: {
        Row: {
          account_id: string | null
          color: string | null
          created_at: string | null
          external_id: string
          id: string
          is_visible: boolean | null
          name: string
        }
        Insert: {
          account_id?: string | null
          color?: string | null
          created_at?: string | null
          external_id: string
          id?: string
          is_visible?: boolean | null
          name: string
        }
        Update: {
          account_id?: string | null
          color?: string | null
          created_at?: string | null
          external_id?: string
          id?: string
          is_visible?: boolean | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sub_accounts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "calendar_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      captures: {
        Row: {
          capture_type: string | null
          content: string
          created_at: string | null
          id: string
          knowledge_id: string | null
          processed: boolean | null
          source_title: string | null
          source_url: string | null
        }
        Insert: {
          capture_type?: string | null
          content: string
          created_at?: string | null
          id?: string
          knowledge_id?: string | null
          processed?: boolean | null
          source_title?: string | null
          source_url?: string | null
        }
        Update: {
          capture_type?: string | null
          content?: string
          created_at?: string | null
          id?: string
          knowledge_id?: string | null
          processed?: boolean | null
          source_title?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "captures_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          agent_id: string | null
          created_at: string | null
          department: string | null
          id: string
          is_archived: boolean | null
          last_message_at: string | null
          message_count: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          department?: string | null
          id?: string
          is_archived?: boolean | null
          last_message_at?: string | null
          message_count?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          cost_cents: number | null
          created_at: string | null
          id: string
          model: string | null
          role: string
          tokens_input: number | null
          tokens_output: number | null
          tool_calls: Json | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          cost_cents?: number | null
          created_at?: string | null
          id?: string
          model?: string | null
          role: string
          tokens_input?: number | null
          tokens_output?: number | null
          tool_calls?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          cost_cents?: number | null
          created_at?: string | null
          id?: string
          model?: string | null
          role?: string
          tokens_input?: number | null
          tokens_output?: number | null
          tool_calls?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      content: {
        Row: {
          agent_run_id: string | null
          body: string | null
          clicks: number | null
          comments: number | null
          created_at: string | null
          excerpt: string | null
          id: string
          knowledge_id: string | null
          likes: number | null
          parent_id: string | null
          platform_id: string | null
          platform_url: string | null
          published_at: string | null
          reading_time: number | null
          scheduled_for: string | null
          shares: number | null
          status: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          venture_id: string | null
          views: number | null
          word_count: number | null
        }
        Insert: {
          agent_run_id?: string | null
          body?: string | null
          clicks?: number | null
          comments?: number | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          knowledge_id?: string | null
          likes?: number | null
          parent_id?: string | null
          platform_id?: string | null
          platform_url?: string | null
          published_at?: string | null
          reading_time?: number | null
          scheduled_for?: string | null
          shares?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          type: string
          updated_at?: string | null
          venture_id?: string | null
          views?: number | null
          word_count?: number | null
        }
        Update: {
          agent_run_id?: string | null
          body?: string | null
          clicks?: number | null
          comments?: number | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          knowledge_id?: string | null
          likes?: number | null
          parent_id?: string | null
          platform_id?: string | null
          platform_url?: string | null
          published_at?: string | null
          reading_time?: number | null
          scheduled_for?: string | null
          shares?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          venture_id?: string | null
          views?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      content_calendar: {
        Row: {
          calendar_date: string
          content_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          time_slot: string | null
        }
        Insert: {
          calendar_date: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          time_slot?: string | null
        }
        Update: {
          calendar_date?: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          time_slot?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_calendar_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      content_queue: {
        Row: {
          agent_run_id: string | null
          content: string
          created_at: string | null
          external_id: string | null
          id: string
          media_urls: string[] | null
          platform: string
          posted_at: string | null
          scheduled_for: string | null
          status: string | null
          venture_id: string | null
        }
        Insert: {
          agent_run_id?: string | null
          content: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          media_urls?: string[] | null
          platform: string
          posted_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          venture_id?: string | null
        }
        Update: {
          agent_run_id?: string | null
          content?: string
          created_at?: string | null
          external_id?: string | null
          id?: string
          media_urls?: string[] | null
          platform?: string
          posted_at?: string | null
          scheduled_for?: string | null
          status?: string | null
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_queue_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_queue_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      content_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          structure: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          structure: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          structure?: string
          type?: string
        }
        Relationships: []
      }
      email_accounts: {
        Row: {
          access_token: string | null
          created_at: string | null
          email: string
          full_sync_completed: boolean | null
          id: string
          last_history_id: string | null
          last_sync_at: string | null
          provider: string | null
          refresh_token: string | null
          sync_enabled: boolean | null
          sync_error: string | null
          sync_status: string | null
          token_expires_at: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          email: string
          full_sync_completed?: boolean | null
          id?: string
          last_history_id?: string | null
          last_sync_at?: string | null
          provider?: string | null
          refresh_token?: string | null
          sync_enabled?: boolean | null
          sync_error?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          email?: string
          full_sync_completed?: boolean | null
          id?: string
          last_history_id?: string | null
          last_sync_at?: string | null
          provider?: string | null
          refresh_token?: string | null
          sync_enabled?: boolean | null
          sync_error?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
        }
        Relationships: []
      }
      email_aliases: {
        Row: {
          account_id: string
          created_at: string | null
          email: string
          id: string
          name: string | null
          source: string
        }
        Insert: {
          account_id: string
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          source?: string
        }
        Update: {
          account_id?: string
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_aliases_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_drafts: {
        Row: {
          account_id: string | null
          agent_run_id: string | null
          body_html: string | null
          body_text: string | null
          cc_emails: string[] | null
          created_at: string | null
          id: string
          is_minimized: boolean | null
          last_auto_saved_at: string | null
          reply_to_email_id: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          to_emails: string[] | null
        }
        Insert: {
          account_id?: string | null
          agent_run_id?: string | null
          body_html?: string | null
          body_text?: string | null
          cc_emails?: string[] | null
          created_at?: string | null
          id?: string
          is_minimized?: boolean | null
          last_auto_saved_at?: string | null
          reply_to_email_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          to_emails?: string[] | null
        }
        Update: {
          account_id?: string | null
          agent_run_id?: string | null
          body_html?: string | null
          body_text?: string | null
          cc_emails?: string[] | null
          created_at?: string | null
          id?: string
          is_minimized?: boolean | null
          last_auto_saved_at?: string | null
          reply_to_email_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          to_emails?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "email_drafts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_drafts_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_drafts_reply_to_email_id_fkey"
            columns: ["reply_to_email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
        ]
      }
      email_label_assignments: {
        Row: {
          assigned_at: string | null
          email_id: string
          label_id: string
        }
        Insert: {
          assigned_at?: string | null
          email_id: string
          label_id: string
        }
        Update: {
          assigned_at?: string | null
          email_id?: string
          label_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_label_assignments_email_id_fkey"
            columns: ["email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_label_assignments_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "email_labels"
            referencedColumns: ["id"]
          },
        ]
      }
      email_labels: {
        Row: {
          account_id: string | null
          color: string | null
          created_at: string | null
          external_id: string | null
          icon: string | null
          id: string
          is_visible: boolean | null
          label_list_visibility: string | null
          message_list_visibility: string | null
          name: string
          sort_order: number | null
          type: string | null
        }
        Insert: {
          account_id?: string | null
          color?: string | null
          created_at?: string | null
          external_id?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label_list_visibility?: string | null
          message_list_visibility?: string | null
          name: string
          sort_order?: number | null
          type?: string | null
        }
        Update: {
          account_id?: string | null
          color?: string | null
          created_at?: string | null
          external_id?: string | null
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          label_list_visibility?: string | null
          message_list_visibility?: string | null
          name?: string
          sort_order?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_labels_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_snippet_defaults: {
        Row: {
          content: string
          id: string
          title: string
          trigger: string
        }
        Insert: {
          content: string
          id?: string
          title: string
          trigger: string
        }
        Update: {
          content?: string
          id?: string
          title?: string
          trigger?: string
        }
        Relationships: []
      }
      email_snippets: {
        Row: {
          content: string
          created_at: string | null
          id: string
          title: string
          trigger: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          title: string
          trigger: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          trigger?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          id: string
          name: string
          subject: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          name: string
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          name?: string
          subject?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      emails: {
        Row: {
          account_id: string | null
          ai_category: string | null
          ai_priority: string | null
          ai_summary: string | null
          attachment_count: number | null
          bcc_emails: string[] | null
          body_html: string | null
          body_text: string | null
          cc_emails: string[] | null
          created_at: string | null
          external_id: string
          folder: string | null
          from_email: string | null
          from_name: string | null
          has_attachments: boolean | null
          id: string
          is_archived: boolean | null
          is_draft: boolean | null
          is_read: boolean | null
          is_spam: boolean | null
          is_starred: boolean | null
          is_trashed: boolean | null
          labels: string[] | null
          received_at: string | null
          relationship_id: string | null
          snippet: string | null
          snoozed_until: string | null
          subject: string | null
          thread_id: string | null
          to_emails: string[] | null
          triage_category: string | null
          triage_confidence: number | null
          triaged_at: string | null
        }
        Insert: {
          account_id?: string | null
          ai_category?: string | null
          ai_priority?: string | null
          ai_summary?: string | null
          attachment_count?: number | null
          bcc_emails?: string[] | null
          body_html?: string | null
          body_text?: string | null
          cc_emails?: string[] | null
          created_at?: string | null
          external_id: string
          folder?: string | null
          from_email?: string | null
          from_name?: string | null
          has_attachments?: boolean | null
          id?: string
          is_archived?: boolean | null
          is_draft?: boolean | null
          is_read?: boolean | null
          is_spam?: boolean | null
          is_starred?: boolean | null
          is_trashed?: boolean | null
          labels?: string[] | null
          received_at?: string | null
          relationship_id?: string | null
          snippet?: string | null
          snoozed_until?: string | null
          subject?: string | null
          thread_id?: string | null
          to_emails?: string[] | null
          triage_category?: string | null
          triage_confidence?: number | null
          triaged_at?: string | null
        }
        Update: {
          account_id?: string | null
          ai_category?: string | null
          ai_priority?: string | null
          ai_summary?: string | null
          attachment_count?: number | null
          bcc_emails?: string[] | null
          body_html?: string | null
          body_text?: string | null
          cc_emails?: string[] | null
          created_at?: string | null
          external_id?: string
          folder?: string | null
          from_email?: string | null
          from_name?: string | null
          has_attachments?: boolean | null
          id?: string
          is_archived?: boolean | null
          is_draft?: boolean | null
          is_read?: boolean | null
          is_spam?: boolean | null
          is_starred?: boolean | null
          is_trashed?: boolean | null
          labels?: string[] | null
          received_at?: string | null
          relationship_id?: string | null
          snippet?: string | null
          snoozed_until?: string | null
          subject?: string | null
          thread_id?: string | null
          to_emails?: string[] | null
          triage_category?: string | null
          triage_confidence?: number | null
          triaged_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_connections: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          provider: string
          venture_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider: string
          venture_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_connections_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount_cents: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          description: string | null
          expense_date: string
          external_id: string | null
          id: string
          is_recurring: boolean | null
          receipt_filename: string | null
          receipt_url: string | null
          source: string | null
          vendor: string
          venture_id: string | null
        }
        Insert: {
          amount_cents: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          description?: string | null
          expense_date: string
          external_id?: string | null
          id?: string
          is_recurring?: boolean | null
          receipt_filename?: string | null
          receipt_url?: string | null
          source?: string | null
          vendor: string
          venture_id?: string | null
        }
        Update: {
          amount_cents?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          description?: string | null
          expense_date?: string
          external_id?: string | null
          id?: string
          is_recurring?: boolean | null
          receipt_filename?: string | null
          receipt_url?: string | null
          source?: string | null
          vendor?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_items: {
        Row: {
          content: string | null
          created_at: string | null
          external_id: string
          id: string
          is_read: boolean | null
          is_saved: boolean | null
          knowledge_id: string | null
          published_at: string | null
          source_id: string | null
          summary: string | null
          title: string
          url: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          external_id: string
          id?: string
          is_read?: boolean | null
          is_saved?: boolean | null
          knowledge_id?: string | null
          published_at?: string | null
          source_id?: string | null
          summary?: string | null
          title: string
          url?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          external_id?: string
          id?: string
          is_read?: boolean | null
          is_saved?: boolean | null
          knowledge_id?: string | null
          published_at?: string | null
          source_id?: string | null
          summary?: string | null
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feed_items_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feed_items_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "feed_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      feed_sources: {
        Row: {
          category: string | null
          created_at: string | null
          enabled: boolean | null
          feed_type: string | null
          id: string
          last_fetched_at: string | null
          name: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          enabled?: boolean | null
          feed_type?: string | null
          id?: string
          last_fetched_at?: string | null
          name: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          enabled?: boolean | null
          feed_type?: string | null
          id?: string
          last_fetched_at?: string | null
          name?: string
          url?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          created_at: string | null
          direction: string | null
          id: string
          occurred_at: string | null
          relationship_id: string | null
          subject: string | null
          summary: string | null
          type: string
          venture_id: string | null
        }
        Insert: {
          created_at?: string | null
          direction?: string | null
          id?: string
          occurred_at?: string | null
          relationship_id?: string | null
          subject?: string | null
          summary?: string | null
          type: string
          venture_id?: string | null
        }
        Update: {
          created_at?: string | null
          direction?: string | null
          id?: string
          occurred_at?: string | null
          relationship_id?: string | null
          subject?: string | null
          summary?: string | null
          type?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_relationship_id_fkey"
            columns: ["relationship_id"]
            isOneToOne: false
            referencedRelation: "relationships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_pinned: boolean | null
          parent_id: string | null
          reading_time: number | null
          slug: string
          source_type: string | null
          source_url: string | null
          summary: string | null
          tags: string[] | null
          title: string
          type: string
          updated_at: string | null
          venture_id: string | null
          venture_id_new: string | null
          word_count: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          parent_id?: string | null
          reading_time?: number | null
          slug: string
          source_type?: string | null
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          type?: string
          updated_at?: string | null
          venture_id?: string | null
          venture_id_new?: string | null
          word_count?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          parent_id?: string | null
          reading_time?: number | null
          slug?: string
          source_type?: string | null
          source_url?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          type?: string
          updated_at?: string | null
          venture_id?: string | null
          venture_id_new?: string | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_venture_id_new_fkey"
            columns: ["venture_id_new"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_tags: {
        Row: {
          knowledge_id: string
          tag_id: string
        }
        Insert: {
          knowledge_id: string
          tag_id: string
        }
        Update: {
          knowledge_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_tags_knowledge_id_fkey"
            columns: ["knowledge_id"]
            isOneToOne: false
            referencedRelation: "knowledge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "knowledge_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_conversations: {
        Row: {
          created_at: string | null
          id: string
          learning_path_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          learning_path_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          learning_path_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_conversations_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_exercises: {
        Row: {
          created_at: string | null
          hints: Json | null
          id: string
          instructions: string | null
          learning_lesson_id: string | null
          solution_code: string | null
          sort_order: number | null
          starter_code: string | null
          test_cases: Json | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hints?: Json | null
          id?: string
          instructions?: string | null
          learning_lesson_id?: string | null
          solution_code?: string | null
          sort_order?: number | null
          starter_code?: string | null
          test_cases?: Json | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hints?: Json | null
          id?: string
          instructions?: string | null
          learning_lesson_id?: string | null
          solution_code?: string | null
          sort_order?: number | null
          starter_code?: string | null
          test_cases?: Json | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_exercises_learning_lesson_id_fkey"
            columns: ["learning_lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_lessons: {
        Row: {
          content: string | null
          created_at: string | null
          estimated_minutes: number | null
          generation_prompt: string | null
          id: string
          is_ai_generated: boolean | null
          learning_module_id: string | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          estimated_minutes?: number | null
          generation_prompt?: string | null
          id?: string
          is_ai_generated?: boolean | null
          learning_module_id?: string | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          estimated_minutes?: number | null
          generation_prompt?: string | null
          id?: string
          is_ai_generated?: boolean | null
          learning_module_id?: string | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_lessons_learning_module_id_fkey"
            columns: ["learning_module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_messages: {
        Row: {
          content: string
          context_files: Json | null
          context_lessons: Json | null
          conversation_id: string | null
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          context_files?: Json | null
          context_lessons?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          context_files?: Json | null
          context_lessons?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "learning_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_modules: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_minutes: number | null
          id: string
          learning_path_id: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          learning_path_id?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          learning_path_id?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_modules_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_paths: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          estimated_hours: number | null
          icon: string | null
          id: string
          is_ai_generated: boolean | null
          is_published: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_hours?: number | null
          icon?: string | null
          id?: string
          is_ai_generated?: boolean | null
          is_published?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_hours?: number | null
          icon?: string | null
          id?: string
          is_ai_generated?: boolean | null
          is_published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          attempts: number | null
          best_score: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          last_submission: string | null
          learning_exercise_id: string | null
          learning_lesson_id: string | null
          learning_module_id: string | null
          learning_path_id: string | null
          status: string | null
          time_spent_seconds: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          best_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_submission?: string | null
          learning_exercise_id?: string | null
          learning_lesson_id?: string | null
          learning_module_id?: string | null
          learning_path_id?: string | null
          status?: string | null
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          best_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_submission?: string | null
          learning_exercise_id?: string | null
          learning_lesson_id?: string | null
          learning_module_id?: string | null
          learning_path_id?: string | null
          status?: string | null
          time_spent_seconds?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "learning_progress_learning_exercise_id_fkey"
            columns: ["learning_exercise_id"]
            isOneToOne: false
            referencedRelation: "learning_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_progress_learning_lesson_id_fkey"
            columns: ["learning_lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_progress_learning_module_id_fkey"
            columns: ["learning_module_id"]
            isOneToOne: false
            referencedRelation: "learning_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_progress_learning_path_id_fkey"
            columns: ["learning_path_id"]
            isOneToOne: false
            referencedRelation: "learning_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          sort_order: number | null
          status: string | null
          target_date: string | null
          title: string
          venture_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          venture_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_sends: {
        Row: {
          clicks: number | null
          content_id: string | null
          created_at: string | null
          id: string
          opens: number | null
          preview_text: string | null
          recipient_count: number | null
          resend_id: string | null
          sent_at: string | null
          status: string | null
          subject: string
          unsubscribes: number | null
        }
        Insert: {
          clicks?: number | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          opens?: number | null
          preview_text?: string | null
          recipient_count?: number | null
          resend_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          unsubscribes?: number | null
        }
        Update: {
          clicks?: number | null
          content_id?: string | null
          created_at?: string | null
          id?: string
          opens?: number | null
          preview_text?: string | null
          recipient_count?: number | null
          resend_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          unsubscribes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sends_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          name: string | null
          source: string | null
          status: string | null
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      pipeline: {
        Row: {
          created_at: string | null
          evaluation_requested_at: string | null
          id: string
          last_evaluation_id: string | null
          name: string
          notes: string | null
          problem_statement: string | null
          score_ai_leverage: number | null
          score_market_size: number | null
          score_operator_insight: number | null
          score_personal_energy: number | null
          score_portfolio_fit: number | null
          score_revenue_speed: number | null
          stage: Database["public"]["Enums"]["pipeline_stage"] | null
          target_market: string | null
          total_score: number | null
          updated_at: string | null
          venture_id: string | null
        }
        Insert: {
          created_at?: string | null
          evaluation_requested_at?: string | null
          id?: string
          last_evaluation_id?: string | null
          name: string
          notes?: string | null
          problem_statement?: string | null
          score_ai_leverage?: number | null
          score_market_size?: number | null
          score_operator_insight?: number | null
          score_personal_energy?: number | null
          score_portfolio_fit?: number | null
          score_revenue_speed?: number | null
          stage?: Database["public"]["Enums"]["pipeline_stage"] | null
          target_market?: string | null
          total_score?: number | null
          updated_at?: string | null
          venture_id?: string | null
        }
        Update: {
          created_at?: string | null
          evaluation_requested_at?: string | null
          id?: string
          last_evaluation_id?: string | null
          name?: string
          notes?: string | null
          problem_statement?: string | null
          score_ai_leverage?: number | null
          score_market_size?: number | null
          score_operator_insight?: number | null
          score_personal_energy?: number | null
          score_portfolio_fit?: number | null
          score_revenue_speed?: number | null
          stage?: Database["public"]["Enums"]["pipeline_stage"] | null
          target_market?: string | null
          total_score?: number | null
          updated_at?: string | null
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_last_evaluation_id_fkey"
            columns: ["last_evaluation_id"]
            isOneToOne: false
            referencedRelation: "pipeline_evaluations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_evaluations: {
        Row: {
          agent_run_id: string | null
          ai_leverage_score: number | null
          competition_score: number | null
          competitor_summary: string | null
          competitors: Json | null
          created_at: string | null
          estimated_monthly_cost: number | null
          estimated_mrr_high: number | null
          estimated_mrr_low: number | null
          estimated_startup_cost: number | null
          estimated_time_to_revenue: string | null
          id: string
          market_analysis: string | null
          market_clarity_score: number | null
          market_size_estimate: string | null
          operational_fit_score: number | null
          personal_energy_score: number | null
          pipeline_id: string | null
          recommendation: string | null
          recommendation_rationale: string | null
          revenue_speed_score: number | null
          risk_factors: string[] | null
          success_factors: string[] | null
          suggested_mvp_scope: string | null
          suggested_next_steps: string[] | null
          total_score: number | null
          web_research: Json | null
        }
        Insert: {
          agent_run_id?: string | null
          ai_leverage_score?: number | null
          competition_score?: number | null
          competitor_summary?: string | null
          competitors?: Json | null
          created_at?: string | null
          estimated_monthly_cost?: number | null
          estimated_mrr_high?: number | null
          estimated_mrr_low?: number | null
          estimated_startup_cost?: number | null
          estimated_time_to_revenue?: string | null
          id?: string
          market_analysis?: string | null
          market_clarity_score?: number | null
          market_size_estimate?: string | null
          operational_fit_score?: number | null
          personal_energy_score?: number | null
          pipeline_id?: string | null
          recommendation?: string | null
          recommendation_rationale?: string | null
          revenue_speed_score?: number | null
          risk_factors?: string[] | null
          success_factors?: string[] | null
          suggested_mvp_scope?: string | null
          suggested_next_steps?: string[] | null
          total_score?: number | null
          web_research?: Json | null
        }
        Update: {
          agent_run_id?: string | null
          ai_leverage_score?: number | null
          competition_score?: number | null
          competitor_summary?: string | null
          competitors?: Json | null
          created_at?: string | null
          estimated_monthly_cost?: number | null
          estimated_mrr_high?: number | null
          estimated_mrr_low?: number | null
          estimated_startup_cost?: number | null
          estimated_time_to_revenue?: string | null
          id?: string
          market_analysis?: string | null
          market_clarity_score?: number | null
          market_size_estimate?: string | null
          operational_fit_score?: number | null
          personal_energy_score?: number | null
          pipeline_id?: string | null
          recommendation?: string | null
          recommendation_rationale?: string | null
          revenue_speed_score?: number | null
          risk_factors?: string[] | null
          success_factors?: string[] | null
          suggested_mvp_scope?: string | null
          suggested_next_steps?: string[] | null
          total_score?: number | null
          web_research?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_evaluations_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_evaluations_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "pipeline"
            referencedColumns: ["id"]
          },
        ]
      }
      quick_actions: {
        Row: {
          action_data: Json | null
          action_type: string
          category: string | null
          created_at: string | null
          description: string | null
          enabled: boolean | null
          icon: string | null
          id: string
          last_used_at: string | null
          name: string
          shortcut: string | null
          usage_count: number | null
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          icon?: string | null
          id?: string
          last_used_at?: string | null
          name: string
          shortcut?: string | null
          usage_count?: number | null
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          enabled?: boolean | null
          icon?: string | null
          id?: string
          last_used_at?: string | null
          name?: string
          shortcut?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      relationships: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          role: string | null
          strength: number | null
          type: Database["public"]["Enums"]["relationship_type"] | null
          updated_at: string | null
          venture_ids: string[] | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          role?: string | null
          strength?: number | null
          type?: Database["public"]["Enums"]["relationship_type"] | null
          updated_at?: string | null
          venture_ids?: string[] | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          role?: string | null
          strength?: number | null
          type?: Database["public"]["Enums"]["relationship_type"] | null
          updated_at?: string | null
          venture_ids?: string[] | null
        }
        Relationships: []
      }
      revenue: {
        Row: {
          amount_cents: number
          client_name: string | null
          created_at: string | null
          description: string | null
          id: string
          period_end: string | null
          period_start: string | null
          recorded_at: string | null
          stripe_connection_id: string | null
          stripe_invoice_id: string | null
          type: Database["public"]["Enums"]["revenue_type"]
          venture_id: string | null
        }
        Insert: {
          amount_cents: number
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          recorded_at?: string | null
          stripe_connection_id?: string | null
          stripe_invoice_id?: string | null
          type: Database["public"]["Enums"]["revenue_type"]
          venture_id?: string | null
        }
        Update: {
          amount_cents?: number
          client_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          period_end?: string | null
          period_start?: string | null
          recorded_at?: string | null
          stripe_connection_id?: string | null
          stripe_invoice_id?: string | null
          type?: Database["public"]["Enums"]["revenue_type"]
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_stripe_connection_id_fkey"
            columns: ["stripe_connection_id"]
            isOneToOne: false
            referencedRelation: "stripe_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      stack_templates: {
        Row: {
          claude_md_template: string | null
          created_at: string | null
          description: string | null
          hooks: Json | null
          id: string
          name: string
          skills: Json | null
          stack_items: Json
          venture_type: string
        }
        Insert: {
          claude_md_template?: string | null
          created_at?: string | null
          description?: string | null
          hooks?: Json | null
          id?: string
          name: string
          skills?: Json | null
          stack_items: Json
          venture_type: string
        }
        Update: {
          claude_md_template?: string | null
          created_at?: string | null
          description?: string | null
          hooks?: Json | null
          id?: string
          name?: string
          skills?: Json | null
          stack_items?: Json
          venture_type?: string
        }
        Relationships: []
      }
      stripe_connections: {
        Row: {
          account_key: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          account_key: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          account_key?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      stripe_product_mappings: {
        Row: {
          created_at: string | null
          id: string
          stripe_connection_id: string | null
          stripe_product_id: string
          venture_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_connection_id?: string | null
          stripe_product_id: string
          venture_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_connection_id?: string | null
          stripe_product_id?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stripe_product_mappings_stripe_connection_id_fkey"
            columns: ["stripe_connection_id"]
            isOneToOne: false
            referencedRelation: "stripe_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stripe_product_mappings_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          milestone_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
          venture_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
          venture_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          milestone_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          converted_milestone_id: string | null
          converted_task_id: string | null
          created_at: string | null
          description: string | null
          external_id: string | null
          id: string
          priority: string | null
          source: string
          status: string | null
          submitter_email: string | null
          submitter_name: string | null
          synced_at: string | null
          title: string
          type: string
          venture_id: string | null
        }
        Insert: {
          converted_milestone_id?: string | null
          converted_task_id?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          priority?: string | null
          source: string
          status?: string | null
          submitter_email?: string | null
          submitter_name?: string | null
          synced_at?: string | null
          title: string
          type: string
          venture_id?: string | null
        }
        Update: {
          converted_milestone_id?: string | null
          converted_task_id?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          id?: string
          priority?: string | null
          source?: string
          status?: string | null
          submitter_email?: string | null
          submitter_name?: string | null
          synced_at?: string | null
          title?: string
          type?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_converted_milestone_id_fkey"
            columns: ["converted_milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_converted_task_id_fkey"
            columns: ["converted_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      time_block_templates: {
        Row: {
          color: string | null
          created_at: string | null
          default_duration: number | null
          id: string
          name: string
          preferred_times: Json | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          default_duration?: number | null
          id?: string
          name: string
          preferred_times?: Json | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          default_duration?: number | null
          id?: string
          name?: string
          preferred_times?: Json | null
        }
        Relationships: []
      }
      venture_connections: {
        Row: {
          config: Json | null
          created_at: string | null
          credentials_key: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          provider: string
          venture_id: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          credentials_key?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider: string
          venture_id?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          credentials_key?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venture_connections_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      venture_docs: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          path: string
          type: string
          updated_at: string | null
          venture_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          path: string
          type: string
          updated_at?: string | null
          venture_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          path?: string
          type?: string
          updated_at?: string | null
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venture_docs_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      venture_links: {
        Row: {
          created_at: string | null
          id: string
          label: string
          type: string | null
          url: string
          venture_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          type?: string | null
          url: string
          venture_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          type?: string | null
          url?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venture_links_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      venture_stack: {
        Row: {
          category: string
          config: Json | null
          created_at: string | null
          dashboard_url: string | null
          docs_url: string | null
          id: string
          secrets_required: string[] | null
          setup_commands: string | null
          tool_name: string
          venture_id: string | null
        }
        Insert: {
          category: string
          config?: Json | null
          created_at?: string | null
          dashboard_url?: string | null
          docs_url?: string | null
          id?: string
          secrets_required?: string[] | null
          setup_commands?: string | null
          tool_name: string
          venture_id?: string | null
        }
        Update: {
          category?: string
          config?: Json | null
          created_at?: string | null
          dashboard_url?: string | null
          docs_url?: string | null
          id?: string
          secrets_required?: string[] | null
          setup_commands?: string | null
          tool_name?: string
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venture_stack_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      ventures: {
        Row: {
          churn_rate: number | null
          created_at: string | null
          customer_count: number | null
          domain: string | null
          health_score: number | null
          id: string
          mrr_cents: number | null
          name: string
          parent_venture_id: string | null
          slug: string
          stage: Database["public"]["Enums"]["venture_stage"] | null
          status: Database["public"]["Enums"]["venture_status"] | null
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          churn_rate?: number | null
          created_at?: string | null
          customer_count?: number | null
          domain?: string | null
          health_score?: number | null
          id?: string
          mrr_cents?: number | null
          name: string
          parent_venture_id?: string | null
          slug: string
          stage?: Database["public"]["Enums"]["venture_stage"] | null
          status?: Database["public"]["Enums"]["venture_status"] | null
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          churn_rate?: number | null
          created_at?: string | null
          customer_count?: number | null
          domain?: string | null
          health_score?: number | null
          id?: string
          mrr_cents?: number | null
          name?: string
          parent_venture_id?: string | null
          slug?: string
          stage?: Database["public"]["Enums"]["venture_stage"] | null
          status?: Database["public"]["Enums"]["venture_status"] | null
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ventures_parent_venture_id_fkey"
            columns: ["parent_venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_action_usage: {
        Args: { action_id: string }
        Returns: undefined
      }
      seed_email_labels_for_account: {
        Args: { p_account_id: string }
        Returns: undefined
      }
      unsnooze_emails: { Args: never; Returns: number }
    }
    Enums: {
      department:
        | "executive"
        | "marketing"
        | "product"
        | "finance"
        | "research"
        | "operations"
        | "education"
      expense_category:
        | "software"
        | "hosting"
        | "ai_usage"
        | "contractor"
        | "hardware"
        | "office"
        | "marketing"
        | "legal"
        | "banking"
        | "travel"
        | "subscriptions"
        | "other"
      pipeline_stage:
        | "idea"
        | "researching"
        | "validating"
        | "speccing"
        | "building"
        | "beta"
        | "launched"
        | "parked"
      relationship_type:
        | "client"
        | "partner"
        | "investor"
        | "advisor"
        | "vendor"
        | "prospect"
        | "friend"
      revenue_type: "recurring" | "one-time" | "retainer" | "project"
      task_priority: "urgent" | "high" | "medium" | "low"
      task_status:
        | "backlog"
        | "todo"
        | "in-progress"
        | "review"
        | "done"
        | "blocked"
      venture_stage:
        | "pre-revenue"
        | "early-revenue"
        | "growing"
        | "profitable"
        | "scaled"
      venture_status:
        | "idea"
        | "validating"
        | "building"
        | "active"
        | "maintenance"
        | "sunset"
        | "sold"
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
      department: [
        "executive",
        "marketing",
        "product",
        "finance",
        "research",
        "operations",
        "education",
      ],
      expense_category: [
        "software",
        "hosting",
        "ai_usage",
        "contractor",
        "hardware",
        "office",
        "marketing",
        "legal",
        "banking",
        "travel",
        "subscriptions",
        "other",
      ],
      pipeline_stage: [
        "idea",
        "researching",
        "validating",
        "speccing",
        "building",
        "beta",
        "launched",
        "parked",
      ],
      relationship_type: [
        "client",
        "partner",
        "investor",
        "advisor",
        "vendor",
        "prospect",
        "friend",
      ],
      revenue_type: ["recurring", "one-time", "retainer", "project"],
      task_priority: ["urgent", "high", "medium", "low"],
      task_status: [
        "backlog",
        "todo",
        "in-progress",
        "review",
        "done",
        "blocked",
      ],
      venture_stage: [
        "pre-revenue",
        "early-revenue",
        "growing",
        "profitable",
        "scaled",
      ],
      venture_status: [
        "idea",
        "validating",
        "building",
        "active",
        "maintenance",
        "sunset",
        "sold",
      ],
    },
  },
} as const
