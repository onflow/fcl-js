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

// this is an async function but we can't await bc it's run at top level.
// NOT guaranteed that flow.network.default is set after this call (or at startup)
setChainIdDefault()

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}
