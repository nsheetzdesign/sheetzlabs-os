import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/health", (c) => {
  return c.json({ status: "ok", env: c.env.ENVIRONMENT });
});

export default app;
