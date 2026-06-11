import type { LoaderFunctionArgs } from "react-router";
export declare function loader({ context }: LoaderFunctionArgs): Promise<{
    deptSummary: {
        dept: "marketing" | "product" | "finance" | "research" | "operations" | "executive";
        agents: {
            id: string;
            department: "marketing" | "product" | "finance" | "research" | "operations" | "executive" | "education";
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
