import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  createElement,
  Fragment,
} from "react"

/**
 * Global singleton modal manager reference.
 * This enables imperative modal control similar to browser FCL's document.body.append()
 * approach, but adapted for React Native's component-based architecture.
 */
let modalManager = null

/**
 * Set the global modal manager instance.
 * Called internally by ServiceModalProvider on mount.
 *
 * @param {object} manager - The modal manager instance with show/hide methods
 * @private
 */
export function setModalManager(manager) {
  modalManager = manager
}

/**
 * Get the global modal manager instance.
 *
 * @returns {object|null} The modal manager instance or null if not mounted
 * @private
 */
export function getModalManager() {
  return modalManager
}

/**
 * Show a modal imperatively (like browser FCL's renderFrame/renderPop).
 *
 * @param {React.Component} ModalComponent - The modal component to render
 * @param {object} props - Props to pass to the modal component
 * @returns {number|null} Modal ID for cleanup, or null if manager not mounted
 *
 * @example
 * const modalId = showModal(ServiceDiscoveryModal, {
 *   fcl,
 *   onClose: () => hideModal(modalId)
 * })
 */
export function showModal(ModalComponent, props) {
  if (!modalManager) {
    console.warn(
      "ServiceModalProvider not mounted. Add <fcl.ModalContainer> to your app root to enable automatic wallet discovery UI."
    )
    return null
  }
  return modalManager.show(ModalComponent, props)
}

/**
 * Hide a modal by ID.
 *
 * @param {number} id - The modal ID returned by showModal()
 *
 * @example
 * const modalId = showModal(MyModal, {})
 * // Later...
 * hideModal(modalId)
 */
export function hideModal(id) {
  if (modalManager) {
    modalManager.hide(id)
  }
}

/**
 * ServiceModalProvider - Container component that enables imperative modal rendering.
 *
 * This component should wrap your app root (similar to React Navigation's NavigationContainer
 * or React Native Paper's PaperProvider). It provides the infrastructure for FCL to show
 * wallet discovery modals automatically when fcl.authenticate() is called.
 *
 * @component
 * @example
 * // In your App.js or _layout.tsx
 * import * as fcl from '@onflow/fcl-react-native'
 *
 * export default function App() {
 *   return (
 *     <fcl.ModalContainer>
 *       <YourApp />
 *     </fcl.ModalContainer>
 *   )
 * }
 *
 * // Then anywhere in your app, authentication works automatically:
 * await fcl.authenticate() // Shows wallet selection modal automatically
 */
export const ServiceModalProvider = forwardRef(({children}, ref) => {
  const [modals, setModals] = useState([])

  useImperativeHandle(ref, () => ({
    show: (ModalComponent, props) => {
      const id = Date.now()
      setModals(prev => [...prev, {id, ModalComponent, props}])
      return id
    },
    hide: id => {
      setModals(prev => prev.filter(m => m.id !== id))
    },
  }))

  // Register global modal manager on mount (singleton pattern)
  useEffect(() => {
    const manager = {
      show: (ModalComponent, props) => {
        const id = Date.now()
        setModals(prev => [...prev, {id, ModalComponent, props}])
        return id
      },
      hide: id => {
        setModals(prev => prev.filter(m => m.id !== id))
      },
    }

    setModalManager(manager)

    // Cleanup on unmount
    return () => setModalManager(null)
  }, [])

  return createElement(
    Fragment,
    null,
    children,
    modals.map(({id, ModalComponent, props}) =>
      createElement(ModalComponent, {
        key: id,
        visible: true,
        ...props,
        onClose: () => hideModal(id),
      })
    )
  )
})

ServiceModalProvider.displayName = "ServiceModalProvider"
