"use client";

import * as React from "react";
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
  setData: (data: TreeNode[]) => void;
}

export function FolderTree({
  data,
  setData,
  selectedId,
  setSelectedId,
}: Props) {
  const toggleFolder = (id: string) => {
    const toggleNode = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: toggleNode(node.children) };
        }
        return node;
      });
    };
    setData(toggleNode(data));
  };

  const updateNodeName = (id: string, newName: string) => {
    const updateName = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, name: newName };
        }
        if (node.children) {
          return { ...node, children: updateName(node.children) };
        }
        return node;
      });
    };
    setData(updateName(data));
  };

  return (
    <div className='flex max-h-[350px] w-full flex-col gap-2 overflow-y-auto scroll-bar rounded-md border border-[#ccc] bg-background px-2 py-3 mt-6 mb-4'>
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
}

function TreeNode({
  node,
  level,
  selectedId,
  onSelect,
  onToggle,
  onUpdateName,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;
  const [isEditing, setIsEditing] = React.useState(node.isEditing || false);
  const [newName, setNewName] = React.useState(node.name);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
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
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setNewName(node.name);
      setIsEditing(false);
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
              {node.isOpen ? (
                <FcOpenedFolder size={18} />
              ) : (
                <FcFolder size={18} />
              )}
              {isEditing ? (
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
                  onDoubleClick={() => setIsEditing(true)}
                  className='cursor-pointer flex-grow text-start'
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
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
