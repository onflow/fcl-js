import {createContext, SdkClientOptions} from "./context/context"
import {createSend} from "./transport/send/send"
import {createSubscribe} from "./transport/subscribe/subscribe"
import {createSubscribeRaw} from "./transport/subscribe/subscribe-raw"
import {createAccount} from "./account/account"
import {createBlock} from "./block/block"
import {createResolve} from "./resolve/resolve"
import {createDecode} from "./decode/sdk-decode"

/**
 * Creates an SDK client with the provided options.
 * @param options - Configuration options for the SDK client.
 * @returns A client object with methods to interact with the Flow blockchain.
 * @example
 * const client = createSdkClient({
 *  accessNodeUrl: "https://rest-mainnet.onflow.org",
 *  transport: myTransport,
 *  computeLimit: 1000,
 * })
 * client.send([myScript, myTransaction])
 *   .then(client.decode)
 *   .catch(error => console.error("Error sending request:", error))
 */
export function createSdkClient(options: SdkClientOptions) {
  const context = createContext(options)

  return {
    send: createSend(context),
    subscribe: createSubscribe(context),
    subscribeRaw: createSubscribeRaw(context),
    account: createAccount(context),
    block: createBlock(context),
    resolve: createResolve(context),
    decode: createDecode(context),
  }
}
