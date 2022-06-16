import * as transportHTTP from "@onflow/transport-http"
import * as transportGRPC from "@onflow/transport-grpc"
import {config} from "@onflow/config"
import {sendFn} from "./send-fn"

test("sendFn defaults to HTTP Transport if accessNode.httpApi exists", async () => {
  await config.overload(
    {
      "accessNode.httpApi": "https://http-endpoint.com",
    },
    async () => {
      const originalSend = transportHTTP.default.send
      transportHTTP.default.send = jest.fn()

      await sendFn()

      expect(transportHTTP.default.send).toHaveBeenCalled()
      transportHTTP.default.send = originalSend
    }
  )
})

test("sendFn defaults to GRPC Transport if accessNode.httpApi exists", async () => {
  await config.overload(
    {
      "accessNode.grpcApi": "https://grpc-endpoint.com",
    },
    async () => {
      const originalSend = transportGRPC.default.send
      transportGRPC.default.send = jest.fn()

      await sendFn()

      expect(transportGRPC.default.send).toHaveBeenCalled()
      transportGRPC.default.send = originalSend
    }
  )
})

test("sendFn throws invariant if both accessNode.httpApi and accessNode.grpcApi exist", async () => {
  await config.overload(
    {
      "accessNode.httpApi": "https://http-endpoint.com",
      "accessNode.grpcApi": "https://grpc-endpoint.com",
    },
    async () => {
      const sendFnPromise = sendFn()
      await expect(sendFnPromise).rejects.toThrow(
        "INVARIANT One of either accessNode.httpApi or accessNode.grpcApi must be provided but not both"
      )
    }
  )
})

test("sendFn populates opts.node", async () => {
  await config.overload(
    {
      "accessNode.httpApi": "https://http-endpoint.com",
    },
    async () => {
      const originalSend = transportHTTP.default.send
      transportHTTP.default.send = jest.fn()

      await sendFn()

      expect(transportHTTP.default.send.mock.calls[0][2].node).toBe(
        "https://http-endpoint.com"
      )
      transportHTTP.default.send = originalSend
    }
  )
})
