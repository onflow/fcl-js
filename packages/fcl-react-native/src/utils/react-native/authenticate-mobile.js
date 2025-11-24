import {getServiceRegistry} from "@onflow/fcl-core"
import {showModal, hideModal} from "./ConnectModalProvider"
import {ConnectModal} from "./ConnectModal"

/**
 * Mobile-specific authentication with automatic discovery modal.
 *
 * This function replicates browser FCL's automatic discovery UI behavior for React Native.
 * When called, it shows a wallet selection modal (similar to how browser FCL shows an iframe).
 *
 * Flow:
 * 1. Get available wallets from service registry
 * 2. Show ConnectModal imperatively (even if only 1 wallet)
 * 3. Wait for user to select a wallet
 * 4. Authenticate with selected wallet via WalletConnect
 * 5. Return authenticated user
 *
 * @param {object} fclContext - FCL context object
 * @param {Function} fclContext.authenticate - The core FCL authenticate function
 * @param {object} fclContext.config - FCL config instance
 * @param {object} opts - Authentication options
 * @returns {Promise<object>} - Authenticated user object
 * @throws {Error} - If user cancels or authentication fails
 *
 * @example
 * // This is called automatically by fcl.authenticate() when no service is provided
 * const user = await authenticateWithDiscovery({authenticate: fcl.authenticate, config: fcl.config}, {})
 */
export async function authenticateWithDiscovery(fclContext, opts = {}) {
  // Get available wallets from service registry
  const serviceRegistry = getServiceRegistry()
  const wallets = serviceRegistry.getServices()

  // Show modal even with single wallet (as requested by user)
  // This matches browser FCL behavior where discovery UI always shows
  return new Promise((resolve, reject) => {
    const handleAuthenticate = async service => {
      // Close modal
      hideModal()

      try {
        // Authenticate with selected service
        const user = await fclContext.authenticate({...opts, service})
        resolve(user)
      } catch (error) {
        reject(error)
      }
    }

    const handleClose = () => {
      // Close modal
      hideModal()

      // Reject with cancellation error
      reject(new Error("User cancelled authentication"))
    }

    // Show modal imperatively (like browser FCL's renderFrame)
    const result = showModal(ConnectModal, {
      fcl: fclContext,
      onAuthenticate: handleAuthenticate,
      onClose: handleClose,
    })

    // If modal manager not available, provide helpful error
    if (result === null) {
      reject(
        new Error(
          "FCL Modal system not initialized. Please wrap your app with <fcl.ConnectModalProvider>. " +
            "See: https://developers.flow.com/tools/clients/fcl-js/react-native#setup"
        )
      )
    }
  })
}
