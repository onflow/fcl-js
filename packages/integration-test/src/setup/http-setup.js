import "./common-setup"
import * as fcl from "@onflow/fcl"
import {send as transportHTTP} from "@onflow/transport-http"

fcl
  .config()
  .put("accessNode.api", "http://localhost:8888")
  .put("sdk.transport", transportHTTP)
