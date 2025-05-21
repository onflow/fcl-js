import {config} from "@onflow/config"
import {arg, Signable, t} from "@onflow/sdk"
import {
  Account,
  CompositeSignature,
  CurrentUser,
  Service,
} from "@onflow/typedefs"
import {
  ActorContext,
  INIT,
  Letter,
  send,
  spawn,
  SUBSCRIBE,
  UNSUBSCRIBE,
} from "@onflow/util-actor"
import {sansPrefix, withPrefix} from "@onflow/util-address"
import {invariant} from "@onflow/util-invariant"
import {LEVELS, log} from "@onflow/util-logger"
import "../default-config"
import {getDiscoveryService, makeDiscoveryServices} from "../discovery"
import {normalizeCompositeSignature} from "../normalizers/service/composite-signature"
import {StorageProvider} from "../utils/storage"
import {buildUser} from "./build-user"
import {execService} from "./exec-service"
import {getServiceRegistry} from "./exec-service/plugins"
import {serviceOfType} from "./service-of-type"

export interface CurrentUserConfig {
  platform: string
  discovery?: object | undefined
  getStorageProvider?: () => Promise<StorageProvider>
}

export interface CurrentUserFull extends CurrentUser {
  (): CurrentUserFull
  authenticate: ({
    service,
    redir,
    forceReauth,
  }?: AuthenticationOptions) => Promise<CurrentUser>
  unauthenticate: () => void
  authorization: (account: Account) => Promise<Account>
  signUserMessage: (msg: string) => Promise<CompositeSignature[]>
  subscribe: (callback: (user: CurrentUser) => void) => () => void
  snapshot: () => Promise<CurrentUser>
  resolveArgument: () => Promise<string>
}

export interface AccountProofData {
  appIdentifier: string
  nonce: string
  [key: string]: any
}

export interface AuthenticationOptions {
  service?: Service
  redir?: boolean
  forceReauth?: boolean
}

export interface MakeConfigOptions {
  discoveryAuthnInclude?: string[]
  discoveryAuthnExclude?: string[]
  discoveryFeaturesSuggested?: string[]
}

export const isFn = (d: any): boolean => typeof d === "function"

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

const getStoredUser = async (storage: StorageProvider): Promise<any> => {
  const fallback = JSON.parse(DATA)
  const stored = await storage.get(NAME)
  if (stored != null && fallback["f_vsn"] !== stored["f_vsn"]) {
    storage.removeItem(NAME)
    return fallback
  }
  return stored || fallback
}

const makeHandlers = (cfg: CurrentUserConfig) => {
  // Wrapper for backwards compatibility
  const getStorageProvider = async (): Promise<StorageProvider> => {
    if (cfg.getStorageProvider) return await cfg.getStorageProvider()
    return (await config.first(
      ["fcl.storage", "fcl.storage.default"],
      undefined
    )) as any
  }

  return {
    [INIT]: async (ctx: ActorContext) => {
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
      const storage = await getStorageProvider()
      if (storage.can) {
        const user = await getStoredUser(storage)
        if (notExpired(user)) ctx.merge(user)
      }
    },
    [SUBSCRIBE]: (ctx: ActorContext, letter: Letter) => {
      ctx.subscribe(letter.from)
      ctx.send(letter.from, UPDATED, {...ctx.all()})
    },
    [UNSUBSCRIBE]: (ctx: ActorContext, letter: Letter) => {
      ctx.unsubscribe(letter.from)
    },
    [SNAPSHOT]: async (ctx: ActorContext, letter: Letter) => {
      letter.reply({...ctx.all()})
    },
    [SET_CURRENT_USER]: async (
      ctx: ActorContext,
      letter: Letter,
      data: any
    ) => {
      ctx.merge(data)
      const storage = await getStorageProvider()
      if (storage.can) storage.put(NAME, ctx.all())
      ctx.broadcast(UPDATED, {...ctx.all()})
    },
    [DEL_CURRENT_USER]: async (ctx: ActorContext, letter: Letter) => {
      ctx.merge(JSON.parse(DATA))
      const storage = await getStorageProvider()
      if (storage.can) storage.put(NAME, ctx.all())
      ctx.broadcast(UPDATED, {...ctx.all()})
    },
  }
}

const spawnCurrentUser = (cfg: CurrentUserConfig) =>
  spawn(makeHandlers(cfg), NAME)

function notExpired(user: any): boolean {
  return (
    user.expiresAt == null ||
    user.expiresAt === 0 ||
    user.expiresAt > Date.now()
  )
}

async function getAccountProofData(): Promise<AccountProofData | undefined> {
  let accountProofDataResolver: any = await config.get(
    "fcl.accountProof.resolver"
  )
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

  const accountProofData = {...(await accountProofDataResolver())}

  const origin: any = window?.location?.origin

  if (accountProofData.appIdentifier) {
    if (origin) {
      log.deprecate({
        pkg: "FCL",
        subject: "appIdentifier in fcl.accountProof.resolver",
        message:
          "Manually set app identifiers in the account proof resolver function are now deprecated.  These are now automatically set to the application origin URL by FCL",
        transition:
          "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/TRANSITIONS.md#0002-deprecate-appIdentifier-field-in-account-proof-resolver",
      })

      invariant(
        typeof accountProofData.appIdentifier === "string",
        "appIdentifier must be a string"
      )
    }
  } else {
    invariant(
      origin,
      "The appIdentifier (origin) could not be inferred from the window.location.origin.  Please set the appIdentifier manually in the fcl.accountProof.resolver function."
    )

    accountProofData.appIdentifier = origin
  }

  invariant(
    /^[0-9a-f]+$/i.test(accountProofData.nonce),
    "Nonce must be a hex string"
  )

  return accountProofData
}

const makeConfig = async ({
  discoveryAuthnInclude,
  discoveryAuthnExclude,
  discoveryFeaturesSuggested,
}: MakeConfigOptions): Promise<Record<string, any>> => {
  return {
    client: {
      discoveryAuthnInclude,
      discoveryAuthnExclude,
      discoveryFeaturesSuggested,
      clientServices: await makeDiscoveryServices(),
      supportedStrategies: getServiceRegistry().getStrategies(),
    },
  }
}

/**
 * @description Factory function to get the authenticate method
 * @param {CurrentUserConfig} config Current User Configuration
 */
const getAuthenticate =
  (config: CurrentUserConfig) =>
  /**
   * @description Authenticate a user
   * @param {AuthenticationOptions} [opts] Options
   * @param {Service} [opts.service] Optional service to use for authentication
   * @param {boolean} [opts.redir] Optional redirect flag
   * @param {boolean} [opts.forceReauth] Optional force re-authentication flag
   * @returns
   */
  async ({
    service,
    redir = false,
    forceReauth = false,
  }: AuthenticationOptions = {}): Promise<CurrentUser | undefined> => {
    if (
      service &&
      !service?.provider?.is_installed &&
      service?.provider?.requires_install
    ) {
      window.location.href = service?.provider?.install_link!
      return
    }

    return new Promise(async (resolve, reject) => {
      spawnCurrentUser(config)
      const opts = {redir}
      const user = await getSnapshot(config)()
      const refreshService = serviceOfType(user.services, "authn-refresh")
      let accountProofData

      if (user.loggedIn && !forceReauth) {
        if (refreshService) {
          try {
            const response: any = await execService({
              service: refreshService,
              msg: accountProofData,
              opts,
              platform: config.platform,
              user,
            })
            send(NAME, SET_CURRENT_USER, await buildUser(response))
          } catch (error: any) {
            log({
              title: `${error.name} Could not refresh wallet authentication.`,
              message: error.message,
              level: LEVELS.error,
            })
          } finally {
            return resolve(await getSnapshot(config)())
          }
        } else {
          return resolve(user)
        }
      }

      try {
        accountProofData = await getAccountProofData()
      } catch (error: any) {
        log({
          title: `${error.name} On Authentication: Could not resolve account proof data.`,
          message: error.message,
          level: LEVELS.error,
        })
        return reject(error)
      }

      try {
        const discoveryService = await getDiscoveryService(service)
        const response: any = await execService({
          service: discoveryService,
          msg: accountProofData,
          config: await makeConfig(discoveryService),
          opts,
          platform: config.platform,
          execStrategy: (config.discovery as any)?.execStrategy,
          user,
        })

        send(NAME, SET_CURRENT_USER, await buildUser(response))
      } catch (error: any) {
        log({
          title: `${error} On Authentication`,
          message: error,
          level: LEVELS.error,
        })
      } finally {
        resolve(await getSnapshot(config)())
      }
    })
  }

/**
 * @description Factory function to get the unauthenticate method
 * @param {CurrentUserConfig} config Current User Configuration
 */
function getUnauthenticate(config: CurrentUserConfig) {
  /**
   * @description Unauthenticate a user
   */
  return function unauthenticate() {
    spawnCurrentUser(config)
    send(NAME, DEL_CURRENT_USER)
  }
}

const normalizePreAuthzResponse = (authz: any) => ({
  f_type: "PreAuthzResponse",
  f_vsn: "1.0.0",
  proposer: (authz || {}).proposer,
  payer: (authz || {}).payer || [],
  authorization: (authz || {}).authorization || [],
})

/**
 * @description Factory function to get the resolvePreAuthz method
 * @param {CurrentUserConfig} config Current User Configuration
 */
const getResolvePreAuthz =
  (config: CurrentUserConfig) =>
  (authz: any, {user}: {user: CurrentUser}) => {
    const resp = normalizePreAuthzResponse(authz)
    const axs = []

    if (resp.proposer != null) axs.push(["PROPOSER", resp.proposer])
    for (let az of resp.payer || []) axs.push(["PAYER", az])
    for (let az of resp.authorization || []) axs.push(["AUTHORIZER", az])

    var result = axs.map(([role, az]) => ({
      tempId: [az.identity.address, az.identity.keyId].join("|"),
      addr: az.identity.address,
      keyId: az.identity.keyId,
      signingFunction(signable: Signable) {
        return execService({
          service: az,
          msg: signable,
          platform: config.platform,
          user,
        })
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
 * @description Factory function to get the authorization method
 * @param {CurrentUserConfig} config Current User Configuration
 */
const getAuthorization =
  (config: CurrentUserConfig) =>
  /**
   * @description Produces the needed authorization details for the current user to submit transactions to Flow
   * It defines a signing function that connects to a user's wallet provider to produce signatures to submit transactions.
   *
   * @param {Account} account Account object
   * @returns {Promise<Account>} Account object with signing function
   * */
  async (account: Account) => {
    spawnCurrentUser(config)

    return {
      ...account,
      tempId: "CURRENT_USER",
      async resolve(account: Account, preSignable: Signable) {
        const user = await getAuthenticate(config)({redir: true})
        const authz = serviceOfType(user!.services, "authz")
        const preAuthz = serviceOfType(user!.services, "pre-authz")

        if (preAuthz)
          return getResolvePreAuthz(config)(
            await execService({
              service: preAuthz,
              msg: preSignable,
              platform: config.platform,
              user,
            }),
            {
              user: user!,
            }
          )
        if (authz) {
          return {
            ...account,
            tempId: "CURRENT_USER",
            resolve: null,
            addr: sansPrefix((authz as any).identity.address),
            keyId: (authz as any).identity.keyId,
            sequenceNum: null,
            signature: null,
            async signingFunction(signable: Signable) {
              return normalizeCompositeSignature(
                await execService({
                  service: authz,
                  msg: signable,
                  opts: {
                    includeOlderJsonRpcCall: true,
                  },
                  platform: config.platform,
                  user,
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
 * @description Factory function to get the subscribe method
 * @param {CurrentUserConfig} config Current User Configuration
 */
function getSubscribe(config: CurrentUserConfig) {
  /**
   * @description
   * The callback passed to subscribe will be called when the user authenticates and un-authenticates, making it easy to update the UI accordingly.
   *
   * @param {Function} callback Callback function
   * @returns {Function} Unsubscribe function
   */
  return function subscribe(callback: (user: CurrentUser) => void) {
    spawnCurrentUser(config)
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
}

/**
 * @description Factory function to get the snapshot method
 * @param {CurrentUserConfig} config Current User Configuration
 */
function getSnapshot(config: CurrentUserConfig): () => Promise<CurrentUser> {
  /**
   * @description Gets the current user
   * @returns {Promise<CurrentUser>} User object
   */
  return function snapshot() {
    spawnCurrentUser(config)
    return send(NAME, SNAPSHOT, null, {expectReply: true, timeout: 0})
  }
}

/**
 * Resolves the current user as an argument
 * @param {CurrentUserConfig} config Current User Configuration
 */
const getResolveArgument = (config: CurrentUserConfig) => async () => {
  const {addr} = (await getAuthenticate(config)()) as any
  return arg(withPrefix(addr) as any, t.Address)
}

const makeSignable = (msg: string) => {
  invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string")

  return {
    message: msg,
  }
}

/**
 * @description Factory function to get the signUserMessage method
 * @param {CurrentUserConfig} config Current User Configuration
 */
const getSignUserMessage =
  (config: CurrentUserConfig) =>
  /**
   * @description A method to use allowing the user to personally sign data via FCL Compatible Wallets/Services.
   * @param {string} msg Message to sign
   * @returns {Promise<CompositeSignature[]>} Array of CompositeSignatures
   */
  async (msg: string) => {
    spawnCurrentUser(config)
    const user: any = await getAuthenticate(config)({
      redir: true,
    })

    const signingService = serviceOfType(user.services, "user-signature")

    invariant(
      signingService as any,
      "Current user must have authorized a signing service."
    )

    try {
      const response = await execService({
        service: signingService as any,
        msg: makeSignable(msg),
        platform: config.platform,
        user,
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

/**
 * @description Creates the Current User object
 * @param {CurrentUserConfig} config Current User Configuration
 *  */
const getCurrentUser = (config: CurrentUserConfig): CurrentUserFull => {
  const currentUser = {
    authenticate: getAuthenticate(config),
    unauthenticate: getUnauthenticate(config),
    authorization: getAuthorization(config),
    signUserMessage: getSignUserMessage(config),
    subscribe: getSubscribe(config),
    snapshot: getSnapshot(config),
    resolveArgument: getResolveArgument(config),
  }

  return Object.assign(
    () => {
      return {...currentUser}
    },
    {...currentUser}
  ) as any
}

export {getCurrentUser}
