import { Hono } from "hono";
import { cors } from "hono/cors";
import agents from "./routes/agents";
import stripeRouter from "./routes/stripe";
import expensesRouter from "./routes/expenses";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  STRIPE_PERSONAL_KEY: string;
  STRIPE_PERSONAL_WEBHOOK_SECRET: string;
  STRIPE_COLAB_KEY: string;
  STRIPE_COLAB_WEBHOOK_SECRET: string;
  N8N_API_KEY: string;
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
app.route("/stripe", stripeRouter);
app.route("/expenses", expensesRouter);

export default app;
