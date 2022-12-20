import {makeAuthzFn} from "./common-setup"
import {config} from "@onflow/config"
import {send as transportHTTP} from "@onflow/transport-http"

config()
  .put("accessNode.api", "http://localhost:8888")
  .put("sdk.transport", transportHTTP)

makeAuthzFn()