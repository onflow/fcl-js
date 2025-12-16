import type {InteractionAccount} from "@onflow/typedefs"
import type {FlowClientCore} from "@onflow/fcl-core"
import {useFlowClient} from "./useFlowClient"

export type AuthorizationFunction = (
  account: Partial<InteractionAccount>
) => Partial<InteractionAccount> | Promise<Partial<InteractionAccount>>

interface UseFlowAuthzArgs {
  /** Custom authorization function. If not provided, uses current user's wallet authorization. */
  authz?: AuthorizationFunction
  /** Optional FlowClient instance to use instead of the default */
  flowClient?: FlowClientCore
}

/**
 * @description A React hook that returns an authorization function for Flow transactions.
 * If no custom authorization is provided, it returns the current user's wallet authorization.
 *
 * @param options Optional configuration object
 * @param options.authz Optional custom authorization function
 * @param options.flowClient Optional FlowClient instance to use instead of the default
 *
 * @returns The authorization function compatible with Flow transactions authorizations parameter
 *
 * @example
 * // Current user authorization
 * import { useFlowAuthz } from "@onflow/react-sdk"  // or @onflow/react-native-sdk
 * import * as fcl from "@onflow/fcl"  // or @onflow/fcl-react-native on mobile
 *
 * function MyComponent() {
 *   const authorization = useFlowAuthz()
 *
 *   const sendTransaction = async () => {
 *     await fcl.mutate({
 *       cadence: `transaction { prepare(signer: auth(Storage) &Account) {} }`,
 *       authorizations: [authorization],
 *     })
 *   }
 * }
 *
 * @example
 * // Custom authorization function
 * import { useFlowAuthz } from "@onflow/react-sdk"  // or @onflow/react-native-sdk
 * import * as fcl from "@onflow/fcl"  // or @onflow/fcl-react-native on mobile
 *
 * function MyComponent() {
 *   const customAuthz = (account) => ({
 *     ...account,
 *     addr: "0xCUSTOM",
 *     keyId: 0,
 *     signingFunction: async (signable) => ({ signature: "0x..." })
 *   })
 *
 *   const authorization = useFlowAuthz({ authz: customAuthz })
 *
 *   const sendTransaction = async () => {
 *     await fcl.mutate({
 *       cadence: `transaction { prepare(signer: auth(Storage) &Account) {} }`,
 *       authorizations: [authorization],
 *     })
 *   }
 * }
 */
export function useFlowAuthz({
  authz,
  flowClient,
}: UseFlowAuthzArgs = {}): AuthorizationFunction {
  const fcl = useFlowClient({flowClient})
  return authz || (fcl.currentUser.authorization as any)
}
