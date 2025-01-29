import React, { createContext, useState, useCallback, useEffect, Dispatch, SetStateAction } from "react";
import { initialFoldersData } from "../../../constant/foldersData";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isOpen?: boolean;
  isEditing?: boolean;
}

interface BookmarkContextType {
  bookmarks: string[];
  selected: string;
  path: string;
  openPopover: boolean;
  moreFolder: boolean;
  removeBookMark: boolean;
  openFolderId: boolean;
  data: TreeNode[];
  selectedId: string | null;
  editingFolderId: string | null;
  handleBookmarks: (value: string) => void;
  handleRemoveBookMark: (value: string) => void;
  handleRemove: () => void;
  addNewFolder: () => void;
  setSelected: Dispatch<SetStateAction<string>>;
  setOpenPopover: Dispatch<SetStateAction<boolean>>;
  setMoreFolder: Dispatch<SetStateAction<boolean>>;
  setOpenFolderId: Dispatch<SetStateAction<boolean>>;
  setSelectedId: Dispatch<SetStateAction<string | null>>;
  setEditingFolderId: Dispatch<SetStateAction<string | null>>;
  setData: Dispatch<SetStateAction<TreeNode[]>>;
}

export const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined
);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("Bookmark bar");
  const [path, setPath] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [moreFolder, setMoreFolder] = useState(false);
  const [removeBookMark, setRemoveBookMark] = useState(false);
  const [openFolderId, setOpenFolderId] = useState(false);
  const [data, setData] = useState<TreeNode[]>(initialFoldersData);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  const handleBookmarks = useCallback((value: string) => {
    setBookmarks((prev) => (!prev.includes(value) ? [...prev, value] : prev));
  }, []);

  const handleRemoveBookMark = useCallback((value: string) => {
    setBookmarks((prev) => prev.filter((item) => item !== value));
  }, []);

  const handleRemove = useCallback(() => {
    setMoreFolder((prev) => {
      if (prev) return false;
      setRemoveBookMark((prevRemove) => !prevRemove);
      return prev;
    });
  }, []);

  useEffect(() => {
    setPath(window.location.href);
  }, []);

  const addNewFolder = () => {
    const newFolder: TreeNode = {
      id: String(Date.now()),
      name: "New Folder",
      children: [],
      isOpen: false,
    };

    if (!selectedId) {
      setData([...data, newFolder]);
      setEditingFolderId(newFolder.id);
      return;
    }

    const addToChildren = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === selectedId) {
          return {
            ...node,
            children: [...(node.children || []), newFolder],
            isOpen: true,
            isEditing: false,
          };
        }
        if (node.children) {
          return {
            ...node,
            children: addToChildren(node.children),
          };
        }
        return node;
      });
    };

    setData(addToChildren(data));
    setEditingFolderId(newFolder.id);
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        selected,
        path,
        openPopover,
        moreFolder,
        removeBookMark,
        openFolderId,
        data,
        selectedId,
        editingFolderId,
        handleBookmarks,
        handleRemoveBookMark,
        handleRemove,
        addNewFolder,
        setSelected,
        setOpenPopover,
        setMoreFolder,
        setOpenFolderId,
        setSelectedId,
        setEditingFolderId,
        setData,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
