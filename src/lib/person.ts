import type { ConnectedPeople, TreeNode } from "./types";

export function personDescription(node: TreeNode): string {
  const bits: string[] = [];
  if (node.occupation?.trim()) bits.push(node.occupation.trim());
  if (node.city?.trim()) bits.push(`Lives in ${node.city.trim()}`);
  if (node.marital_status?.trim()) bits.push(String(node.marital_status));
  if (node.demographic?.trim()) bits.push(String(node.demographic));
  if (node.care_rating != null) bits.push(`Care rating ${node.care_rating}`);
  if (!bits.length) {
    return node.isRoot
      ? "Progenitor of the CILMI lineage."
      : "Member of the CILMI Foundation family.";
  }
  return bits.join(" · ");
}

export function cleanPhone(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 7) return null;
  return digits;
}

export function whatsappUrl(phone: string): string {
  return `https://wa.me/${phone}`;
}

export function telUrl(phone: string): string {
  return `tel:+${phone}`;
}

/** Direct children for bubbles + rail; father for back navigation. */
export function getConnected(
  node: TreeNode,
  byId: Map<string, TreeNode>
): ConnectedPeople {
  const father = node.father_id ? byId.get(node.father_id) ?? null : null;
  return { father, children: [...node.children] };
}

/**
 * Swipe among children when present; otherwise among siblings.
 */
export function swipeNeighbors(
  node: TreeNode,
  byId: Map<string, TreeNode>
): { prev: TreeNode | null; next: TreeNode | null } {
  if (node.children.length >= 1) {
    const ring = node.children;
    if (ring.length === 1) return { prev: null, next: ring[0] };
    return {
      prev: ring[ring.length - 1],
      next: ring[0],
    };
  }

  const father = node.father_id ? byId.get(node.father_id) : null;
  const ring = father?.children ?? [node];
  if (ring.length < 2) return { prev: null, next: null };
  const idx = ring.findIndex((n) => n.id === node.id);
  if (idx < 0) return { prev: null, next: null };
  return {
    prev: ring[(idx - 1 + ring.length) % ring.length] ?? null,
    next: ring[(idx + 1) % ring.length] ?? null,
  };
}
