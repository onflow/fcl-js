import * as CONFIG from "../config"
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {genKeys, signWithKey} from "../crypto"
import {CONTRACT} from "./contract-noop"

const invariant = (fact, msg, ...rest) => {
  if (!fact) {
    const error = new Error(`INVARIANT ${msg}`)
    error.stack = error.stack
      .split("\n")
      .filter(d => !/at invariant/.test(d))
      .join("\n")
    console.error("\n\n---\n\n", error, "\n\n", ...rest, "\n\n---\n\n")
    throw error
  }
}

// Will be handled by fcl.user(addr).info()
const getAccount = async addr => {
  const {account} = await fcl.send([sdk.getAccount(addr)])
  return account
}

// Known Upcoming Changes
//
// Resolve Functions
// =================
// proposers, authorizers and payers will accept Resolve Functions
// in the future. These Resolve Functions will be responsible for
// making sure a Flow Account has everything it needs to fullfil its
// roles. They will be passed the current knowledge of an account
// which will include the roles required.
//
// Proposers will need:
// - tempId (accounts with the same tempId are treated the same)
// - addr
// - keyId
// - seqNum
// - signFn (if their only role is a proposer)
//
// Authorizers will need:
// - tempId
// - addr
// - keyId
// - signFn
//
// Payers will need:
// - tempId
// - addr
// - keyId
// - signFn
//
// If an account has more than one role, it will require a union of the above values.
//
// This change should let us use the same logic for proposing, authorizing and paying
//
//
//  example:
//    where `fcl.user(addr).authorization` is the resolve function
//
//    fcl.send([
//      sdk.transaction`...`,
//      sdk.proposer(fcl.user(addr).authorization),
//      sdk.authorizations([
//        fcl.user(addr).authorization
//      ])
//      sdk.payer(fcl.user(addr).authorization)
//    ])
//
//
//  example:
//    where resolveFunction is defined by the developer
//
//    const resolveFn = addr => async (acct) => {
//      acct.tempId = addr
//      acct.addr = addr
//
//      const [keyId, seqNum, signFn] = await getSigningData(addr)
//      acct.keyId = keyId
//      acct.seqNum = seqNum
//
//      acct.signFn = ({ message, addr: authzAddr, roles }) => {
//        invariant(addr === authzAddr, "Authz flow address mismatch")
//        invariant(acct.roles.proposer === roles.proposer, "Authz acct role mismatch")
//        invariant(acct.roles.authorizer === roles.authorizer, "Authz acct role mismatch")
//        invariant(acct.roles.payer === roles.payer, "Authz acct role mismatch")
//        return { addr, keyId, signature: signFn(message) }
//      }
//      return acct
//    }
//
//    fcl.send([
//      sdk.transaction`...`,
//      sdk.proposer(resolveFn(addr)),
//      sdk.authorizations([
//        resolveFn(addr)
//      ])
//      sdk.payer(resolveFn(addr))
//    ])
//

// Will be handled by a resolve function
const rootProposer = async () => {
  const account = await getAccount(CONFIG.ROOT_ADDR)
  const key = account.keys[0]

  return {
    addr: account.address,
    keyId: key.index,
    sequenceNum: key.sequenceNumber,
  }
}

// Will be handled by a resolve function
const rootSignFn = async ({message}) => {
  const account = await getAccount(CONFIG.ROOT_ADDR)
  const key = account.keys[0]

  return {
    addr: account.address,
    keyId: key.index,
    signature: signWithKey(CONFIG.PK, message),
  }
}

// Will be supplied by sdk
const isSealed = transaction => {
  return transaction.status === 4
}

// FCL will eventually provide this
const sealedTransaction = transactionId =>
  new Promise(async resolve => {
    const resp = await fcl.send([sdk.getTransactionStatus(transactionId)])

    // This bit will be handled by `sdk.decodeResponse(resp)`
    // in an upcoming update.
    // -- start --
    // const transaction = await sdk.decodeResponse(resp)
    const {transaction} = resp
    transaction.events = await Promise.all(
      transaction.events.map(async e => {
        e.payload = JSON.parse(Buffer.from(e.payload).toString("utf8"))
        e.data = await sdk.decode(e.payload)
        delete e.payload
        return e
      })
    )
    // -- end --

    // Will be replaced with sdk.tx.isSealed(transaction)
    if (!isSealed(transaction)) {
      resolve(await sealedTransaction(transactionId))
      return
    }

    resolve(transaction)
  })

export const createFlowAccount = async (contract = CONTRACT) => {
  const keys = await genKeys()

  const {transactionId} = await fcl.send([
    sdk.proposer(rootProposer),
    sdk.payer(sdk.authorization(CONFIG.ROOT_ADDR, rootSignFn)),
    sdk.transaction`
      transaction {
        execute {
          let key = "${p => p.publicKey}"
          let code = "${p => p.code}"
          AuthAccount(publicKeys: [key.decodeHex()], code: code.decodeHex())
        }
      }
    `,
    sdk.params([
      sdk.param(keys.flowKey, t.Identity, "publicKey"),
      sdk.param(
        Buffer.from(contract, "utf8").toString("hex"),
        t.Identity,
        "code"
      ),
    ]),
  ])

  // Will be replaced by fcl.transaction(transactionId).onceSealed()
  const {events} = await sealedTransaction(transactionId)
  const accountCreatedEvent = events.find(d => d.type === "flow.AccountCreated")
  invariant(accountCreatedEvent, "No flow.AccountCreated found", events)
  let addr = accountCreatedEvent.data.address
  // a standardized string format for addresses is coming soon
  // our aim is to make the as small as possible while making them unambiguous
  addr = addr.replace(/^0x/, "")
  invariant(addr, "an address is required")

  const account = await getAccount(addr)
  const key = account.keys.find(d => d.publicKey === keys.publicKey)
  invariant(
    key,
    "could not find provided public key in on-chain flow account keys"
  )

  return {
    addr,
    publicKey: keys.publicKey,
    privateKey: keys.privateKey,
    keyId: key.index,
  }
}
