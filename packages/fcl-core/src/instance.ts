import {httpTransport} from "@onflow/transport-http"
import {createVerifyUserSignatures} from "./app-utils/verify-signatures"
import {createFCLContext} from "./context/index"
import {createMutate} from "./exec/mutate"
import {createQuery} from "./exec/query"
import {createQueryRaw} from "./exec/query-raw"
import {createTransaction} from "./transaction"
import {createEvents} from "./events"
import {createGetChainId} from "./utils"
import {createSerialize} from "./serialize"

type WithOptionalProperties<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

export function createFcl(
  params: WithOptionalProperties<
    Parameters<typeof createFCLContext>[0],
    "transport"
  >
) {
  const context = createFCLContext({...params, transport: httpTransport})

  return {
    // Global services
    currentUser: context.currentUser,
    config: context.config,

    // Execution methods
    mutate: createMutate(context),
    query: createQuery(context),
    queryRaw: createQueryRaw(context),
    verifyUserSignatures: createVerifyUserSignatures(context),
    getChainId: createGetChainId(context),

    // Streaming helpers
    tx: createTransaction(context),
    events: createEvents(context),

    // Authentication methods
    authenticate: context.currentUser.authenticate,
    unauthenticate: context.currentUser.unauthenticate,
    signUserMessage: context.currentUser.signUserMessage,

    // Utility methods
    serialize: createSerialize(context),

    // Re-export the SDK methods
    ...context.sdk,
  }
}
