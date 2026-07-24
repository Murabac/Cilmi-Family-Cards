"use client";

import { create } from "zustand";

interface TreeUiState {
  currentId: string | null;
  searchQuery: string;
  setCurrent: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
}

export const useTreeStore = create<TreeUiState>((set) => ({
  currentId: null,
  searchQuery: "",
  setCurrent: (currentId) => set({ currentId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
