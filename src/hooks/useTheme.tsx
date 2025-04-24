
"use client"

import { useContext } from "react"
import { useTheme as useNextTheme } from "next-themes"

export function useTheme() {
  try {
    return useNextTheme()
  } catch (error) {
    // Fallback in case the hook is used outside of ThemeProvider
    console.warn("useTheme must be used within a ThemeProvider component")
    return {
      theme: "light",
      setTheme: () => {},
      themes: ["light", "dark", "system"],
      systemTheme: "light",
    }
  }
}
