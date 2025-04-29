
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Copy audio assets to public folder during development
  if (mode === 'development') {
    const srcAssetsDir = path.resolve(__dirname, './src/assets');
    const publicAssetsDir = path.resolve(__dirname, './public/assets');
    
    // Ensure assets directory exists
    if (!fs.existsSync(publicAssetsDir)) {
      fs.mkdirSync(publicAssetsDir, { recursive: true });
    }
    
    // Copy audio files if they exist in src/assets
    if (fs.existsSync(srcAssetsDir)) {
      fs.readdirSync(srcAssetsDir)
        .filter(file => /\.(mp3|wav|ogg)$/.test(file))
        .forEach(file => {
          const srcPath = path.join(srcAssetsDir, file);
          const destPath = path.join(publicAssetsDir, file);
          try {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${srcPath} to ${destPath}`);
          } catch (err) {
            console.error(`Error copying ${file}:`, err);
          }
        });
    }
  }
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
