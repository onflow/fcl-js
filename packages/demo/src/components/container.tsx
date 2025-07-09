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

export function Container() {
  return (
    <div className="w-full flex flex-col gap-0">
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
    </div>
  )
}
