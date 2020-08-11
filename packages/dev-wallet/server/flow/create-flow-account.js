import * as CONFIG from "../config"
import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"
import {genKeys, signWithKey} from "../crypto"

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
  const {account} = await fcl.send([fcl.getAccount(addr)])
  return account
}

const authorization = async (account = {}) => {
  const user = await getAccount(CONFIG.SERVICE_ADDR)
  const key = user.keys[0]

  let sequenceNum
  if (account.role.proposer) sequenceNum = key.sequenceNumber

  const signingFunction = async data => {
    return {
      addr: user.address,
      keyId: key.index,
      signature: signWithKey(CONFIG.PK, data.message),
    }
  }

  return {
    ...account,
    addr: user.address,
    keyId: key.index,
    sequenceNum,
    signature: account.signature || null,
    signingFunction,
    resolve: null,
    roles: account.roles,
  }
}

export const createFlowAccount = async () => {
  const keys = await genKeys()

  const response = await fcl.send([
    fcl.transaction`
      transaction {
        let payer: AuthAccount
        prepare(payer: AuthAccount) {
          self.payer = payer
        }
        execute {
          let account = AuthAccount(payer: self.payer)
          account.addPublicKey("${p => p.publicKey}".decodeHex())
        }
      }
    `,
    fcl.proposer(authorization),
    fcl.authorizations([authorization]),
    fcl.payer(authorization),
    fcl.params([
      fcl.param(keys.flowKey, t.Identity, "publicKey"),
    ]),
  ])

  const {events} = await fcl.tx(response).onceSealed()
  const accountCreatedEvent = events.find(d => d.type === "flow.AccountCreated")
  invariant(accountCreatedEvent, "No flow.AccountCreated found", events)
  let addr = accountCreatedEvent.data.address
  // a standardized string format for addresses is coming soon
  // our aim is to make them as small as possible while making them unambiguous
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
