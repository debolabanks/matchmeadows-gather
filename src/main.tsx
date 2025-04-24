
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './components/theme-provider.tsx'
import { StrictMode } from 'react'

// Create root outside of render call to avoid potential issues
const rootElement = document.getElementById("root");
const root = createRoot(rootElement!);

// Render with proper provider structure
root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vibe-theme" attribute="class">
      <App />
    </ThemeProvider>
  </StrictMode>
);
