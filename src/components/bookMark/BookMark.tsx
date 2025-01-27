"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Folder, BookMarkProps } from "../../../types/Bookmark";
import BookMarkInput from "./BookMarkInput";
import BookmarkSelect from "./BookMarkSelect";
import Header from "./Header";
import Footer from "./Footer";
import { initialFoldersData } from "../../../constant/foldersData";

const BookMark: React.FC<BookMarkProps> = ({
  initialFolders = initialFoldersData,
}) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("Bookmark bar");
  const [path, setPath] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [moreFolder, setMoreFolder] = useState(false);
  const [removeBookMark, setRemoveBookMark] = useState(false);
  const [edited, setEdited] = useState(false);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("1");

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

  const handleAddFolder = useCallback(() => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: "New Folder",
      subfolders: [],
    };

    setFolders((prevFolders) => {
      const addFolderRecursively = (folderList: Folder[]): Folder[] => {
        return folderList.map((folder) => {
          if (folder.id === selectedFolderId) {
            return { ...folder, subfolders: [...folder.subfolders, newFolder] };
          } else if (folder.subfolders.length > 0) {
            return {
              ...folder,
              subfolders: addFolderRecursively(folder.subfolders),
            };
          }
          return folder;
        });
      };

      return addFolderRecursively(prevFolders);
    });
    setEdited(true);
  }, [selectedFolderId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".folder-input")) {
        setEdited(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    setPath(window.location.href);
  }, []);

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
              edited,
              folders,
              setFolders,
              selectedFolderId,
              setSelectedFolderId,
              openPopover,
              setOpenPopover,
              selected,
              selectChange: setSelected,
              handleBookmarks,
              bookmarks,
              handleRemoveBookMark,
              moreFolder,
            }}
          />
        </div>
        <Footer
          moreFolder={moreFolder}
          handleAddFolder={handleAddFolder}
          setMoreFolder={setMoreFolder}
          handleRemove={handleRemove}
        />
      </div>
    </div>
  );
};

export default BookMark;
