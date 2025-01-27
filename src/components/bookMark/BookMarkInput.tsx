import { cn } from "@/lib/utils";
import { useState } from "react";
interface Props {
  value?: string;
  title?: string;
  className?: string;
}
const BookMarkInput = ({ value, title, className }: Props) => {
  const [inputValue, setInputValue] = useState(value);
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium mt-6 '>{title}</label>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className={cn(
          "flex h-10 w-full rounded border border-input bg-transparent px-3 py-3 text-base  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ",
          className
        )}
      />
    </div>
  );
};

export default BookMarkInput;
