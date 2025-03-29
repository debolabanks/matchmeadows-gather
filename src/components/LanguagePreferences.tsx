
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

type LanguageOption = "en" | "es" | "fr" | "de" | "zh" | "ja" | "ko" | "pt" | "ru";

interface LanguagePreferencesProps {
  value: LanguageOption;
  onChange: (value: LanguageOption) => void;
}

const LANGUAGE_NAMES: Record<LanguageOption, string> = {
  en: "English",
  es: "Español (Spanish)",
  fr: "Français (French)",
  de: "Deutsch (German)",
  zh: "中文 (Chinese)",
  ja: "日本語 (Japanese)",
  ko: "한국어 (Korean)",
  pt: "Português (Portuguese)",
  ru: "Русский (Russian)"
};

export const LanguagePreferences = ({ value, onChange }: LanguagePreferencesProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="language-preference">Language Preference</Label>
      <Select value={value} onValueChange={onChange as any}>
        <SelectTrigger id="language-preference" className="w-full">
          <SelectValue placeholder="Choose your preferred language" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(LANGUAGE_NAMES) as LanguageOption[]).map((langCode) => (
            <SelectItem key={langCode} value={langCode} className="flex items-center">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-blue-500" />
                <span>{LANGUAGE_NAMES[langCode]}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
