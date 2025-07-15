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

export function Container() {
  return (
    <div className="w-full flex flex-col gap-0">
      <h4 className="text-2xl font-bold mb-2 p-4">Hooks</h4>
      <FlowCurrentUserCard />
      <FlowAccountCard />
      <FlowBlockCard />
      <FlowChainIdCard />
      <FlowConfigCard />
      <FlowQueryCard />
      <FlowQueryRawCard />
      <FlowMutateCard />
      <FlowRevertibleRandomCard />
      <FlowTransactionStatusCard />
      <CrossVmReceiveTokenCard />

      <h4 className="text-2xl font-bold mb-2 p-4">Components</h4>
      <KitConnectCard />
      <KitTransactionButtonCard />
      <KitTransactionDialogCard />
      <KitTransactionLinkCard />
    </div>
  )
}
