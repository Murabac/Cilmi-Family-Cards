/** Teal dusk palette used by the 3D scene */
export const COLORS = {
  bg: "#1B3A4B",
  coral: "#E07A3D",
  teal: "#3BA99C",
  sun: "#E8A838",
  sky: "#5B8FA8",
  leaf: "#6BBF8A",
  edge: "#6A8FA3",
} as const;

export function personColor(opts: {
  isRoot?: boolean;
  depth?: number;
  demographic?: string | null;
  maritalStatus?: string | null;
  highlighted?: boolean;
}): string {
  if (opts.highlighted) return COLORS.coral;
  if (opts.isRoot) return COLORS.sun;

  const demo = (opts.demographic ?? "").toLowerCase();
  const marital = (opts.maritalStatus ?? "").toLowerCase();

  if (demo.includes("deceased") || demo.includes("dead")) return "#9A8B7C";
  if (demo.includes("child") || demo.includes("student") || demo.includes("minor"))
    return COLORS.leaf;
  if (marital.includes("married")) return COLORS.sun;
  if ((opts.depth ?? 0) % 2 === 0) return COLORS.teal;
  return "#5B9EC9";
}
