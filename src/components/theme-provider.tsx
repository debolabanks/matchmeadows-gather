
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useTheme } from "@/contexts/ThemeContext"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use our custom theme context to get the theme
  const { theme } = useTheme()
  
  // Pass our theme to next-themes provider
  return (
    <NextThemesProvider {...props} forcedTheme={theme}>
      {children}
    </NextThemesProvider>
  )
}
