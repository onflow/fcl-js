import "./common-setup"
import * as fcl from "@onflow/fcl"
import {send as transportGRPC} from "@onflow/transport-grpc"

fcl
  .config()
  .put("accessNode.api", "http://localhost:8080")
  .put("sdk.transport", transportGRPC)
