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

interface NavItemProps {
  label: string;
  isActive?: boolean;
  isCollapsible?: boolean;
  children?: React.ReactNode;
  isSelected: boolean; // New prop to check if this item is selected
  onSelect: (label: string) => void; // Function to handle selection
}

function NavItem({
  label,
  isCollapsible,
  children,
  isSelected,
  onSelect,
}: NavItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    onSelect(label); // Notify parent about selection
    setIsOpen(!isOpen); // Toggle open state
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className='w-full' onClick={handleClick}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            isSelected
              ? "bg-accent text-accent-foreground" // Selected item styles
              : "hover:bg-accent/50",
            isCollapsible ? "justify-between " : "justify-start"
          )}
        >
          <div className='flex items-center gap-3'>
            {isOpen ? <FcOpenedFolder size={18} /> : <FcFolder size={18} />}
            <span>{label}</span>
          </div>
          {isCollapsible && (
            <ChevronRight
              className={cn(
                "h-4 w-4 transition-transform",
                isOpen && "rotate-90"
              )}
            />
          )}
        </div>
      </CollapsibleTrigger>
      {children && <CollapsibleContent>{children}</CollapsibleContent>}
    </Collapsible>
  );
}

export function More() {
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null); // Track the selected item

  const handleSelect = (label: string) => {
    setSelectedItem((prev) => (prev === label ? null : label)); // Deselect if clicked again
  };

  return (
    <>
      <div className='flex max-h-[350px] overflow-y-auto w-full scroll-bar flex-col gap-2 border bg-background py-3 px-2 mt-6 mb-4 rounded-md'>
        <nav className='space-y-1'>
          <NavItem
            label='Projects'
            isCollapsible
            isSelected={selectedItem === "Projects"}
            onSelect={handleSelect}
          >
            <div className='ml-6 mt-1 space-y-1'>
              <NavItem
                label='Office'
                isSelected={selectedItem === "Office"}
                onSelect={handleSelect}
              />
              <NavItem
                label='Social'
                isSelected={selectedItem === "Social"}
                onSelect={handleSelect}
              />
            </div>
          </NavItem>

          <NavItem
            label='Backorder'
            isSelected={selectedItem === "Backorder"}
            onSelect={handleSelect}
          />
          <NavItem
            label='DMCA'
            isSelected={selectedItem === "DMCA"}
            onSelect={handleSelect}
          />
          <NavItem
            label='Others'
            isSelected={selectedItem === "Others"}
            onSelect={handleSelect}
          />
          <NavItem
            label='SEO'
            isSelected={selectedItem === "SEO"}
            onSelect={handleSelect}
          />

          <NavItem
            label='IMP'
            isCollapsible
            isSelected={selectedItem === "IMP"}
            onSelect={handleSelect}
          >
            <div className='ml-6 mt-1 space-y-1'>
              <NavItem
                label='Payment Gateway'
                isSelected={selectedItem === "Payment Gateway"}
                onSelect={handleSelect}
              />
              <NavItem
                label='Sheet'
                isSelected={selectedItem === "Sheet"}
                onSelect={handleSelect}
              />
              <NavItem
                label='Nulled Scripts sites'
                isSelected={selectedItem === "Nulled Scripts sites"}
                onSelect={handleSelect}
              />
              <NavItem
                label='AUG Copycat'
                isSelected={selectedItem === "AUG Copycat"}
                onSelect={handleSelect}
              />
              <NavItem
                label='Affiliate project'
                isSelected={selectedItem === "Affiliate project"}
                onSelect={handleSelect}
              />
              <NavItem
                label='Apartments'
                isSelected={selectedItem === "Apartments"}
                onSelect={handleSelect}
              />
              <NavItem
                label='Freeware Project'
                isSelected={selectedItem === "Freeware Project"}
                onSelect={handleSelect}
              />
            </div>
          </NavItem>
        </nav>
      </div>
    </>
  );
}
