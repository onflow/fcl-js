import React, {useState, useCallback} from "react"
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from "react-native"
import * as Clipboard from "expo-clipboard"
import {useFlowCurrentUser} from "@onflow/react-core"
import {CopyIcon, CheckIcon, ChevronDownIcon} from "../icons"
import {
  colors,
  spacing,
  radius,
  borderWidths,
  sizes,
  fontSizes,
  fontWeights,
} from "../styles"

const tokens = [
  {id: 1, name: "USDC"},
  {id: 2, name: "FLOW"},
]

const chains = [
  {id: 1, name: "Flow"},
  {id: 2, name: "Ethereum"},
]

type TabType = "credit-card" | "crypto-transfer"

const PLACEHOLDER_ADDRESS = "0x1a2b3c4d5e6f7890abcdef1234567890"

/**
 * FundContent - Content for the Fund modal
 *
 * Displays two tabs for funding options:
 * - Credit Card: Enter amount in USD
 * - Crypto Transfer: Select token/chain and copy deposit address
 *
 * @example
 * ```tsx
 * <FundContent />
 * ```
 */
export const FundContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("credit-card")
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState(tokens[0])
  const [selectedChain, setSelectedChain] = useState(chains[0])
  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false)
  const [chainDropdownOpen, setChainDropdownOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const {user} = useFlowCurrentUser()
  const depositAddress = user?.addr || PLACEHOLDER_ADDRESS

  const handleCopyAddress = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(depositAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Silently fail
    }
  }, [depositAddress])

  const handleSelectToken = useCallback((token: (typeof tokens)[0]) => {
    setSelectedToken(token)
    setTokenDropdownOpen(false)
  }, [])

  const handleSelectChain = useCallback((chain: (typeof chains)[0]) => {
    setSelectedChain(chain)
    setChainDropdownOpen(false)
  }, [])

  const handleContinue = useCallback(() => {
    // TODO: Implement continue functionality for credit card
    console.log("Continue with amount:", amount)
  }, [amount])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fund Your Account</Text>

      <View style={styles.tabList}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "credit-card" && styles.tabActive]}
          onPress={() => setActiveTab("credit-card")}
          accessible
          accessibilityRole="tab"
          accessibilityState={{selected: activeTab === "credit-card"}}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "credit-card" && styles.tabTextActive,
            ]}
          >
            Credit Card
          </Text>
          {activeTab === "credit-card" && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "crypto-transfer" && styles.tabActive,
          ]}
          onPress={() => setActiveTab("crypto-transfer")}
          accessible
          accessibilityRole="tab"
          accessibilityState={{selected: activeTab === "crypto-transfer"}}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "crypto-transfer" && styles.tabTextActive,
            ]}
          >
            Crypto Transfer
          </Text>
          {activeTab === "crypto-transfer" && (
            <View style={styles.tabIndicator} />
          )}
        </TouchableOpacity>
      </View>

      {activeTab === "credit-card" && (
        <View style={styles.tabPanel}>
          <View style={styles.amountCard}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputRow}>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.slate500}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                accessible
                accessibilityLabel="Amount in USD"
              />
              <Text style={styles.currencyLabel}>USD</Text>
            </View>
            <View style={styles.estimatedRow}>
              <Text style={styles.estimatedText}>
                {"≈ "}
                <Text style={styles.estimatedValue}>0 FLOW</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Continue with purchase"
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "crypto-transfer" && (
        <View style={styles.tabPanel}>
          <View style={styles.selectorsRow}>
            <View style={[styles.selectorContainer, {zIndex: 2}]}>
              <Text style={styles.label}>Token</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                  setTokenDropdownOpen(!tokenDropdownOpen)
                  setChainDropdownOpen(false)
                }}
                accessible
                accessibilityRole="combobox"
                accessibilityLabel={`Token: ${selectedToken.name}`}
              >
                <Text style={styles.selectorText}>{selectedToken.name}</Text>
                <ChevronDownIcon size={sizes.iconSm} color={colors.slate500} />
              </TouchableOpacity>
              {tokenDropdownOpen && (
                <View style={styles.dropdown}>
                  {tokens.map(token => (
                    <TouchableOpacity
                      key={token.id}
                      style={[
                        styles.dropdownOption,
                        selectedToken.id === token.id &&
                          styles.dropdownOptionSelected,
                      ]}
                      onPress={() => handleSelectToken(token)}
                      accessible
                      accessibilityRole="menuitem"
                      accessibilityState={{
                        selected: selectedToken.id === token.id,
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          selectedToken.id === token.id &&
                            styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {token.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={[styles.selectorContainer, {zIndex: 1}]}>
              <Text style={styles.label}>Chain</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => {
                  setChainDropdownOpen(!chainDropdownOpen)
                  setTokenDropdownOpen(false)
                }}
                accessible
                accessibilityRole="combobox"
                accessibilityLabel={`Chain: ${selectedChain.name}`}
              >
                <Text style={styles.selectorText}>{selectedChain.name}</Text>
                <ChevronDownIcon size={sizes.iconSm} color={colors.slate500} />
              </TouchableOpacity>
              {chainDropdownOpen && (
                <View style={styles.dropdown}>
                  {chains.map(chain => (
                    <TouchableOpacity
                      key={chain.id}
                      style={[
                        styles.dropdownOption,
                        selectedChain.id === chain.id &&
                          styles.dropdownOptionSelected,
                      ]}
                      onPress={() => handleSelectChain(chain)}
                      accessible
                      accessibilityRole="menuitem"
                      accessibilityState={{
                        selected: selectedChain.id === chain.id,
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownOptionText,
                          selectedChain.id === chain.id &&
                            styles.dropdownOptionTextSelected,
                        ]}
                      >
                        {chain.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>Deposit Address</Text>
            <View style={styles.addressCard}>
              <Text style={styles.addressText} numberOfLines={1}>
                {depositAddress}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={handleCopyAddress}
                disabled={copied}
                accessible
                accessibilityRole="button"
                accessibilityLabel={copied ? "Address copied" : "Copy address"}
              >
                {copied ? (
                  <CheckIcon size={sizes.iconSm} color={colors.white} />
                ) : (
                  <CopyIcon size={sizes.iconSm} color={colors.white} />
                )}
                <Text style={styles.copyButtonText}>
                  {copied ? "Copied!" : "Copy"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: fontWeights.semibold,
    color: colors.slate900,
    marginBottom: spacing.md,
  },
  tabList: {
    flexDirection: "row",
    borderBottomWidth: borderWidths.default,
    borderBottomColor: colors.slate200,
    marginBottom: spacing.lg,
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    position: "relative",
  },
  tabActive: {},
  tabText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.slate500,
  },
  tabTextActive: {
    color: colors.slate900,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -borderWidths.default,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.slate900,
  },
  tabPanel: {
    gap: spacing.md,
  },
  amountCard: {
    backgroundColor: colors.slate50,
    borderRadius: radius.md,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
    padding: spacing.md,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.slate500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  amountInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: fontWeights.medium,
    color: colors.slate900,
    padding: 0,
  },
  currencyLabel: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.slate500,
  },
  estimatedRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: borderWidths.default,
    borderTopColor: colors.slate200,
  },
  estimatedText: {
    fontSize: fontSizes.sm,
    color: colors.slate500,
  },
  estimatedValue: {
    fontWeight: fontWeights.medium,
    color: colors.slate900,
  },
  continueButton: {
    backgroundColor: colors.slate900,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    minHeight: sizes.buttonMinHeight,
  },
  continueButtonText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  selectorsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  selectorContainer: {
    flex: 1,
    position: "relative",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  selectorText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.slate900,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: radius.sm,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
    marginTop: spacing.xs,
    shadowColor: colors.slate900,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.primaryLight,
  },
  dropdownOptionText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.slate900,
  },
  dropdownOptionTextSelected: {
    color: colors.primary,
  },
  addressSection: {
    alignItems: "center",
    gap: spacing.xs,
  },
  addressLabel: {
    fontSize: fontSizes.sm,
    color: colors.slate500,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.slate50,
    borderRadius: radius.md,
    borderWidth: borderWidths.default,
    borderColor: colors.slate200,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    width: "100%",
  },
  addressText: {
    flex: 1,
    fontSize: fontSizes.sm,
    fontFamily: "monospace",
    color: colors.slate900,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.slate900,
    borderRadius: radius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  copyButtonText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    color: colors.white,
  },
})
