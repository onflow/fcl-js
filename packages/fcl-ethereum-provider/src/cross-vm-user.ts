import * as fcl from "@onflow/fcl"

/**
 * The controller is given to each plugin when it is bound.
 * It exposes a connect method so that plugins (if needed)
 * can trigger state updates across the system.
 */
export type CrossVmController<PluginStates extends {}> = {
  connect: (newState: Partial<PluginStates>) => void
}

/**
 * A plugin is a function that receives the controller and returns
 * an object containing at least a setState function for its own state.
 *
 * The first type parameter is the state type for this plugin.
 * The second parameter is the overall plugin state (the mapping of keys to state).
 */
export type CrossVmPlugin<PluginState, PluginStates extends {}> = (
  controller: CrossVmController<PluginStates>
) => {
  unauthenticate: () => void
  // Optionally, you can expose additional plugin-specific API here.
}

/**
 * The user object exposes a way to bind plugins later,
 * a connect method that accepts a partial state update (keyed by plugin),
 * and a getState method to inspect the current plugin state.
 */
export type CrossVmUser<Providers extends {}> = {
  /**
   * Bind a plugin under the specified key.
   */
  bindPlugin: <K extends keyof Providers>(
    key: K,
    plugin: CrossVmPlugin<Providers[K], Providers>
  ) => void

  /**
   * Update one or more plugins’ state.
   * This calls each bound plugin’s setState method.
   */
  connect: (newState: Partial<Providers>) => void

  /**
   * Get the current state snapshot for all plugins.
   */
  getProviders: () => Providers
}

/**
 * Create a CrossVmUser with a given overall plugin state shape.
 * No plugins are bound initially. They can be bound later with bindPlugin.
 *
 * @example
 * // Create a user expecting two plugins: "fcl" and "ethereum"
 * const user = createCrossVmUser<{
 *   fcl: { account: string },
 *   ethereum: { isConnected: boolean }
 * }>()
 *
 * // Later, bind your plugins:
 * user.bindPlugin("fcl", (controller) => ({
 *   setState: (state) => { console.log("fcl plugin updated", state) }
 * }))
 * user.bindPlugin("ethereum", (controller) => ({
 *   setState: (state) => { console.log("ethereum plugin updated", state) }
 * }))
 *
 * // Now update the state for one or both plugins:
 * user.connect({
 *   fcl: { account: "0xABC123" },
 *   ethereum: { isConnected: true }
 * })
 */
export function createCrossVmUser<
  ProviderTypes extends {} = {},
>(): CrossVmUser<ProviderTypes> {
  // Internal storage for the current plugin states.
  // todo: make this an observable
  const state: Partial<ProviderTypes> = {}

  // We'll store each plugin's instance (its API) by key.
  const pluginInstances: Partial<
    Record<keyof ProviderTypes, {unauthenticate: () => void}>
  > = {}

  // The controller passed to each plugin.
  const controller: CrossVmController<ProviderTypes> = {
    connect(newState: Partial<ProviderTypes>) {
      // Update the state for each plugin.
      for (const key in newState) {
        if (newState.hasOwnProperty(key)) {
          state[key] = {...state[key], ...newState[key]}
          pluginInstances[key]?.unauthenticate()
        }
      }
    },
  }

  function bindPlugin<K extends keyof ProviderTypes>(
    key: K,
    plugin: CrossVmPlugin<ProviderTypes[K], ProviderTypes>
  ) {
    // Bind the plugin and store its API.
    pluginInstances[key] = plugin(controller)
  }

  function connect(newState: Partial<ProviderTypes>) {
    controller.connect(newState)
  }

  function getProviders(): ProviderTypes {
    return state as ProviderTypes
  }

  return {bindPlugin, connect, getProviders}
}
