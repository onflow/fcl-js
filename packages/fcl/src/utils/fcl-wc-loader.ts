import * as fclWc from "@onflow/fcl-wc"
import {config} from "@onflow/config"
import {pluginRegistry} from "@onflow/fcl-core"
import {invariant} from "@onflow/util-invariant"

export function initFclWcLoader() {
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
