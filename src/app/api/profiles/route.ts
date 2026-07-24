import { NextResponse } from "next/server";
import { fetchProfilesServer, hasSupabaseConfig } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabaseConfig()) {
    return NextResponse.json(
      {
        error:
          "Missing Supabase env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or anon key) in .env.local",
      },
      { status: 500 }
    );
  }

  try {
    const profiles = await fetchProfilesServer();
    return NextResponse.json(
      { profiles, count: profiles.length, fetchedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load profiles";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
