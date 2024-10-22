import {ConfirmationPrompt} from "./components/ConfirmationPrompt"
import {render} from "preact"

export function createConfrmationPrompt({
  provider,
  initiatorIcon,
  onTryAgain,
  onClose,
}: {
  provider: any
  initiatorIcon: string
  onTryAgain: () => void
  onClose: () => void
}) {
  let ref: HTMLDivElement | null = null

  function handlePromptClose() {
    if (ref != null) {
      ref.parentNode?.removeChild(ref)
    }
    onClose()
  }

  render(
    <div ref={r => (ref = r)}>
      <ConfirmationPrompt
        open={true}
        onClose={handlePromptClose}
        provider={provider}
        initiatorIcon={initiatorIcon}
        onTryAgain={onTryAgain}
      />
    </div>,
    document.body
  )

  return {
    close: handlePromptClose,
  }
}
