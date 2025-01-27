"use client";

import * as React from "react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";

interface Folder {
  id: string;
  name: string;
  subfolders: Folder[];
}

interface NavItemProps {
  folder: Folder;
  onSelect: (folderId: string) => void;
  onAddFolder: (parentId: string) => void;
  selectedFolderId: string;
  onRename: (folderId: string, newName: string) => void;
  edited: boolean;
  openFolderId: boolean;
  setOpenFolderId: (id: boolean) => void;
}

function NavItem({
  folder,
  onSelect,
  onAddFolder,
  selectedFolderId,
  onRename,
  edited,
  openFolderId,
  setOpenFolderId,
}: NavItemProps) {
  const [isEditing, setIsEditing] = React.useState(edited);
  const [newName, setNewName] = React.useState(folder.name);

  const handleClick = () => {
    setOpenFolderId(!openFolderId);
    onSelect(folder.id); // Always select the folder when clicked
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    onRename(folder.id, newName);
    setIsEditing(false);
  };

  return (
    <Collapsible open={openFolderId}>
      <CollapsibleTrigger asChild>
        <div
          onClick={handleClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer",
            selectedFolderId === folder.id
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50",
            folder.subfolders.length > 0 ? "justify-between" : "justify-start"
          )}
        >
          <div className='flex items-center gap-3 flex-grow'>
            {openFolderId ? (
              <FcOpenedFolder size={18} />
            ) : (
              <FcFolder size={18} />
            )}
            {isEditing ? (
              <form onSubmit={handleRename} className='flex-grow'>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                  className='h-6 py-0 px-1'
                />
              </form>
            ) : (
              <span onDoubleClick={() => setIsEditing(true)}>
                {folder.name}
              </span>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {folder.subfolders.length > 0 && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  openFolderId && "rotate-90"
                )}
              />
            )}
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div
          className='ml-6 mt-1 space-y-1'
          onClick={(e) => e.stopPropagation()}
        >
          {folder.subfolders.map((subfolder) => (
            <NavItem
              openFolderId={openFolderId}
              setOpenFolderId={setOpenFolderId}
              edited={edited}
              key={subfolder.id}
              folder={subfolder}
              onSelect={onSelect}
              onAddFolder={onAddFolder}
              selectedFolderId={selectedFolderId}
              onRename={onRename}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface FolderTreeStructureProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  selectedFolderId: string;
  setSelectedFolderId: React.Dispatch<React.SetStateAction<string>>;
  edited: boolean;
  openFolderId: boolean;
  setOpenFolderId: (id: boolean) => void;
}

export function FolderTreeStructure({
  folders,
  setFolders,
  selectedFolderId,
  setSelectedFolderId,
  edited,
  openFolderId,
  setOpenFolderId,
}: FolderTreeStructureProps) {
  const handleSelect = (folderId: string) => {
    setSelectedFolderId(folderId);
  };

  const handleAddFolder = (parentId: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: "New Folder",
      subfolders: [],
    };

    const addFolderRecursively = (folderList: Folder[]): Folder[] => {
      return folderList.map((folder) => {
        if (folder.id === parentId) {
          return {
            ...folder,
            subfolders: [...folder.subfolders, newFolder],
          };
        } else if (folder.subfolders.length > 0) {
          return {
            ...folder,
            subfolders: addFolderRecursively(folder.subfolders),
          };
        }
        return folder;
      });
    };

    setFolders(addFolderRecursively(folders));

    // Open and select the parent folder
    setSelectedFolderId(parentId);
  };

  const handleRename = (folderId: string, newName: string) => {
    const renameFolderRecursively = (folderList: Folder[]): Folder[] => {
      return folderList.map((folder) => {
        if (folder.id === folderId) {
          return { ...folder, name: newName };
        } else if (folder.subfolders.length > 0) {
          return {
            ...folder,
            subfolders: renameFolderRecursively(folder.subfolders),
          };
        }
        return folder;
      });
    };

    setFolders(renameFolderRecursively(folders));
  };

  return (
    <div className='flex max-h-[350px] overflow-y-auto w-full scroll-bar flex-col gap-2 border border-[#ccc] bg-background py-3 px-2 mt-6 mb-4 rounded-md'>
      <nav className='space-y-1'>
        {folders.map((folder) => (
          <NavItem
            openFolderId={openFolderId}
            setOpenFolderId={setOpenFolderId}
            edited={edited}
            key={folder.id}
            folder={folder}
            onSelect={handleSelect}
            onAddFolder={handleAddFolder}
            selectedFolderId={selectedFolderId}
            onRename={handleRename}
          />
        ))}
      </nav>
    </div>
  );
}
