"use client";

import React, { useEffect, useState } from "react";
import BookMarkInput from "./BookMarkInput";
import BookmarkSelect from "./BookMarkSelect";
import BookMarkBtn from "./BookMarksBtn";
import { cn } from "@/lib/utils";

const BookMark = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("Bookmark bar");
  const [path, setPath] = useState("");
  const [openPopover, setOpenPopover] = useState(false);
  const [moreFolder, setMoreFolder] = useState(false);
  const [removeBookMark, setRemoveBookMark] = useState(false);
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
        <h1 className='font-medium text-[15px]'>
          {removeBookMark ? "Edit bookMark" : "Bookmark added"}
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
            text={moreFolder ? "New folder" : "More"}
            onClick={() => setMoreFolder(true)}
          />
          <div className='flex items-center gap-3'>
            <BookMarkBtn
              text={moreFolder ? "Cancel" : "Remove"}
              onClick={handleRemove}
            />
            <BookMarkBtn
              text={moreFolder ? "Save" : "Done"}
              className='bg-black text-white hover:bg-black/80 hover:text-white px-6'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookMark;
