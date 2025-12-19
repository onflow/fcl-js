import {Image} from "expo-image"
import {createElement, useEffect, useState} from "react"
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import {useServiceDiscovery} from "./ServiceDiscovery"

const DefaultModalWrapper = ({children}) =>
  createElement(
    ScrollView,
    {
      style: styles.scrollView,
      contentContainerStyle: styles.scrollViewContent,
    },
    ...children
  )

const DefaultModalServiceCard = ({service, onPress}) => {
  const walletIcon = service?.provider?.icon
  const walletName =
    service?.provider?.name || service?.name || "Unknown Wallet"
  const walletDescription = service?.provider?.description

  return createElement(
    TouchableOpacity,
    {
      onPress,
      style: styles.walletCard,
      activeOpacity: 0.7,
    },
    // Wallet icon (if available)
    walletIcon &&
      createElement(Image, {
        source: {uri: walletIcon},
        style: styles.walletIcon,
        contentFit: "contain",
      }),
    // Wallet info
    createElement(
      View,
      {style: styles.walletCardContent},
      createElement(Text, {style: styles.walletName}, walletName),
      walletDescription &&
        createElement(
          Text,
          {
            style: styles.walletDescription,
            numberOfLines: 1,
            ellipsizeMode: "tail",
          },
          walletDescription
        )
    ),
    // Arrow
    createElement(Text, {style: styles.walletArrow}, "→")
  )
}

/**
 * ConnectModal component that displays a modal for wallet selection.
 * Wraps the existing ServiceDiscovery component in a React Native Modal.
 *
 * @param {object} props - The component props.
 * @param {object} props.fcl - The fcl instance.
 * @param {boolean} props.visible - Controls modal visibility.
 * @param {Function} props.onClose - Called when modal should close.
 * @param {Function} props.onAuthenticate - Callback when user selects a wallet. Required.
 * @param {Function} [props.Loading] - Optional custom loading component.
 * @param {Function} [props.Empty] - Optional custom empty state component.
 * @param {Function} [props.ServiceCard] - Optional custom wallet card component.
 * @param {Function} [props.Wrapper] - Optional custom wrapper component.
 * @param {string} [props.title] - Modal title text (default: "Connect Wallet").
 * @returns {JSX.Element} - The connect modal component.
 */
export const ConnectModal = ({
  fcl,
  visible,
  onClose,
  onAuthenticate,
  Loading,
  Empty,
  ServiceCard = DefaultModalServiceCard,
  Wrapper = DefaultModalWrapper,
  title = "Connect Wallet",
}) => {
  const {services, isLoading} = useServiceDiscovery({fcl})

  // Double-click protection
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Reset authentication state when modal opens
  useEffect(() => {
    if (visible) {
      setIsAuthenticating(false)
    }
  }, [visible])

  const handleServiceSelect = service => {
    // Prevent double-click: ignore if already authenticating
    if (isAuthenticating) return

    setIsAuthenticating(true)
    // onAuthenticate handles modal closing internally, don't call onClose()
    onAuthenticate(service)
  }

  return createElement(
    Modal,
    {
      visible,
      transparent: true,
      animationType: "fade",
      onRequestClose: onClose,
    },
    createElement(
      Pressable,
      {style: styles.backdrop, onPress: onClose},
      createElement(
        Pressable,
        {style: styles.modalContainer, onPress: e => e.stopPropagation()},
        createElement(
          SafeAreaView,
          {style: styles.safeArea},
          createElement(
            View,
            {style: styles.modalContent},
            // Header
            createElement(
              View,
              {style: styles.header},
              createElement(Text, {style: styles.title}, title),
              createElement(
                TouchableOpacity,
                {onPress: onClose, style: styles.closeButton},
                createElement(Text, {style: styles.closeButtonText}, "✕")
              )
            ),
            // Content
            createElement(
              Wrapper,
              null,
              isLoading &&
                (Loading
                  ? createElement(Loading)
                  : createElement(
                      View,
                      {style: styles.loadingContainer},
                      createElement(
                        Text,
                        {style: styles.loadingText},
                        "Loading wallets..."
                      )
                    )),
              !isLoading &&
                services.length === 0 &&
                (Empty
                  ? createElement(Empty)
                  : createElement(
                      View,
                      {style: styles.emptyContainer},
                      createElement(
                        Text,
                        {style: styles.emptyText},
                        "No wallets found"
                      )
                    )),
              !isLoading &&
                services.map((service, index) => {
                  return createElement(ServiceCard, {
                    key: service?.provider?.address ?? service?.uid ?? index,
                    service,
                    onPress: () => handleServiceSelect(service),
                  })
                })
            )
          )
        )
      )
    )
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  safeArea: {
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#000000",
    lineHeight: 20,
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollViewContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  walletCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  walletIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  walletCardContent: {
    flex: 1,
  },
  walletName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  walletDescription: {
    fontSize: 13,
    color: "#666666",
  },
  walletArrow: {
    fontSize: 20,
    color: "#000000",
    marginLeft: 12,
  },
  loadingContainer: {
    paddingVertical: 34,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
  },
  emptyContainer: {
    paddingVertical: 28,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
  },
})
