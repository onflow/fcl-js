import {useContext} from "react"
import {FlowClientContext} from "../core/context"
import {createFlowClient} from "@onflow/fcl"

export function useFlowClient({
  flowClient,
}: {flowClient?: ReturnType<typeof createFlowClient>} = {}) {
  const contextClient = useContext(FlowClientContext)
  const _flowClient = flowClient ?? contextClient
  if (!_flowClient) {
    throw new Error(
      "useFlowClient must be used within FlowProvider or manually specified using the flowClient property"
    )
  }
  return _flowClient
}
