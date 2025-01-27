export interface Folder {
  id: string;
  name: string;
  subfolders: Folder[];
}

export const initialFoldersData: Folder[] = [
  {
    id: "1",
    name: "Projects",
    subfolders: [
      {
        id: "1-1",
        name: "Office",
        subfolders: [],
      },
      {
        id: "1-2",
        name: "Social",
        subfolders: [],
      },
      {
        id: "1-3",
        name: "Others",
        subfolders: [],
      },
    ],
  },
  { id: "2", name: "Backorder", subfolders: [] },
  { id: "3", name: "DMCA", subfolders: [] },
  { id: "4", name: "SEO", subfolders: [] },
  {
    id: "5",
    name: "IMP",
    subfolders: [
      {
        id: "5-1",
        name: "Payment Gateway",
        subfolders: [],
      },
      {
        id: "5-2",
        name: "Sheet",
        subfolders: [],
      },
      {
        id: "5-3",
        name: "Nulled Scripts sites",
        subfolders: [],
      },
      {
        id: "5-4",
        name: "AUG Copycat",
        subfolders: [],
      },
      {
        id: "5-5",
        name: "Affiliate project",
        subfolders: [],
      },
      {
        id: "5-6",
        name: "Apartments",
        subfolders: [],
      },
    ],
  },
  { id: "6", name: "Freeware Project", subfolders: [] },
  { id: "7", name: "Affiliate project", subfolders: [] },
];
