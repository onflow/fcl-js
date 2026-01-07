import React, {useState} from "react"
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native"
import {
  colors,
  spacing,
  radius,
  borderWidths,
  sizes,
  fontSizes,
  fontWeights,
} from "../styles"
import {FundContent} from "./FundContent"

export interface FundProps {
  /** Button variant style */
  variant?: "primary" | "secondary" | "outline" | "link"
}

/**
 * Fund - Account funding button for React Native
 *
 * Displays a button that opens a modal with options to fund
 * your Flow account via credit card or crypto transfer.
 *
 * @example
 * ```tsx
 * <Fund />
 * ```
 *
 * @example
 * ```tsx
 * // With outline variant
 * <Fund variant="outline" />
 * ```
 */
export function Fund({variant = "primary"}: FundProps) {
  const [modalVisible, setModalVisible] = useState(false)

  const handlePress = () => {
    setModalVisible(true)
  }

  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton
      case "outline":
        return styles.outlineButton
      case "link":
        return styles.linkButton
      case "primary":
      default:
        return styles.primaryButton
    }
  }

  const getButtonTextStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButtonText
      case "outline":
        return styles.outlineButtonText
      case "link":
        return styles.linkButtonText
      case "primary":
      default:
        return styles.primaryButtonText
    }
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.button, getButtonStyle()]}
        onPress={handlePress}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Fund Account"
        accessibilityHint="Tap to open fund account options"
      >
        <Text style={[styles.buttonText, getButtonTextStyle()]}>
          Fund Account
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        accessible
        accessibilityViewIsModal
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Close fund options"
        >
          <Pressable
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            <FundContent />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.sm,
    minHeight: sizes.buttonMinHeight,
  },
  primaryButton: {
    backgroundColor: colors.slate900,
  },
  secondaryButton: {
    backgroundColor: colors.slate100,
  },
  outlineButton: {
    backgroundColor: colors.transparent,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
  },
  linkButton: {
    backgroundColor: colors.transparent,
    paddingHorizontal: spacing.xs,
    minHeight: 0,
  },
  buttonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.slate900,
  },
  outlineButtonText: {
    color: colors.slate900,
  },
  linkButtonText: {
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    width: "100%",
    maxWidth: sizes.modalMaxWidth,
    shadowColor: colors.slate900,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: radius.md,
    elevation: 8,
  },
})
