import {FlowCurrentUserCard} from "./cards/flow-current-user-card"
import {FlowAccountCard} from "./cards/flow-account-card"
import {FlowBlockCard} from "./cards/flow-block-card"
import {FlowChainIdCard} from "./cards/flow-chain-id-card"
import {FlowConfigCard} from "./cards/flow-config-card"
import {FlowEventsCard} from "./cards/flow-events-card"
import {FlowMutateCard} from "./cards/flow-mutate-card"
import {FlowQueryCard} from "./cards/flow-query-card"
import {FlowQueryRawCard} from "./cards/flow-query-raw-card"
import {FlowRevertibleRandomCard} from "./cards/flow-revertible-random-card"
import {FlowTransactionStatusCard} from "./cards/flow-transaction-status-card"
import {CrossVmReceiveTokenCard} from "./cards/cross-vm-receive-token-card"
import {KitConnectCard} from "./kits/kit-connect-card"
import {KitTransactionButtonCard} from "./kits/kit-transaction-button-card"
import {KitTransactionDialogCard} from "./kits/kit-transaction-dialog-card"
import {KitTransactionLinkCard} from "./kits/kit-transaction-link-card"
import {useDarkMode} from "./flow-provider-wrapper"

export function Container() {
  const {darkMode} = useDarkMode()

  return (
    <div className="w-full flex flex-col gap-6">
      <section>
        <h4
          className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Hooks
        </h4>
        <div className="space-y-4">
          <div id="flow-current-user" className="scroll-mt-4">
            <FlowCurrentUserCard />
          </div>
          <div id="flow-account" className="scroll-mt-4">
            <FlowAccountCard />
          </div>
          <div id="flow-block" className="scroll-mt-4">
            <FlowBlockCard />
          </div>
          <div id="flow-chain-id" className="scroll-mt-4">
            <FlowChainIdCard />
          </div>
          <div id="flow-config" className="scroll-mt-4">
            <FlowConfigCard />
          </div>
          <div id="flow-query" className="scroll-mt-4">
            <FlowQueryCard />
          </div>
          <div id="flow-query-raw" className="scroll-mt-4">
            <FlowQueryRawCard />
          </div>
          <div id="flow-mutate" className="scroll-mt-4">
            <FlowMutateCard />
          </div>
          <div id="flow-revertible-random" className="scroll-mt-4">
            <FlowRevertibleRandomCard />
          </div>
          <div id="flow-transaction-status" className="scroll-mt-4">
            <FlowTransactionStatusCard />
          </div>
          <div id="cross-vm-receive-token" className="scroll-mt-4">
            <CrossVmReceiveTokenCard />
          </div>
        </div>
      </section>

      <section>
        <h4
          className={`text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Components
        </h4>
        <div className="space-y-4">
          <div id="kit-connect" className="scroll-mt-4">
            <KitConnectCard />
          </div>
          <div id="kit-transaction-button" className="scroll-mt-4">
            <KitTransactionButtonCard />
          </div>
          <div id="kit-transaction-dialog" className="scroll-mt-4">
            <KitTransactionDialogCard />
          </div>
          <div id="kit-transaction-link" className="scroll-mt-4">
            <KitTransactionLinkCard />
          </div>
        </div>
      </section>
    </div>
  )
}
