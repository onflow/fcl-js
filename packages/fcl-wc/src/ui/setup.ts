import styles from "./styles.css"

// Helper function to load the UI dependencies into the DOM.
export function setupUi() {
  if (typeof document === "undefined") return

  const style = document.createElement("style")
  style.textContent = styles
  document.head.appendChild(style)
}
