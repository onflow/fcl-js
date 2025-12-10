import {useFlowCurrentUser} from "@onflow/react-core"
import {UseCrossVmTokenBalanceData} from "@onflow/react-core"
import React, {useCallback, useMemo, useState} from "react"
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  type TextStyle,
  type ViewStyle,
} from "react-native"
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
  /** Button container style */
  style?: ViewStyle
  /** Button text style */
  textStyle?: TextStyle
  /** Style when connected */
  connectedStyle?: ViewStyle
  /** Text style when connected */
  connectedTextStyle?: TextStyle
  /** Custom text for connect button */
  connectText?: string
  /** Custom text for connecting state */
  connectingText?: string
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
 *
 * @example
 * ```tsx
 * // Custom styling
 * <Connect
 *   style={{backgroundColor: "#6366F1"}}
 *   textStyle={{fontSize: 18}}
 *   connectText="Sign In"
 * />
 * ```
 */
export function Connect({
  onConnect,
  onDisconnect,
  balanceType = "cadence",
  balanceTokens,
  modalEnabled = true,
  style,
  textStyle,
  connectedStyle,
  connectedTextStyle,
  connectText = "Connect Wallet",
  connectingText = "Connecting...",
}: ConnectProps) {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()
  const [modalVisible, setModalVisible] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const isLoggedIn = user?.loggedIn ?? false

  const displayAddress = useMemo(() => {
    if (!user?.addr) return ""
    return `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`
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
      setIsConnecting(true)
      try {
        await authenticate()
        onConnect?.()
      } catch (error) {
        console.error("Authentication failed:", error)
      } finally {
        setIsConnecting(false)
      }
    }
  }, [isLoggedIn, modalEnabled, authenticate, onConnect, handleDisconnect])

  const buttonText = useMemo(() => {
    if (isConnecting) return connectingText
    if (isLoggedIn) return displayAddress
    return connectText
  }, [isConnecting, isLoggedIn, displayAddress, connectText, connectingText])

  const accessibilityLabel = useMemo(() => {
    if (isConnecting) return "Connecting to wallet"
    if (isLoggedIn) return `Connected: ${displayAddress}`
    return "Connect wallet"
  }, [isConnecting, isLoggedIn, displayAddress])

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          isLoggedIn ? styles.connectedButton : styles.disconnectedButton,
          style,
          isLoggedIn && connectedStyle,
        ]}
        onPress={handlePress}
        disabled={isConnecting}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={
          isLoggedIn ? "Tap to view profile" : "Tap to connect wallet"
        }
        accessibilityState={{disabled: isConnecting}}
      >
        {isConnecting && (
          <ActivityIndicator
            size="small"
            color="#FFFFFF"
            style={styles.spinner}
          />
        )}
        <Text
          style={[
            styles.buttonText,
            isLoggedIn
              ? styles.connectedButtonText
              : styles.disconnectedButtonText,
            textStyle,
            isLoggedIn && connectedTextStyle,
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
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minHeight: 48,
  },
  disconnectedButton: {
    backgroundColor: "#2563EB",
  },
  connectedButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disconnectedButtonText: {
    color: "#FFFFFF",
  },
  connectedButtonText: {
    color: "#2563EB",
  },
  spinner: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
})
