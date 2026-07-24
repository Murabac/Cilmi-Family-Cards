import type { LayoutResult, Profile, TreeNode } from "./types";

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toUpperCase();
}

function compareSiblings(a: Profile, b: Profile): number {
  const ao = a.birth_order ?? Number.POSITIVE_INFINITY;
  const bo = b.birth_order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  return a.full_name.localeCompare(b.full_name, undefined, { sensitivity: "base" });
}

/** Build parent/child tree from profiles (no spatial layout). */
export function buildTreeLayout(profiles: Profile[]): LayoutResult {
  const childrenOf = new Map<string, Profile[]>();

  for (const p of profiles) {
    if (!p.father_id) continue;
    const list = childrenOf.get(p.father_id) ?? [];
    list.push(p);
    childrenOf.set(p.father_id, list);
  }
  for (const list of childrenOf.values()) list.sort(compareSiblings);

  const rootProfile =
    profiles.find((p) => !p.father_id && normalizeName(p.full_name) === "CILMI") ??
    profiles.find(
      (p) => !p.father_id && normalizeName(p.full_name).includes("CILMI")
    ) ??
    null;

  if (!rootProfile) return emptyLayout();

  function buildNode(profile: Profile, depth: number): TreeNode {
    const children = (childrenOf.get(profile.id) ?? []).map((child) =>
      buildNode(child, depth + 1)
    );
    return {
      ...profile,
      children,
      depth,
      isRoot: depth === 0,
    };
  }

  const root = buildNode(rootProfile, 0);
  const nodes: TreeNode[] = [];
  const byId = new Map<string, TreeNode>();

  function index(node: TreeNode) {
    nodes.push(node);
    byId.set(node.id, node);
    for (const c of node.children) index(c);
  }
  index(root);

  return { root, nodes, byId };
}

function emptyLayout(): LayoutResult {
  return { root: null, nodes: [], byId: new Map() };
}

export function searchProfiles(nodes: TreeNode[], query: string): TreeNode[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return nodes
    .filter((n) => n.full_name.toLowerCase().includes(q))
    .slice(0, 10);
}
