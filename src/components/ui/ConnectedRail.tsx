"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { TreeNode } from "@/lib/types";

function nameFromSupabase(person: TreeNode): string {
  return person.full_name?.trim() || "Unknown";
}

export function ConnectedRail({
  descendants,
  onSelect,
}: {
  descendants: TreeNode[];
  onSelect: (id: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [descendants, updateArrows]);

  const scrollByCards = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(280, Math.max(140, el.clientWidth * 0.7));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!descendants.length) {
    return (
      <p className="px-1 text-center text-xs font-bold text-[#8FA8B5] sm:text-sm">
        No descendants
      </p>
    );
  }

  return (
    <div className="w-full">
      <p className="mb-1.5 px-1 text-[10px] font-extrabold tracking-[0.16em] text-[#8FA8B5] uppercase sm:mb-2 sm:text-xs">
        Descendants · {descendants.length}
      </p>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          aria-label="Scroll descendants left"
          disabled={!canLeft}
          onClick={() => scrollByCards(-1)}
          className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl bg-[#234A5E] text-lg font-bold text-[#F0E6D6] ring-1 ring-[#F0E6D6]/15 disabled:opacity-30 sm:h-12 sm:w-10 sm:rounded-2xl"
        >
          ‹
        </button>

        <div
          ref={scrollerRef}
          className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory [scrollbar-width:none] sm:gap-2 [&::-webkit-scrollbar]:hidden"
        >
          {descendants.map((person) => {
            const name = nameFromSupabase(person);
            const order =
              person.birth_order != null
                ? `Child #${person.birth_order}`
                : "Child";
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => onSelect(person.id)}
                title={name}
                className="snap-start flex w-[118px] shrink-0 flex-col items-center rounded-xl bg-[#234A5E] p-2 ring-1 ring-[#F0E6D6]/10 active:scale-[0.97] sm:w-[130px] sm:rounded-2xl sm:p-2.5"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#1B3A4B] sm:h-14 sm:w-14">
                  {person.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={person.avatar_url}
                      alt={name}
                      className="h-full w-full object-cover object-top"
                    />
                  ) : (
                    <span className="px-1 text-center text-[8px] leading-tight font-extrabold text-[#F0E6D6] sm:text-[9px]">
                      {name}
                    </span>
                  )}
                </div>
                <p
                  className={`mt-1.5 line-clamp-2 w-full text-center leading-tight font-extrabold text-[#F0E6D6] sm:mt-2 ${
                    name.length > 22
                      ? "text-[8px] sm:text-[9px]"
                      : name.length > 14
                        ? "text-[9px] sm:text-[10px]"
                        : "text-[10px] sm:text-[11px]"
                  }`}
                >
                  {name}
                </p>
                <p className="text-[9px] font-bold text-[#E8A838] sm:text-[10px]">
                  {order}
                  {person.children.length > 0
                    ? ` · ${person.children.length} kids`
                    : ""}
                </p>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Scroll descendants right"
          disabled={!canRight}
          onClick={() => scrollByCards(1)}
          className="flex h-11 w-9 shrink-0 items-center justify-center rounded-xl bg-[#234A5E] text-lg font-bold text-[#F0E6D6] ring-1 ring-[#F0E6D6]/15 disabled:opacity-30 sm:h-12 sm:w-10 sm:rounded-2xl"
        >
          ›
        </button>
      </div>
    </div>
  );
}
