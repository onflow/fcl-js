import React, {useState, useEffect} from "react"

// Module-level singleton that holds reference to the modal manager
// This enables imperative API (showModal/hideModal) to work outside React components
let modalManager = null

export function showModal(ModalComponent, props) {
  if (!modalManager) {
    console.warn(
      "ConnectModalProvider not mounted. Add <fcl.ConnectModalProvider> to your app root to enable automatic wallet discovery UI."
    )
    return null
  }
  return modalManager.show(ModalComponent, props)
}

export function hideModal() {
  if (modalManager) {
    modalManager.hide()
  }
}

export function ConnectModalProvider({children}) {
  const [currentModal, setCurrentModal] = useState(null)

  // Show a modal (only one at a time)
  const show = (ModalComponent, props) => {
    setCurrentModal({ModalComponent, props})
    return true
  }

  // Hide the current modal
  const hide = () => {
    setCurrentModal(null)
  }

  // Set module-level singleton for imperative API
  modalManager = {show, hide}

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      modalManager = null
    }
  }, [])

  return React.createElement(
    React.Fragment,
    null,
    children,
    currentModal &&
      React.createElement(currentModal.ModalComponent, {
        visible: true,
        ...currentModal.props,
        onClose: hide,
      })
  )
}
