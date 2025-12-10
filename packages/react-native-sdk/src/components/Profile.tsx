import React, {useCallback, useMemo, useState, useEffect} from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  type ViewStyle,
} from "react-native"
import {
  useFlowCurrentUser,
  useCrossVmTokenBalance,
  UseCrossVmTokenBalanceData,
  useFlowChainId,
  getFlowscanAccountUrl,
  CONTRACT_ADDRESSES,
} from "@onflow/react-core"
import type {TokenConfig} from "./Connect"

type BalanceType = keyof UseCrossVmTokenBalanceData

export interface ProfileProps {
  /** Callback when user disconnects */
  onDisconnect?: () => void
  /** Balance type to display (cadence, evm, or combined) */
  balanceType?: BalanceType
  /** Custom tokens to display balance for */
  balanceTokens?: TokenConfig[]
  /** Container style override */
  style?: ViewStyle
}

/**
 * Profile - Displays user wallet information with balance
 *
 * Shows the connected wallet address and token balance.
 * Provides disconnect functionality and links to Flowscan.
 *
 * @example
 * ```tsx
 * <Profile
 *   onDisconnect={() => console.log("Disconnected")}
 *   balanceType="cadence"
 * />
 * ```
 */
export const Profile: React.FC<ProfileProps> = ({
  onDisconnect,
  balanceType = "cadence",
  balanceTokens,
  style,
}) => {
  const {user, unauthenticate} = useFlowCurrentUser()
  const {data: chainId} = useFlowChainId()
  const [copied, setCopied] = useState(false)

  // Default token configuration for FlowToken
  const defaultTokens: TokenConfig[] = useMemo(() => {
    if (!chainId) return []

    const getFlowTokenAddress = () => {
      if (chainId === "emulator" || chainId === "local")
        return CONTRACT_ADDRESSES.local.FlowToken
      return chainId === "testnet"
        ? CONTRACT_ADDRESSES.testnet.FlowToken
        : CONTRACT_ADDRESSES.mainnet.FlowToken
    }

    const address = getFlowTokenAddress().replace("0x", "")
    return [
      {
        symbol: "FLOW",
        name: "Flow Token",
        vaultIdentifier: `A.${address}.FlowToken.Vault`,
      },
    ]
  }, [chainId])

  // Use provided tokens or default to FLOW
  const availableTokens = useMemo(
    () =>
      balanceTokens && balanceTokens.length > 0 ? balanceTokens : defaultTokens,
    [balanceTokens, defaultTokens]
  )

  const [selectedToken, setSelectedToken] = useState<TokenConfig | undefined>(
    availableTokens[0]
  )

  // Update selectedToken when availableTokens changes
  useEffect(() => {
    if (!availableTokens || availableTokens.length === 0) {
      setSelectedToken(undefined)
      return
    }

    setSelectedToken(prev => {
      if (!prev) return availableTokens[0]

      const updatedToken = availableTokens.find(t => t.symbol === prev.symbol)
      if (!updatedToken) return availableTokens[0]

      if (
        (!prev.vaultIdentifier && updatedToken.vaultIdentifier) ||
        (!prev.erc20Address && updatedToken.erc20Address)
      ) {
        return updatedToken
      }

      return prev
    })
  }, [availableTokens])

  const {data: balanceData} = useCrossVmTokenBalance({
    owner: user?.addr,
    vaultIdentifier: selectedToken?.vaultIdentifier,
    erc20Address: selectedToken?.erc20Address,
    query: {
      enabled:
        !!user?.addr &&
        !!chainId &&
        !!selectedToken &&
        (!!selectedToken?.vaultIdentifier || !!selectedToken?.erc20Address),
    },
  })

  const displayAddress = useMemo(() => {
    if (!user?.addr) return ""
    return `${user.addr.slice(0, 6)}...${user.addr.slice(-4)}`
  }, [user?.addr])

  const flowscanUrl = useMemo(
    () => getFlowscanAccountUrl(user?.addr || "", chainId),
    [user?.addr, chainId]
  )

  const displayBalance = useMemo(() => {
    if (
      !balanceData ||
      typeof balanceData === "string" ||
      !balanceData[balanceType]?.formatted
    ) {
      return "0"
    }
    return Number(balanceData[balanceType].formatted).toLocaleString(
      undefined,
      {
        maximumFractionDigits: 4,
        minimumFractionDigits: 0,
      }
    )
  }, [balanceData, balanceType])

  const handleCopy = useCallback(async () => {
    if (user?.addr) {
      try {
        // Try to use @react-native-clipboard/clipboard if available
        const Clipboard = require("@react-native-clipboard/clipboard").default
        Clipboard.setString(user.addr)
      } catch {
        // Fallback: just show copied feedback without actual clipboard
        console.warn(
          "Clipboard not available. Install @react-native-clipboard/clipboard for copy functionality."
        )
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }, [user?.addr])

  const handleOpenFlowscan = useCallback(() => {
    if (flowscanUrl) {
      Linking.openURL(flowscanUrl)
    }
  }, [flowscanUrl])

  const handleDisconnect = useCallback(() => {
    unauthenticate()
    onDisconnect?.()
  }, [unauthenticate, onDisconnect])

  const handleSelectToken = useCallback((token: TokenConfig) => {
    setSelectedToken(token)
  }, [])

  // Not connected state
  if (!user?.loggedIn) {
    return (
      <View style={[styles.container, styles.centerContent, style]}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <Text style={styles.notConnectedText}>No connected wallet</Text>
      </View>
    )
  }

  // Connected state
  return (
    <View style={[styles.container, style]}>
      {/* Header with avatar and address */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
        <View style={styles.addressRow}>
          <Text style={styles.address}>{displayAddress}</Text>
          {flowscanUrl && (
            <TouchableOpacity
              onPress={handleOpenFlowscan}
              accessible
              accessibilityRole="link"
              accessibilityLabel="View on Flowscan"
            >
              <Text style={styles.externalLink}>↗</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Token selector (when multiple tokens) */}
      {availableTokens.length > 1 && (
        <View style={styles.tokenSelector}>
          <Text style={styles.sectionLabel}>Token</Text>
          <View style={styles.tokenList}>
            {availableTokens.map(token => (
              <TouchableOpacity
                key={token.symbol}
                style={[
                  styles.tokenOption,
                  selectedToken?.symbol === token.symbol &&
                    styles.tokenOptionSelected,
                ]}
                onPress={() => handleSelectToken(token)}
                accessible
                accessibilityRole="radio"
                accessibilityState={{
                  selected: selectedToken?.symbol === token.symbol,
                }}
              >
                <Text
                  style={[
                    styles.tokenSymbol,
                    selectedToken?.symbol === token.symbol &&
                      styles.tokenSymbolSelected,
                  ]}
                >
                  {token.symbol}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Balance display */}
      <View style={styles.balanceCard}>
        <Text style={styles.sectionLabel}>Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>{displayBalance}</Text>
          <Text style={styles.balanceSymbol}>
            {selectedToken?.symbol || "FLOW"}
          </Text>
        </View>
      </View>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopy}
          disabled={copied}
          accessible
          accessibilityRole="button"
          accessibilityLabel={copied ? "Address copied" : "Copy address"}
        >
          <Text style={styles.actionIcon}>{copied ? "✓" : "📋"}</Text>
          <Text style={styles.actionText}>
            {copied ? "Copied!" : "Copy Address"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDisconnect}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Disconnect wallet"
        >
          <Text style={styles.actionIcon}>🚪</Text>
          <Text style={styles.actionText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },

  // Not connected state
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  notConnectedText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarIcon: {
    fontSize: 32,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  address: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A",
  },
  externalLink: {
    fontSize: 16,
    color: "#64748B",
  },

  // Token selector
  tokenSelector: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },
  tokenList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tokenOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  tokenOptionSelected: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },
  tokenSymbol: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },
  tokenSymbolSelected: {
    color: "#2563EB",
  },

  // Balance card
  balanceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 16,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },
  balanceSymbol: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    marginLeft: 8,
  },

  // Actions
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0F172A",
  },
})
