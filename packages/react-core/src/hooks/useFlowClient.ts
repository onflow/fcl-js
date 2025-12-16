import {useContext} from "react"
import type {FlowClientCore} from "@onflow/fcl-core"
import {FlowClientContext} from "../core/context"

export function useFlowClient({
  flowClient,
}: {flowClient?: FlowClientCore} = {}) {
  const contextClient = useContext(FlowClientContext)
  const _flowClient = flowClient ?? contextClient
  if (!_flowClient) {
    throw new Error(
      "useFlowClient must be used within FlowProvider or manually specified using the flowClient property"
    )
  }
  return _flowClient
}
