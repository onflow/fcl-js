import React from "react"
import {View, Text, TouchableOpacity, StyleSheet, ViewStyle} from "react-native"
import {useFlowCurrentUser} from "@onflow/react-sdk"

interface ProfileProps {
  onDisconnect?: () => void
  style?: ViewStyle
}

export const Profile: React.FC<ProfileProps> = React.memo(
  ({onDisconnect, style}) => {
    const {user} = useFlowCurrentUser()

    if (!user?.loggedIn || !user.addr) {
      return null
    }

    const displayAddress = `${user.addr.slice(0, 8)}...${user.addr.slice(-8)}`

    return (
      <View
        style={[styles.container, style]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="Wallet profile information"
      >
        <Text style={styles.title}>Profile</Text>

        <View style={styles.infoSection}>
          <Text style={styles.label} accessible={true} accessibilityRole="text">
            Wallet Address
          </Text>
          <Text
            style={styles.address}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Wallet address: ${user.addr}`}
          >
            {displayAddress}
          </Text>
          <Text
            style={styles.fullAddress}
            accessible={true}
            accessibilityRole="text"
          >
            {user.addr}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.disconnectButton}
          onPress={onDisconnect}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Disconnect wallet"
          accessibilityHint="Tap to disconnect your wallet from this application"
        >
          <Text style={styles.disconnectButtonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    )
  }
)

Profile.displayName = "Profile"

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666666",
    marginBottom: 8,
  },
  address: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  fullAddress: {
    fontSize: 12,
    color: "#999999",
    fontFamily: "monospace",
  },
  disconnectButton: {
    backgroundColor: "#FF4444",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    marginTop: 12,
  },
  disconnectButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
