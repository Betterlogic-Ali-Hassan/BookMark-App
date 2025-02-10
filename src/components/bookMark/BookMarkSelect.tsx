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
  isOpen?: boolean;
  isEditing?: boolean;
}

interface TBookmarkProps {
  selectChange: (value: string) => void;
  selected: string;
  bookmarks: string[];
  handleBookmarks: (value: string) => void;
  pinnedFolders: string[]; // Holds pinned folder IDs
  handlePinFolder: (value: string) => void;
  handleUnpinFolder: (value: string) => void;
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>;
  openPopover: boolean;
  moreFolder: boolean;
  setSelectedId: (id: string | null) => void;
  selectedId: string | null;
  data: TreeNode[];
  setData: React.Dispatch<React.SetStateAction<TreeNode[]>>;
  editingFolderId: string | null;
  setEditingFolderId: React.Dispatch<React.SetStateAction<string | null>>;
}

const BookmarkSelect = ({
  selected,
  selectChange,
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
  const [activeBookmark, setActiveBookmark] = useState<string | null>(null);

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

  /** Check if the current page is already bookmarked */
  useEffect(() => {
    if (chrome?.tabs && chrome?.bookmarks) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url) {
          const currentUrl = tabs[0].url;

          // Search for the bookmark by URL
          chrome.bookmarks.search({ url: currentUrl }, (results) => {
            if (results.length > 0) {
              const bookmark = results[0];
              const folderId = bookmark.parentId;

              // Find the folder name using the folder ID
              const findFolderName = (nodes: TreeNode[], targetId: string): string | null => {
                for (const node of nodes) {
                  if (node.id === targetId) {
                    return node.name;
                  }
                  if (node.children) {
                    const result = findFolderName(node.children, targetId);
                    if (result) return result;
                  }
                }
                return null;
              };

              if (folderId) {
                const folderName = findFolderName(chromeFolders, folderId);
                if (folderName) {
                  selectChange(folderName); // Update selected folder name
                  setSelectedId(folderId); // Update selected folder ID
                  setActiveBookmark(folderName); // Set active bookmark
                }
              }
            }
          });
        }
      });
    }
  }, [chromeFolders, selectChange, setSelectedId]);

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

  /** Handle search input */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="pb-4">
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
        <div className="pb-4">
          <div className='flex flex-col gap-2 '>
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
                        console.log("Folder Selected:", bookmark.name, "ID:", bookmark.id); //  Debugging
                        selectChange(bookmark.name); //  Update selected folder name
                        setSelectedId(bookmark.id); //  Update folder ID
                        setActiveBookmark(bookmark.name); // Set active bookmark
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
        </div>
      )}
      <div className="pb-12">
        <div className='flex items-center gap-2 mt-3 flex-wrap'>
          {pinnedFolders.map((folderId, i) => {
            const folder = allFolders.find((f) => f.id === folderId);
            return folder ? (
              <span
                key={i}
                onClick={() => {
                  setActiveBookmark(folder.name); // Set active bookmark
                  selectChange(folder.name); // Update selected folder name
                  setSelectedId(folder.id); // Update selected folder ID

                  //  Expand all parent folders leading to this folder
                  setData((prevData) => {
                    const expandParentFolders = (nodes: TreeNode[], targetId: string): TreeNode[] => {
                      return nodes.map((node) => {
                        if (node.id === targetId) {
                          return { ...node, isOpen: true };
                        }
                        if (node.children) {
                          const updatedChildren = expandParentFolders(node.children, targetId);
                          const shouldOpen = updatedChildren.some((child) => child.isOpen);
                          return { ...node, children: updatedChildren, isOpen: shouldOpen };
                        }
                        return node;
                      });
                    };

                    return expandParentFolders(prevData, folder.id);
                  });
                }}
                className={cn(
                  "p-2 px-3 hover:bg-[#E5E5E5] rounded-full text-xs font-medium cursor-pointer bg-[#f2f2f2] border-2 border-transparent",
                  activeBookmark === folder.name && "border-[#ccc] border-dashed"
                )}
              >
                {folder.name}
              </span>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
};

export default BookmarkSelect;