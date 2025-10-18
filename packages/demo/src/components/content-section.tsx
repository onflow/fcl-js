import {PlusGrid, PlusGridRow} from "./ui/plus-grid"

// Import hook cards
import {UseFlowCurrentUserCard} from "./hook-cards/use-flow-current-user-card"
import {UseFlowAccountCard} from "./hook-cards/use-flow-account-card"
import {UseFlowBlockCard} from "./hook-cards/use-flow-block-card"
import {UseFlowChainIdCard} from "./hook-cards/use-flow-chain-id-card"
import {UseFlowConfigCard} from "./hook-cards/use-flow-config-card"
import {UseFlowQueryCard} from "./hook-cards/use-flow-query-card"
import {UseFlowQueryRawCard} from "./hook-cards/use-flow-query-raw-card"
import {UseFlowMutateCard} from "./hook-cards/use-flow-mutate-card"
import {UseFlowEventsCard} from "./hook-cards/use-flow-events-card"
import {UseFlowTransactionStatusCard} from "./hook-cards/use-flow-transaction-status-card"
import {UseFlowRevertibleRandomCard} from "./hook-cards/use-flow-revertible-random-card"
import {UseFlowScheduledTransactionCard} from "./hook-cards/use-flow-scheduled-transaction-card"
import {UseFlowNftMetadataCard} from "./hook-cards/use-flow-nft-metadata-card"

// Import setup cards
import {InstallationCard} from "./setup-cards/installation-card"

// Import advanced cards
import {DarkModeCard} from "./advanced-cards/dark-mode-card"
import {ThemingCard} from "./advanced-cards/theming-card"

// Import component cards
import {ConnectCard} from "./component-cards/connect-card"
import {TransactionButtonCard} from "./component-cards/transaction-button-card"
import {TransactionDialogCard} from "./component-cards/transaction-dialog-card"
import {TransactionLinkCard} from "./component-cards/transaction-link-card"

export function ContentSection() {
  return (
    <section id="content-section" className="">
      <PlusGrid>
        <PlusGridRow>
          <div className="my-12 md:my-24 mt-8 md:mt-16">
            <div className="text-left mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                Getting Started
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                Install and configure the Flow React SDK to start building apps
                on Flow.
              </p>
            </div>

            <InstallationCard />
          </div>

          <div className="mb-12 md:mb-24">
            <div className="text-left mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                React Components
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                Pre-built UI components for common Flow blockchain interactions.
                Drop them into your app to ship faster.
              </p>
            </div>

            <ConnectCard />
            <TransactionButtonCard />
            <TransactionDialogCard />
            <TransactionLinkCard />
          </div>

          <div className="mb-12 md:mb-24">
            <div className="text-left mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                React Hooks
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                Powerful React hooks for interacting with the Flow blockchain.
                Each hook provides a simple interface for complex blockchain
                operations.
              </p>
            </div>

            <UseFlowCurrentUserCard />
            <UseFlowAccountCard />
            <UseFlowBlockCard />
            <UseFlowChainIdCard />
            <UseFlowConfigCard />
            <UseFlowQueryCard />
            <UseFlowQueryRawCard />
            <UseFlowMutateCard />
            <UseFlowEventsCard />
            <UseFlowRevertibleRandomCard />
            <UseFlowTransactionStatusCard />
            <UseFlowNftMetadataCard />
            <UseFlowScheduledTransactionCard />
          </div>

          <div className="mb-12 md:mb-24">
            <div className="text-left mb-8 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                Advanced Features
              </h2>
              <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                Customize and extend the Flow React SDK with advanced theming,
                dark mode controls, and configuration options.
              </p>
            </div>

            <DarkModeCard />
            <ThemingCard />
          </div>
        </PlusGridRow>
      </PlusGrid>
    </section>
  )
}
