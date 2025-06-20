import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Include .cdc files as static assets so they can be imported with ?raw
  assetsInclude: ["**/*.cdc"],
})
