import type { Database } from "@sheetzlabs/shared";
/**
 * Returns a Supabase client using the service role key, which bypasses RLS.
 *
 * This is safe to use in server-side loaders because:
 * 1. All dashboard routes are already protected by requireAuth in dashboard.tsx
 * 2. This is a single-tenant app — only the authenticated founder accesses data
 * 3. Service role key is never exposed to the client (server-only module)
 */
export declare function getSupabaseClient(env: {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
}): import("@supabase/supabase-js").SupabaseClient<Database, "public", "public", {
    Tables: {
        agent_actions: {
            Row: {
                action_type: string;
                created_at: string | null;
                external_id: string | null;
                id: string;
                payload: import("@sheetzlabs/shared").Json | null;
                run_id: string | null;
                target_id: string | null;
                target_table: string | null;
            };
            Insert: {
                action_type: string;
                created_at?: string | null;
                external_id?: string | null;
                id?: string;
                payload?: import("@sheetzlabs/shared").Json | null;
                run_id?: string | null;
                target_id?: string | null;
                target_table?: string | null;
            };
            Update: {
                action_type?: string;
                created_at?: string | null;
                external_id?: string | null;
                id?: string;
                payload?: import("@sheetzlabs/shared").Json | null;
                run_id?: string | null;
                target_id?: string | null;
                target_table?: string | null;
            };
            Relationships: [{
                foreignKeyName: "agent_actions_run_id_fkey";
                columns: ["run_id"];
                isOneToOne: false;
                referencedRelation: "agent_runs";
                referencedColumns: ["id"];
            }];
        };
        agent_runs: {
            Row: {
                agent_id: string | null;
                agent_name: string;
                completed_at: string | null;
                cost_cents: number | null;
                created_at: string | null;
                duration_ms: number | null;
                error_message: string | null;
                id: string;
                input_context: import("@sheetzlabs/shared").Json | null;
                input_data: import("@sheetzlabs/shared").Json | null;
                output_data: import("@sheetzlabs/shared").Json | null;
                started_at: string | null;
                status: string | null;
                tokens_input: number | null;
                tokens_output: number | null;
                tokens_used: number | null;
                trigger_type: string | null;
            };
            Insert: {
                agent_id?: string | null;
                agent_name: string;
                completed_at?: string | null;
                cost_cents?: number | null;
                created_at?: string | null;
                duration_ms?: number | null;
                error_message?: string | null;
                id?: string;
                input_context?: import("@sheetzlabs/shared").Json | null;
                input_data?: import("@sheetzlabs/shared").Json | null;
                output_data?: import("@sheetzlabs/shared").Json | null;
                started_at?: string | null;
                status?: string | null;
                tokens_input?: number | null;
                tokens_output?: number | null;
                tokens_used?: number | null;
                trigger_type?: string | null;
            };
            Update: {
                agent_id?: string | null;
                agent_name?: string;
                completed_at?: string | null;
                cost_cents?: number | null;
                created_at?: string | null;
                duration_ms?: number | null;
                error_message?: string | null;
                id?: string;
                input_context?: import("@sheetzlabs/shared").Json | null;
                input_data?: import("@sheetzlabs/shared").Json | null;
                output_data?: import("@sheetzlabs/shared").Json | null;
                started_at?: string | null;
                status?: string | null;
                tokens_input?: number | null;
                tokens_output?: number | null;
                tokens_used?: number | null;
                trigger_type?: string | null;
            };
            Relationships: [{
                foreignKeyName: "agent_runs_agent_id_fkey";
                columns: ["agent_id"];
                isOneToOne: false;
                referencedRelation: "agents";
                referencedColumns: ["id"];
            }];
        };
        agents: {
            Row: {
                created_at: string | null;
                department: Database["public"]["Enums"]["department"];
                description: string | null;
                enabled: boolean | null;
                id: string;
                input_sources: import("@sheetzlabs/shared").Json | null;
                max_tokens: number | null;
                model: string | null;
                name: string;
                output_actions: import("@sheetzlabs/shared").Json | null;
                schedule: string | null;
                slug: string;
                system_prompt: string;
                updated_at: string | null;
                user_prompt_template: string | null;
            };
            Insert: {
                created_at?: string | null;
                department: Database["public"]["Enums"]["department"];
                description?: string | null;
                enabled?: boolean | null;
                id?: string;
                input_sources?: import("@sheetzlabs/shared").Json | null;
                max_tokens?: number | null;
                model?: string | null;
                name: string;
                output_actions?: import("@sheetzlabs/shared").Json | null;
                schedule?: string | null;
                slug: string;
                system_prompt: string;
                updated_at?: string | null;
                user_prompt_template?: string | null;
            };
            Update: {
                created_at?: string | null;
                department?: Database["public"]["Enums"]["department"];
                description?: string | null;
                enabled?: boolean | null;
                id?: string;
                input_sources?: import("@sheetzlabs/shared").Json | null;
                max_tokens?: number | null;
                model?: string | null;
                name?: string;
                output_actions?: import("@sheetzlabs/shared").Json | null;
                schedule?: string | null;
                slug?: string;
                system_prompt?: string;
                updated_at?: string | null;
                user_prompt_template?: string | null;
            };
            Relationships: [];
        };
        content_queue: {
            Row: {
                agent_run_id: string | null;
                content: string;
                created_at: string | null;
                external_id: string | null;
                id: string;
                media_urls: string[] | null;
                platform: string;
                posted_at: string | null;
                scheduled_for: string | null;
                status: string | null;
                venture_id: string | null;
            };
            Insert: {
                agent_run_id?: string | null;
                content: string;
                created_at?: string | null;
                external_id?: string | null;
                id?: string;
                media_urls?: string[] | null;
                platform: string;
                posted_at?: string | null;
                scheduled_for?: string | null;
                status?: string | null;
                venture_id?: string | null;
            };
            Update: {
                agent_run_id?: string | null;
                content?: string;
                created_at?: string | null;
                external_id?: string | null;
                id?: string;
                media_urls?: string[] | null;
                platform?: string;
                posted_at?: string | null;
                scheduled_for?: string | null;
                status?: string | null;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "content_queue_agent_run_id_fkey";
                columns: ["agent_run_id"];
                isOneToOne: false;
                referencedRelation: "agent_runs";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "content_queue_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        expense_connections: {
            Row: {
                created_at: string | null;
                id: string;
                is_active: boolean | null;
                last_sync_at: string | null;
                provider: string;
                venture_id: string | null;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                is_active?: boolean | null;
                last_sync_at?: string | null;
                provider: string;
                venture_id?: string | null;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                is_active?: boolean | null;
                last_sync_at?: string | null;
                provider?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "expense_connections_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        expenses: {
            Row: {
                amount_cents: number;
                category: Database["public"]["Enums"]["expense_category"];
                created_at: string | null;
                description: string | null;
                expense_date: string;
                external_id: string | null;
                id: string;
                is_recurring: boolean | null;
                receipt_filename: string | null;
                receipt_url: string | null;
                source: string | null;
                vendor: string;
                venture_id: string | null;
            };
            Insert: {
                amount_cents: number;
                category: Database["public"]["Enums"]["expense_category"];
                created_at?: string | null;
                description?: string | null;
                expense_date: string;
                external_id?: string | null;
                id?: string;
                is_recurring?: boolean | null;
                receipt_filename?: string | null;
                receipt_url?: string | null;
                source?: string | null;
                vendor: string;
                venture_id?: string | null;
            };
            Update: {
                amount_cents?: number;
                category?: Database["public"]["Enums"]["expense_category"];
                created_at?: string | null;
                description?: string | null;
                expense_date?: string;
                external_id?: string | null;
                id?: string;
                is_recurring?: boolean | null;
                receipt_filename?: string | null;
                receipt_url?: string | null;
                source?: string | null;
                vendor?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "expenses_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        interactions: {
            Row: {
                created_at: string | null;
                direction: string | null;
                id: string;
                occurred_at: string | null;
                relationship_id: string | null;
                subject: string | null;
                summary: string | null;
                type: string;
                venture_id: string | null;
            };
            Insert: {
                created_at?: string | null;
                direction?: string | null;
                id?: string;
                occurred_at?: string | null;
                relationship_id?: string | null;
                subject?: string | null;
                summary?: string | null;
                type: string;
                venture_id?: string | null;
            };
            Update: {
                created_at?: string | null;
                direction?: string | null;
                id?: string;
                occurred_at?: string | null;
                relationship_id?: string | null;
                subject?: string | null;
                summary?: string | null;
                type?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "interactions_relationship_id_fkey";
                columns: ["relationship_id"];
                isOneToOne: false;
                referencedRelation: "relationships";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "interactions_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        knowledge: {
            Row: {
                content: string | null;
                created_at: string | null;
                id: string;
                slug: string;
                tags: string[] | null;
                title: string;
                type: string;
                updated_at: string | null;
                venture_id: string | null;
            };
            Insert: {
                content?: string | null;
                created_at?: string | null;
                id?: string;
                slug: string;
                tags?: string[] | null;
                title: string;
                type?: string;
                updated_at?: string | null;
                venture_id?: string | null;
            };
            Update: {
                content?: string | null;
                created_at?: string | null;
                id?: string;
                slug?: string;
                tags?: string[] | null;
                title?: string;
                type?: string;
                updated_at?: string | null;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "knowledge_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        milestones: {
            Row: {
                completed_at: string | null;
                created_at: string | null;
                description: string | null;
                id: string;
                sort_order: number | null;
                status: string | null;
                target_date: string | null;
                title: string;
                venture_id: string | null;
            };
            Insert: {
                completed_at?: string | null;
                created_at?: string | null;
                description?: string | null;
                id?: string;
                sort_order?: number | null;
                status?: string | null;
                target_date?: string | null;
                title: string;
                venture_id?: string | null;
            };
            Update: {
                completed_at?: string | null;
                created_at?: string | null;
                description?: string | null;
                id?: string;
                sort_order?: number | null;
                status?: string | null;
                target_date?: string | null;
                title?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "milestones_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        pipeline: {
            Row: {
                created_at: string | null;
                id: string;
                name: string;
                notes: string | null;
                problem_statement: string | null;
                score_ai_leverage: number | null;
                score_market_size: number | null;
                score_operator_insight: number | null;
                score_personal_energy: number | null;
                score_portfolio_fit: number | null;
                score_revenue_speed: number | null;
                stage: Database["public"]["Enums"]["pipeline_stage"] | null;
                target_market: string | null;
                total_score: number | null;
                updated_at: string | null;
                venture_id: string | null;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                name: string;
                notes?: string | null;
                problem_statement?: string | null;
                score_ai_leverage?: number | null;
                score_market_size?: number | null;
                score_operator_insight?: number | null;
                score_personal_energy?: number | null;
                score_portfolio_fit?: number | null;
                score_revenue_speed?: number | null;
                stage?: Database["public"]["Enums"]["pipeline_stage"] | null;
                target_market?: string | null;
                total_score?: number | null;
                updated_at?: string | null;
                venture_id?: string | null;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                name?: string;
                notes?: string | null;
                problem_statement?: string | null;
                score_ai_leverage?: number | null;
                score_market_size?: number | null;
                score_operator_insight?: number | null;
                score_personal_energy?: number | null;
                score_portfolio_fit?: number | null;
                score_revenue_speed?: number | null;
                stage?: Database["public"]["Enums"]["pipeline_stage"] | null;
                target_market?: string | null;
                total_score?: number | null;
                updated_at?: string | null;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "pipeline_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        relationships: {
            Row: {
                company: string | null;
                created_at: string | null;
                email: string | null;
                id: string;
                last_contact: string | null;
                name: string;
                notes: string | null;
                role: string | null;
                strength: number | null;
                type: Database["public"]["Enums"]["relationship_type"] | null;
                updated_at: string | null;
                venture_ids: string[] | null;
            };
            Insert: {
                company?: string | null;
                created_at?: string | null;
                email?: string | null;
                id?: string;
                last_contact?: string | null;
                name: string;
                notes?: string | null;
                role?: string | null;
                strength?: number | null;
                type?: Database["public"]["Enums"]["relationship_type"] | null;
                updated_at?: string | null;
                venture_ids?: string[] | null;
            };
            Update: {
                company?: string | null;
                created_at?: string | null;
                email?: string | null;
                id?: string;
                last_contact?: string | null;
                name?: string;
                notes?: string | null;
                role?: string | null;
                strength?: number | null;
                type?: Database["public"]["Enums"]["relationship_type"] | null;
                updated_at?: string | null;
                venture_ids?: string[] | null;
            };
            Relationships: [];
        };
        revenue: {
            Row: {
                amount_cents: number;
                client_name: string | null;
                created_at: string | null;
                description: string | null;
                id: string;
                period_end: string | null;
                period_start: string | null;
                recorded_at: string | null;
                stripe_connection_id: string | null;
                stripe_invoice_id: string | null;
                type: Database["public"]["Enums"]["revenue_type"];
                venture_id: string | null;
            };
            Insert: {
                amount_cents: number;
                client_name?: string | null;
                created_at?: string | null;
                description?: string | null;
                id?: string;
                period_end?: string | null;
                period_start?: string | null;
                recorded_at?: string | null;
                stripe_connection_id?: string | null;
                stripe_invoice_id?: string | null;
                type: Database["public"]["Enums"]["revenue_type"];
                venture_id?: string | null;
            };
            Update: {
                amount_cents?: number;
                client_name?: string | null;
                created_at?: string | null;
                description?: string | null;
                id?: string;
                period_end?: string | null;
                period_start?: string | null;
                recorded_at?: string | null;
                stripe_connection_id?: string | null;
                stripe_invoice_id?: string | null;
                type?: Database["public"]["Enums"]["revenue_type"];
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "revenue_stripe_connection_id_fkey";
                columns: ["stripe_connection_id"];
                isOneToOne: false;
                referencedRelation: "stripe_connections";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "revenue_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        stack_templates: {
            Row: {
                claude_md_template: string | null;
                created_at: string | null;
                description: string | null;
                hooks: import("@sheetzlabs/shared").Json | null;
                id: string;
                name: string;
                skills: import("@sheetzlabs/shared").Json | null;
                stack_items: import("@sheetzlabs/shared").Json;
                venture_type: string;
            };
            Insert: {
                claude_md_template?: string | null;
                created_at?: string | null;
                description?: string | null;
                hooks?: import("@sheetzlabs/shared").Json | null;
                id?: string;
                name: string;
                skills?: import("@sheetzlabs/shared").Json | null;
                stack_items: import("@sheetzlabs/shared").Json;
                venture_type: string;
            };
            Update: {
                claude_md_template?: string | null;
                created_at?: string | null;
                description?: string | null;
                hooks?: import("@sheetzlabs/shared").Json | null;
                id?: string;
                name?: string;
                skills?: import("@sheetzlabs/shared").Json | null;
                stack_items?: import("@sheetzlabs/shared").Json;
                venture_type?: string;
            };
            Relationships: [];
        };
        stripe_connections: {
            Row: {
                account_key: string;
                created_at: string | null;
                id: string;
                is_active: boolean | null;
                name: string;
            };
            Insert: {
                account_key: string;
                created_at?: string | null;
                id?: string;
                is_active?: boolean | null;
                name: string;
            };
            Update: {
                account_key?: string;
                created_at?: string | null;
                id?: string;
                is_active?: boolean | null;
                name?: string;
            };
            Relationships: [];
        };
        stripe_product_mappings: {
            Row: {
                created_at: string | null;
                id: string;
                stripe_connection_id: string | null;
                stripe_product_id: string;
                venture_id: string | null;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                stripe_connection_id?: string | null;
                stripe_product_id: string;
                venture_id?: string | null;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                stripe_connection_id?: string | null;
                stripe_product_id?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "stripe_product_mappings_stripe_connection_id_fkey";
                columns: ["stripe_connection_id"];
                isOneToOne: false;
                referencedRelation: "stripe_connections";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "stripe_product_mappings_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        tasks: {
            Row: {
                completed_at: string | null;
                created_at: string | null;
                description: string | null;
                due_date: string | null;
                id: string;
                milestone_id: string | null;
                priority: Database["public"]["Enums"]["task_priority"] | null;
                status: Database["public"]["Enums"]["task_status"] | null;
                title: string;
                updated_at: string | null;
                venture_id: string | null;
            };
            Insert: {
                completed_at?: string | null;
                created_at?: string | null;
                description?: string | null;
                due_date?: string | null;
                id?: string;
                milestone_id?: string | null;
                priority?: Database["public"]["Enums"]["task_priority"] | null;
                status?: Database["public"]["Enums"]["task_status"] | null;
                title: string;
                updated_at?: string | null;
                venture_id?: string | null;
            };
            Update: {
                completed_at?: string | null;
                created_at?: string | null;
                description?: string | null;
                due_date?: string | null;
                id?: string;
                milestone_id?: string | null;
                priority?: Database["public"]["Enums"]["task_priority"] | null;
                status?: Database["public"]["Enums"]["task_status"] | null;
                title?: string;
                updated_at?: string | null;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "tasks_milestone_id_fkey";
                columns: ["milestone_id"];
                isOneToOne: false;
                referencedRelation: "milestones";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "tasks_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        tickets: {
            Row: {
                converted_milestone_id: string | null;
                converted_task_id: string | null;
                created_at: string | null;
                description: string | null;
                external_id: string | null;
                id: string;
                priority: string | null;
                source: string;
                status: string | null;
                submitter_email: string | null;
                submitter_name: string | null;
                synced_at: string | null;
                title: string;
                type: string;
                venture_id: string | null;
            };
            Insert: {
                converted_milestone_id?: string | null;
                converted_task_id?: string | null;
                created_at?: string | null;
                description?: string | null;
                external_id?: string | null;
                id?: string;
                priority?: string | null;
                source: string;
                status?: string | null;
                submitter_email?: string | null;
                submitter_name?: string | null;
                synced_at?: string | null;
                title: string;
                type: string;
                venture_id?: string | null;
            };
            Update: {
                converted_milestone_id?: string | null;
                converted_task_id?: string | null;
                created_at?: string | null;
                description?: string | null;
                external_id?: string | null;
                id?: string;
                priority?: string | null;
                source?: string;
                status?: string | null;
                submitter_email?: string | null;
                submitter_name?: string | null;
                synced_at?: string | null;
                title?: string;
                type?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "tickets_converted_milestone_id_fkey";
                columns: ["converted_milestone_id"];
                isOneToOne: false;
                referencedRelation: "milestones";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "tickets_converted_task_id_fkey";
                columns: ["converted_task_id"];
                isOneToOne: false;
                referencedRelation: "tasks";
                referencedColumns: ["id"];
            }, {
                foreignKeyName: "tickets_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        venture_connections: {
            Row: {
                config: import("@sheetzlabs/shared").Json | null;
                created_at: string | null;
                credentials_key: string | null;
                id: string;
                is_active: boolean | null;
                last_sync_at: string | null;
                provider: string;
                venture_id: string | null;
            };
            Insert: {
                config?: import("@sheetzlabs/shared").Json | null;
                created_at?: string | null;
                credentials_key?: string | null;
                id?: string;
                is_active?: boolean | null;
                last_sync_at?: string | null;
                provider: string;
                venture_id?: string | null;
            };
            Update: {
                config?: import("@sheetzlabs/shared").Json | null;
                created_at?: string | null;
                credentials_key?: string | null;
                id?: string;
                is_active?: boolean | null;
                last_sync_at?: string | null;
                provider?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "venture_connections_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        venture_docs: {
            Row: {
                content: string | null;
                created_at: string | null;
                id: string;
                path: string;
                type: string;
                updated_at: string | null;
                venture_id: string | null;
            };
            Insert: {
                content?: string | null;
                created_at?: string | null;
                id?: string;
                path: string;
                type: string;
                updated_at?: string | null;
                venture_id?: string | null;
            };
            Update: {
                content?: string | null;
                created_at?: string | null;
                id?: string;
                path?: string;
                type?: string;
                updated_at?: string | null;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "venture_docs_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        venture_links: {
            Row: {
                created_at: string | null;
                id: string;
                label: string;
                type: string | null;
                url: string;
                venture_id: string | null;
            };
            Insert: {
                created_at?: string | null;
                id?: string;
                label: string;
                type?: string | null;
                url: string;
                venture_id?: string | null;
            };
            Update: {
                created_at?: string | null;
                id?: string;
                label?: string;
                type?: string | null;
                url?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "venture_links_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        venture_stack: {
            Row: {
                category: string;
                config: import("@sheetzlabs/shared").Json | null;
                created_at: string | null;
                dashboard_url: string | null;
                docs_url: string | null;
                id: string;
                secrets_required: string[] | null;
                setup_commands: string | null;
                tool_name: string;
                venture_id: string | null;
            };
            Insert: {
                category: string;
                config?: import("@sheetzlabs/shared").Json | null;
                created_at?: string | null;
                dashboard_url?: string | null;
                docs_url?: string | null;
                id?: string;
                secrets_required?: string[] | null;
                setup_commands?: string | null;
                tool_name: string;
                venture_id?: string | null;
            };
            Update: {
                category?: string;
                config?: import("@sheetzlabs/shared").Json | null;
                created_at?: string | null;
                dashboard_url?: string | null;
                docs_url?: string | null;
                id?: string;
                secrets_required?: string[] | null;
                setup_commands?: string | null;
                tool_name?: string;
                venture_id?: string | null;
            };
            Relationships: [{
                foreignKeyName: "venture_stack_venture_id_fkey";
                columns: ["venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
        ventures: {
            Row: {
                churn_rate: number | null;
                created_at: string | null;
                customer_count: number | null;
                domain: string | null;
                health_score: number | null;
                id: string;
                mrr_cents: number | null;
                name: string;
                parent_venture_id: string | null;
                slug: string;
                stage: Database["public"]["Enums"]["venture_stage"] | null;
                status: Database["public"]["Enums"]["venture_status"] | null;
                tagline: string | null;
                updated_at: string | null;
            };
            Insert: {
                churn_rate?: number | null;
                created_at?: string | null;
                customer_count?: number | null;
                domain?: string | null;
                health_score?: number | null;
                id?: string;
                mrr_cents?: number | null;
                name: string;
                parent_venture_id?: string | null;
                slug: string;
                stage?: Database["public"]["Enums"]["venture_stage"] | null;
                status?: Database["public"]["Enums"]["venture_status"] | null;
                tagline?: string | null;
                updated_at?: string | null;
            };
            Update: {
                churn_rate?: number | null;
                created_at?: string | null;
                customer_count?: number | null;
                domain?: string | null;
                health_score?: number | null;
                id?: string;
                mrr_cents?: number | null;
                name?: string;
                parent_venture_id?: string | null;
                slug?: string;
                stage?: Database["public"]["Enums"]["venture_stage"] | null;
                status?: Database["public"]["Enums"]["venture_status"] | null;
                tagline?: string | null;
                updated_at?: string | null;
            };
            Relationships: [{
                foreignKeyName: "ventures_parent_venture_id_fkey";
                columns: ["parent_venture_id"];
                isOneToOne: false;
                referencedRelation: "ventures";
                referencedColumns: ["id"];
            }];
        };
    };
    Views: { [_ in never]: never; };
    Functions: { [_ in never]: never; };
    Enums: {
        department: "executive" | "marketing" | "product" | "finance" | "research" | "operations";
        expense_category: "software" | "hosting" | "ai_usage" | "contractor" | "hardware" | "office" | "marketing" | "legal" | "banking" | "travel" | "subscriptions" | "other";
        pipeline_stage: "idea" | "researching" | "validating" | "speccing" | "building" | "beta" | "launched" | "parked";
        relationship_type: "client" | "partner" | "investor" | "advisor" | "vendor" | "prospect" | "friend";
        revenue_type: "recurring" | "one-time" | "retainer" | "project";
        task_priority: "urgent" | "high" | "medium" | "low";
        task_status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked";
        venture_stage: "pre-revenue" | "early-revenue" | "growing" | "profitable" | "scaled";
        venture_status: "idea" | "validating" | "building" | "active" | "maintenance" | "sunset" | "sold";
    };
    CompositeTypes: { [_ in never]: never; };
}, {
    PostgrestVersion: "14.1";
}>;
