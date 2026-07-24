"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserClient, hasSupabaseConfig } from "@/lib/supabase";
import { buildTreeLayout } from "@/lib/tree-layout";
import type { LayoutResult, Profile } from "@/lib/types";

export type LoadState =
  | "idle"
  | "loading"
  | "ready"
  | "error"
  | "missing-config"
  | "missing-root";

async function fetchProfilesViaApi(): Promise<Profile[]> {
  const res = await fetch("/api/profiles", { cache: "no-store" });
  const body = (await res.json()) as { profiles?: Profile[]; error?: string };
  if (!res.ok) throw new Error(body.error || `Profiles API failed (${res.status})`);
  return body.profiles ?? [];
}

export function useFamilyTree() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [status, setStatus] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!hasSupabaseConfig()) {
      setStatus("missing-config");
      setError("Set Supabase env vars in .env.local, then restart.");
      return;
    }
    if (!opts?.silent) setStatus("loading");
    setError(null);
    try {
      const data = await fetchProfilesViaApi();
      setProfiles(data);
      const hasRoot = data.some(
        (p) => !p.father_id && p.full_name.trim().toUpperCase().includes("CILMI")
      );
      setStatus(hasRoot ? "ready" : "missing-root");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!hasSupabaseConfig()) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") void load({ silent: true });
    };
    document.addEventListener("visibilitychange", onVisible);
    let unsub = () => undefined;
    try {
      const schema = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA || "reer_sh_yoonis";
      const supabase = createBrowserClient();
      const channel = supabase
        .channel("profiles-live")
        .on("postgres_changes", { event: "*", schema, table: "profiles" }, () =>
          void load({ silent: true })
        )
        .subscribe();
      unsub = () => {
        void supabase.removeChannel(channel);
      };
    } catch {
      /* optional */
    }
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      unsub();
    };
  }, [load]);

  const layout: LayoutResult = useMemo(() => buildTreeLayout(profiles), [profiles]);

  return {
    layout,
    status,
    error,
    refresh: () => load({ silent: true }),
  };
}
