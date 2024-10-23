import {AdaptiveModal} from "./AdaptiveModal"
import {LoadingDots} from "./LoadingDots"

import browserImage from "../assets/browser.png"
import mobileImage from "../assets/mobile.png"
import {Provider} from "@onflow/typedefs"

export function ConfirmationPrompt({
  open,
  provider,
  initiatorIcon,
  onClose,
  onTryAgain,
}: {
  open: boolean
  provider?: Provider
  initiatorIcon?: string
  onClose: () => void
  onTryAgain: () => void
}) {
  return (
    <AdaptiveModal isOpen={open} onOpenChange={onClose}>
      <h2 class="text-regular">Please Confirm in Wallet</h2>

      <div class="flex items-center justify-center gap-4">
        <img
          class="w-12 h-12 rounded-md"
          src={initiatorIcon || browserImage}
          alt="Browser"
        />
        <LoadingDots></LoadingDots>
        <img
          class="w-12 h-12 rounded-md"
          src={provider?.icon || mobileImage}
          alt={provider?.name || "Wallet Icon"}
        />
      </div>

      <div class="flex flex-col gap-2 text-center">
        <span>
          There is a pending request to the{" "}
          <span class="text-bold">{provider?.name}</span> app on your device.
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
