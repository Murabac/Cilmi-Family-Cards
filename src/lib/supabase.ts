import { createClient } from "@supabase/supabase-js";
import type { Profile } from "./types";

export const PROFILE_COLUMNS =
  "id, full_name, father_id, birth_order, demographic, marital_status, care_rating, avatar_url, city, occupation, phone_number, email" as const;

function schemaName(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_SCHEMA ||
    process.env.VITE_SUPABASE_SCHEMA ||
    "reer_sh_yoonis"
  );
}

function supabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ""
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClient = ReturnType<typeof createClient<any, any, any>>;

let browserClient: AnyClient | null = null;

export function createBrowserClient(): AnyClient {
  if (browserClient) return browserClient;
  const url = supabaseUrl();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  browserClient = createClient(url, key, {
    db: { schema: schemaName() },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return browserClient;
}

export function createServerClient(): AnyClient {
  const url = supabaseUrl();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";
  if (!url || !key) {
    throw new Error("Missing Supabase URL / key in .env.local");
  }
  return createClient(url, key, {
    db: { schema: schemaName() },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function hasSupabaseConfig(): boolean {
  return Boolean(
    supabaseUrl() &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        process.env.VITE_SUPABASE_ANON_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY)
  );
}

export async function fetchProfilesServer(): Promise<Profile[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .schema(schemaName())
    .from("profiles")
    .select(PROFILE_COLUMNS);

  if (error) throw new Error(error.message);
  return (data ?? []) as Profile[];
}
