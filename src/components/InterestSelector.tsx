
import { useState } from "react";
import { Check, ListCheck } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InterestSelectorProps {
  interests: string[];
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  maxSelections?: number;
}

const InterestSelector = ({ 
  interests,
  selectedInterests,
  onChange,
  maxSelections = 10
}: InterestSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSelect = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      onChange(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length < maxSelections) {
        onChange([...selectedInterests, interest]);
      }
    }
  };

  const handleRemove = (interest: string) => {
    onChange(selectedInterests.filter(i => i !== interest));
  };
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedInterests.length === 0 ? (
          <div className="text-sm text-muted-foreground">No interests selected</div>
        ) : (
          selectedInterests.map((interest) => (
            <Badge key={interest} variant="secondary" className="px-3 py-1">
              {interest}
              <button
                className="ml-2 rounded-full outline-none focus:ring-2 focus:ring-offset-1"
                onClick={() => handleRemove(interest)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="opacity-60 hover:opacity-100"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </Badge>
          ))
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            <ListCheck className="mr-2 h-4 w-4" />
            {selectedInterests.length > 0 ? (
              <span>{selectedInterests.length} of {maxSelections} interests selected</span>
            ) : (
              <span>Select your interests</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]">
          <Command>
            <CommandInput 
              placeholder="Search interests..." 
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No interests found.</CommandEmpty>
              <ScrollArea className="h-[240px]">
                <CommandGroup>
                  {interests
                    .filter(interest => interest.toLowerCase().includes(search.toLowerCase()))
                    .map(interest => (
                      <CommandItem
                        key={interest}
                        onSelect={() => handleSelect(interest)}
                        className="cursor-pointer"
                      >
                        <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                          selectedInterests.includes(interest) ? 'bg-primary border-primary text-primary-foreground' : 'border-input'
                        }`}>
                          {selectedInterests.includes(interest) && <Check className="h-3 w-3" />}
                        </div>
                        <span>{interest}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedInterests.length >= maxSelections && (
        <p className="text-xs text-amber-500 mt-1">You have selected the maximum number of interests ({maxSelections}).</p>
      )}
    </div>
  );
};

export default InterestSelector;
