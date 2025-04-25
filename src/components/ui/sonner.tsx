
import { Toaster as Sonner } from "sonner"
import * as React from "react"
import { useTheme as useNextTheme } from "next-themes"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Use next-themes directly instead of our custom context
  const { theme } = useNextTheme();
  
  // Default to light theme if theme is undefined
  const toasterTheme = (theme === "dark" || theme === "light" || theme === "system") 
    ? theme
    : "light";

  return (
    <Sonner
      theme={toasterTheme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
