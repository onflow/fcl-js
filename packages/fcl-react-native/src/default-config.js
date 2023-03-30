import {config} from "@onflow/config"
import {setChainIdDefault} from "./utils/getChainId"
import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_STORAGE = {
  can: true,
  get: async key => JSON.parse(await AsyncStorage.getItem(key)),
  put: async (key, value) => await AsyncStorage.setItem(key, JSON.stringify(value)),
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
