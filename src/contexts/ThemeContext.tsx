import React, { createContext, useState, useEffect, useContext } from "react";

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
  // Start with a default theme
  const [theme, setTheme] = useState<Theme>("light");
  // Flag to track if component is mounted
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize from localStorage only after component mounts
  useEffect(() => {
    setIsMounted(true);
    try {
      // Check for saved theme in localStorage
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Check for system preference
        setTheme("dark");
      }
    } catch (error) {
      console.error("Error reading theme from localStorage:", error);
      // Keep default theme if there's an error
    }
  }, []);
  
  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (!isMounted) return;
    
    try {
      const root = document.documentElement;
      
      // Apply theme to document
      if (theme === "dark" || (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      
      // Save theme preference
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.error("Error updating theme:", error);
    }
  }, [theme, isMounted]);

  // Listen for system theme changes if using system preference
  useEffect(() => {
    if (!isMounted || theme !== "system") return;
    
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        document.documentElement.classList.toggle("dark", mediaQuery.matches);
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } catch (error) {
      console.error("Error setting up media query listener:", error);
    }
  }, [theme, isMounted]);

  // Create context value
  const contextValue = {
    theme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  // Get context safely
  const context = useContext(ThemeContext);
  
  // Fallback if context is unavailable
  if (!context) {
    console.warn("useTheme hook called outside ThemeProvider");
    return { theme: "light" as Theme, setTheme: () => {} };
  }
  
  return context;
}
