import {InteractionAccount} from "@onflow/typedefs"
import {useMemo} from "react"
import {useFlowClient} from "./useFlowClient"

export interface SignableObject {
  message: string
  addr: string
  keyId: number | string
  roles: {
    proposer: boolean
    authorizer: boolean
    payer: boolean
  }
  voucher: any
}

export interface SignatureResult {
  addr?: string
  keyId?: number | string
  signature: string
}

export type SigningFunction = (
  signable: SignableObject
) => Promise<SignatureResult> | SignatureResult

/** Configuration for custom authorization */
export interface CustomAuthzConfig {
  /** Address of the account that will sign */
  address: string
  /** Key ID for the signing key */
  keyId?: number | string
  /** Function that produces signatures for this account */
  signingFunction: SigningFunction
}

interface UseFlowAuthzArgs {
  /** Custom authorization configuration, if not provided, uses current user's wallet authorization. */
  authz?: CustomAuthzConfig
  /** Optional FlowClient instance to use instead of the default */
  flowClient?: ReturnType<typeof useFlowClient>
}

export type AuthorizationFunction = (
  account: Partial<InteractionAccount>
) => Partial<InteractionAccount> | Promise<Partial<InteractionAccount>>

/**
 * @description A React hook that creates authorization functions for transactions.
 * Supports both current user wallet authorization and custom authorization.
 *
 * @param options Optional configuration object
 * @param options.authz Optional custom authorization configuration
 * @param options.flowClient Optional FlowClient instance to use instead of the default
 *
 * @returns The authorization function to be used in transactions
 *
 * @example
 * // Current user authorization
 * import { useFlowAuthz } from "@onflow/react-sdk"
 * import * as fcl from "@onflow/fcl"
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
 * // Backend signer authorization
 * import { useFlowAuthz } from "@onflow/react-sdk"
 *
 * function MyComponent() {
 *   const backendAuthz = useFlowAuthz({
 *     authz: {
 *       address: "0xBACKEND",
 *       keyId: 0,
 *       signingFunction: async ({ message }) => {
 *         const response = await fetch('/api/sign', {
 *           method: 'POST',
 *           body: JSON.stringify({ message }),
 *         })
 *         const { signature } = await response.json()
 *         return { signature }
 *       }
 *     }
 *   })
 * }
 *
 * @example
 * // Multisig: user + backend
 * import { useFlowAuthz } from "@onflow/react-sdk"
 * import * as fcl from "@onflow/fcl"
 *
 * function MultisigComponent() {
 *   const userAuthz = useFlowAuthz()
 *   const backendAuthz = useFlowAuthz({
 *     authz: {
 *       address: "0xBACKEND",
 *       keyId: 0,
 *       signingFunction: async ({ message }) => {
 *         const res = await fetch('/api/sign', {
 *           method: 'POST',
 *           body: JSON.stringify({ message })
 *         })
 *         return await res.json()
 *       }
 *     }
 *   })
 *
 *   const sendMultisigTx = async () => {
 *     await fcl.mutate({
 *       cadence: `
 *         transaction {
 *           prepare(user: auth(Storage) &Account, backend: auth(Storage) &Account) {
 *             // Both accounts authorize
 *           }
 *         }
 *       `,
 *       authorizations: [userAuthz, backendAuthz],
 *     })
 *   }
 * }
 */
export function useFlowAuthz({
  authz,
  flowClient,
}: UseFlowAuthzArgs = {}): AuthorizationFunction {
  const fcl = useFlowClient({flowClient})

  const authorization: AuthorizationFunction = useMemo(() => {
    if (authz) {
      return (
        account: Partial<InteractionAccount>
      ): Partial<InteractionAccount> => {
        return {
          ...account,
          addr: authz.address,
          keyId: authz.keyId ?? 0,
          signingFunction: authz.signingFunction,
        }
      }
    }

    // Current user authorization as default
    return fcl.currentUser.authorization as any
  }, [fcl, authz])

  return authorization
}
