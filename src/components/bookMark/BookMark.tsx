"use client";

import React, { useContext } from "react";
import { cn } from "@/lib/utils";
import BookMarkInput from "./BookMarkInput";
import Header from "./Header";
import Footer from "./Footer";
import { BookmarkContext } from "../context/BookmarkContext";
import BookmarkSelect from "./BookMarkSelect";

const BookMark: React.FC = () => {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("BookMark must be used within a BookmarkProvider");
  }

  const {
    bookmarks,
    selected,
    path,
    openPopover,
    moreFolder,
    removeBookMark,
    openFolderId,
    data,
    selectedId,
    editingFolderId, // ✅ Already here
    setSelectedId,
    setData,
    setOpenPopover,
    setSelected,
    handleBookmarks,
    handleRemoveBookMark,
    addNewFolder,
    handleRemove,
    setMoreFolder,
    setOpenFolderId,
    setEditingFolderId, // ✅ Add this missing setter
  } = context;
  

  return (
    <div
      className={cn(
        "high-shadow bg-card rounded-lg border w-[380px] relative h-auto",
        openPopover && "h-[450px]"
      )}
    >
      <Header removeBookMark={removeBookMark} />
      <div className="p-6 pt-0 flex flex-col justify-between">
        <div>
          <BookMarkInput
            value="Create new app"
            title="Name"
            className={cn(moreFolder && "h-[46px]")}
          />
          {moreFolder && <BookMarkInput value={path} title="URL" className="h-[46px]" />}
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
