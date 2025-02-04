import {ProviderRequest} from "../types/provider"
import {ethAccounts, ethRequestAccounts} from "./handlers/eth-accounts"
import {Gateway} from "../gateway/gateway"
import {AccountManager} from "../accounts/account-manager"
import {ethSendTransaction} from "./handlers/eth-send-transaction"
import {NetworkManager} from "../network/network-manager"
import {personalSign} from "./handlers/personal-sign"
import {
  AddEthereumChainParams,
  PersonalSignParams,
  SignTypedDataParams, SwitchEthereumChainParams,
  TypedData,
} from "../types/eth"
import {signTypedData} from "./handlers/eth-signtypeddata"

export class RpcProcessor {
  constructor(
    private gateway: Gateway,
    private accountManager: AccountManager,
    private networkManager: NetworkManager
  ) {}

  async handleRequest({method, params}: ProviderRequest): Promise<any> {
    const chainId = await this.networkManager.getChainId()
    if (!chainId) {
      throw new Error("No active chain")
    }

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
      case "wallet_addEthereumChain":
        // Expect params to be an array with one chain configuration object.
        if (!params || !Array.isArray(params) || !params[0]) {
          throw new Error(
            "wallet_addEthereumChain requires an array with a chain configuration object."
          )
        }
        const chainConfig = params[0] as AddEthereumChainParams

        return await this.networkManager.addChain(chainConfig)
      case "wallet_switchEthereumChain":
        // Expect params to be an array with one object.
        if (!params || !Array.isArray(params) || !params[0]) {
          throw new Error(
            "wallet_switchEthereumChain requires an array with a chain configuration object."
          );
        }
        const switchParams = params[0] as SwitchEthereumChainParams;
        return await this.networkManager.switchChain(switchParams);
      default:
        return await this.gateway.request({
          chainId,
          method,
          params,
        })
    }
  }
}
