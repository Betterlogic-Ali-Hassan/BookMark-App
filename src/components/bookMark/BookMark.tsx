"use client";

import React, { useContext, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import BookMarkInput from "./BookMarkInput";
import Header from "./Header";
import Footer from "./Footer";
import { BookmarkContext } from "../context/BookmarkContext";
import BookmarkSelect from "./BookMarkSelect";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isOpen?: boolean;
  isEditing?: boolean;
}

const BookMark: React.FC = () => {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("BookMark must be used within a BookmarkProvider");
  }

  const {
    bookmarks,
    selected,
    openPopover,
    moreFolder,
    removeBookMark,
    openFolderId,
    data,
    selectedId,
    editingFolderId,
    setSelectedId,
    setData,
    setOpenPopover,
    setSelected,
    handleBookmarks,
    setOpenFolderId,
    setEditingFolderId,
  } = context;

  //  Persistent Pinned Folders State
  const [pinnedFolders, setPinnedFolders] = useState<string[]>([]);

  //  Load pinned folders from Chrome Storage
  useEffect(() => {
    if (chrome?.storage) {
      chrome.storage.local.get(["pinnedFolders"], (result) => {
        if (result.pinnedFolders) {
          setPinnedFolders(result.pinnedFolders);
          console.log("Loaded pinned folders:", result.pinnedFolders);
        }
      });
    }
  }, []);

  //  Function to pin a folder
  const handlePinFolder = (folderId: string) => {
    setPinnedFolders((prev) => {
      const updated = prev.includes(folderId) ? prev : [...prev, folderId];
  
      //  Save pinned folders to Chrome Storage
      chrome.storage.local.set({ pinnedFolders: updated });
  
      //  Open the folder in FolderTree
      setData((prevData) => {
        const toggleOpenState = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map((node) => ({
            ...node,
            isOpen: node.id === folderId ? true : node.isOpen, //  Ensure it opens
            children: node.children ? toggleOpenState(node.children) : node.children,
          }));
        };
        return toggleOpenState(prevData);
      });
  
      return updated;
    });
  
    //  Also update `selectedId` to make sure the pinned folder is selected
    setSelectedId(folderId);
  };
  
  

  //  Function to unpin a folder
  const handleUnpinFolder = (folderId: string) => {
    setPinnedFolders((prev) => {
      const updated = prev.filter((id) => id !== folderId);
  
      //  Save updated pinned folders to Chrome Storage
      chrome.storage.local.set({ pinnedFolders: updated });
  
      //  Close the folder in FolderTree
      setData((prevData) => {
        const toggleCloseState = (nodes: TreeNode[]): TreeNode[] => {
          return nodes.map((node) => ({
            ...node,
            isOpen: node.id === folderId ? false : node.isOpen, //  Ensure it closes
            children: node.children ? toggleCloseState(node.children) : node.children,
          }));
        };
        return toggleCloseState(prevData);
      });
  
      return updated;
    });
  };
  
  

  return (
    <div
      className={cn(
        "high-shadow bg-card rounded-lg border w-[380px] relative h-auto scroll-bar",
        openPopover && "h-[450px]"
      )}
    >
      <Header removeBookMark={removeBookMark} />
      <div className="p-6 pt-0 flex flex-col justify-between">
        <div>
          <BookMarkInput className={cn(moreFolder && "h-[46px]")} />
          <BookmarkSelect
            {...{
              editingFolderId,
              setEditingFolderId,
              data,
              selectedId,
              setSelectedId,
              setData,
              openPopover,
              setOpenPopover,
              selected,
              selectChange: setSelected,
              handleBookmarks,
              bookmarks,
              moreFolder,
              openFolderId,
              setOpenFolderId,
              pinnedFolders,
              handlePinFolder,
              handleUnpinFolder,
            }}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BookMark;
