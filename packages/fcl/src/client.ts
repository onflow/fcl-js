import {createFcl} from "@onflow/fcl-core"
import {LOCAL_STORAGE} from "./fcl"
import {execStrategyHook} from "./discovery/exec-hook"

export const discoveryOpts = {
  execStrategy: execStrategyHook,
}

type WithOptionalProperties<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

export function createFlowClient(
  params: WithOptionalProperties<
    Parameters<typeof createFcl>[0],
    "platform" | "storage" | "discoveryWalletMethod"
  >
) {
  const fclCore = createFcl({
    ...params,
    platform: "web",
    storage: params.storage || LOCAL_STORAGE,
    discovery: discoveryOpts,
    discoveryWalletMethod: params.discoveryWalletMethod || "IFRAME/RPC",
  })

  return {
    ...fclCore,
  }
}
