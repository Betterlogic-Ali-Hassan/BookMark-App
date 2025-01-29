import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { BsPinAngle, BsPinFill } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { FolderTree } from "./FoldertreeView";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

interface TBookmarkProps {
  selectChange: (value: string) => void;
  selected: string;
  bookmarks: string[];
  handleBookmarks: (value: string) => void;
  handleRemoveBookMark: (value: string) => void;
  pinnedFolders: string[]; // Holds pinned folder IDs
  handlePinFolder: (value: string) => void;
  handleUnpinFolder: (value: string) => void;
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>;
  openPopover: boolean;
  moreFolder: boolean;
  setSelectedId: (id: string | null) => void;
  selectedId: string | null;
  data: TreeNode[];
  setData: (data: TreeNode[]) => void;
  editingFolderId: string | null;
  setEditingFolderId: React.Dispatch<React.SetStateAction<string | null>>;
}

const BookmarkSelect = ({
  selected,
  selectChange,
  // bookmarks,
  // handleBookmarks,
  // handleRemoveBookMark,
  pinnedFolders,
  handlePinFolder,
  handleUnpinFolder,
  setOpenPopover,
  openPopover,
  moreFolder,
  selectedId,
  setSelectedId,
  setData,
  data,
  editingFolderId,
  setEditingFolderId,
}: TBookmarkProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chromeFolders, setChromeFolders] = useState<TreeNode[]>([]);
  const [activeBookmark, setActiveBookmark] = useState<string | null>(null); // ✅ Added missing state

  /** Fetch Chrome bookmark folders dynamically */
  useEffect(() => {
    if (chrome?.bookmarks) {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        const extractFolders = (nodes: chrome.bookmarks.BookmarkTreeNode[]): TreeNode[] => {
          return nodes
            .filter((node) => node.children) // Keep only folders
            .map((folder) => ({
              id: folder.id,
              name: folder.title,
              children: folder.children ? extractFolders(folder.children) : [],
            }));
        };

        const fetchedFolders = extractFolders(bookmarkTreeNodes[0].children || []);
        setChromeFolders(fetchedFolders);
      });
    }
  }, []);

  /** Flatten folder tree for search */
  const flattenFolders = (folders: TreeNode[]): TreeNode[] => {
    return folders.reduce<TreeNode[]>((acc, folder) => {
      acc.push({ id: folder.id, name: folder.name });
      if (folder.children) acc = acc.concat(flattenFolders(folder.children));
      return acc;
    }, []);
  };

  const allFolders = flattenFolders(chromeFolders);

  /** Filter folders based on search */
  const filterData = allFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /** ✅ Added missing handleSearch function */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      {moreFolder ? (
        <>
          <FolderTree
            editingFolderId={editingFolderId}
            setEditingFolderId={setEditingFolderId}
            data={data}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setData={setData}
          />
        </>
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
                      selectChange(bookmark.name);
                      setOpenPopover(false);
                    }}
                  >
                    <span>{bookmark.name}</span>
                    <span>
                      {pinnedFolders.includes(bookmark.id) ? (
                        <span
                          className='z-50 hover:text-blue-700 '
                          onClick={(e) => {
                            handleUnpinFolder(bookmark.id);
                            e.stopPropagation();
                          }}
                        >
                          <BsPinFill size={18} />
                        </span>
                      ) : (
                        <span
                          className='z-50 hover:text-blue-700 opacity-0 group-hover:opacity-100'
                          onClick={(e) => {
                            handlePinFolder(bookmark.id);
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
        {pinnedFolders.map((folderId, i) => {
          const folder = allFolders.find((f) => f.id === folderId);
          return folder ? (
            <span
              key={i}
              onClick={() => {
                setActiveBookmark(folder.name);
                selectChange(folder.name);
              }}
              className={cn(
                "p-2 px-3  hover:bg-[#E5E5E5] rounded-full text-xs font-medium cursor-pointer bg-[#f2f2f2] border-2 border-transparent ",
                activeBookmark === folder.name && " border-[#ccc] border-dashed"
              )}
            >
              {folder.name}
            </span>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default BookmarkSelect;
