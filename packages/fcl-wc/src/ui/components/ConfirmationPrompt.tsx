import {AdaptiveModal} from "./AdaptiveModal"
import {LoadingDots} from "./LoadingDots"

import browserImage from "../assets/browser.png"
import mobileImage from "../assets/mobile.png"

export function ConfirmationPrompt({
  open,
  provider,
  initiatorIcon,
  onClose,
  onTryAgain,
}: {
  open: boolean
  provider: any
  initiatorIcon: string
  onClose: () => void
  onTryAgain: () => void
}) {
  return (
    <AdaptiveModal isOpen={open} onOpenChange={onClose}>
      <button
        class="close-btn"
        onClick={() => {
          onClose
        }}
      >
        &times;
      </button>
      <h2 class="text-regular">Please Confirm in Wallet</h2>

      <div class="icon-container">
        <img
          src="${this.initiatorIcon || browserImage}"
          class="icon"
          alt="Browser"
        />
        <LoadingDots></LoadingDots>
        <img
          src={provider?.icon || mobileImage}
          class="icon"
          alt={provider?.name || "Wallet Icon"}
        />
      </div>

      <div class="lower-content">
        <span>
          There is a pending request to the{" "}
          <span class="text-bold">${provider?.name}</span> app on your device.
        </span>
        <span class="text-small">
          No prompt on your device?{" "}
          <span class="try-again" onClick={onTryAgain}>
            Try again
          </span>
        </span>
      </div>
    </AdaptiveModal>
  )
}
