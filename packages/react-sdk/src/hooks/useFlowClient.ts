import {useContext} from "react"
import {FclClientContext} from "../core/context"
import {createFcl} from "@onflow/fcl"

export function useFlowClient({
  flowClient,
}: {flowClient?: ReturnType<typeof createFcl>} = {}) {
  const contextClient = useContext(FclClientContext)
  const _flowClient = flowClient ?? contextClient
  if (!_flowClient) {
    throw new Error(
      "useFlowClient must be used within FlowProvider or manually specified using the flowClient property"
    )
  }
  return _flowClient
}
