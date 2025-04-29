
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StreamSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

const StreamSearch = ({ 
  searchQuery, 
  onSearchChange, 
  category, 
  onCategoryChange 
}: StreamSearchProps) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search streams, creators, or tags"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="fashion">Fashion</SelectItem>
          <SelectItem value="travel">Travel</SelectItem>
          <SelectItem value="fitness">Fitness</SelectItem>
          <SelectItem value="technology">Technology</SelectItem>
          <SelectItem value="cooking">Cooking</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StreamSearch;
