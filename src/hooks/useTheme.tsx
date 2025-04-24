
"use client"

import { useContext } from "react"
import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  // Using a simpler approach without try/catch that could cause React render issues
  const theme = useNextTheme()
  
  // If theme is undefined (which can happen outside ThemeProvider), return defaults
  if (!theme) {
    console.warn("useTheme must be used within a ThemeProvider component")
    return {
      theme: "light",
      setTheme: () => {},
      themes: ["light", "dark", "system"],
      systemTheme: "light",
    }
  }
  
  return theme
}
