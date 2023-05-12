import {config} from "@onflow/config"
import {setChainIdDefault} from "./utils/getChainId"

const isServerSide = () => typeof window === "undefined"

const SESSION_STORAGE = {
  can: !isServerSide(),
  get: async key => JSON.parse(sessionStorage.getItem(key)),
  put: async (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
}

config({
  "discovery.wallet.method.default": "IFRAME/RPC",
  "fcl.storage.default": SESSION_STORAGE,
})

// Set chain id default on access node change
config.subscribe(
  function configSubscriber(config) {
    const nextAccessNode = config?.["accessNode.api"]
    if (prevAccessNode !== nextAccessNode) setChainIdDefault()
    this.prevAccessNode = nextAccessNode
  }.bind({})
)

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}
