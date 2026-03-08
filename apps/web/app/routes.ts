import { type RouteConfig, index, layout } from "@react-router/dev/routes";

export default [
  layout("routes/_marketing.tsx", [
    index("routes/_marketing._index.tsx"),
  ]),
] satisfies RouteConfig;
