"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TreeNode } from "@/lib/types";
import { searchProfiles } from "@/lib/tree-layout";
import { useTreeStore } from "@/store/useTreeStore";

export function SearchBar({ nodes }: { nodes: TreeNode[] }) {
  const query = useTreeStore((s) => s.searchQuery);
  const setSearchQuery = useTreeStore((s) => s.setSearchQuery);
  const setCurrent = useTreeStore((s) => s.setCurrent);
  const [open, setOpen] = useState(false);
  const results = useMemo(() => searchProfiles(nodes, query), [nodes, query]);

  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        placeholder="Find someone…"
        className="w-full rounded-xl border-0 bg-[#234A5E] px-3 py-2.5 text-sm font-semibold text-[#F0E6D6] outline-none ring-1 ring-[#F0E6D6]/12 placeholder:text-[#8FA8B5] focus:ring-2 focus:ring-[#E8A838]/50 sm:rounded-2xl sm:px-4 sm:py-3"
      />
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-full z-40 mt-2 max-h-56 w-full overflow-auto rounded-2xl bg-[#234A5E] py-1 shadow-xl ring-1 ring-[#F0E6D6]/10"
          >
            {results.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-[#F0E6D6] hover:bg-[#1B3A4B]"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setCurrent(n.id);
                    setSearchQuery(n.full_name);
                    setOpen(false);
                  }}
                >
                  <span>{n.full_name}</span>
                  <span className="text-xs font-bold text-[#8FA8B5]">
                    Gen {n.depth}
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
