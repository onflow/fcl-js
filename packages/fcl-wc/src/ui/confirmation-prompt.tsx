import {Provider} from "@onflow/typedefs"
import {ConfirmationPrompt} from "./components/ConfirmationPrompt"
import {render} from "preact"

export function createConfrmationPrompt({
  provider,
  initiatorIcon,
  onTryAgain,
  onClose,
}: {
  provider?: Provider
  initiatorIcon?: string
  onTryAgain: () => void
  onClose: () => void
}) {
  const container = document.createElement("div")
  document.body.appendChild(container)

  function handlePromptClose() {
    render(null, container)
    container.remove()
    onClose()
  }

  render(
    <ConfirmationPrompt
      open={true}
      onClose={handlePromptClose}
      provider={provider}
      initiatorIcon={initiatorIcon}
      onTryAgain={onTryAgain}
    />,
    container
  )

  return {
    close: handlePromptClose,
  }
}
