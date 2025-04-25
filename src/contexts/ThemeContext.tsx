
import React, { createContext, useState, useEffect, useContext } from "react";
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
  // Use next-themes for theme management
  const { theme: nextTheme, setTheme: setNextTheme } = useNextTheme();
  
  // Convert next-themes theme to our Theme type
  const theme = (nextTheme as Theme) || "light";
  
  // Create a wrapper around next-themes setTheme to ensure type safety
  const setTheme = (newTheme: Theme) => {
    setNextTheme(newTheme);
  };

  // Create context value
  const contextValue = {
    theme: theme === "light" || theme === "dark" || theme === "system" ? theme : "light",
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    // Provide a meaningful fallback when used outside provider
    return { 
      theme: "light" as Theme, 
      setTheme: (theme: Theme) => {
        console.warn("useTheme called outside of ThemeProvider, theme change will not take effect");
      } 
    };
  }
  
  return context;
}
