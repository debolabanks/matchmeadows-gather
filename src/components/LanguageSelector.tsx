
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

export type SupportedLanguage = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | "pt" | "ru";

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
  className?: string;
}

const LANGUAGES: Record<SupportedLanguage, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  zh: "中文",
  ja: "日本語",
  ko: "한국어",
  pt: "Português",
  ru: "Русский"
};

const LanguageSelector = ({ value, onChange, className }: LanguageSelectorProps) => {
  return (
    <div className={className}>
      <Select value={value} onValueChange={(val) => onChange(val as SupportedLanguage)}>
        <SelectTrigger className="w-[140px]">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <SelectValue placeholder="Select language" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {(Object.entries(LANGUAGES) as [SupportedLanguage, string][]).map(([code, name]) => (
            <SelectItem key={code} value={code}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
