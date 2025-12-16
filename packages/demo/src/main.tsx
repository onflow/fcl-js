import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {Buffer} from "buffer"
import {App} from "./app.tsx"

// Polyfill Buffer for FCL in browser
globalThis.Buffer = Buffer

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
