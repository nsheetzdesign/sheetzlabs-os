import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_marketing.tsx", [
    index("routes/_marketing._index.tsx"),
  ]),
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard._index.tsx"),
    route("ventures", "routes/dashboard.ventures.tsx"),
    route("pipeline", "routes/dashboard.pipeline.tsx"),
    route("revenue", "routes/dashboard.revenue.tsx"),
    route("relationships", "routes/dashboard.relationships.tsx"),
    route("tasks", "routes/dashboard.tasks.tsx"),
    route("knowledge", "routes/dashboard.knowledge.tsx"),
    route("agents", "routes/dashboard.agents.tsx"),
  ]),
] satisfies RouteConfig;
