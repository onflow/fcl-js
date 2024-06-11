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

  // Use previous configuration to check for changes & notify the user that this is not possible
  let previousConfig: string | null = null

  // Only the first configuration will be used
  let hasLoaded = false

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

    // Check if the plugin is already loaded by this loader, but with different configuration
    const currentConfig = JSON.stringify({projectId, metadata})
    if (previousConfig !== currentConfig && hasLoaded) {
      console.warn(
        "FCL WalletConnect plugin has been already loaded with different configuration. It is not possible to change the configuration after the plugin has been loaded."
      )
      return
    }
    previousConfig = currentConfig

    // Check if the plugin is already loaded manually
    if (pluginRegistry.getPlugins().has(fclWc.SERVICE_PLUGIN_NAME)) {
      if (!hasLoaded) {
        console.warn(
          "It seems like the FCL WalletConnect plugins has been already loaded manually. This is no longer necessary, please see the documentation for more information."
        )
      }
      hasLoaded = true
      return
    }
    hasLoaded = true

    // Load the plugin if not already loaded
    // We must lazy load the plugin to avoid race conditions
    // where the developer attempts to use the plugin before
    // our loader applies the configuration
    const {FclWcServicePlugin} = fclWc.initLazy({
      projectId,
      metadata,
    })
    pluginRegistry.add([FclWcServicePlugin])
  })
}
