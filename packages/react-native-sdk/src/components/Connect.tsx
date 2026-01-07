import {useFlowCurrentUser, truncateAddress} from "@onflow/react-core"
import {UseCrossVmTokenBalanceData} from "@onflow/react-core"
import React, {useCallback, useMemo, useState} from "react"
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
import {Profile} from "./Profile"

type BalanceType = keyof UseCrossVmTokenBalanceData

export type TokenConfig = {
  symbol: string
  name: string
} & (
  | {vaultIdentifier: string; erc20Address?: never}
  | {vaultIdentifier?: never; erc20Address: string}
)

export interface ConnectProps {
  /** Callback after successful connection */
  onConnect?: () => void
  /** Callback after disconnection */
  onDisconnect?: () => void
  /** Balance type to display in profile (cadence, evm, or combined) */
  balanceType?: BalanceType
  /** Custom tokens to display balance for in profile */
  balanceTokens?: TokenConfig[]
  /** Whether to show profile modal when connected (default: true) */
  modalEnabled?: boolean
}

/**
 * Connect - Wallet connection button for React Native
 *
 * Displays a button to connect/disconnect wallet. When connected,
 * shows the truncated address and opens a profile modal on tap.
 *
 * @example
 * ```tsx
 * <Connect
 *   onConnect={() => console.log("Connected!")}
 *   onDisconnect={() => console.log("Disconnected!")}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With balance display
 * <Connect
 *   balanceType="cadence"
 *   balanceTokens={[
 *     { symbol: "FLOW", name: "Flow Token", vaultIdentifier: "..." }
 *   ]}
 * />
 * ```
 */
export function Connect({
  onConnect,
  onDisconnect,
  balanceType = "cadence",
  balanceTokens,
  modalEnabled = true,
}: ConnectProps) {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()
  const [modalVisible, setModalVisible] = useState(false)

  const isLoggedIn = user?.loggedIn ?? false

  const displayAddress = useMemo(() => {
    if (!user?.addr) return ""
    return truncateAddress(user.addr)
  }, [user?.addr])

  const handleDisconnect = useCallback(() => {
    unauthenticate()
    setModalVisible(false)
    onDisconnect?.()
  }, [unauthenticate, onDisconnect])

  const handlePress = useCallback(async () => {
    if (isLoggedIn) {
      if (modalEnabled) {
        setModalVisible(true)
      } else {
        handleDisconnect()
      }
    } else {
      try {
        await authenticate()
        onConnect?.()
      } catch {
        // Authentication was cancelled or failed - no action needed
      }
    }
  }, [isLoggedIn, modalEnabled, authenticate, onConnect, handleDisconnect])

  const buttonText = useMemo(() => {
    if (isLoggedIn) return displayAddress
    return "Connect Wallet"
  }, [isLoggedIn, displayAddress])

  const accessibilityLabel = useMemo(() => {
    if (isLoggedIn) return `Connected: ${displayAddress}`
    return "Connect wallet"
  }, [isLoggedIn, displayAddress])

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          isLoggedIn ? styles.connectedButton : styles.disconnectedButton,
        ]}
        onPress={handlePress}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={
          isLoggedIn ? "Tap to view profile" : "Tap to connect wallet"
        }
      >
        <Text
          style={[
            styles.buttonText,
            isLoggedIn
              ? styles.connectedButtonText
              : styles.disconnectedButtonText,
          ]}
        >
          {buttonText}
        </Text>
      </TouchableOpacity>

      {isLoggedIn && modalEnabled && (
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
            accessibilityLabel="Close profile"
          >
            <Pressable
              style={styles.modalContent}
              onPress={e => e.stopPropagation()}
            >
              <Profile
                onDisconnect={handleDisconnect}
                balanceType={balanceType}
                balanceTokens={balanceTokens}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
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
  disconnectedButton: {
    backgroundColor: colors.slate900,
  },
  connectedButton: {
    backgroundColor: colors.transparent,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
  },
  buttonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  disconnectedButtonText: {
    color: colors.white,
  },
  connectedButtonText: {
    color: colors.slate900,
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
