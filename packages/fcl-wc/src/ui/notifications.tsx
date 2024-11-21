import {render} from "preact"
import styles from "./styles.css"
import {Notification} from "./components/Notification"
import {NotificationInfo} from "../types/types"

let renderRoot: HTMLElement | null = null
let id = 0
let dismissTimeout: NodeJS.Timeout | null = null

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
  debounceDelay = 0,
}: NotificationInfo & {debounceDelay?: number}): {dismiss: () => void} {
  if (!renderRoot) {
    renderRoot = createRenderRoot()
  }

  // Don't animate if we are replacing an existing notification
  const animate = !dismissTimeout
  if (dismissTimeout) {
    clearTimeout(dismissTimeout)
    dismissTimeout = null
  }

  render(
    <Notification
      key={id++}
      title={title}
      message={message}
      icon={icon}
      onClick={onClick}
      onDismiss={() => {
        onDismiss?.()
        dismissUi()
      }}
      animate={animate}
    />,
    renderRoot
  )

  function dismissUi() {
    if (renderRoot) {
      render(null, renderRoot)
    }
  }

  return {
    dismiss: () => {
      // We need to delay the dismiss to debounce any subsequent notifications
      // This is important when there is both a FCL/WC authz and pre-authz service
      dismissTimeout = setTimeout(() => {
        dismissTimeout = null
        dismissUi()
      }, debounceDelay)
    },
  }
}
