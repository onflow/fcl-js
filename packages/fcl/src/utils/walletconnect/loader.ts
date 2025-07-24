import {type config as _config} from "@onflow/config"
import {pluginRegistry} from "@onflow/fcl-core"
import {invariant} from "@onflow/util-invariant"
import * as fclWc from "@onflow/fcl-wc"
import {CoreTypes} from "@walletconnect/types"

export const isServer = typeof window === "undefined"

const getMetadata = (config: {
  appDetailTitle?: string | null
  appDetailIcon?: string | null
  appDetailDescription?: string | null
  appDetailUrl?: string | null
}): CoreTypes.Metadata => {
  const appTitle = config.appDetailTitle
  const appIcon = config.appDetailIcon
  const appDescription = config.appDetailDescription
  const appUrl = config.appDetailUrl

  return {
    name: appTitle ?? document.title,
    description: appDescription ?? "",
    url: appUrl ?? window.location.origin,
    icons: appIcon ? [appIcon] : [],
  }
}

// Use previous configuration to check for changes & notify the user that this is not possible
let lastConfig: string | null = null

// Only the first configuration will be used
let hasLoaded = false

export function initFclWcLoader({
  config,
}: {
  config: ReturnType<typeof _config>
}) {
  // We cannot load WalletConnect plugin on server side
  if (isServer) {
    return
  }

  config.subscribe(async (fullConfig: any) => {
    const wcConfig = {
      walletConnectProjectId: fullConfig["walletconnect.projectId"],
      walletConnectDisableNotifications:
        fullConfig["walletconnect.disableNotifications"],
      appDetailTitle: fullConfig["app.detail.title"],
      appDetailIcon: fullConfig["app.detail.icon"],
      appDetailDescription: fullConfig["app.detail.description"],
      appDetailUrl: fullConfig["app.detail.url"],
    }
    loadFclWc(wcConfig)
  })
}

export function loadFclWc(wcConfig: {
  walletConnectProjectId?: string | null
  walletConnectDisableNotifications?: boolean | null
  appDetailTitle?: string | null
  appDetailIcon?: string | null
  appDetailDescription?: string | null
  appDetailUrl?: string | null
}) {
  const projectId: string | undefined | null = wcConfig.walletConnectProjectId
  const disableNotifications: boolean | undefined | null =
    wcConfig.walletConnectDisableNotifications

  // Check if the plugin is already loaded by this loader, but with different configuration
  // The plugin can only be loaded once
  const previousConfig = lastConfig
  lastConfig = JSON.stringify(wcConfig, null, 2)
  if (hasLoaded) {
    if (previousConfig !== lastConfig) {
      console.warn(
        `FCL WalletConnect Plugin has been already loaded with different configuration. It is not possible to change the configuration after the plugin has been loaded.

Previous configuration:
${previousConfig}

Current configuration:
${lastConfig}`
      )
    }
    return
  }

  // If the configuration is not set, we do not load the plugin
  const isConfigured = !!projectId
  if (!isConfigured) {
    return
  }

  invariant(
    !!projectId,
    "FCL Configuration value for 'walletconnect.projectId' is required"
  )

  // Check if the plugin is already loaded manually
  // Usually this won't happen as it is more likely that the plugin will be loaded by this loader
  // before the developer has a chance to load it manually, but it's good to check
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
  const {providerPromise: _clientPromise, FclWcServicePlugin} = fclWc.initLazy({
    projectId,
    metadata: getMetadata(wcConfig),
    disableNotifications: disableNotifications ?? undefined,
  })
  pluginRegistry.add([FclWcServicePlugin])
}
