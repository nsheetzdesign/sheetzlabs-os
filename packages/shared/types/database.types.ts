Using workdir /Users/nick/Documents/Development/sheetz-labs
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
      pipeline: {
        Row: {
          created_at: string | null
          id: string
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
          id?: string
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
          id?: string
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
            foreignKeyName: "pipeline_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
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
          type?: Database["public"]["Enums"]["revenue_type"]
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
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
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
          venture_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
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
      [_ in never]: never
    }
    Enums: {
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
