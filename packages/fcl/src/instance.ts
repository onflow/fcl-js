import {createFcl as createFclCore} from "@onflow/fcl-core"
import {LOCAL_STORAGE} from "./fcl"
import {execStrategyHook} from "./discovery/exec-hook"

export const discoveryOpts = {
  execStrategy: execStrategyHook,
}

export function createFcl(params: Parameters<typeof createFclCore>[0]) {
  const fclCore = createFclCore({
    ...params,
    platform: "web",
    storage: params.storage || LOCAL_STORAGE,
  })

  return {
    ...fclCore,
  }
}
