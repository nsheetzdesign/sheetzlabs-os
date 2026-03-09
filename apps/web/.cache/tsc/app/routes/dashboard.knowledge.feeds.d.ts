import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    feeds: ({
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
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
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
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
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
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
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
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
    })[];
    unreadItems: ({
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between ventures and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tickets and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between tasks and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between pipeline and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between revenue and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expenses and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between relationships and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between knowledge and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agents and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_actions and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between agent_runs and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between content_queue and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between expense_connections and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between interactions and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between milestones and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_connections and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stack_templates and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between stripe_product_mappings and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_connections and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_docs and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_links and feed_sources";
    } | {
        action_type: string;
        created_at: string | null;
        external_id: string | null;
        id: string;
        payload: import("@sheetzlabs/shared").Json | null;
        run_id: string | null;
        target_id: string | null;
        target_table: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
    } | {
        account_key: string;
        created_at: string | null;
        id: string;
        is_active: boolean | null;
        name: string;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        stripe_connection_id: string | null;
        stripe_product_id: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
    } | {
        config: import("@sheetzlabs/shared").Json | null;
        created_at: string | null;
        credentials_key: string | null;
        id: string;
        is_active: boolean | null;
        last_sync_at: string | null;
        provider: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
    } | {
        content: string | null;
        created_at: string | null;
        id: string;
        path: string;
        type: string;
        updated_at: string | null;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
    } | {
        created_at: string | null;
        id: string;
        label: string;
        type: string | null;
        url: string;
        venture_id: string | null;
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
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
        feed_sources: {
            error: true;
        } & "could not find the relation between venture_stack and feed_sources";
    })[];
}>;
export declare function action({ request, context }: ActionFunctionArgs): Promise<import("react-router").UNSAFE_DataWithResponseInit<{
    error: string;
}> | {
    feed: any;
    ok?: undefined;
    added?: undefined;
    item?: undefined;
} | {
    ok: boolean;
    feed?: undefined;
    added?: undefined;
    item?: undefined;
} | {
    added: any;
    feed?: undefined;
    ok?: undefined;
    item?: undefined;
} | {
    item: any;
    feed?: undefined;
    ok?: undefined;
    added?: undefined;
}>;
export default function Feeds(): import("react/jsx-runtime").JSX.Element;
