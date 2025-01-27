"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import BookMarkInput from "./BookMarkInput";
import BookmarkSelect from "./BookMarkSelect";
import Header from "./Header";
import Footer from "./Footer";
import { initialFoldersData } from "../../../constant/foldersData";
interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isOpen?: boolean;
  isEditing?: boolean;
}
const BookMark: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("Bookmark bar");
  const [path, setPath] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [moreFolder, setMoreFolder] = useState(false);
  const [removeBookMark, setRemoveBookMark] = useState(false);
  const [openFolderId, setOpenFolderId] = useState(false); // Track open folder
  const [data, setData] = React.useState<TreeNode[]>(initialFoldersData);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
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
      id: Math.random().toString(36).substr(2, 9),
      name: "New Folder",
      children: [],
      isOpen: false,
      isEditing: true,
    };

    if (!selectedId) {
      setData([...data, newFolder]);
      return;
    }

    const addToChildren = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === selectedId) {
          return {
            ...node,
            children: [...(node.children || []), newFolder],
            isOpen: true,
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
  };

  return (
    <div
      className={cn(
        "high-shadow bg-card rounded-lg border w-[380px] relative h-auto",
        openPopover && "h-[450px]"
      )}
    >
      <Header removeBookMark={removeBookMark} />
      <div className='p-6 pt-0 flex flex-col justify-between'>
        <div>
          <BookMarkInput
            value='Create new app'
            title='Name'
            className={cn(moreFolder && "h-[46px]")}
          />
          {moreFolder && (
            <BookMarkInput value={path} title='URL' className='h-[46px]' />
          )}
          <BookmarkSelect
            {...{
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
              handleRemoveBookMark,
              moreFolder,
              openFolderId,
              setOpenFolderId,
            }}
          />
        </div>
        <Footer
          moreFolder={moreFolder}
          handleAddFolder={addNewFolder}
          setMoreFolder={setMoreFolder}
          handleRemove={handleRemove}
        />
      </div>
    </div>
  );
};

export default BookMark;
