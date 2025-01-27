"use client";

import { useEffect, useState } from "react";
import BookMarkInput from "./BookMarkInput";
import BookmarkSelect from "./BookMarkSelect";
import BookMarkBtn from "./BookMarksBtn";
import { cn } from "@/lib/utils";
interface Folder {
  id: string;
  name: string;
  subfolders: Folder[];
}
const BookMark = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("Bookmark bar");
  const [path, setPath] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [moreFolder, setMoreFolder] = useState(false);
  const [removeBookMark, setRemoveBookMark] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([
    { id: "1", name: "Root Folder", subfolders: [] },
  ]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>("1");
  const handleBookmarks = (value: string) => {
    if (!bookmarks.includes(value)) setBookmarks([...bookmarks, value]);
  };
  const handleSelectChange = (value: string) => {
    setSelected(value);
  };
  const handleRemoveBookMark = (value: string) => {
    setBookmarks(bookmarks.filter((item) => item !== value));
  };
  const handleRemove = () => {
    if (moreFolder) {
      setMoreFolder(false);
    } else {
      setRemoveBookMark(!removeBookMark);
    }
  };
  const handleAddFolder = () => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: "New Folder",
      subfolders: [],
    };

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

    setFolders(addFolderRecursively(folders));
  };
  useEffect(() => {
    setPath(window.location.href);
  }, [path]);
  return (
    <div
      className={cn(
        "high-shadow bg-card rounded-lg border w-[380px] relative h-auto",
        openPopover && "h-[450px]"
      )}
    >
      <div className='py-3 px-4 border-b '>
        <h1 className='font-medium text-[15px] flex items-center gap-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='24px'
            viewBox='0 -960 960 960'
            width='24px'
            fill='black'
          >
            <path d='m489-460 91-55 91 55-24-104 80-69-105-9-42-98-42 98-105 9 80 69-24 104Zm19 260h224q-7 26-24 42t-44 20L228-85q-33 5-59.5-15.5T138-154L85-591q-4-33 16-59t53-30l46-6v80l-36 5 54 437 290-36Zm-148-80q-33 0-56.5-23.5T280-360v-440q0-33 23.5-56.5T360-880h440q33 0 56.5 23.5T880-800v440q0 33-23.5 56.5T800-280H360Zm0-80h440v-440H360v440Zm220-220ZM218-164Z' />
          </svg>
          {removeBookMark ? "Edit bookmark" : "Bookmark added"}
        </h1>
      </div>
      <div className='p-6 pt-0 flex flex-col justify-between'>
        <div>
          {moreFolder ? (
            <>
              <BookMarkInput value='Create new app' title='Name' />
              <BookMarkInput value={path} title='URL' />
            </>
          ) : (
            <BookMarkInput value='Create new app' title='Name' />
          )}

          <BookmarkSelect
            folders={folders}
            setFolders={setFolders}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
            openPopover={openPopover}
            setOpenPopover={setOpenPopover}
            selected={selected}
            selectChange={handleSelectChange}
            handleBookmarks={handleBookmarks}
            bookmarks={bookmarks}
            handleRemoveBookMark={handleRemoveBookMark}
            moreFolder={moreFolder}
          />
        </div>
        <div className='flex items-center justify-between mt-auto'>
          <BookMarkBtn
            icon={
              moreFolder ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='24px'
                  viewBox='0 -960 960 960'
                  width='24px'
                  fill='#000000'
                  className='mb-0.5'
                >
                  <path d='M560-320h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z' />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='24px'
                  viewBox='0 -960 960 960'
                  width='24px'
                  fill='#000000'
                  className='mb-0.5'
                >
                  <path d='M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z' />
                </svg>
              )
            }
            text={moreFolder ? "New folder" : "More"}
            onClick={moreFolder ? handleAddFolder : () => setMoreFolder(true)}
          />
          <div className='flex items-center gap-3'>
            <BookMarkBtn
              icon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='24px'
                  viewBox='0 -960 960 960'
                  width='24px'
                  fill='#000000'
                  className='mb-[1px]'
                >
                  <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
                </svg>
              }
              text={moreFolder ? "Cancel" : "Remove"}
              onClick={handleRemove}
            />
            <BookMarkBtn
              icon={
                moreFolder ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='24px'
                    viewBox='0 -960 960 960'
                    width='24px'
                    fill='#ffff'
                    className='mb-0.5'
                  >
                    <path d='M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z' />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='24px'
                    viewBox='0 -960 960 960'
                    width='24px'
                    fill='#ffff'
                  >
                    <path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z' />
                  </svg>
                )
              }
              text={moreFolder ? "Save" : "Done"}
              className='bg-black text-white hover:bg-black/80 hover:text-white px-4'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookMark;
