import {config} from "@onflow/config"
import {send as transportGRPC} from "@onflow/transport-grpc"
import {makeAuthzFn} from "./common-setup"

config()
  .put("accessNode.api", "http://localhost:8080")
  .put("sdk.transport", transportGRPC)

makeAuthzFn()