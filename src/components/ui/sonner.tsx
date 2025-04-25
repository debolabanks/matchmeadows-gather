
import { useTheme } from "@/contexts/ThemeContext"
import { Toaster as Sonner } from "sonner"
import * as React from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // Default to light theme
  let theme: ToasterProps["theme"] = "light";
  
  try {
    // Only try to access theme context if available
    const themeContext = useTheme();
    if (themeContext && typeof themeContext.theme === 'string') {
      // Ensure theme is valid
      theme = (themeContext.theme === "dark" || themeContext.theme === "light" || themeContext.theme === "system") 
        ? themeContext.theme 
        : "light";
    }
  } catch (error) {
    console.error("Error accessing theme in Toaster:", error);
    // Default to light theme in case of error
  }

  return (
    <Sonner
      theme={theme}
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
