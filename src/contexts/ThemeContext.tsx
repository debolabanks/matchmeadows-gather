
import React, { createContext, useContext } from "react";
import { useTheme as useNextTheme } from "next-themes";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Use next-themes directly
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  
  // Convert next-themes theme to our Theme type with safety check
  const theme = (nextTheme as Theme) || "light";
  const safeTheme = (theme === "light" || theme === "dark" || theme === "system") 
    ? theme 
    : "light";
  
  // Create a wrapper around next-themes setTheme to ensure type safety
  const setTheme = (newTheme: Theme) => {
    setNextTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: safeTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}
