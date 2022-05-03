import {config} from "@onflow/config"
import {DISCOVERY_METHOD, STORAGE_DEFAULT} from "./config-utils"

config({
  "discovery.wallet.method.default": DISCOVERY_METHOD,
  "fcl.storage.default": STORAGE_DEFAULT,
})
