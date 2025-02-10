"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isOpen?: boolean;
  isEditing?: boolean;
}

interface Props {
  setSelectedId: (id: string | null) => void;
  selectedId: string | null;
  data: TreeNode[];
  setData: React.Dispatch<React.SetStateAction<TreeNode[]>>;
  editingFolderId: string | null;
  setEditingFolderId: (id: string | null) => void;
}

export function FolderTree({
  data,
  setData,
  selectedId,
  setSelectedId,
  editingFolderId,
  setEditingFolderId,
}: Props) {
  const [isInitialized, setIsInitialized] = useState(false);

  //  Always select "Bookmarks Bar" initially, but allow user changes
  useEffect(() => {
    if (!isInitialized && data.length > 0) {
      const bookmarksBar = data.find((folder) => folder.name.toLowerCase() === "bookmarks bar");
      if (bookmarksBar && !selectedId) {
        console.log("Selecting Bookmarks Bar initially:", bookmarksBar.id);
        setSelectedId(bookmarksBar.id);
        setIsInitialized(true);
      }
    }
  }, [data, selectedId, isInitialized, setSelectedId]);

  const toggleFolder = (id: string) => {
    setData((prevData) => toggleFolderState(prevData, id));
  };

  const toggleFolderState = (nodes: TreeNode[], id: string): TreeNode[] => {
    return nodes.map((node) => ({
      ...node,
      isOpen: node.id === id ? !node.isOpen : node.isOpen,
      children: node.children ? toggleFolderState(node.children, id) : node.children,
    }));
  };

  const updateNodeName = (id: string, newName: string) => {
    if (!chrome || !chrome.bookmarks) {
      console.warn("Chrome Bookmarks API is not available.");
      return;
    }
  
    chrome.bookmarks.update(id, { title: newName }, (updatedBookmark) => {
      if (chrome.runtime.lastError) {
        console.error("Error updating folder name:", chrome.runtime.lastError.message);
        return;
      }
  
      console.log("Folder name updated in Chrome Bookmarks:", updatedBookmark);
  
      //  Update local state to reflect the new folder name
      setData((prevData) => updateNodeNameState(prevData, id, newName));
    });
  
    setEditingFolderId(null);
  };
  
  // Helper function to update the folder name in the local state
  const updateNodeNameState = (nodes: TreeNode[], id: string, newName: string): TreeNode[] => {
    return nodes.map((node) => ({
      ...node,
      name: node.id === id ? newName : node.name,
      children: node.children ? updateNodeNameState(node.children, id, newName) : node.children,
    }));
  };
  

  return (
    <div className='flex mb-4 max-h-[250px] w-full flex-col gap-2 overflow-y-auto scroll-bar rounded-md border border-[#ccc] bg-background px-2 py-3 mt-6'>
      <div>
        {data.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onToggle={toggleFolder}
            onUpdateName={updateNodeName}
            editingFolderId={editingFolderId}
            setEditingFolderId={setEditingFolderId}
          />
        ))}
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  editingFolderId: string | null;
  setEditingFolderId: (id: string | null) => void;
}

function TreeNode({
  node,
  level,
  selectedId,
  onSelect,
  onToggle,
  onUpdateName,
  editingFolderId,
  setEditingFolderId,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const [newName, setNewName] = useState(node.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingFolderId === node.id && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingFolderId, node.id]);

  useEffect(() => {
    setNewName(node.name);
  }, [node.name]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Folder selected: ${node.name} (ID: ${node.id})`);
    onSelect(node.id);
    setEditingFolderId(null);
    if (hasChildren) {
      onToggle(node.id);
    }
  };

  const handleNameSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newName.trim() && newName !== node.name) {
      onUpdateName(node.id, newName.trim());
    } else {
      setNewName(node.name);
    }
    setEditingFolderId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setNewName(node.name);
      setEditingFolderId(null);
    }
  };

  return (
    <div>
      <Collapsible open={node.isOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent/50",
              selectedId === node.id && "bg-accent text-accent-foreground",
              !hasChildren && "justify-start"
            )}
            onClick={handleClick}
          >
            <div className='flex flex-grow items-center gap-3'>
              {node.isOpen ? <FcOpenedFolder size={18} /> : <FcFolder size={18} />}
              {editingFolderId === node.id ? (
                <form className='flex-grow' onSubmit={handleNameSubmit}>
                  <Input
                    ref={inputRef}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleNameSubmit}
                    onKeyDown={handleKeyDown}
                    className='h-6 px-1 py-0'
                  />
                </form>
              ) : (
                <span
                  className='cursor-pointer flex-grow text-start'
                  onDoubleClick={() => setEditingFolderId(node.id)}
                >
                  {node.name}
                </span>
              )}
            </div>
            {hasChildren &&
              (node.isOpen ? (
                <ChevronDown className='h-4 w-4 shrink-0' />
              ) : (
                <ChevronRight className='h-4 w-4 shrink-0' />
              ))}
          </button>
        </CollapsibleTrigger>
        {hasChildren && (
          <CollapsibleContent className='ml-6 mt-1 flex-grow'>
            {node.children?.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                onToggle={onToggle}
                onUpdateName={onUpdateName}
                editingFolderId={editingFolderId}
                setEditingFolderId={setEditingFolderId}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
