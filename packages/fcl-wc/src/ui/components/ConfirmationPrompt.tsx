import {AdaptiveModal} from "./AdaptiveModal"
import {LoadingDots} from "./LoadingDots"

import browserImage from "../assets/browser.png"
import mobileImage from "../assets/mobile.png"
import {Provider} from "@onflow/typedefs"
import {isMobile as checkIsMobile} from "../../utils"
import {AppInfo} from "../../types/types"

export function ConfirmationPrompt({
  open,
  walletProvider,
  appInfo,
  onClose,
  onTryAgain,
  onDeeplink,
}: {
  open: boolean
  walletProvider?: Provider
  appInfo?: AppInfo
  onClose: () => void
  onTryAgain: () => void
  onDeeplink: () => void
}) {
  const isMobile = checkIsMobile()

  return (
    <AdaptiveModal
      isOpen={open}
      onClose={onClose}
      title={`Confirm in ${walletProvider?.name}`}
    >
      <div class="flex flex-col items-center gap-6">
        <div class="flex items-center justify-space-between max-w-[16rem] gap-8">
          <img
            class="w-16 h-16 rounded-lg border-1 border-gray-200 shadow-lg"
            src={appInfo?.icon || browserImage}
            alt={appInfo?.name || "App Icon"}
          />
          <LoadingDots></LoadingDots>
          <img
            class="w-16 h-16 rounded-lg border-1 border-gray-200 shadow-lg"
            src={walletProvider?.icon || mobileImage}
            alt={walletProvider?.name || "Wallet Icon"}
          />
        </div>

        <div class="flex flex-col gap-3 text-center">
          <span>{`${appInfo?.name || "The app"} is waiting for you to confirm in ${walletProvider?.name || "your wallet"}`}</span>
          {isMobile && (
            <span class="text-sm text-gray-500">
              App didn't open?{" "}
              <span class="text-blue-500 cursor-pointer" onClick={onTryAgain}>
                Try again
              </span>
            </span>
          )}
        </div>
      </div>
    </AdaptiveModal>
  )
}
