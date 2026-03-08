import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_marketing.tsx", [
    index("routes/_marketing._index.tsx"),
  ]),
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard._index.tsx"),
    route("ventures", "routes/dashboard.ventures.tsx", [
      index("routes/dashboard.ventures._index.tsx"),
      route("new", "routes/dashboard.ventures.new.tsx"),
      route(":slug", "routes/dashboard.ventures.$slug.tsx"),
    ]),
    route("pipeline", "routes/dashboard.pipeline.tsx"),
    route("revenue", "routes/dashboard.revenue.tsx", [
      index("routes/dashboard.revenue._index.tsx"),
      route("new", "routes/dashboard.revenue.new.tsx"),
    ]),
    route("relationships", "routes/dashboard.relationships.tsx"),
    route("tasks", "routes/dashboard.tasks.tsx", [
      index("routes/dashboard.tasks._index.tsx"),
      route("new", "routes/dashboard.tasks.new.tsx"),
      route(":id", "routes/dashboard.tasks.$id.tsx"),
    ]),
    route("knowledge", "routes/dashboard.knowledge.tsx"),
    route("agents", "routes/dashboard.agents.tsx"),
  ]),
] satisfies RouteConfig;
