import * as CONFIG from "../config"
import {exec} from "../db"
import argon2 from "argon2"
import {v4 as uuid} from "uuid"
import {genKeys, sensorKeys, signAsRoot} from "../crypto"
import * as sdk from "@onflow/sdk"

export const getUserByEmail = email =>
  new Promise(resolve =>
    exec(db => {
      db.serialize(() => {
        db.get("SELECT * FROM USERS WHERE email = ?", [email], (err, user) => {
          return err == null
            ? (console.log(`getUserByEmail(${email})`, sensorKeys(user)),
              resolve(user))
            : (console.error(`getUserByEmail(${email})`, err), resolve(null))
        })
      })
    })
  )

export const getUserById = userId =>
  new Promise(resolve =>
    exec(db => {
      db.serialize(() => {
        db.get(
          "SELECT * FROM USERS WHERE userId = ?",
          [userId],
          (err, user) => {
            return err == null
              ? (console.log(`getUserById(${userId})`, sensorKeys(user)),
                resolve(user))
              : (console.error(`getUserById(${userId})`, err), resolve(null))
          }
        )
      })
    })
  )

const send = async xforms => {
  let ix
  ix = await sdk.build(xforms)
  ix = await sdk.resolve(ix, [sdk.resolveParams, sdk.resolveAuthorizations])

  return sdk.send(ix, {
    node: CONFIG.ACCESS_NODE,
  })
}

const txAsRoot = async (xforms = []) => {
  const resp = await send([sdk.getAccount("01")])
  const {account} = await send([sdk.getAccount("01")])
  const key = account.keys[0]

  const signFn = ({message}) => ({
    addr: account.address,
    keyId: key.index,
    signature: signAsRoot(message),
  })

  const ix = await sdk.build([
    sdk.proposer(account.address, key.index, key.sequenceNumber),
    sdk.payer(sdk.authorization(account.address, signFn)),
    ...xforms,
  ])

  const rix = await sdk.resolve(ix, [
    sdk.resolveParams,
    sdk.resolveAuthorizations,
  ])

  return sdk.send(rix, {
    node: CONFIG.ACCESS_NODE,
  })
}

const CONTRACT = `
access(all) contract HelloWorld {
    access(all) let greeting: String
    init() {
        self.greeting = "Hello, World!"
    }
    access(all) fun hello(): String {
        return self.greeting
    }
}
`

export const createUser = (email, password) =>
  new Promise(async resolve => {
    const userId = uuid()
    const passwordHash = await argon2.hash(password)
    const {publicKey, privateKey, flowKey} = await genKeys()

    const {transactionId} = await txAsRoot([
      sdk.transaction`
        transaction {
          execute {
            AuthAccount(publicKeys: ["${p =>
              p.publicKey}".decodeHex()], code: "${p => p.code}".decodeHex())
          }
        }
      `,
      sdk.params([
        sdk.param(flowKey.toString("hex"), null, "publicKey"),
        sdk.param(Buffer.from(CONTRACT, "utf8").toString("hex"), null, "code"),
      ]),
    ])

    const resp = await send([sdk.getTransactionStatus(transactionId)])

    console.log("RESPONSE", resp)

    const result = await sdk.decode(
      JSON.parse(
        Buffer.from(resp.transaction.events[0].payload).toString("utf8")
      )
    )

    console.log("address!!!!", result.address)

    const user = {userId, email, passwordHash, privateKey, publicKey}

    exec((db, log) => {
      db.serialize(() => {
        db.run(
          "INSERT INTO USERS (userId, email, passwordHash, privateKey, publicKey) VALUES (?, ?, ?, ?, ?)",
          [userId, email, passwordHash, privateKey, publicKey],
          (err, row) => {
            return err == null
              ? (console.log(`createUser(${email}, ****)`, sensorKeys(user)),
                resolve(user))
              : (console.error(`createUser(${email}, ***)`, err), resolve(null))
          }
        )
      })
    })
  })
