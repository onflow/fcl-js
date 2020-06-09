import { pipe } from "@onflow/interaction"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const sendFlowToken = ({ to, amount }) => pipe([
    sdk.transaction`
        import FungibleToken from 0xf8d6e0586b0a20c7
        import f8d6e0586b0a20c7 from 0xf8d6e0586b0a20c7
        transaction {
            prepare(acct: AuthAccount, to: Address, amount: UFix64) {
                let recipient = getAccount(to)
                let providerRef = acct.borrow<&f8d6e0586b0a20c7.Vault{FungibleToken.Provider}>(from: /storage/f8d6e0586b0a20c7Vault)
                    ?? panic("Could not borrow Provider reference to the Vault!")
                let receiverRef = recipient.getCapability(/public/f8d6e0586b0a20c7Receiver)!.borrow<&f8d6e0586b0a20c7.Vault{FungibleToken.Receiver}>()
                    ?? panic("Could not borrow receiver reference to the recipient's Vault")
                let tokens <- providerRef.withdraw(amount: amount)
                receiverRef.deposit(from: <-tokens)
            }
        }
  `,
  sdk.params([
    sdk.param(to, t.Address, "to"),
    sdk.param(amount, t.UFix64, "amount"),
  ]),
  sdk.validator((ix, { Ok, Bad }) => {
    if (Object.keys(ix.params).length != 2) return Bad(ix, "Was expecting 2 Params to:Address and amount:UFix64")
    return Ok(ix)
  })
])
