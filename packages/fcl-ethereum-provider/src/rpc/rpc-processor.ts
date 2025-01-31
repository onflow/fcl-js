import {ProviderRequest} from "../types/provider"
import {ethAccounts, ethRequestAccounts} from "./handlers/eth-accounts"
import {Gateway} from "../gateway/gateway"
import {AccountManager} from "../accounts/account-manager"
import * as fcl from "@onflow/fcl"
import {FLOW_CHAINS, FlowNetwork} from "../constants"
import {ethSendTransaction} from "./handlers/eth-send-transaction"
import {personalSign} from "./handlers/personal-sign"
import {PersonalSignParams, SignTypedDataParams, TypedData} from "../types/eth"
import {signTypedData} from "./handlers/eth-signtypeddata"

export class RpcProcessor {
  constructor(
    private gateway: Gateway,
    private accountManager: AccountManager
  ) {}

  async handleRequest({method, params}: ProviderRequest): Promise<any> {
    const flowNetwork = await fcl.getChainId()
    if (!(flowNetwork in FLOW_CHAINS)) {
      throw new Error(`Unsupported chainId ${flowNetwork}`)
    }
    const {eip155ChainId} = FLOW_CHAINS[flowNetwork as FlowNetwork]

    switch (method) {
      case "eth_accounts":
        return ethAccounts(this.accountManager)
      case "eth_requestAccounts":
        return ethRequestAccounts(this.accountManager)
      case "eth_sendTransaction":
        return await ethSendTransaction(this.accountManager, params)
      case "eth_signTypedData":
      case "eth_signTypedData_v3":
      case "eth_signTypedData_v4": {
        if (!params || typeof params !== "object") {
          throw new Error(`${method} requires valid parameters.`)
        }

        const {address, data} = params as {address?: unknown; data?: unknown}

        if (
          typeof address !== "string" ||
          typeof data !== "object" ||
          data === null
        ) {
          throw new Error(
            `${method} requires 'address' (string) and a valid 'data' object.`
          )
        }

        const validParams: SignTypedDataParams = {
          address,
          data: data as TypedData,
        }

        return await signTypedData(this.accountManager, validParams, method)
      }
      case "personal_sign":
        return await personalSign(
          this.accountManager,
          params as PersonalSignParams
        )
      default:
        return await this.gateway.request({
          chainId: eip155ChainId,
          method,
          params,
        })
    }
  }
}
