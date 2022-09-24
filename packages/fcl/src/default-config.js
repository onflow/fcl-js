import {config} from "@onflow/config"
import {getNetwork} from "./utils"

const isServerSide = () => typeof window === "undefined"

const SESSION_STORAGE = {
  can: !isServerSide(),
  get: async key => JSON.parse(sessionStorage.getItem(key)),
  put: async (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
}

async function setNetworkDefault() {
  const network = await getNetwork()
  config.put("flow.network.default", network)
  return network
}

setTimeout(async () => await setNetworkDefault(), 0)

config({
  "discovery.wallet.method.default": "IFRAME/RPC",
  "fcl.storage.default": SESSION_STORAGE,
})

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}

export async function getNetworkConfig() {
  let network = await config.get("flow.network.default")

  if (!network) {
    network = await setNetworkDefault()

    if (!network) {
      network = await config.get("flow.network")

      if (network) {
        log.deprecate({
          pkg: "FCL",
          subject:
            'Using the "flow.network" configuration key for specifying the flow network',
          message: "Configuring flow.network is no longer required",
          transition:
            "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/TRANSITIONS.md#0002-deprecate-flow.network-config-key",
        })
      } else {
        network = await config.get("env")

        if (network)
          log.deprecate({
            pkg: "FCL",
            subject:
              'Using the "env" configuration key for specifying the flow network',
            message:
              "Configuring to specify flow network is no longer required",
            transition:
              "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/TRANSITIONS.md#0001-deprecate-env-config-key",
          })
      }
    }
  }

  return network
}
