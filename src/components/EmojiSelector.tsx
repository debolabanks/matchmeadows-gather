
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile } from "lucide-react";

interface EmojiSelectorProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}

const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    emojis: ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "🥰", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥"]
  },
  {
    name: "Love",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️", "😻", "💔"]
  },
  {
    name: "Gestures",
    emojis: ["👍", "👎", "👌", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✌️", "🤞", "🤟", "🤘", "👊", "✊", "🤛", "🤜", "👋", "🤚", "🖐️", "✋", "👆", "👇", "👉", "👈"]
  },
  {
    name: "Activities",
    emojis: ["🎉", "🎊", "🎈", "🎂", "🎁", "🎗️", "🎟️", "🎫", "🎖️", "🏆", "🏅", "🥇", "🥈", "🥉", "⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏉", "🎱", "🎮", "♟️"]
  }
];

const EmojiSelector = ({ onEmojiSelect, disabled = false }: EmojiSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState(EMOJI_CATEGORIES[0].name);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full"
          disabled={disabled}
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-2">
          <div className="flex space-x-1 pb-2 border-b overflow-x-auto">
            {EMOJI_CATEGORIES.map((category) => (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? "default" : "ghost"}
                size="sm"
                className="text-xs px-2 py-1 h-auto"
                onClick={() => setActiveCategory(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-8 gap-1 overflow-y-auto max-h-[200px] pt-1">
            {EMOJI_CATEGORIES.find(c => c.name === activeCategory)?.emojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-xl"
                onClick={() => onEmojiSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EmojiSelector;
