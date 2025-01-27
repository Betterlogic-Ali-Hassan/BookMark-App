import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const BookMarkBtn = ({
  text,
  className,
  onClick,
}: {
  text: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Button
      variant='outline'
      onClick={onClick}
      className={cn(
        " flex items-center gap-2  bg-[#f2f2f2] hover:bg-[#E5E5E5] cursor-pointer ",
        className
      )}
    >
      {text}
    </Button>
  );
};

export default BookMarkBtn;
