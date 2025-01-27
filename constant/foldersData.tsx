export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isOpen?: boolean;
}

export const initialFoldersData: TreeNode[] = [
  {
    id: "1",
    name: "Projects",
    children: [
      { id: "2", name: "Office" },
      { id: "3", name: "Social" },
      { id: "4", name: "Others" },
    ],
    isOpen: false,
  },
  { id: "5", name: "Backorder" },
  { id: "6", name: "DMCA" },
  { id: "7", name: "SEO" },
  {
    id: "8",
    name: "IMP",
    children: [
      { id: "5", name: "Projects" },
      { id: "6", name: "All Projects" },
      { id: "7", name: "My Projects" },
    ],
    isOpen: false,
  },
];
