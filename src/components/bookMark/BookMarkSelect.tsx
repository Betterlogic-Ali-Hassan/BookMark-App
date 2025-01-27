"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { bookmarkData } from "../../../constant/BookMarkData";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import { FolderTreeStructure } from "./FolderTreeStructure";
interface Folder {
  id: string;
  name: string;
  subfolders: Folder[];
}
interface TBookmarkProps {
  selectChange: (value: string) => void;
  selected: string;
  bookmarks: string[];
  handleBookmarks: (value: string) => void;
  handleRemoveBookMark: (value: string) => void;
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>;
  openPopover: boolean;
  moreFolder: boolean;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  selectedFolderId: string;
  setSelectedFolderId: React.Dispatch<React.SetStateAction<string>>;
  edited: boolean;
}

const BookmarkSelect = ({
  selected,
  selectChange,
  bookmarks,
  handleBookmarks,
  handleRemoveBookMark,
  setOpenPopover,
  openPopover,
  moreFolder,
  folders,
  setFolders,
  selectedFolderId,
  setSelectedFolderId,
  edited,
}: TBookmarkProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filterData = bookmarkData.filter((bookmark) =>
    bookmark.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {moreFolder ? (
        <FolderTreeStructure
          edited={edited}
          folders={folders}
          setFolders={setFolders}
          selectedFolderId={selectedFolderId}
          setSelectedFolderId={setSelectedFolderId}
        />
      ) : (
        <div className='flex flex-col gap-2'>
          <h4 className='text-sm font-medium mt-4'>Folder</h4>
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger className='w-full mb-1 outline-none focus:outline-none ring-0 flex h-[44px] px-4 text-sm items-center justify-between rounded-sm border border-[#ccc] bg-background   placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1'>
              {selected}
              <span>
                <ChevronDown size={20} className='text-muted-foreground' />
              </span>
            </PopoverTrigger>
            <PopoverContent className='relative z-50  max-h-96 min-w-[20.5rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md p-0'>
              <div className='p-2 py-0 border-b'>
                <div className='relative'>
                  <Search className='absolute left-1 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
                  <Input
                    placeholder='Search bookmarks...'
                    value={searchTerm}
                    onChange={handleSearch}
                    className='pl-[28px] border-0 shadow-none'
                  />
                </div>
              </div>
              <div className='overflow-y-auto max-h-40 px-2 py-2 scroll-bar'>
                {filterData.map((bookmark, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between relative w-full cursor-pointer hover:bg-[#f2f2f2] rounded-sm py-1.5 px-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group '
                    onClick={() => {
                      selectChange(bookmark);
                      setOpenPopover(false);
                    }}
                  >
                    <span>{bookmark}</span>
                    <span>
                      {bookmarks.includes(bookmark) ? (
                        <span
                          className='z-50 hover:text-blue-700 '
                          onClick={(e) => {
                            handleRemoveBookMark(bookmark);
                            e.stopPropagation();
                          }}
                        >
                          <BsPinFill size={18} />
                        </span>
                      ) : (
                        <span
                          className='z-50 hover:text-blue-700 opacity-0 group-hover:opacity-100'
                          onClick={(e) => {
                            handleBookmarks(bookmark);
                            e.stopPropagation();
                          }}
                        >
                          <BsPinAngle size={18} />
                        </span>
                      )}
                    </span>
                  </div>
                ))}
                {filterData.length === 0 && (
                  <div className='py-2 px-4 text-sm text-muted-foreground'>
                    No bookmarks found
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      <div className='flex items-center gap-2 mb-6 mt-3 flex-wrap'>
        {bookmarks &&
          bookmarks.map((bookmark, i) => (
            <span
              key={i}
              onClick={() => {
                selectChange(bookmark);
              }}
              className='p-2 px-3 border hover:bg-[#E5E5E5] rounded-full text-xs font-medium cursor-pointer bg-[#f2f2f2]'
            >
              {bookmark}
            </span>
          ))}
      </div>
    </div>
  );
};

export default BookmarkSelect;
