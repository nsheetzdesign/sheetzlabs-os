import type { LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction<typeof loader>;
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    email: {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tickets and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between tasks and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between pipeline and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between revenue and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expenses and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: ({
            error: true;
        } & "column 'name' does not exist on 'relationships'.")[];
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between knowledge and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agents and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_actions and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between agent_runs and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between content_queue and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between expense_connections and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between interactions and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between milestones and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_connections and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stack_templates and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_connections and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_docs and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_links and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            error: true;
        } & "could not find the relation between venture_stack and relationships";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between ventures and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tickets and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between tasks and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between pipeline and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between revenue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expenses and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between relationships and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        }[];
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between knowledge and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agents and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between content_queue and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between interactions and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        } | null;
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between milestones and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_links and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        department: import("@sheetzlabs/shared").Database["public"]["Enums"]["department"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        amount_cents: number;
        category: import("@sheetzlabs/shared").Database["public"]["Enums"]["expense_category"];
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        direction: string | null;
        id: string;
        occurred_at: string | null;
        relationship_id: string | null;
        subject: string | null;
        summary: string | null;
        type: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        slug: string;
        tags: string[] | null;
        title: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        id: string;
        sort_order: number | null;
        status: string | null;
        target_date: string | null;
        title: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["pipeline_stage"] | null;
        target_market: string | null;
        total_score: number | null;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        company: string | null;
        created_at: string | null;
        email: string | null;
        id: string;
        last_contact: string | null;
        name: string;
        notes: string | null;
        role: string | null;
        strength: number | null;
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["relationship_type"] | null;
        updated_at: string | null;
        venture_ids: string[] | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        type: import("@sheetzlabs/shared").Database["public"]["Enums"]["revenue_type"];
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        claude_md_template: string | null;
        created_at: string | null;
        description: string | null;
        hooks: import("@sheetzlabs/shared").Json | null;
        id: string;
        name: string;
        skills: import("@sheetzlabs/shared").Json | null;
        stack_items: import("@sheetzlabs/shared").Json;
        venture_type: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        completed_at: string | null;
        created_at: string | null;
        description: string | null;
        due_date: string | null;
        id: string;
        milestone_id: string | null;
        priority: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_priority"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["task_status"] | null;
        title: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    } | {
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
        stage: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_stage"] | null;
        status: import("@sheetzlabs/shared").Database["public"]["Enums"]["venture_status"] | null;
        tagline: string | null;
        updated_at: string | null;
        email_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and email_accounts";
        relationships: {
            id: string;
            name: string;
            company: string | null;
        };
    };
    thread: unknown[];
}>;
export default function EmailDetail(): import("react/jsx-runtime").JSX.Element;
