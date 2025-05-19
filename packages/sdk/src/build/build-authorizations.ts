import {InteractionAccount, TransactionRole} from "@onflow/typedefs"
import {
  AccountAuthorization,
  pipe,
  prepAccount,
} from "../interaction/interaction"
import {Voucher} from "../encode/encode"

interface SignableMessage {
  message: string
  addr: string
  keyId: number | string
  roles: {
    proposer: boolean
    authorizer: boolean
    payer: boolean
  }
  voucher: Voucher
}

interface SigningResult {
  addr?: string
  keyId?: number | string
  signature: string
}

type SigningFn = (
  signable?: SignableMessage
) => SigningResult | Promise<SigningResult>

export function authorizations(ax: Array<AccountAuthorization> = []) {
  return pipe(
    ax.map(authz => {
      return prepAccount(authz, {
        role: TransactionRole.AUTHORIZER,
      })
    })
  )
}

export function authorization(
  addr: string,
  signingFunction: SigningFn,
  keyId?: number | string,
  sequenceNum?: number
): Partial<InteractionAccount> {
  return {addr, signingFunction, keyId, sequenceNum}
}
