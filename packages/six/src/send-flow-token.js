import { pipe } from "@onflow/interaction"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

// import FungibleToken from 0xf8d6e0586b0a20c7;
// import f8d6e0586b0a20c7 from 0xf8d6e0586b0a20c7;
// transaction(to: Address, amount: UFix64) {
//     prepare(acct: AuthAccount) {
//         let recipient = getAccount(to);
//         let providerRef = acct.borrow<&f8d6e0586b0a20c7.Vault{FungibleToken.Provider}>(from: /storage/f8d6e0586b0a20c7Vault)
//             ?? panic("Could not borrow Provider reference to the Vault!");
//         let receiverRef = recipient.getCapability(/public/f8d6e0586b0a20c7Receiver)!.borrow<&f8d6e0586b0a20c7.Vault{FungibleToken.Receiver}>()
//             ?? panic("Could not borrow receiver reference to the recipient's Vault");
//         let tokens <- providerRef.withdraw(amount: amount);
//         receiverRef.deposit(from: <-tokens);
//     }
// }

const SEND_FLOW_TOKEN_CODE = `importFungibleTokenfrom0xf8d6e0586b0a20c7;importf8d6e0586b0a20c7from0xf8d6e0586b0a20c7;transaction(to:Address,amount:UFix64){prepare(acct:AuthAccount){letrecipient=getAccount(to);letproviderRef=acct.borrow<&f8d6e0586b0a20c7.Vault{FungibleToken.Provider}>(from:/storage/f8d6e0586b0a20c7Vault)??panic("CouldnotborrowProviderreferencetotheVault!");letreceiverRef=recipient.getCapability(/public/f8d6e0586b0a20c7Receiver)!.borrow<&f8d6e0586b0a20c7.Vault{FungibleToken.Receiver}>()??panic("Couldnotborrowreceiverreferencetotherecipient'sVault");lettokens<-providerRef.withdraw(amount:amount);receiverRef.deposit(from:<-tokens);}}`
const SEND_FLOW_TOKEN_CODE_HASH = "3a385731720e0905ae4d9efb182660186eb033d7b676c1b872a95008e2161f52"

const SEND_FLOW_TOKEN_SIX = ({ to, amount }) => pipe([
  sdk.transaction(SEND_FLOW_TOKEN_CODE),
  sdk.params([
    sdk.param(to, t.Address, "to"),
    sdk.param(amount, t.UFix64, "amount"),
  ]),
  sdk.validator((ix, { Ok, Bad }) => {
    if (Object.keys(ix.params).length != 2) return Bad(ix, "Was expecting 2 Params to:Address and amount:UFix64")
    return Ok(ix)
  })
])

export const SEND_FLOW_TOKEN = {
    code: SEND_FLOW_TOKEN_CODE,
    hash: SEND_FLOW_TOKEN_CODE_HASH,
    six: SEND_FLOW_TOKEN_SIX
} 
