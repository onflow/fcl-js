import {LOCAL_STORAGE} from "./storage"

export const getDefaultConfig = () => {
  return {
    "discovery.wallet.method.default": "IFRAME/RPC",
    "fcl.storage.default": LOCAL_STORAGE,
  }
}
