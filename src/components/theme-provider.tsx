
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Use a simpler implementation without dependencies on our custom context
  // Default to light theme and enable system preference detection
  return (
    <NextThemesProvider {...props} defaultTheme="light" enableSystem={true}>
      {children}
    </NextThemesProvider>
  )
}
