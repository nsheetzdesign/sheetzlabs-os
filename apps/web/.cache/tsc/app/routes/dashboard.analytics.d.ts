import type { MetaFunction, LoaderFunctionArgs } from "react-router";
export declare const meta: MetaFunction;
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    latest: {
        active_ventures: number | null;
        agent_cost_24h: number | null;
        agent_cost_30d: number | null;
        agent_runs_24h: number | null;
        agent_runs_failed: number | null;
        agent_runs_success: number | null;
        content_published_30d: number | null;
        content_scheduled: number | null;
        conversions_30d: number | null;
        created_at: string | null;
        emails_action_required: number | null;
        emails_received_24h: number | null;
        emails_sent_24h: number | null;
        id: string;
        mrr_growth: number | null;
        newsletter_subscribers: number | null;
        pipeline_by_stage: import("@sheetzlabs/shared").Json | null;
        pipeline_count: number | null;
        relationships_critical: number | null;
        relationships_healthy: number | null;
        relationships_warning: number | null;
        runway_months: number | null;
        snapshot_date: string;
        total_arr: number | null;
        total_monthly_expenses: number | null;
        total_mrr: number | null;
        total_relationships: number | null;
        total_revenue_30d: number | null;
    } | null;
    realtime: {
        ventures: number;
        pipeline: number;
        relationships: number;
        open_tasks: number;
    };
    byDepartment: Record<string, {
        runs: number;
        cost: number;
        success: number;
        failed: number;
    }>;
    funnel: Record<string, number>;
    conversions: {
        idea_to_research: number;
        research_to_build: number;
        build_to_launch: number;
    };
    relHealthy: number;
    relWarning: number;
    relCritical: number;
    needsAttention: {
        id: string;
        name: string;
        company: string | null;
        days_since_contact: number;
    }[];
    system: {
        agents: {
            runs_24h: number;
            success: number;
            failed: number;
            success_rate: number;
        };
        email: {
            accounts: number;
            syncing: number;
        };
        calendar: {
            accounts: number;
            syncing: number;
        };
        queues: {
            content_scheduled: number;
            captures_pending: number;
        };
    };
}>;
export default function Analytics(): import("react/jsx-runtime").JSX.Element;
