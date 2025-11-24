import {ConnectModal} from "./ConnectModal"
import {hideModal, showModal} from "./ConnectModalProvider"

// Mobile-specific authentication with automatic discovery modal
export async function authenticateWithDiscovery(fclContext, opts = {}) {
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
        new Error("Please wrap your app with ConnectModalProvider component.")
      )
    }
  })
}
