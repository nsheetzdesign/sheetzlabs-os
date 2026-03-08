import type { LoaderFunctionArgs } from "react-router";
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    deptSummary: {
        dept: "executive" | "marketing" | "product" | "finance" | "research" | "operations";
        agents: {
            id: string;
            department: "executive" | "marketing" | "product" | "finance" | "research" | "operations";
            name: string;
            slug: string;
            enabled: boolean | null;
        }[];
        agent_count: number;
        enabled_count: number;
        last_run: string | null;
        recent_status: string | null;
    }[];
    totalAgents: number;
    totalEnabled: number;
}>;
export default function AgentsDepartmentDashboard(): import("react/jsx-runtime").JSX.Element;
