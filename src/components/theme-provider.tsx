
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useTheme } from "@/contexts/ThemeContext"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // We need to be careful about using useTheme inside NextThemesProvider
  // since it could cause circular dependencies
  try {
    // Get theme from our context
    const { theme } = useTheme();
    
    // Make sure theme is one of the expected values
    const validTheme = theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'light';
    
    return (
      <NextThemesProvider {...props} defaultTheme={validTheme} enableSystem={true}>
        {children}
      </NextThemesProvider>
    )
  } catch (error) {
    console.error("Error in ThemeProvider:", error);
    // If there's an error with our custom useTheme, fall back to default provider
    return (
      <NextThemesProvider {...props} defaultTheme="light" enableSystem={true}>
        {children}
      </NextThemesProvider>
    )
  }
}
