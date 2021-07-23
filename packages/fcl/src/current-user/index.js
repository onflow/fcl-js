import "../default-config"
import {account, config} from "@onflow/sdk"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {sansPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {buildUser} from "./build-user"
import {serviceOfType} from "./service-of-type"
import {execService} from "./exec-service"
import {query} from "../exec/query"
import {frame} from "./exec-service/strategies/utils/frame"
import {pop} from "./exec-service/strategies/utils/pop"
import {normalizeCompositeSignature} from "./normalize/composite-signature"

const NAME = "CURRENT_USER"
const UPDATED = "CURRENT_USER/UPDATED"
const SNAPSHOT = "SNAPSHOT"
const SET_CURRENT_USER = "SET_CURRENT_USER"
const DEL_CURRENT_USER = "DEL_CURRENT_USER"

const DATA = `{
  "f_type": "User",
  "f_vsn": "1.0.0",
  "addr":null,
  "cid":null,
  "loggedIn":null,
  "expiresAt":null,
  "services":[]
}`

const coldStorage = {
  get: async () => {
    const fallback = JSON.parse(DATA)
    const stored = JSON.parse(sessionStorage.getItem(NAME))
    if (stored != null && fallback["f_vsn"] !== stored["f_vsn"]) {
      sessionStorage.removeItem(NAME)
      return fallback
    }
    return stored || fallback
  },
  put: async data => {
    sessionStorage.setItem(NAME, JSON.stringify(data))
    return data
  },
}

const canColdStorage = () => {
  return config().get("persistSession", true)
}

const HANDLERS = {
  [INIT]: async ctx => {
    ctx.merge(JSON.parse(DATA))
    if (await canColdStorage()) {
      const user = await coldStorage.get()
      if (notExpired(user)) ctx.merge(user)
    }
  },
  [SUBSCRIBE]: (ctx, letter) => {
    ctx.subscribe(letter.from)
    ctx.send(letter.from, UPDATED, {...ctx.all()})
  },
  [UNSUBSCRIBE]: (ctx, letter) => {
    ctx.unsubscribe(letter.from)
  },
  [SNAPSHOT]: async (ctx, letter) => {
    letter.reply({...ctx.all()})
  },
  [SET_CURRENT_USER]: async (ctx, letter, data) => {
    ctx.merge(data)
    if (await canColdStorage()) coldStorage.put(ctx.all())
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
  [DEL_CURRENT_USER]: async (ctx, letter) => {
    ctx.merge(JSON.parse(DATA))
    if (await canColdStorage()) coldStorage.put(ctx.all())
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
}

const identity = v => v
const spawnCurrentUser = () => spawn(HANDLERS, NAME)

function notExpired(user) {
  return (
    user.expiresAt == null ||
    user.expiresAt === 0 ||
    user.expiresAt > Date.now()
  )
}

async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}

async function authenticate() {
  return new Promise(async (resolve, reject) => {
    spawnCurrentUser()
    const user = await snapshot()
    if (user.loggedIn && notExpired(user)) return resolve(user)

    const view =
      (await config.first(["discovery.wallet.view"], "frame")) === "frame"
        ? frame
        : pop

    view(
      {
        endpoint: await config.first([
          "discovery.wallet",
          "challenge.handshake",
        ]),
      },
      {
        async onReady(e, {send, close}) {
          send({
            type: "FCL:AUTHN:CONFIG",
            services: await configLens(/^service\./),
            app: await configLens(/^app\.detail\./),
          })
        },
        async onClose() {
          resolve(await snapshot())
        },
        async onResponse(e, {close}) {
          send(NAME, SET_CURRENT_USER, await buildUser(e.data))
          resolve(await snapshot())
          close()
        },
      }
    )
  })
}

function unauthenticate() {
  spawnCurrentUser()
  send(NAME, DEL_CURRENT_USER)
}

const normalizePreAuthzResponse = authz => ({
  f_type: "PreAuthzResponse",
  f_vsn: "1.0.0",
  proposer: (authz || {}).proposer,
  payer: (authz || {}).payer || [],
  authorization: (authz || {}).authorization || [],
})

function resolvePreAuthz(authz) {
  const resp = normalizePreAuthzResponse(authz)
  const axs = []

  if (resp.proposer != null) axs.push(["PROPOSER", resp.proposer])
  for (let az of resp.payer || []) axs.push(["PAYER", az])
  for (let az of resp.authorization || []) axs.push(["AUTHORIZER", az])

  var result = axs.map(([role, az]) => ({
    tempId: [az.identity.address, az.identity.keyId].join("|"),
    addr: az.identity.address,
    keyId: az.identity.keyId,
    signingFunction(signable) {
      return execService(az, signable)
    },
    role: {
      proposer: role === "PROPOSER",
      payer: role === "PAYER",
      authorizer: role === "AUTHORIZER",
    },
  }))
  return result
}

async function authorization(account) {
  spawnCurrentUser()
  const user = await authenticate()
  const authz = serviceOfType(user.services, "authz")

  const preAuthz = serviceOfType(user.services, "pre-authz")
  if (preAuthz) {
    return {
      ...account,
      tempId: "CURRENT_USER",
      async resolve(account, preSignable) {
        return resolvePreAuthz(await execService(preAuthz, preSignable))
      },
    }
  }

  return {
    ...account,
    tempId: "CURRENT_USER",
    resolve: null,
    addr: sansPrefix(authz.identity.address),
    keyId: authz.identity.keyId,
    sequenceNum: null,
    signature: null,
    async signingFunction(signable) {
      return normalizeCompositeSignature(
        await execService(authz, signable, {
          includeOlderJsonRpcCall: true,
        })
      )
    },
  }
}

function subscribe(callback) {
  spawnCurrentUser()
  const EXIT = "@EXIT"
  const self = spawn(async ctx => {
    ctx.send(NAME, SUBSCRIBE)
    while (1) {
      const letter = await ctx.receive()
      if (letter.tag === EXIT) {
        ctx.send(NAME, UNSUBSCRIBE)
        return
      }
      callback(letter.data)
    }
  })
  return () => send(self, EXIT)
}

function snapshot() {
  spawnCurrentUser()
  return send(NAME, SNAPSHOT, null, {expectReply: true, timeout: 0})
}

async function info() {
  spawnCurrentUser()
  const {addr} = await snapshot()
  if (addr == null) throw new Error("No Flow Address for Current User")
  return account(addr)
}

const makeSignable = msg => {
  invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string")

  return {
    message: msg,
  }
}

async function signUserMessage(msg, opts = {}) {
  spawnCurrentUser()
  const user = await authenticate(opts)
  const signingService = serviceOfType(user.services, "user-signature")

  invariant(
    signingService,
    "Current user must have authorized a signing service."
  )

  try {
    const data = await execService(signingService, makeSignable(msg))
    if (Array.isArray(data)) {
      return data.map(compSigs => normalizeCompositeSignature(compSigs))
    } else {
      return [normalizeCompositeSignature(data)]
    }
  } catch (error) {
    return error
  }
}

const VERIFY_SIG_SCRIPT = `
import Crypto
    
pub fun main(
  message: String,
  rawPublicKeys: [String],
  weights: [UFix64],
  signAlgos: [UInt],
  signatures: [String],
): Bool {

  let keyList = Crypto.KeyList()
  
  var i = 0
  for rawPublicKey in rawPublicKeys {
    keyList.add(
      PublicKey(
        publicKey: rawPublicKey.decodeHex(),
        signatureAlgorithm: signAlgos[i] == 2 ? SignatureAlgorithm.ECDSA_P256 : SignatureAlgorithm.ECDSA_secp256k1 
      ),
      hashAlgorithm: HashAlgorithm.SHA3_256,
      weight: weights[i],
    )
    i = i + 1
  }

  let signatureSet: [Crypto.KeyListSignature] = []

  var j = 0
  for signature in signatures {
    signatureSet.append(
      Crypto.KeyListSignature(
        keyIndex: j,
        signature: signature.decodeHex()
      )
    )
    j = j + 1
  }
    
  let signedData = message.decodeHex()
  
  return keyList.verify(
    signatureSet: signatureSet,
    signedData: signedData
  )
}
`

async function verifyUserSignatures(msg, compSigs) {
  invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string")
  invariant(
    Array.isArray(compSigs),
    "Must include an Array of composite signatures"
  )

  let weights = []
  let signAlgos = []
  let signatures = []
  const rawPubKeys = await Promise.all(
    compSigs.map(async cs => {
      invariant(typeof cs.addr === "string", "addr must be a string")
      invariant(typeof cs.keyId === "number", "keyId must be a number")
      invariant(typeof cs.signature === "string", "signature must be a string")

      try {
        const account = await account(cs.addr)
        weights.push(account.keys[cs.keyId].weight.toFixed(1))
        signAlgos.push(account.keys[cs.keyId].signAlgo)
        signatures.push(cs.signature)
        return account.keys[cs.keyId].publicKey
      } catch (err) {
        throw err
      }
    })
  )

  return await query({
    cadence: `${VERIFY_SIG_SCRIPT}`,
    args: (arg, t) => [
      arg(msg, t.String),
      arg(rawPubKeys, t.Array([t.String])),
      arg(weights, t.Array(t.UFix64)),
      arg(signAlgos, t.Array([t.UInt])),
      arg(signatures, t.Array([t.String])),
    ],
  })
}

export const currentUser = () => {
  return {
    authenticate,
    unauthenticate,
    authorization,
    signUserMessage,
    verifyUserSignatures,
    subscribe,
    snapshot,
  }
}
