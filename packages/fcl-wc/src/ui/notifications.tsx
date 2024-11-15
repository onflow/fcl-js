import {render} from "preact"
import styles from "./styles.css"
import {Notification} from "./components/Notification"
import {NotificationInfo} from "../types/types"

let renderRoot: HTMLElement | null = null
let id = 0

function createRenderRoot() {
  const shadowHost = document.createElement("div")
  const shadowRoot = shadowHost.attachShadow({mode: "open"})
  const container = document.createElement("div")

  shadowRoot.appendChild(container)
  document.body.appendChild(shadowHost)

  const style = document.createElement("style")
  style.textContent = styles
  shadowRoot.appendChild(style)

  // Subscribe to root dark mode changes to inherit the theme
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
  const listener = () => {
    container.classList.toggle("dark", mediaQuery.matches)
  }
  mediaQuery.addEventListener("change", listener)
  listener()

  return container
}

/**
 * Show a notification to the user.  Only one notification can be shown at a time and will replace any existing notification.
 */
export function showNotification({
  title,
  message,
  icon,
  onClick,
  onDismiss,
}: NotificationInfo) {
  if (!renderRoot) {
    renderRoot = createRenderRoot()
  }

  render(
    <Notification
      key={id++}
      title={title}
      message={message}
      icon={icon}
      onClick={onClick}
      onDismiss={() => {
        dismiss()
      }}
    />,
    renderRoot
  )

  function dismiss() {
    if (!renderRoot) return
    render(null, renderRoot)
    onDismiss?.()
  }

  return {
    dismiss,
  }
}
