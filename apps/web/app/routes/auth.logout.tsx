import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { createSupabaseServerClient } from "~/lib/auth.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(
    request,
    context.cloudflare.env,
  );
  await supabase.auth.signOut();
  return redirect("/auth/login", { headers });
}

// No UI — POST only
export default function Logout() {
  return null;
}
