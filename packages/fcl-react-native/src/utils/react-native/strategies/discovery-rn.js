import {ConnectModal} from "../ConnectModal"
import {hideModal, showModal} from "../ConnectModalProvider"
import {config} from "@onflow/config"

/**
 * Execution strategy for React Native discovery services.
 *
 * This strategy shows the ConnectModal for wallet discovery,
 * then returns the selected wallet service for FCL to execute.
 *
 * This follows the same pattern as FCL IFRAME/RPC strategy
 * but adapted for React Native native modal UI.
 *
 * Flow:
 * 1. fcl.authenticate() called
 * 2. Discovery service created (type: "authn", method: "DISCOVERY/RN")
 * 3. execStrategy looks up "DISCOVERY/RN" in coreStrategies
 * 4. This function executes → shows ConnectModal with wallet list
 * 5. User selects wallet
 * 6. Returns {status: "REDIRECT", data: walletService}
 * 7. FCL core executes the wallet service (WC/RPC or DEEPLINK/RPC)
 *
 * @param {object} params - Strategy execution parameters
 * @param {object} params.service - The discovery service to execute
 * @param {object} params.body - Request body/message data
 * @param {object} params.config - FCL configuration
 * @param {AbortSignal} params.abortSignal - Abort signal for cancellation
 * @returns {Promise<object>} Promise resolving to strategy response
 */
export async function execDiscoveryRN({
  service,
  body,
  config: execConfig,
  abortSignal,
}) {
  return new Promise((resolve, reject) => {
    // Check if already aborted before showing modal (prevents race condition)
    if (abortSignal?.aborted) {
      reject(new Error("Authentication aborted before modal shown"))
      return
    }

    // Store abort listener reference for cleanup
    let abortListener = null

    const handleAuthenticate = walletService => {
      try {
        hideModal()

        // Clean up abort listener to prevent memory leak
        if (abortListener && abortSignal) {
          abortSignal.removeEventListener("abort", abortListener)
          abortListener = null
        }

        // Return REDIRECT to tell FCL core to execute the selected wallet service
        resolve({
          status: "REDIRECT",
          data: walletService,
        })
      } catch (error) {
        reject(
          new Error(`Failed to authenticate with wallet: ${error.message}`)
        )
      }
    }

    const handleClose = () => {
      try {
        hideModal()

        // Clean up abort listener to prevent memory leak
        if (abortListener && abortSignal) {
          abortSignal.removeEventListener("abort", abortListener)
          abortListener = null
        }

        reject(new Error("User cancelled wallet selection"))
      } catch (error) {
        reject(new Error(`Failed to close modal: ${error.message}`))
      }
    }

    // Use the global FCL config to give ConnectModal access to all config values including discovery.authn.endpoint
    const fclContext = {
      config: config(),
    }

    const result = showModal(ConnectModal, {
      fcl: fclContext,
      onAuthenticate: handleAuthenticate,
      onClose: handleClose,
    })

    if (result === null) {
      reject(
        new Error(
          "ConnectModalProvider not found. Please wrap your app with <ConnectModalProvider>."
        )
      )
      return
    }

    // Handle abort signal after modal shown
    if (abortSignal) {
      abortListener = () => {
        try {
          hideModal()
          reject(new Error("Authentication aborted by user"))
        } catch (error) {
          reject(new Error(`Failed to abort authentication: ${error.message}`))
        }
      }
      abortSignal.addEventListener("abort", abortListener)
    }
  })
}
