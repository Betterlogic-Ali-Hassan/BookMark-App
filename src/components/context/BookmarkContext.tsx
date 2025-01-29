import React, { createContext, useState, useCallback, useEffect, Dispatch, SetStateAction } from "react";

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
  inputValue: string;
  url: string;
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
  setInputValue: Dispatch<SetStateAction<string>>;
  setUrl: Dispatch<SetStateAction<string>>;
}

export const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("Bookmark bar");
  const [path, setPath] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [moreFolder, setMoreFolder] = useState(false);
  const [removeBookMark, setRemoveBookMark] = useState(false);
  const [openFolderId, setOpenFolderId] = useState(false);
  const [data, setData] = useState<TreeNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [url, setUrl] = useState("");

  const handleBookmarks = useCallback((url: string) => {
    setBookmarks((prev) => (!prev.includes(url) ? [...prev, url] : prev));
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
    if (!chrome || !chrome.bookmarks) {
      console.warn("Chrome Bookmarks API is not available.");
      return;
    }
  
    const parentId = selectedId || "1"; // Default to "Bookmarks Bar" if nothing is selected
  
    chrome.bookmarks.create(
      {
        parentId,
        title: "New Folder",
      },
      (newFolder) => {
        if (chrome.runtime.lastError) {
          console.error("Error creating bookmark folder:", chrome.runtime.lastError.message);
          return;
        }
  
        console.log("Bookmark folder created:", newFolder);
  
        // ✅ Create local TreeNode representation
        const newTreeNode: TreeNode = {
          id: newFolder.id,
          name: newFolder.title,
          children: [],
          isOpen: false,
        };
  
        // ✅ Update local state to reflect the new folder
        setData((prevData) => {
          const addFolderToTree = (nodes: TreeNode[]): TreeNode[] =>
            nodes.map((node) => {
              if (node.id === parentId) {
                return {
                  ...node,
                  children: [...(node.children || []), newTreeNode],
                  isOpen: true,
                  isEditing: false,
                };
              }
              if (node.children) {
                return { ...node, children: addFolderToTree(node.children) };
              }
              return node;
            });
  
          return addFolderToTree(prevData);
        });
  
        setEditingFolderId(newFolder.id);
      }
    );
  };
  
  const transformChromeBookmarks = (bookmarkTreeNodes: chrome.bookmarks.BookmarkTreeNode[]): TreeNode[] => {
    return bookmarkTreeNodes
      .filter((folder) => folder.children) // Only folders with children
      .map((folder) => ({
        id: folder.id,
        name: folder.title, // Folder name is the title
        isOpen: false, // Folders are initially closed
        children: folder.children ? transformChromeBookmarks(folder.children) : [], // Recursively transform children
      }));
  };

  useEffect(() => {
    const fetchChromeBookmarks = () => {
      if (!chrome || !chrome.bookmarks) {
        console.warn("Chrome Bookmarks API is not available. Ensure this is running inside a Chrome extension.");
        return;
      }
  
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        console.log("Raw Chrome Bookmarks:", bookmarkTreeNodes);
  
        if (bookmarkTreeNodes && bookmarkTreeNodes.length > 0) {
          const chromeBookmarks = transformChromeBookmarks(bookmarkTreeNodes[0].children || []);
  
          setData(chromeBookmarks);
  
          // ✅ Print all folders with their IDs in a readable format
          console.log("Formatted Chrome Bookmark Folders:");
          // chromeBookmarks.forEach((folder) => printFolderStructure(folder, 0));
  
          console.log("Updated Chrome Bookmark Data:", chromeBookmarks);
        }
      });
    };
  
    fetchChromeBookmarks();
  }, []);
  

  /** Fetch Active Tab Title & URL on Extension Open */
  useEffect(() => {
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].title && tabs[0].url) {
          setInputValue(tabs[0].title); // ✅ Store tab title
          setUrl(tabs[0].url); // ✅ Store tab URL
          handleBookmarks(tabs[0].url); // ✅ Add to bookmarks
        }
      });
    }
  }, [handleBookmarks]);

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
        url,
        inputValue,
        setInputValue,
        setUrl,
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
