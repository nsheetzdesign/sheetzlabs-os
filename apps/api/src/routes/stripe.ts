import { Hono } from "hono";
import Stripe from "stripe";
import { getSupabaseClient } from "../lib/supabase";

type Bindings = {
  ENVIRONMENT: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  STRIPE_PERSONAL_KEY: string;
  STRIPE_PERSONAL_WEBHOOK_SECRET: string;
  STRIPE_COLAB_KEY: string;
  STRIPE_COLAB_WEBHOOK_SECRET: string;
};

const stripeRouter = new Hono<{ Bindings: Bindings }>();

/** Resolve account key → Stripe secret key + webhook secret */
function getStripeKeys(
  account: string,
  env: Bindings,
): { secretKey: string; webhookSecret: string } | null {
  const map: Record<string, { secretKey: string; webhookSecret: string }> = {
    personal: {
      secretKey: env.STRIPE_PERSONAL_KEY,
      webhookSecret: env.STRIPE_PERSONAL_WEBHOOK_SECRET,
    },
    colab: {
      secretKey: env.STRIPE_COLAB_KEY,
      webhookSecret: env.STRIPE_COLAB_WEBHOOK_SECRET,
    },
  };
  return map[account] ?? null;
}

/**
 * POST /stripe/webhook/:account
 *
 * Stripe sends signed webhook payloads to this endpoint.
 * :account must match a stripe_connections.account_key (e.g. "personal", "colab").
 *
 * Handled events:
 *   invoice.paid → upsert revenue row (dedupe via stripe_invoice_id)
 *
 * Stripe v20 field paths:
 *   - Product ID: line.pricing.price_details.product (plain string)
 *   - Recurring check: invoice.billing_reason
 *   - Paid timestamp: invoice.status_transitions.paid_at
 */
stripeRouter.post("/webhook/:account", async (c) => {
  const account = c.req.param("account");
  const keys = getStripeKeys(account, c.env);
  if (!keys) {
    return c.json({ error: `Unknown account: ${account}` }, 400);
  }

  // Read raw body (required for signature verification)
  const payload = await c.req.text();
  const sig = c.req.header("stripe-signature");
  if (!sig) {
    return c.json({ error: "Missing stripe-signature header" }, 400);
  }

  // Workers-compatible Stripe client using fetch HTTP client
  const stripe = new Stripe(keys.secretKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  // Verify signature using Web Crypto API (Workers-compatible async version)
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      sig,
      keys.webhookSecret,
    );
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : "Signature verification failed";
    return c.json({ error: msg }, 400);
  }

  const supabase = getSupabaseClient(c.env);

  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;

    // Resolve stripe_connection_id from account_key
    const { data: connection, error: connErr } = await supabase
      .from("stripe_connections")
      .select("id")
      .eq("account_key", account)
      .single();

    if (connErr || !connection) {
      console.error("stripe_connections lookup failed:", connErr?.message);
      return c.json({ error: "Connection not found" }, 500);
    }

    // Determine venture via product mapping.
    // Stripe v20: product ID lives at line.pricing.price_details.product (string)
    let ventureId: string | null = null;
    const lines = invoice.lines?.data ?? [];

    for (const line of lines) {
      const productId = line.pricing?.price_details?.product ?? null;
      if (productId) {
        const { data: mapping } = await supabase
          .from("stripe_product_mappings")
          .select("venture_id")
          .eq("stripe_product_id", productId)
          .single();

        if (mapping?.venture_id) {
          ventureId = mapping.venture_id;
          break;
        }
      }
    }

    // Detect recurring vs one-time via billing_reason (Stripe v20)
    const billingReason = invoice.billing_reason;
    const isRecurring =
      billingReason === "subscription" ||
      billingReason === "subscription_create" ||
      billingReason === "subscription_cycle" ||
      billingReason === "subscription_update" ||
      billingReason === "subscription_threshold";

    const revenueType: "recurring" | "one-time" = isRecurring
      ? "recurring"
      : "one-time";

    // Paid timestamp: status_transitions.paid_at, fall back to created
    const paidTs = invoice.status_transitions.paid_at ?? invoice.created;
    const paidAt = new Date(paidTs * 1000).toISOString();

    const amountCents = invoice.amount_paid;
    const currency = invoice.currency.toUpperCase();
    const description =
      invoice.description || `Invoice ${invoice.number ?? invoice.id}`;

    const { error: upsertErr } = await supabase.from("revenue").upsert(
      {
        stripe_invoice_id: invoice.id,
        stripe_connection_id: connection.id,
        venture_id: ventureId,
        amount_cents: amountCents,
        currency,
        type: revenueType,
        description,
        period_start: paidAt,
      },
      { onConflict: "stripe_invoice_id" },
    );

    if (upsertErr) {
      console.error("Revenue upsert failed:", upsertErr.message);
      return c.json({ error: upsertErr.message }, 500);
    }

    console.log(
      `[stripe/${account}] invoice.paid ${invoice.id} → ${amountCents} ${currency} venture=${ventureId ?? "unmapped"}`,
    );
  }

  // Acknowledge receipt of all event types
  return c.json({ received: true });
});

export default stripeRouter;
