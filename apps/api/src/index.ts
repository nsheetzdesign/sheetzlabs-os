import { Hono } from "hono";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth";
import agents from "./routes/agents";
import pipelineRouter from "./routes/pipeline";
import stripeRouter from "./routes/stripe";
import expensesRouter from "./routes/expenses";
import ticketsRouter from "./routes/tickets";
import mcpRouter from "./routes/mcp";
import emailRouter from "./routes/email";
import calendarRouter from "./routes/calendar";
import knowledgeRouter from "./routes/knowledge";
import contentRouter from "./routes/content";
import analyticsRouter from "./routes/analytics";
import chatRouter from "./routes/chat";
import bookingRouter from "./routes/booking";
import learningRouter from "./routes/learning";
import scheduledHandler from "./scheduled";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_ANON_KEY: string;
  ALLOWED_ORIGINS: string;
  CRON_SECRET: string;
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
  RESEND_API_KEY: string;
  NEWSLETTER_FROM: string;
  CLOUDFLARE_BILLING_TOKEN: string;
  CLOUDFLARE_ACCOUNT_ID: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  API_URL: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: { userId: string } }>();

// ── CORS ────────────────────────────────────────────────────────────────────
// Locked to the app origin plus localhost for dev. Foreign origins are rejected.
// All authenticated browser traffic flows through the web app's same-origin
// `/api/*` proxy, so the only cross-origin needs here are dev tooling.
app.use("*", (c, next) => {
  const configured = (c.env.ALLOWED_ORIGINS ?? "https://app.sheetzlabs.com")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  return cors({
    origin: (origin) => {
      if (!origin) return configured[0] ?? "https://app.sheetzlabs.com";
      if (configured.includes(origin)) return origin;
      // Allow any localhost / 127.0.0.1 port for local development.
      if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
      return null;
    },
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })(c, next);
});

// ── Auth ──────────────────────────────────────────────────────────────────────
// Verifies Supabase JWTs on every route except the public allowlist.
app.use("*", authMiddleware);

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
app.route("/email", emailRouter);
app.route("/calendar", calendarRouter);
app.route("/knowledge", knowledgeRouter);
app.route("/content", contentRouter);
app.route("/analytics", analyticsRouter);
app.route("/chat", chatRouter);
app.route("/booking", bookingRouter);
app.route("/learning", learningRouter);

export default {
  fetch: app.fetch,
  scheduled: scheduledHandler.scheduled,
};
