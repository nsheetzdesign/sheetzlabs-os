import type { Database } from "@sheetzlabs/shared";
type Env = {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
};
export declare function createSupabaseServerClient(request: Request, env: Env): {
    supabase: import("@supabase/supabase-js").SupabaseClient<Database, "public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">, ("public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">) extends infer T ? T extends ("public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">) ? T extends "public" ? T : "public" : never : never, Omit<Database, "__InternalSupabase">[("public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">) extends infer T_1 ? T_1 extends ("public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">) ? T_1 extends "public" ? T_1 : "public" : never : never] extends {
        Tables: Record<string, {
            Row: Record<string, unknown>;
            Insert: Record<string, unknown>;
            Update: Record<string, unknown>;
            Relationships: {
                foreignKeyName: string;
                columns: string[];
                isOneToOne?: boolean;
                referencedRelation: string;
                referencedColumns: string[];
            }[];
        }>;
        Views: Record<string, {
            Row: Record<string, unknown>;
            Insert: Record<string, unknown>;
            Update: Record<string, unknown>;
            Relationships: {
                foreignKeyName: string;
                columns: string[];
                isOneToOne?: boolean;
                referencedRelation: string;
                referencedColumns: string[];
            }[];
        } | {
            Row: Record<string, unknown>;
            Relationships: {
                foreignKeyName: string;
                columns: string[];
                isOneToOne?: boolean;
                referencedRelation: string;
                referencedColumns: string[];
            }[];
        }>;
        Functions: Record<string, {
            Args: Record<string, unknown> | never;
            Returns: unknown;
            SetofOptions?: {
                isSetofReturn?: boolean | undefined;
                isOneToOne?: boolean | undefined;
                isNotNullable?: boolean | undefined;
                to: string;
                from: string;
            };
        }>;
    } ? Omit<Database, "__InternalSupabase">[("public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">) extends infer T_2 ? T_2 extends ("public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">) ? T_2 extends "public" ? T_2 : "public" : never : never] : never, ("public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">) extends infer T_3 ? T_3 extends ("public" extends Exclude<keyof Database, "__InternalSupabase"> ? "public" : string & Exclude<keyof Database, "__InternalSupabase">) ? T_3 extends "public" ? {
        PostgrestVersion: "14.1";
    } : T_3 extends {
        PostgrestVersion: string;
    } ? T_3 : never : never : never>;
    headers: Headers;
};
export declare function requireAuth(request: Request, env: Env): Promise<{
    user: import("@supabase/supabase-js").AuthUser;
    headers: Headers;
}>;
export {};
