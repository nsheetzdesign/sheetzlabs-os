import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_marketing.tsx", [
    index("routes/_marketing._index.tsx"),
  ]),
  route("auth/login", "routes/auth.login.tsx"),
  route("auth/logout", "routes/auth.logout.tsx"),
  route("dashboard", "routes/dashboard.tsx", [
    index("routes/dashboard._index.tsx"),
    route("ventures", "routes/dashboard.ventures.tsx", [
      index("routes/dashboard.ventures._index.tsx"),
      route("new", "routes/dashboard.ventures.new.tsx"),
      route(":slug", "routes/dashboard.ventures.$slug.tsx", [
        index("routes/dashboard.ventures.$slug._index.tsx"),
        route("stack", "routes/dashboard.ventures.$slug.stack.tsx"),
        route("links", "routes/dashboard.ventures.$slug.links.tsx"),
        route("roadmap", "routes/dashboard.ventures.$slug.roadmap.tsx"),
        route("tickets", "routes/dashboard.ventures.$slug.tickets.tsx"),
        route("tasks", "routes/dashboard.ventures.$slug.tasks.tsx"),
        route("docs", "routes/dashboard.ventures.$slug.docs.tsx"),
      ]),
    ]),
    route("pipeline", "routes/dashboard.pipeline.tsx", [
      index("routes/dashboard.pipeline._index.tsx"),
      route("new", "routes/dashboard.pipeline.new.tsx"),
      route(":id", "routes/dashboard.pipeline.$id.tsx"),
    ]),
    route("revenue", "routes/dashboard.revenue.tsx", [
      index("routes/dashboard.revenue._index.tsx"),
      route("new", "routes/dashboard.revenue.new.tsx"),
    ]),
    route("expenses", "routes/dashboard.expenses.tsx", [
      index("routes/dashboard.expenses._index.tsx"),
      route("new", "routes/dashboard.expenses.new.tsx"),
      route(":id", "routes/dashboard.expenses.$id.tsx"),
    ]),
    route("tickets", "routes/dashboard.tickets.tsx", [
      index("routes/dashboard.tickets._index.tsx"),
    ]),
    route("relationships", "routes/dashboard.relationships.tsx", [
      index("routes/dashboard.relationships._index.tsx"),
      route("new", "routes/dashboard.relationships.new.tsx"),
      route(":id", "routes/dashboard.relationships.$id.tsx"),
    ]),
    route("tasks", "routes/dashboard.tasks.tsx", [
      index("routes/dashboard.tasks._index.tsx"),
      route("new", "routes/dashboard.tasks.new.tsx"),
      route(":id", "routes/dashboard.tasks.$id.tsx"),
    ]),
    route("knowledge", "routes/dashboard.knowledge.tsx", [
      index("routes/dashboard.knowledge._index.tsx"),
      route("new", "routes/dashboard.knowledge.new.tsx"),
      route(":slug", "routes/dashboard.knowledge.$slug.tsx"),
    ]),
    route("content", "routes/dashboard.content.tsx", [
      index("routes/dashboard.content._index.tsx"),
      route("new", "routes/dashboard.content.new.tsx"),
      route(":id", "routes/dashboard.content.$id.tsx"),
    ]),
    route("agents", "routes/dashboard.agents.tsx", [
      index("routes/dashboard.agents._index.tsx"),
      route("runs", "routes/dashboard.agents.runs.tsx", [
        index("routes/dashboard.agents.runs._index.tsx"),
        route(":id", "routes/dashboard.agents.runs.$id.tsx"),
      ]),
      route("content", "routes/dashboard.agents.content.tsx"),
      route(":slug", "routes/dashboard.agents.$slug.tsx"),
    ]),
    route("calendar", "routes/dashboard.calendar.tsx", [
      index("routes/dashboard.calendar._index.tsx"),
      route(":id", "routes/dashboard.calendar.$id.tsx"),
    ]),
    route("inbox", "routes/dashboard.inbox.tsx", [
      index("routes/dashboard.inbox._index.tsx"),
      route("compose", "routes/dashboard.inbox.compose.tsx"),
      route("draft-ai", "routes/dashboard.inbox.draft-ai.tsx"),
      route(":id", "routes/dashboard.inbox.$id.tsx", [
        route("star", "routes/dashboard.inbox.$id.star.tsx"),
      ]),
    ]),
    route("settings", "routes/dashboard.settings.tsx", [
      route("stripe", "routes/dashboard.settings.stripe.tsx"),
      route("expenses", "routes/dashboard.settings.expenses.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
