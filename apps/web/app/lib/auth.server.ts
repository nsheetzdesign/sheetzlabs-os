import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { type Database, isAllowedUser } from "@sheetzlabs/shared";
import { redirect } from "react-router";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  ALLOWED_USER_EMAILS?: string;
};

export function createSupabaseServerClient(request: Request, env: Env) {
  const headers = new Headers();

  const supabase = createServerClient<Database>(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "") ?? [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options),
            ),
          );
        },
      },
    },
  );

  return { supabase, headers };
}

export async function requireAuth(request: Request, env: Env) {
  const { supabase, headers } = createSupabaseServerClient(request, env);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw redirect("/auth/login", { headers });
  }

  // Single-tenant gate (Prompt 54A Part 0). Web loaders read Supabase directly
  // with the service key, so the API's allowlist check is not enough on its own —
  // a non-allowlisted but otherwise-valid session must be signed out here.
  if (!isAllowedUser(user.email, env)) {
    await supabase.auth.signOut(); // emits Set-Cookie clears onto `headers`
    throw redirect("/auth/login?error=not_authorized", { headers });
  }

  return { user, headers };
}
