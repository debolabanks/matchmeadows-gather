
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Make sure we're mounting the provider only after the component is mounted
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    // Return a placeholder with the same structure while the component is not mounted
    return <>{children}</>;
  }
  
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}
