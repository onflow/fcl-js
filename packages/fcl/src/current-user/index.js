import "../default-config"
import * as t from "@onflow/types"
import {account, arg} from "@onflow/sdk"
import {config} from "@onflow/config"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {withPrefix, sansPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {buildUser} from "./build-user"
import {serviceOfType} from "./service-of-type"
import {execService} from "./exec-service"
import {normalizeCompositeSignature} from "./normalize/composite-signature"
import {getDiscoveryService} from "../config-utils"

export const isFn = d => typeof d === "function"

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

const getStoredUser = async storage => {
  const fallback = JSON.parse(DATA)
  const stored = await storage.get(NAME)
  if (stored != null && fallback["f_vsn"] !== stored["f_vsn"]) {
    storage.removeItem(NAME)
    return fallback
  }
  return stored || fallback
}

const HANDLERS = {
  [INIT]: async ctx => {
    if (typeof window === "undefined") {
      console.warn(
        `
        %cFCL Warning
        ============================
        "currentUser" is only available in the browser.
        For more info, please see the docs: https://docs.onflow.org/fcl/
        ============================
        `,
        "font-weight:bold;font-family:monospace;"
      )
    }

    ctx.merge(JSON.parse(DATA))
    const storage = await config.first(["fcl.storage", "fcl.storage.default"])
    if (storage.can) {
      const user = await getStoredUser(storage)
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
    const storage = await config.first(["fcl.storage", "fcl.storage.default"])
    if (storage.can) storage.put(NAME, ctx.all())
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
  [DEL_CURRENT_USER]: async (ctx, letter) => {
    ctx.merge(JSON.parse(DATA))
    const storage = await config.first(["fcl.storage", "fcl.storage.default"])
    if (storage.can) storage.put(NAME, ctx.all())
    ctx.broadcast(UPDATED, {...ctx.all()})
  },
}

const spawnCurrentUser = () => spawn(HANDLERS, NAME)

function notExpired(user) {
  return (
    user.expiresAt == null ||
    user.expiresAt === 0 ||
    user.expiresAt > Date.now()
  )
}

async function getAccountProofData() {
  let accountProofDataResolver = await config.get("fcl.accountProof.resolver")

  if (!isFn(accountProofDataResolver)) return

  const accountProofData = await accountProofDataResolver()

  if (accountProofData == null) return

  invariant(
    typeof accountProofData.appIdentifier === "string",
    "appIdentifier must be a string"
  )
  invariant(
    /^[0-9a-f]+$/i.test(accountProofData.nonce),
    "Nonce must be a hex string"
  )

  return accountProofData
}

// Certain method types cannot be overridden to use other methods like POP/RCP
const isServiceMethodUnchangable = method => ["EXT/RPC"].includes(method)

async function authenticate({service, redir = false} = {}) {
  if (service && !service?.provider?.is_installed && service?.provider?.requires_install) {
    window.location.href = service?.provider?.install_link
    return
  }

  return new Promise(async (resolve, reject) => {
    spawnCurrentUser()
    const opts = {redir}
    const user = await snapshot()
    const discoveryService = await getDiscoveryService()
    const refreshService = serviceOfType(user.services, "authn-refresh")
    let accountProofData

    try {
      accountProofData = await getAccountProofData()
    } catch (error) {
      console.error(
        `Error During Authentication: Could not resolve account proof data.
        ${error}`
      )
      return reject(error)
    }

    invariant(
      service || discoveryService.endpoint,
      `
        If no service passed to "authenticate," then "discovery.wallet" must be defined in config.
        See: "https://docs.onflow.org/fcl/reference/api/#setting-configuration-values"
      `
    )

    if (user.loggedIn) {
      if (refreshService) {
        try {
          const response = await execService({
            service: refreshService,
            msg: accountProofData,
            opts,
          })
          send(NAME, SET_CURRENT_USER, await buildUser(response))
        } catch (e) {
          console.error("Error: Could not refresh authentication.", e)
        } finally {
          return resolve(await snapshot())
        }
      } else {
        return resolve(user)
      }
    }

    try {
      const response = await execService({
        service: {
          ...(service || discoveryService),
          method: isServiceMethodUnchangable(service?.method)
            ? service.method 
            : discoveryService?.method || service.method || "IFRAME/RPC",
        },
        msg: accountProofData,
        opts,
        config: {
          discoveryAuthnInclude: discoveryService.discoveryAuthnInclude,
        },
      })
      send(NAME, SET_CURRENT_USER, await buildUser(response))
    } catch (e) {
      console.error("Error while authenticating", e)
    } finally {
      resolve(await snapshot())
    }
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
      return execService({service: az, msg: signable})
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

  return {
    ...account,
    tempId: "CURRENT_USER",
    async resolve(account, preSignable) {
      const user = await authenticate({redir: true})
      const authz = serviceOfType(user.services, "authz")
      const preAuthz = serviceOfType(user.services, "pre-authz")

      if (preAuthz)
        return resolvePreAuthz(
          await execService({
            service: preAuthz,
            msg: preSignable,
          })
        )
      if (authz)
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
              await execService({
                service: authz,
                msg: signable,
                opts: {
                  includeOlderJsonRpcCall: true,
                },
              })
            )
          },
        }
      throw new Error(
        "No Authz or PreAuthz Service configured for CURRENT_USER"
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

async function resolveArgument() {
  const {addr} = await authenticate()
  return arg(withPrefix(addr), t.Address)
}

const makeSignable = msg => {
  invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string")

  return {
    message: msg,
  }
}

async function signUserMessage(msg) {
  spawnCurrentUser()
  const user = await authenticate({redir: true})

  const signingService = serviceOfType(user.services, "user-signature")

  invariant(
    signingService,
    "Current user must have authorized a signing service."
  )

  try {
    const response = await execService({
      service: signingService,
      msg: makeSignable(msg),
    })
    if (Array.isArray(response)) {
      return response.map(compSigs => normalizeCompositeSignature(compSigs))
    } else {
      return [normalizeCompositeSignature(response)]
    }
  } catch (error) {
    return error
  }
}

let currentUser = () => {
  return {
    authenticate,
    unauthenticate,
    authorization,
    signUserMessage,
    subscribe,
    snapshot,
    resolveArgument,
  }
}

currentUser.authenticate = authenticate
currentUser.unauthenticate = unauthenticate
currentUser.authorization = authorization
currentUser.signUserMessage = signUserMessage
currentUser.subscribe = subscribe
currentUser.snapshot = snapshot
currentUser.resolveArgument = resolveArgument

export {currentUser}
