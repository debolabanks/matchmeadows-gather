
import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  // We need to make sure this hook is only used within a component inside ThemeProvider
  return useNextTheme();
}
