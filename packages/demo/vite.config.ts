import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          fcl: ["@onflow/fcl", "@onflow/react-sdk", "@onflow/typedefs"],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["@onflow/fcl", "@onflow/react-sdk", "@onflow/typedefs"],
  },
})
