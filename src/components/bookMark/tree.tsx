"use client";
import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
  isOpen?: boolean;
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
  return (
    <div className='flex max-h-[350px] overflow-y-auto w-full scroll-bar flex-col gap-2 border border-[#ccc] bg-background py-3 px-2 mt-6 mb-4 rounded-md'>
      <div>
        {data.map((node) => (
          <TreeNode
            onToggle={toggleFolder}
            key={node.id}
            node={node}
            level={0}
            selectedId={selectedId}
            onSelect={setSelectedId}
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
}

function TreeNode({
  node,
  level,
  selectedId,
  onSelect,
  onToggle,
}: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id);
    if (hasChildren) {
      onToggle(node.id);
    }
  };

  return (
    <div>
      <Collapsible open={node.isOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors cursor-pointer hover:bg-accent/50 w-full",
              selectedId === node.id && "bg-accent text-accent-foreground"
            )}
            onClick={handleClick}
          >
            <div className='flex items-center gap-3'>
              {" "}
              {!hasChildren && <span className='w-4' />}
              {node.isOpen ? (
                <FcOpenedFolder size={18} />
              ) : (
                <FcFolder size={18} />
              )}
              {node.name}
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
          <CollapsibleContent className='ml-6 mt-2 flex-grow '>
            {node.children?.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
                onToggle={onToggle}
              />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}
