import {Navbar} from "./navbar"
import {CurrentFlowUserCard} from "./cards/current-flow-user-card"
import {FlowAccountCard} from "./cards/flow-account-card"
import {FlowBlockCard} from "./cards/flow-block-card"
import {FlowChainIdCard} from "./cards/flow-chain-id-card"
import {FlowConfigCard} from "./cards/flow-config-card"
import {FlowEventsCard} from "./cards/flow-events-card"
import {FlowQueryCard} from "./cards/flow-query-card"
import {FlowQueryRawCard} from "./cards/flow-query-raw-card"
import {FlowMutateCard} from "./cards/flow-mutate-card"
import {FlowRevertibleRandomCard} from "./cards/flow-revertible-random-card"
import {FlowTransactionStatusCard} from "./cards/flow-transaction-status-card"

export function Container() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0",
      }}
    >
      <CurrentFlowUserCard />
      <FlowBlockCard />
      <FlowChainIdCard />
      <FlowConfigCard />
      <FlowEventsCard />
      <FlowQueryCard />
      <FlowQueryRawCard />
      <FlowMutateCard />
      <FlowRevertibleRandomCard />
      <FlowTransactionStatusCard />
    </div>
  )
}
