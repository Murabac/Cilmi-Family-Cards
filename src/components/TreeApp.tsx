"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { useFamilyTree } from "@/hooks/useFamilyTree";
import { useTreeStore } from "@/store/useTreeStore";
import { getConnected, swipeNeighbors } from "@/lib/person";
import { SearchBar } from "@/components/ui/SearchBar";
import { PersonCard } from "@/components/ui/PersonCard";
import { ConnectedRail } from "@/components/ui/ConnectedRail";
import { Loader, StatusPanel } from "@/components/ui/Loader";
import { SceneErrorBoundary } from "@/components/SceneErrorBoundary";

const TreeScene = dynamic(
  () => import("@/components/scene/TreeScene").then((m) => m.TreeScene),
  { ssr: false }
);

export function TreeApp() {
  const currentId = useTreeStore((s) => s.currentId);
  const setCurrent = useTreeStore((s) => s.setCurrent);
  const { layout, status, error, refresh } = useFamilyTree();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    if (status !== "ready" || !layout.root) return;
    if (!currentId || !layout.byId.has(currentId)) {
      setCurrent(layout.root.id);
    }
    setBooted(true);
  }, [status, layout.root, layout.byId, currentId, setCurrent]);

  const current = currentId ? layout.byId.get(currentId) ?? null : null;

  const connected = useMemo(() => {
    if (!current) return null;
    return getConnected(current, layout.byId);
  }, [current, layout.byId]);

  const neighbors = useMemo(() => {
    if (!current) return null;
    return swipeNeighbors(current, layout.byId);
  }, [current, layout.byId]);

  const goTo = (id: string) => setCurrent(id);

  if (status === "loading" || status === "idle") return <Loader />;

  if (status === "missing-config" || status === "error") {
    return (
      <StatusPanel
        title={status === "missing-config" ? "Setup needed" : "Something went wrong"}
        message={error ?? "Check .env.local"}
        onRetry={status === "error" ? () => void refresh() : undefined}
      />
    );
  }

  if (status === "missing-root" || !layout.root || !current || !connected || !neighbors) {
    if (!booted && status === "ready") return <Loader />;
    return (
      <StatusPanel
        title="CILMI not found"
        message="Could not load the family root."
        onRetry={() => void refresh()}
      />
    );
  }

  const relationHint = current.isRoot
    ? "Root"
    : connected.father
      ? `Child of ${connected.father.full_name}`
      : undefined;

  const descendants = connected.children;

  return (
    <div className="grid h-[100dvh] w-full grid-rows-[minmax(120px,22dvh)_minmax(0,1fr)] overflow-hidden bg-[#1B3A4B] lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:grid-rows-none">
      {/* 3D panel — current person + their descendants only */}
      <section className="relative min-h-0 w-full overflow-hidden lg:h-auto">
        <SceneErrorBoundary>
          <TreeScene
            current={current}
            connected={descendants.slice(0, 16)}
            onSelect={goTo}
          />
        </SceneErrorBoundary>
        {connected.father && (
          <button
            type="button"
            onClick={() => goTo(connected.father!.id)}
            title={`Back to ${connected.father.full_name}`}
            className="absolute top-2 left-2 z-10 max-w-[70%] truncate rounded-full bg-[#E8A838] px-3 py-1.5 text-[10px] font-extrabold text-[#1B3A4B] shadow-md sm:top-3 sm:left-3 sm:text-[11px]"
          >
            ← {connected.father.full_name}
          </button>
        )}
        <p className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[#1B3A4B]/70 px-3 py-1 text-[9px] font-bold tracking-wide text-[#F0E6D6]/70 uppercase backdrop-blur-sm lg:bottom-4">
          Drag to move · pinch to zoom · tap a bubble
        </p>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#1B3A4B] to-transparent lg:hidden" />
      </section>

      {/* UI column — fits viewport; only card area scrolls if needed */}
      <section className="flex min-h-0 flex-col overflow-hidden px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4 lg:border-l lg:border-[#F0E6D6]/10 lg:px-5 lg:pt-4 lg:pb-4">
        <header className="mx-auto flex w-full max-w-md shrink-0 flex-col gap-1.5 sm:gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="CILMI"
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-[#F0E6D6]/20 sm:h-10 sm:w-10"
              />
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold leading-none text-[#F0E6D6] sm:text-xl">
                  CILMI
                </p>
                <p className="mt-0.5 text-[9px] font-extrabold tracking-[0.2em] text-[#E8A838] uppercase sm:text-[10px]">
                  Family cards
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {connected.father && (
                <button
                  type="button"
                  onClick={() => goTo(connected.father!.id)}
                  title={`Back to ${connected.father.full_name}`}
                  className="rounded-full bg-[#E8A838] px-2.5 py-1.5 text-[10px] font-extrabold text-[#1B3A4B] sm:px-3 sm:py-2 sm:text-[11px]"
                >
                  ← Parent
                </button>
              )}
              <button
                type="button"
                onClick={() => goTo(layout.root!.id)}
                className="rounded-full bg-[#234A5E] px-2.5 py-1.5 text-[10px] font-extrabold text-[#F0E6D6] ring-1 ring-[#F0E6D6]/15 sm:px-3 sm:py-2 sm:text-[11px]"
              >
                Root
              </button>
            </div>
          </div>
          <SearchBar nodes={layout.nodes} />
        </header>

        {/* Card grows/shrinks; scrolls only if needed */}
        <div className="mx-auto flex min-h-0 w-full max-w-md flex-1 flex-col py-2 sm:py-3">
          <div className="flex min-h-0 flex-1 items-stretch gap-2">
            <NavBtn
              label="Prev"
              disabled={!neighbors.prev}
              onClick={() => neighbors.prev && goTo(neighbors.prev.id)}
            />
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain rounded-[28px]">
              <AnimatePresence mode="wait">
                <PersonCard
                  key={current.id}
                  person={current}
                  relationHint={relationHint}
                  onParent={
                    connected.father
                      ? () => goTo(connected.father!.id)
                      : undefined
                  }
                  onSwipeLeft={() => neighbors.next && goTo(neighbors.next.id)}
                  onSwipeRight={() => neighbors.prev && goTo(neighbors.prev.id)}
                />
              </AnimatePresence>
            </div>
            <NavBtn
              label="Next"
              disabled={!neighbors.next}
              onClick={() => neighbors.next && goTo(neighbors.next.id)}
            />
          </div>
        </div>

        <footer className="mx-auto w-full max-w-md shrink-0 pt-1">
          <ConnectedRail descendants={descendants} onSelect={goTo} />
        </footer>
      </section>
    </div>
  );
}

function NavBtn({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="my-auto hidden h-11 w-9 shrink-0 items-center justify-center self-center rounded-2xl bg-[#234A5E] text-lg font-bold text-[#F0E6D6] ring-1 ring-[#F0E6D6]/12 disabled:opacity-30 md:flex"
    >
      {label === "Prev" ? "‹" : "›"}
    </button>
  );
}
