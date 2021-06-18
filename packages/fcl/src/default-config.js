import {config} from "@onflow/sdk"

config()
  .put("accessNode.api", "http://localhost:8080")
  .put("challenge.handshake", "http://localhost:8700/authenticate")
