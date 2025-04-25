import React, { createContext, useState, useEffect, useContext } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the context with a default value
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
      const isDark = theme === "dark" || (theme === "system" && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      
      // Save theme preference to localStorage
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

  // Only provide the context if the component is mounted
  // This prevents SSR issues with useContext
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
  try {
    const context = useContext(ThemeContext);
    if (context === undefined) {
      // Provide a fallback to prevent errors when the context is not available
      console.warn("useTheme hook called outside ThemeProvider");
      return { theme: "light" as Theme, setTheme: () => {} };
    }
    return context;
  } catch (error) {
    console.error("Error in useTheme hook:", error);
    return { theme: "light" as Theme, setTheme: () => {} };
  }
}
