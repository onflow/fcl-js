import {Image} from "expo-image"
import {createElement, useEffect, useRef} from "react"
import {
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import {useServiceDiscovery} from "./ServiceDiscovery"

/**
 * Default modal wrapper component that renders wallet cards in a scrollable list.
 *
 * @param {object} props - The component props.
 * @param {JSX.Element[]} props.children - The children components.
 * @returns {JSX.Element} - The modal wrapper component.
 */
const DefaultModalWrapper = ({children}) =>
  createElement(
    ScrollView,
    {
      style: styles.scrollView,
      contentContainerStyle: styles.scrollViewContent,
    },
    ...children
  )

/**
 * Default service card component for modal with enhanced styling.
 *
 * @param {object} props - The component props.
 * @param {Service} props.service - The service object.
 * @param {Function} props.onPress - The onPress event handler.
 * @returns {JSX.Element} - The service card component.
 */
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
        resizeMode: "contain",
        onError: error => {
          console.log(
            "Wallet icon failed to load:",
            walletIcon,
            error.nativeEvent?.error
          )
        },
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
 * ServiceDiscoveryModal component that displays a modal for wallet selection.
 * Wraps the existing ServiceDiscovery component in a React Native Modal.
 *
 * @param {object} props - The component props.
 * @param {object} props.fcl - The fcl instance.
 * @param {boolean} props.visible - Controls modal visibility.
 * @param {Function} props.onClose - Called when modal should close.
 * @param {Function} [props.onAuthenticate] - Optional callback after wallet selection.
 * @param {Function} [props.Loading] - Optional custom loading component.
 * @param {Function} [props.Empty] - Optional custom empty state component.
 * @param {Function} [props.ServiceCard] - Optional custom wallet card component.
 * @param {Function} [props.Wrapper] - Optional custom wrapper component.
 * @param {string} [props.title] - Modal title text (default: "Connect Wallet").
 * @returns {JSX.Element} - The service discovery modal component.
 */
export const ServiceDiscoveryModal = ({
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
  const {services, isLoading, authenticateService} = useServiceDiscovery({fcl})

  // Animation values
  const backdropOpacity = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(300)).current

  // Animate backdrop and content when modal visibility changes
  useEffect(() => {
    if (visible) {
      // Fade in backdrop instantly (fast)
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()

      // Slide up content with spring animation
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 10,
        useNativeDriver: true,
      }).start()
    } else {
      // Reset animations when modal closes
      backdropOpacity.setValue(0)
      slideAnim.setValue(300)
    }
  }, [visible, backdropOpacity, slideAnim])

  const handleServiceSelect = service => {
    authenticateService(service)
    onAuthenticate?.(service)
    onClose()
  }

  return createElement(
    Modal,
    {
      visible,
      transparent: true,
      animationType: "none",
      onRequestClose: onClose,
    },
    createElement(
      Animated.View,
      {style: [styles.backdrop, {opacity: backdropOpacity}]},
      createElement(TouchableOpacity, {
        style: styles.backdropTouchable,
        activeOpacity: 1,
        onPress: onClose,
      }),
      createElement(
        SafeAreaView,
        {style: styles.safeArea},
        createElement(
          Animated.View,
          {
            style: [
              styles.modalContent,
              {transform: [{translateY: slideAnim}]},
            ],
          },
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
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  backdropTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    maxHeight: "80%",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
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
    maxHeight: 600,
  },
  scrollViewContent: {
    paddingVertical: 8,
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
    borderWidth: 1,
    borderColor: "#E5E5E5",
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
