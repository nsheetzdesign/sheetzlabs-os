import { Hono } from "hono";
import { cors } from "hono/cors";
import agents from "./routes/agents";
import pipelineRouter from "./routes/pipeline";
import stripeRouter from "./routes/stripe";
import expensesRouter from "./routes/expenses";
import ticketsRouter from "./routes/tickets";
import mcpRouter from "./routes/mcp";
import scheduledHandler from "./scheduled";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  STRIPE_PERSONAL_KEY: string;
  STRIPE_PERSONAL_WEBHOOK_SECRET: string;
  STRIPE_COLAB_KEY: string;
  STRIPE_COLAB_WEBHOOK_SECRET: string;
  N8N_API_KEY: string;
  ANTHROPIC_API_KEY: string;
  SERPER_API_KEY: string;
  BRAVE_API_KEY: string;
  LINKEDIN_ACCESS_TOKEN: string;
  LINKEDIN_PERSON_ID: string;
  CLOUDFLARE_BILLING_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/", (c) => {
  return c.json({ name: "sheetzlabs-api", status: "ok" });
});

app.get("/health", (c) => {
  return c.json({ status: "ok", env: c.env.ENVIRONMENT });
});

app.route("/agents", agents);
app.route("/pipeline", pipelineRouter);
app.route("/stripe", stripeRouter);
app.route("/expenses", expensesRouter);
app.route("/tickets", ticketsRouter);
app.route("/mcp", mcpRouter);

export default {
  fetch: app.fetch,
  scheduled: scheduledHandler.scheduled,
};
