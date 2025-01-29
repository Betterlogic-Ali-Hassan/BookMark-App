import { useContext } from "react";
import { BookmarkContext } from "../context/BookmarkContext";
import BookMarkBtn from "./BookMarksBtn";

interface FooterProps {
  moreFolder: boolean;
  handleAddFolder: () => void;
  setMoreFolder: (value: boolean) => void;
}

const Footer: React.FC<FooterProps> = ({
  moreFolder,
  handleAddFolder,
  setMoreFolder,
}) => {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("Footer must be used within a BookmarkProvider");
  }

  /** ✅ Send message to background script to remove the bookmark for the current tab */
  const handleRemoveClick = () => {
    chrome.runtime.sendMessage({ action: "removeBookmark" }, (response) => {
      if (response?.status === "success") {
        console.log("Bookmark successfully removed!");
      } else {
        console.error("Failed to remove bookmark:", response?.message);
      }
    });
  };

  return (
    <div className='flex items-center justify-between mt-auto'>
      <BookMarkBtn
        icon={moreFolder ? <FolderIcon /> : <MoreIcon />}
        text={moreFolder ? "New folder" : "More"}
        onClick={moreFolder ? handleAddFolder : () => setMoreFolder(true)}
      />
      <div className='flex items-center gap-3'>
        <BookMarkBtn
          icon={<RemoveIcon />}
          text={moreFolder ? "Cancel" : "Remove"}
          onClick={handleRemoveClick} // ✅ Calls remove function
        />
        <BookMarkBtn
          icon={moreFolder ? <SaveIcon /> : <DoneIcon />}
          text={moreFolder ? "Save" : "Done"}
          className='bg-black text-white hover:bg-black/80 hover:text-white px-4'
        />
      </div>
    </div>
  );
};

// ✅ Keep all SVG icons the same
const FolderIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#000000' className='mb-0.5'>
    <path d='M560-320h80v-80h80v-80h-80v-80h-80v80h-80v80h80v80ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z' />
  </svg>
);

const MoreIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#000000' className='mb-0.5'>
    <path d='M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z' />
  </svg>
);

const RemoveIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#000000' className='mb-[1px]'>
    <path d='m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z' />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#ffff' className='mb-0.5'>
    <path d='M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z' />
  </svg>
);

const DoneIcon = () => (
  <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#ffff'>
    <path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z' />
  </svg>
);

export default Footer;
