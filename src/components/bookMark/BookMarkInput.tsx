/* eslint-disable @typescript-eslint/no-unused-vars */
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { BookmarkContext } from "../context/BookmarkContext";

interface Props {
  className?: string;
}

const BookMarkInput = ({ className }: Props) => {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("BookMarkInput must be used within a BookmarkProvider");
  }

  const { moreFolder, inputValue, setInputValue, url, setUrl } = context;

  return (
    <div className="flex flex-col gap-2">
      {!moreFolder && (
        <label className="text-sm font-medium mt-6">Name</label>)}
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={cn(
          "flex h-10 w-full rounded border bg-transparent px-3 py-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-[#ccc]",
          moreFolder ? "mt-6" : "mt-0",
          className
        )}
      />


      {moreFolder && (
        <>
          {/* <label className="text-sm font-medium mt-4">Url</label> */}
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={cn(
              "flex h-10 w-full rounded border bg-transparent mt-4 px-3 py-3 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-[#ccc]",
              className
            )}
          />
        </>
      )}
    </div>
  );
};

export default BookMarkInput;
