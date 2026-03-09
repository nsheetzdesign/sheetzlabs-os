import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction<typeof loader>;
export declare function loader({ params, context }: LoaderFunctionArgs): Promise<{
    event: {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between tickets and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: string | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between pipeline and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between revenue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expenses and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between relationships and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between knowledge and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agents and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_actions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between agent_runs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between content_queue and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between expense_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between interactions and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stack_templates and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_connections and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_docs and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_links and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            error: true;
        } & "could not find the relation between venture_stack and tasks";
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between ventures and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between ventures and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tickets and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        } | null;
        knowledge: {
            error: true;
        } & "could not find the relation between tickets and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between tasks and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        }[];
        knowledge: {
            error: true;
        } & "could not find the relation between tasks and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between pipeline and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between pipeline and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between revenue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between revenue and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expenses and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expenses and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between relationships and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between relationships and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between knowledge and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between knowledge and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agents and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agents and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_actions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_actions and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between agent_runs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between agent_runs and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between content_queue and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between content_queue and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between expense_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between expense_connections and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between interactions and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between interactions and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between milestones and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between milestones and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_connections and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stack_templates and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stack_templates and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_connections and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_connections and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_docs and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_docs and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_links and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_links and ai_prep_doc_id";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
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
        calendar_accounts: {
            error: true;
        } & "could not find the relation between venture_stack and calendar_accounts";
        tasks: {
            id: string;
            title: string;
            status: "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked" | null;
        };
        knowledge: {
            error: true;
        } & "could not find the relation between venture_stack and ai_prep_doc_id";
    };
}>;
export declare function action({ params, request, context }: ActionFunctionArgs): Promise<Response | null>;
export default function CalendarEventDetail(): import("react/jsx-runtime").JSX.Element;
