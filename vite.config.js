import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enables fast refresh and React 19 JSX Transform
      jsxRuntime: "automatic",
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // allows imports like "@/components/Button"
    },
  },

  server: {
    port: 5173, // change if needed
    open: true, // auto open in browser
    cors: true,
  },

  build: {
    target: "es2017", // modern JS output
    outDir: "dist",
    sourcemap: false, // disable for smaller build
    minify: "esbuild", // faster than terser
    cssCodeSplit: true, // split CSS for faster load
    assetsInlineLimit: 4096, // inline small assets <4kb
  },
optimization: {
  usedExports: true,
  sideEffects: true,
  minimize: true,
},
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-redux",
      "@reduxjs/toolkit",
      "@mui/material",
      "@mui/icons-material",
      "formik",
      "yup",
    ],
  },
});
