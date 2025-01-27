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
}

function NavItem({
  folder,
  onSelect,
  onAddFolder,
  selectedFolderId,
  onRename,
}: NavItemProps) {
  const [isOpen, setIsOpen] = React.useState(
    folder.id === selectedFolderId ? true : false
  );
  const [isEditing, setIsEditing] = React.useState(
    folder.id === "1" ? false : true
  );
  const [newName, setNewName] = React.useState(folder.name);

  const handleClick = () => {
    onSelect(folder.id);
    setIsOpen(!isOpen);
  };

  const handleRename = (e: React.FormEvent) => {
    e.preventDefault();
    onRename(folder.id, newName);
    setIsEditing(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className='w-full' onClick={handleClick}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            selectedFolderId === folder.id
              ? "bg-accent text-accent-foreground"
              : "hover:bg-accent/50",
            folder.subfolders.length > 0 ? "justify-between" : "justify-start"
          )}
        >
          <div className='flex items-center gap-3 flex-grow'>
            {isOpen ? <FcOpenedFolder size={18} /> : <FcFolder size={18} />}
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
                  isOpen && "rotate-90"
                )}
              />
            )}
          </div>
        </div>
      </CollapsibleTrigger>
      {folder.subfolders.length > 0 && (
        <CollapsibleContent>
          <div className='ml-6 mt-1 space-y-1'>
            {folder.subfolders.map((subfolder) => (
              <NavItem
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
      )}
    </Collapsible>
  );
}

interface MoreProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  selectedFolderId: string;
  setSelectedFolderId: React.Dispatch<React.SetStateAction<string>>;
}

export function More({
  folders,
  setFolders,
  selectedFolderId,
  setSelectedFolderId,
}: MoreProps) {
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
          return { ...folder, subfolders: [...folder.subfolders, newFolder] };
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
    <div className='flex max-h-[350px] overflow-y-auto w-full scroll-bar flex-col gap-2 border bg-background py-3 px-2 mt-6 mb-4 rounded-md'>
      <nav className='space-y-1'>
        {folders.map((folder) => (
          <NavItem
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
