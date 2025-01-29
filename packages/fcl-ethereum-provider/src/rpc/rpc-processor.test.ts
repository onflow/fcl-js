import {AccountManager} from "../accounts/account-manager"
import {Gateway} from "../gateway/gateway"
import {RpcProcessor} from "./rpc-processor"

jest.mock("../gateway/gateway")
jest.mock("../accounts/account-manager")

describe("rpc processor", () => {
  test("fallback to gateway", async () => {
    const gateway: jest.Mocked<Gateway> = new (Gateway as any)()
    const accountManager: jest.Mocked<AccountManager> =
      new (AccountManager as any)()
    const rpcProcessor = new RpcProcessor(gateway, accountManager)

    jest.mocked(gateway).request.mockResolvedValue("0x0")

    const response = await rpcProcessor.handleRequest({
      method: "eth_blockNumber",
      params: [],
    })

    expect(response).toEqual("0x0")
    expect(gateway.request).toHaveBeenCalled()
    expect(gateway.request).toHaveBeenCalledTimes(1)
    expect(gateway.request).toHaveBeenCalledWith({
      method: "eth_blockNumber",
      params: [],
    })
  })
})
