import {createVerifyUserSignatures} from "./app-utils/verify-signatures"
import {createFCLContext} from "./context/index"
import {createMutate} from "./exec/mutate"
import {createQuery} from "./exec/query"
import {createQueryRaw} from "./exec/query-raw"

export function createFcl(params: Parameters<typeof createFCLContext>[0]) {
  const context = createFCLContext(params)

  return {
    // Global services
    currentUser: context.currentUser,
    config: context.config,

    // Execution methods
    mutate: createMutate(context),
    query: createQuery(context),
    queryRaw: createQueryRaw(context),
    verifyUserSignatures: createVerifyUserSignatures(context),

    // Authentication methods
    authenticate: context.currentUser.authenticate,
    unauthenticate: context.currentUser.unauthenticate,
    signUserMessage: context.currentUser.signUserMessage,

    // Re-export the SDK methods
    ...context.sdk,
  }
}
