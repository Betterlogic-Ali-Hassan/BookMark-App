import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
interface Props {
  text: string;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}
const BookMarkBtn = ({ text, className, onClick, icon }: Props) => {
  return (
    <Button
      variant='outline'
      onClick={onClick}
      className={cn(
        " flex items-center gap-1 !pl-3  bg-[#f2f2f2] hover:bg-[#E5E5E5] cursor-pointer ",
        className
      )}
    >
      {icon && icon}
      {text}
    </Button>
  );
};

export default BookMarkBtn;
