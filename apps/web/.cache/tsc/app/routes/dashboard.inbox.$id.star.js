import { getSupabaseClient } from "~/lib/supabase.server";
export async function action({ params, request, context }) {
    const { id } = params;
    const env = context.cloudflare.env;
    const supabase = getSupabaseClient(env);
    const formData = await request.formData();
    const is_starred = formData.get("is_starred") === "true";
    await supabase.from("emails").update({ is_starred }).eq("id", id);
    return { success: true };
}
