import "../default-config"
import * as t from "@onflow/types"
import {account, arg} from "@onflow/sdk"
import {config} from "@onflow/config"
import {spawn, send, INIT, SUBSCRIBE, UNSUBSCRIBE} from "@onflow/util-actor"
import {withPrefix, sansPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {buildUser} from "./build-user"
import {serviceOfType} from "./service-of-type"
import {execService} from "./exec-service"
import {normalizeCompositeSignature} from "../normalizers/service/composite-signature"
import {getDiscoveryService, makeDiscoveryServices} from "../discovery"
import {getServiceRegistry} from "./exec-service/plugins"
import {isMobile} from "../utils"

/**
 * @typedef {import("@onflow/typedefs").CurrentUser} CurrentUser
 * @typedef {import("@onflow/typedefs").CompositeSignature} CompositeSignature
 */

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
  if (accountProofDataResolver == null) return
  if (!isFn(accountProofDataResolver)) {
    log({
      title: "Account Proof Data Resolver must be a function",
      message: `Check fcl.accountProof.resolver configuration.
                Expected: fcl.accountProof.resolver: async () => { ... }
                Received: fcl.accountProof.resolver: ${typeof accountProofDataResolver}
                `,
      level: LEVELS.warn,
    })
    return
  }

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

const makeConfig = async ({
  discoveryAuthnInclude,
  discoveryFeaturesSuggested,
}) => {
  return {
    client: {
      discoveryAuthnInclude,
      discoveryFeaturesSuggested,
      clientServices: await makeDiscoveryServices(),
      supportedStrategies: getServiceRegistry().getStrategies(),
    },
  }
}

/**
 * @description - Authenticate a user
 * @param {object} [opts] - Options
 * @param {object} [opts.platform] - platform that runs the function
 * @param {object} [opts.service] - Optional service to use for authentication
 * @param {boolean} [opts.redir=false] - Optional flag to allow window to stay open after authentication
 * @returns {function(*)Promise<CurrentUser>} - User object
 */
const getAuthenticate =
  ({platform}) =>
  async ({service, redir = false} = {}) => {
    if (
      service &&
      !service?.provider?.is_installed &&
      service?.provider?.requires_install
    ) {
      window.location.href = service?.provider?.install_link
      return
    }

    return new Promise(async (resolve, reject) => {
      spawnCurrentUser()
      const opts = {redir}
      const user = await snapshot()
      const discoveryService = await getDiscoveryService(service)
      const refreshService = serviceOfType(user.services, "authn-refresh")
      let accountProofData

      if (user.loggedIn) {
        if (refreshService) {
          try {
            const response = await execService({
              service: refreshService,
              msg: accountProofData,
              opts,
              platform,
            })
            send(NAME, SET_CURRENT_USER, await buildUser(response))
          } catch (error) {
            log({
              title: `${error.name} Could not refresh wallet authentication.`,
              message: error.message,
              level: LEVELS.error,
            })
          } finally {
            return resolve(await snapshot())
          }
        } else {
          return resolve(user)
        }
      }

      try {
        accountProofData = await getAccountProofData()
      } catch (error) {
        log({
          title: `${error.name} On Authentication: Could not resolve account proof data.`,
          message: error.message,
          level: LEVELS.error,
        })
        return reject(error)
      }

      try {
        const response = await execService({
          service: discoveryService,
          msg: accountProofData,
          config: await makeConfig(discoveryService),
          opts,
          platform,
        })
        send(NAME, SET_CURRENT_USER, await buildUser(response))
      } catch (error) {
        log({
          title: `${error} On Authentication`,
          message: error,
          level: LEVELS.error,
        })
      } finally {
        resolve(await snapshot())
      }
    })
  }

/**
 * @description - Unauthenticate a user
 * @returns {void}
 */
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

const getResolvePreAuthz =
  ({platform}) =>
  authz => {
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
        return execService({service: az, msg: signable, platform})
      },
      role: {
        proposer: role === "PROPOSER",
        payer: role === "PAYER",
        authorizer: role === "AUTHORIZER",
      },
    }))
    return result
  }

/**
 * @description
 * Produces the needed authorization details for the current user to submit transactions to Flow
 * It defines a signing function that connects to a user's wallet provider to produce signatures to submit transactions.
 *
 * @param {object} ops - running options
 * @param {string} ops.platform - platform that runs the function
 * @param {object} account - Account object
 * @returns {Promise<object>} - Account object with signing function
 */
const getAuthorization =
  ({platform}) =>
  async account => {
    spawnCurrentUser()

    return {
      ...account,
      tempId: "CURRENT_USER",
      async resolve(account, preSignable) {
        const user = await getAuthenticate({platform})({redir: true})
        const authz = serviceOfType(user.services, "authz")
        const preAuthz = serviceOfType(user.services, "pre-authz")

        if (preAuthz)
          return getResolvePreAuthz({platform})(
            await execService({
              service: preAuthz,
              msg: preSignable,
              platform,
            })
          )
        if (authz) {
          let windowRef
          if (isMobile() && authz.method === "WC/RPC") {
            windowRef = window.open("", "_blank")
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
                await execService({
                  service: authz,
                  msg: signable,
                  opts: {
                    includeOlderJsonRpcCall: true,
                    windowRef,
                  },
                  platform,
                })
              )
            },
          }
        }
        throw new Error(
          "No Authz or PreAuthz Service configured for CURRENT_USER"
        )
      },
    }
  }

/**
 * @description
 * The callback passed to subscribe will be called when the user authenticates and un-authenticates, making it easy to update the UI accordingly.
 *
 * @param {Function} callback - Callback function
 * @returns {Function} - Unsubscribe function
 */
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

/**
 * @description - Gets the current user
 * @returns {Promise<CurrentUser>} - User object
 */
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

/**
 * @description - Resolves the current user as an argument
 *
 * @param {object} ops - running options
 * @param {string} ops.platform - platform that runs the function
 * @returns {Promise<Function>}
 */
const getResolveArgument =
  ({platform}) =>
  async () => {
    const {addr} = await getAuthenticate({platform})()
    return arg(withPrefix(addr), t.Address)
  }

const makeSignable = msg => {
  invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string")

  return {
    message: msg,
  }
}

/**
 * @description - A method to use allowing the user to personally sign data via FCL Compatible Wallets/Services.
 * @param {string} msg - Message to sign
 * @returns {Promise<CompositeSignature[]>} - Array of CompositeSignatures
 */
const getSignUserMessage =
  ({platform}) =>
  async msg => {
    spawnCurrentUser()
    const user = await getAuthenticate({platform})({redir: true})

    const signingService = serviceOfType(user.services, "user-signature")

    invariant(
      signingService,
      "Current user must have authorized a signing service."
    )

    try {
      const response = await execService({
        service: signingService,
        msg: makeSignable(msg),
        platform,
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

const getCurrentUser = ({platform}) => {
  let currentUser = () => {
    return {
      authenticate: getAuthenticate({platform}),
      unauthenticate,
      authorization: getAuthorization({platform}),
      signUserMessage: getSignUserMessage({platform}),
      subscribe,
      snapshot,
      resolveArgument: getResolveArgument({platform}),
    }
  }

  currentUser.authenticate = getAuthenticate({platform})
  currentUser.unauthenticate = unauthenticate
  currentUser.authorization = getAuthorization({platform})
  currentUser.signUserMessage = getSignUserMessage({platform})
  currentUser.subscribe = subscribe
  currentUser.snapshot = snapshot
  currentUser.resolveArgument = getResolveArgument({platform})

  return currentUser
}

export {getCurrentUser}
