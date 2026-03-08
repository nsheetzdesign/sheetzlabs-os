import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@sheetzlabs/shared";
type Client = SupabaseClient<Database>;
export declare function uploadReceipt(supabase: Client, expenseId: string, file: File): Promise<{
    url: string;
    filename: string;
}>;
export declare function deleteReceipt(supabase: Client, receiptUrl: string): Promise<void>;
export {};
