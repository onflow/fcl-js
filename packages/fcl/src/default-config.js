import {config} from "@onflow/sdk"
import {SESSION_STORAGE} from "./config-utils"

config({
  "discovery.wallet.method.default": "IFRAME/RPC",
  "fcl.storage.default": SESSION_STORAGE,
})
