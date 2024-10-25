import {Provider} from "@onflow/typedefs"
import {ConfirmationPrompt} from "./components/ConfirmationPrompt"
import {render} from "preact"
import styles from "./styles.css"
import {AppInfo} from "../types/types"

export function createConfrmationPrompt({
  walletProvider,
  appInfo,
  onTryAgain,
  onClose,
  onDeeplink,
}: {
  walletProvider?: Provider
  appInfo?: AppInfo
  onTryAgain: () => void
  onClose: () => void
  onDeeplink: () => void
}) {
  // Create a shadow root to render the prompt in
  const shadowHost = document.createElement("div")
  const shadowRoot = shadowHost.attachShadow({mode: "open"})
  const container = document.createElement("div")

  shadowRoot.appendChild(container)
  document.body.appendChild(shadowHost)

  // Add styles to the shadow root
  const style = document.createElement("style")
  style.textContent = styles
  shadowRoot.appendChild(style)

  function handlePromptClose() {
    render(null, container)
    shadowHost.remove()
    onClose()
  }

  render(
    <ConfirmationPrompt
      open={true}
      onClose={handlePromptClose}
      onDeeplink={() => {}}
      walletProvider={walletProvider}
      appInfo={appInfo}
      onTryAgain={onTryAgain}
    />,
    container
  )

  return {
    close: handlePromptClose,
  }
}
