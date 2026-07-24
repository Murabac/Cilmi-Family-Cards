export type Demographic =
  | "male"
  | "female"
  | "child"
  | "student"
  | "deceased"
  | string
  | null;

export type MaritalStatus =
  | "married"
  | "single"
  | "widowed"
  | "divorced"
  | string
  | null;

export interface Profile {
  id: string;
  full_name: string;
  father_id: string | null;
  birth_order: number | null;
  demographic: Demographic;
  marital_status: MaritalStatus;
  care_rating: number | null;
  avatar_url: string | null;
  city: string | null;
  occupation: string | null;
  phone_number: string | null;
  email: string | null;
}

export interface TreeNode extends Profile {
  children: TreeNode[];
  depth: number;
  isRoot: boolean;
}

export interface LayoutResult {
  root: TreeNode | null;
  nodes: TreeNode[];
  byId: Map<string, TreeNode>;
}

export interface ConnectedPeople {
  children: TreeNode[];
  father: TreeNode | null;
}
