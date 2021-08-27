import {config} from "@onflow/sdk"

config()
  .put("discovery.wallet.method.default", "POP/RPC")
  .put("fcl.storage.default", "SESSION_STORAGE")
