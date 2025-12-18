import React, {useCallback, useMemo, useState, useEffect} from "react"
import {View, Text, TouchableOpacity, StyleSheet, Linking} from "react-native"
import * as Clipboard from "expo-clipboard"
import {sansPrefix} from "@onflow/fcl-react-native"
import {
  useFlowCurrentUser,
  useCrossVmTokenBalance,
  UseCrossVmTokenBalanceData,
  useFlowChainId,
  getFlowscanAccountUrl,
  CONTRACT_ADDRESSES,
  truncateAddress,
} from "@onflow/react-core"
import type {TokenConfig} from "./Connect"
import {
  UserIcon,
  CopyIcon,
  CheckIcon,
  LogOutIcon,
  ExternalLinkIcon,
} from "../icons"
import {
  colors,
  spacing,
  radius,
  borderWidths,
  sizes,
  fontSizes,
  fontWeights,
} from "../styles"

type BalanceType = keyof UseCrossVmTokenBalanceData

export interface ProfileProps {
  /** Callback when user disconnects */
  onDisconnect?: () => void
  /** Balance type to display (cadence, evm, or combined) */
  balanceType?: BalanceType
  /** Custom tokens to display balance for */
  balanceTokens?: TokenConfig[]
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

    const address = sansPrefix(getFlowTokenAddress())
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
    return truncateAddress(user.addr)
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
        await Clipboard.setStringAsync(user.addr)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      } catch {
        // Silently fail - clipboard may not be available in all environments
      }
    }
  }, [user?.addr])

  const handleOpenFlowscan = useCallback(async () => {
    if (flowscanUrl) {
      try {
        await Linking.openURL(flowscanUrl)
      } catch {
        // Silently fail - URL may not be supported
      }
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
      <View style={[styles.container, styles.centerContent]}>
        <View style={styles.avatarPlaceholder}>
          <UserIcon size={sizes.iconMd} color={colors.slate500} />
        </View>
        <Text style={styles.notConnectedText}>No connected wallet</Text>
      </View>
    )
  }

  // Connected state
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <UserIcon size={sizes.iconMd} color={colors.slate500} />
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
              <ExternalLinkIcon size={sizes.iconSm} color={colors.slate500} />
            </TouchableOpacity>
          )}
        </View>
      </View>

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

      <View style={styles.balanceCard}>
        <Text style={styles.sectionLabel}>Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>{displayBalance}</Text>
          <Text style={styles.balanceSymbol}>
            {selectedToken?.symbol || "FLOW"}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleCopy}
          disabled={copied}
          accessible
          accessibilityRole="button"
          accessibilityLabel={copied ? "Address copied" : "Copy address"}
        >
          {copied ? (
            <CheckIcon size={sizes.iconSm} color={colors.success} />
          ) : (
            <CopyIcon size={sizes.iconSm} color={colors.slate900} />
          )}
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
          <LogOutIcon size={sizes.iconSm} color={colors.slate900} />
          <Text style={styles.actionText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
  },

  avatarPlaceholder: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: radius.full,
    backgroundColor: colors.slate100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  notConnectedText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.slate500,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatar: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: radius.full,
    backgroundColor: colors.slate100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  address: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.slate900,
  },

  tokenSelector: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.slate500,
    marginBottom: spacing.xs,
  },
  tokenList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  tokenOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
  },
  tokenOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  tokenSymbol: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.slate500,
  },
  tokenSymbolSelected: {
    color: colors.primary,
  },

  balanceCard: {
    backgroundColor: colors.slate50,
    borderRadius: radius.md,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  balanceAmount: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.slate900,
  },
  balanceSymbol: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.slate500,
    marginLeft: spacing.xs,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
    backgroundColor: colors.white,
    gap: spacing.xs,
  },
  actionText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.slate900,
  },
})
