
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useTheme } from "@/contexts/ThemeContext"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Make sure we have a valid theme from our custom context
  const { theme } = useTheme()
  
  // Pass the theme to next-themes provider, ensuring it's valid
  const validTheme = theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'light'
  
  return (
    <NextThemesProvider {...props} forcedTheme={validTheme}>
      {children}
    </NextThemesProvider>
  )
}
