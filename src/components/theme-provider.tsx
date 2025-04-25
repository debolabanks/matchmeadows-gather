
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Create a local state to track if the component is mounted
  const [mounted, setMounted] = React.useState(false);
  
  // This effect runs once after initial render
  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);
  
  // Return early if not mounted to avoid hydration issues
  if (!mounted) {
    return <>{children}</>;
  }
  
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}
