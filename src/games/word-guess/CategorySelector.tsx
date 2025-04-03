
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CATEGORY_NAMES, DEFAULT_CATEGORY } from "./gameUtils";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  disabled?: boolean;
}

const CategorySelector = ({
  selectedCategory,
  onCategoryChange,
  disabled = false
}: CategorySelectorProps) => {
  return (
    <div className="mb-4">
      <div className="text-sm font-medium mb-1">Select Word Category:</div>
      <Select
        value={selectedCategory}
        onValueChange={onCategoryChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_NAMES.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
