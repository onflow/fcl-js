import {config} from "@onflow/config"
import {pluginRegistry} from "@onflow/fcl-core"
import {invariant} from "@onflow/util-invariant"
import * as fclWc from "@onflow/fcl-wc"

const isServer = typeof window === "undefined"

export function initFclWcLoader() {
  // We cannot load WalletConnect plugin on server side
  if (isServer) {
    return
  }

  config.subscribe(async (cfg: any) => {
    const projectId: string | undefined = cfg["walletconnect.projectId"]
    const metadata: any = cfg["walletconnect.metadata"]

    const isConfigured = !!projectId || !!metadata
    if (!isConfigured) {
      return
    }

    invariant(
      !!projectId,
      "FCL Configuration value for 'walletconnect.projectId' is required"
    )

    invariant(
      typeof metadata === "object" || metadata == null,
      "FCL Configuration value for 'walletconnect.metadata' must be an object"
    )

    const {FclWcServicePlugin} = await fclWc.init({
      projectId,
      metadata,
    })
    pluginRegistry.add([FclWcServicePlugin])
  })
}
