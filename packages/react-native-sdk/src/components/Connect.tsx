import React, {useState, useCallback, useMemo} from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  View,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle,
} from "react-native"
import {useFlowCurrentUser} from "@onflow/react-sdk"
import {Profile} from "./Profile"

interface ConnectProps {
  onConnect?: () => void
  onDisconnect?: () => void
  style?: ViewStyle
  textStyle?: TextStyle
  connectedStyle?: ViewStyle
  connectedTextStyle?: TextStyle
  modalEnabled?: boolean
}

export const Connect: React.FC<ConnectProps> = ({
  onConnect,
  onDisconnect,
  style,
  textStyle,
  connectedStyle,
  connectedTextStyle,
  modalEnabled = true,
}) => {
  const {user, authenticate, unauthenticate} = useFlowCurrentUser()
  const [modalVisible, setModalVisible] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const displayAddress = useMemo(
    () =>
      user?.loggedIn && user.addr
        ? `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`
        : "",
    [user?.loggedIn, user?.addr]
  )

  const handleDisconnect = useCallback(() => {
    unauthenticate()
    setModalVisible(false)
    onDisconnect?.()
  }, [unauthenticate, onDisconnect])

  const handleButtonPress = useCallback(async () => {
    if (user?.loggedIn) {
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
        console.error("Failed to authenticate:", error)
      } finally {
        setIsConnecting(false)
      }
    }
  }, [user?.loggedIn, modalEnabled, authenticate, onConnect, handleDisconnect])

  const buttonAccessibilityLabel = useMemo(() => {
    if (isConnecting) return "Connecting to wallet"
    return user?.loggedIn ? `Connected: ${displayAddress}` : "Connect Wallet"
  }, [user?.loggedIn, displayAddress, isConnecting])

  const buttonText = useMemo(() => {
    if (isConnecting) return "Connecting..."
    return user?.loggedIn ? displayAddress : "Connect Wallet"
  }, [user?.loggedIn, displayAddress, isConnecting])

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          user?.loggedIn ? styles.connectedButton : styles.disconnectedButton,
          style,
          user?.loggedIn && connectedStyle,
        ]}
        onPress={handleButtonPress}
        disabled={isConnecting}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={buttonAccessibilityLabel}
        accessibilityHint={
          user?.loggedIn
            ? "Tap to view your wallet details"
            : "Tap to connect your wallet"
        }
        accessibilityState={{disabled: isConnecting}}
      >
        <Text
          style={[
            styles.buttonText,
            user?.loggedIn
              ? styles.connectedButtonText
              : styles.disconnectedButtonText,
            textStyle,
            user?.loggedIn && connectedTextStyle,
          ]}
        >
          {buttonText}
        </Text>
      </TouchableOpacity>

      {user?.loggedIn && modalEnabled && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          accessible={true}
          accessibilityViewIsModal={true}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Profile onDisconnect={handleDisconnect} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  disconnectedButton: {
    backgroundColor: "#0052FF",
  },
  connectedButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0052FF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  disconnectedButtonText: {
    color: "#FFFFFF",
  },
  connectedButtonText: {
    color: "#0052FF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
})
