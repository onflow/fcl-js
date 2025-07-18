import {useContext} from "react"
import {FclClientContext} from "../core/context"
import {createFcl} from "@onflow/fcl"

export function useClient({
  client,
}: {client?: ReturnType<typeof createFcl>} = {}) {
  const contextClient = useContext(FclClientContext)
  const _client = client ?? contextClient
  if (!_client) {
    throw new Error(
      "useClient must be used within FlowProvider or manually specified using the client property"
    )
  }
  return _client
}
