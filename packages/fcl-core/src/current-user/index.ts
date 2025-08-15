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
import {createPartialGlobalFCLContext} from "../context/global"
import {FCLContext} from "../context"
import {v4 as uuidv4} from "uuid"

export interface CurrentUserConfig {
  platform: string
  discovery?: {
    execStrategy?: (...args: any[]) => any
  }
  getStorageProvider: () => Promise<StorageProvider>
}

export interface CurrentUserContext extends Pick<FCLContext, "config" | "sdk"> {
  platform: string
  getStorageProvider: () => Promise<StorageProvider>
  discovery?: {
    execStrategy?: (...args: any[]) => any
  }
  actorName: string
}

export interface CurrentUserServiceApi {
  authenticate: (opts?: AuthenticationOptions) => Promise<CurrentUser>
  unauthenticate: () => void
  authorization: (account: Account) => Promise<Account>
  signUserMessage: (msg: string) => Promise<CompositeSignature[]>
  subscribe: (callback: (user: CurrentUser) => void) => () => void
  snapshot: () => Promise<CurrentUser>
  resolveArgument: () => Promise<string>
}

export interface CurrentUserService extends CurrentUserServiceApi {
  (): CurrentUserServiceApi
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

/**
 * @description Type guard function that checks if a value is a function. This is a simple utility
 * used internally by FCL for type checking and validation.
 *
 * @param d The value to check
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * // Check if a value is a function
 * const callback = () => console.log("Hello")
 * const notCallback = "string"
 *
 * console.log(isFn(callback)) // true
 * console.log(isFn(notCallback)) // false
 */
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

const makeHandlers = (context: CurrentUserContext) => {
  // Wrapper for backwards compatibility
  const getStorageProvider = async (): Promise<StorageProvider> => {
    if (context.getStorageProvider) return await context.getStorageProvider()
    return (await context.config.first(
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

const spawnCurrentUser = (context: CurrentUserContext) => {
  spawn(makeHandlers(context), context.actorName)
}

function notExpired(user: any): boolean {
  return (
    user.expiresAt == null ||
    user.expiresAt === 0 ||
    user.expiresAt > Date.now()
  )
}

async function getAccountProofData(
  context: Pick<FCLContext, "config">
): Promise<AccountProofData | undefined> {
  let accountProofDataResolver: any = await context.config.get(
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
 * @description Factory function to create the authenticate method
 * @param config Current User Configuration
 */
const createAuthenticate =
  (context: CurrentUserContext) =>
  /**
   * @description Calling this method will authenticate the current user via any wallet that supports FCL. Once called, FCL will initiate communication with the configured `discovery.wallet` endpoint which lets the user select a wallet to authenticate with. Once the wallet provider has authenticated the user, FCL will set the values on the current user object for future use and authorization.
   *
   * This method can only be used in web browsers.
   *
   * `discovery.wallet` value must be set in the configuration before calling this method. See FCL Configuration.
   *
   * The default discovery endpoint will open an iframe overlay to let the user choose a supported wallet.
   *
   * `authenticate` can also take a service returned from discovery with `fcl.authenticate(\{ service \})`.
   *
   * @param opts Authentication options
   * @param opts.service Optional service to use for authentication. A service returned from discovery can be passed here.
   * @param opts.redir Optional redirect flag. Defaults to false.
   * @param opts.forceReauth Optional force re-authentication flag. Defaults to false.
   * @returns Promise that resolves to the authenticated CurrentUser object or undefined
   *
   * @example
   * import * as fcl from '@onflow/fcl';
   * fcl
   *   .config()
   *   .put('accessNode.api', 'https://rest-testnet.onflow.org')
   *   .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn');
   * // anywhere on the page
   * fcl.authenticate();
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
      spawnCurrentUser(context)
      const opts = {redir}
      const user = await createSnapshot(context)()
      const refreshService = serviceOfType(user.services, "authn-refresh")
      let accountProofData

      if (user.loggedIn && !forceReauth) {
        if (refreshService) {
          try {
            const response: any = await execService(context, {
              service: refreshService,
              msg: accountProofData,
              opts,
              platform: context.platform,
              user,
            })
            send(context.actorName, SET_CURRENT_USER, await buildUser(response))
          } catch (error: any) {
            log({
              title: `${error.name} Could not refresh wallet authentication.`,
              message: error.message,
              level: LEVELS.error,
            })
          } finally {
            return resolve(await createSnapshot(context)())
          }
        } else {
          return resolve(user)
        }
      }

      try {
        accountProofData = await getAccountProofData(context)
      } catch (error: any) {
        log({
          title: `${error.name} On Authentication: Could not resolve account proof data.`,
          message: error.message,
          level: LEVELS.error,
        })
        return reject(error)
      }

      try {
        const discoveryService = await getDiscoveryService(context, service)
        const response: any = await execService(context, {
          service: discoveryService,
          msg: accountProofData,
          config: await makeConfig(discoveryService),
          opts,
          platform: context.platform,
          execStrategy: context.discovery?.execStrategy,
          user,
        })

        send(context.actorName, SET_CURRENT_USER, await buildUser(response))
      } catch (error: any) {
        log({
          title: `${error} On Authentication`,
          message: error,
          level: LEVELS.error,
        })
      } finally {
        resolve(await createSnapshot(context)())
      }
    })
  }

/**
 * @description Factory function to create the unauthenticate method
 * @param config Current User Configuration
 */
function createUnauthenticate(context: CurrentUserContext) {
  /**
   * @description Logs out the current user and sets the values on the current user object to null.
   *
   * This method can only be used in web browsers.
   *
   * The current user must be authenticated first.
   *
   * @example
   * import * as fcl from '@onflow/fcl';
   * fcl.config().put('accessNode.api', 'https://rest-testnet.onflow.org');
   * // first authenticate to set current user
   * fcl.authenticate();
   * // ... somewhere else & sometime later
   * fcl.unauthenticate();
   * // fcl.currentUser.loggedIn === null
   */
  return function unauthenticate() {
    spawnCurrentUser(context)
    send(context.actorName, DEL_CURRENT_USER)
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
 * @description Factory function to create the resolvePreAuthz method
 * @param config Current User Configuration
 */
const createResolvePreAuthz =
  (context: CurrentUserContext) =>
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
        return execService(context, {
          service: az,
          msg: signable,
          platform: context.platform,
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
 * @description Factory function to create the authorization method
 * @param config Current User Configuration
 */
const createAuthorization =
  (context: CurrentUserContext) =>
  /**
   * @description Produces the needed authorization details for the current user to submit transactions to Flow
   * It defines a signing function that connects to a user's wallet provider to produce signatures to submit transactions.
   *
   * @param account Account object
   * @returns Account object with signing function
   * */
  async (account: Account) => {
    spawnCurrentUser(context)

    return {
      ...account,
      tempId: "CURRENT_USER",
      async resolve(account: Account, preSignable: Signable) {
        const user = await createAuthenticate(context)({redir: true})
        const authz = serviceOfType(user!.services, "authz")
        const preAuthz = serviceOfType(user!.services, "pre-authz")

        if (preAuthz)
          return createResolvePreAuthz(context)(
            await execService(context, {
              service: preAuthz,
              msg: preSignable,
              platform: context.platform,
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
                await execService(context, {
                  service: authz,
                  msg: signable,
                  opts: {
                    includeOlderJsonRpcCall: true,
                  },
                  platform: context.platform,
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
 * @description Factory function to create the subscribe method
 * @param context Current User Context
 */
function createSubscribe(context: CurrentUserContext) {
  /**
   * @description The callback passed to subscribe will be called when the user authenticates and un-authenticates, making it easy to update the UI accordingly.
   *
   * @param callback The callback will be called with the current user as the first argument when the current user is set or removed.
   * @returns Function to unsubscribe from user state changes
   *
   * @example
   * import React, { useState, useEffect } from 'react';
   * import * as fcl from '@onflow/fcl';
   *
   * export function AuthCluster() {
   *   const [user, setUser] = useState({ loggedIn: null });
   *   useEffect(() => fcl.currentUser.subscribe(setUser), []); // sets the callback for FCL to use
   *
   *   if (user.loggedIn) {
   *     return (
   *       <div>
   *         <span>{user?.addr ?? 'No Address'}</span>
   *         <button onClick={fcl.unauthenticate}>Log Out</button>
   *       </div>
   *     );
   *   } else {
   *     return (
   *       <div>
   *         <button onClick={fcl.logIn}>Log In</button>{' '}
   *         <button onClick={fcl.signUp}>Sign Up</button>
   *       </div>
   *     );
   *   }
   * }
   */
  return function subscribe(callback: (user: CurrentUser) => void) {
    spawnCurrentUser(context)
    const EXIT = "@EXIT"
    const self = spawn(async ctx => {
      ctx.send(context.actorName, SUBSCRIBE)
      while (1) {
        const letter = await ctx.receive()
        if (letter.tag === EXIT) {
          ctx.send(context.actorName, UNSUBSCRIBE)
          return
        }
        callback(letter.data)
      }
    })
    return () => send(self, EXIT)
  }
}

/**
 * @description Factory function to create the snapshot method
 * @param context Current User Context
 */
function createSnapshot(
  context: CurrentUserContext
): () => Promise<CurrentUser> {
  /**
   * @description Returns the current user object. This is the same object that is set and available on `fcl.currentUser.subscribe(callback)`.
   *
   * @returns Promise that resolves to the current user object
   *
   * @example
   * // returns the current user object
   * const user = fcl.currentUser.snapshot();
   *
   * // subscribes to the current user object and logs to console on changes
   * fcl.currentUser.subscribe(console.log);
   */
  return function snapshot() {
    spawnCurrentUser(context)
    return send(context.actorName, SNAPSHOT, null, {
      expectReply: true,
      timeout: 0,
    })
  }
}

/**
 * @description Resolves the current user as an argument
 * @param config Current User Configuration
 */
const createResolveArgument = (config: CurrentUserContext) => async () => {
  const {addr} = (await createAuthenticate(config)()) as any
  return arg(withPrefix(addr) as any, t.Address)
}

const makeSignable = (msg: string) => {
  invariant(/^[0-9a-f]+$/i.test(msg), "Message must be a hex string")

  return {
    message: msg,
  }
}

/**
 * @description Factory function to create the signUserMessage method
 * @param config Current User Configuration
 */
const createSignUserMessage =
  (context: CurrentUserContext) =>
  /**
   * @description A method to use allowing the user to personally sign data via FCL Compatible Wallets/Services.
   *
   * This method requires the current user's wallet to support a signing service endpoint. Currently, only Blocto is compatible with this feature by default.
   *
   * @param msg A hexadecimal string to be signed
   * @returns An Array of CompositeSignatures: \{`addr`, `keyId`, `signature`\}
   *
   * @example
   * import * as fcl from '@onflow/fcl';
   *
   * export const signMessage = async () => {
   *   const MSG = Buffer.from('FOO').toString('hex');
   *   try {
   *     return await currentUser.signUserMessage(MSG);
   *   } catch (error) {
   *     console.log(error);
   *   }
   * };
   */
  async (msg: string) => {
    spawnCurrentUser(context)
    const user: any = await createAuthenticate(context)({
      redir: true,
    })

    const signingService = serviceOfType(user.services, "user-signature")

    invariant(
      signingService as any,
      "Current user must have authorized a signing service."
    )

    try {
      const response = await execService(context, {
        service: signingService as any,
        msg: makeSignable(msg),
        platform: context.platform,
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

const _createUser = (context: CurrentUserContext): CurrentUserService => {
  const currentUser = {
    authenticate: createAuthenticate(context),
    unauthenticate: createUnauthenticate(context),
    authorization: createAuthorization(context),
    signUserMessage: createSignUserMessage(context),
    subscribe: createSubscribe(context),
    snapshot: createSnapshot(context),
    resolveArgument: createResolveArgument(context),
  }

  return Object.assign(
    () => {
      return {...currentUser}
    },
    {...currentUser}
  ) as any
}

const createUser = (
  context: Pick<FCLContext, "config" | "sdk" | "storage"> & {
    platform: string
    discovery?: {
      execStrategy?: (...args: any[]) => any
    }
  }
) => {
  return _createUser({
    ...context,
    getStorageProvider: async () => context.storage,
    discovery: context.discovery,
    actorName: `${NAME}_${uuidv4()}`,
  })
}

/**
 * @description Creates and configures the Current User service for managing user authentication and
 * authorization in Flow applications. This is the core service for handling user sessions, wallet
 * connections, transaction signing, and user data management. The service provides both callable
 * function interface and object methods for maximum flexibility.
 *
 * @param config Configuration object for the current user service
 * @param config.platform Platform identifier (e.g., "web", "mobile", "extension")
 * @param config.discovery Optional discovery configuration for wallet services
 * @param config.getStorageProvider Optional function to provide custom storage implementation
 *
 * @returns Current user service object with authentication and authorization methods
 *
 * @example
 * // Basic setup and authentication
 * import * as fcl from "@onflow/fcl"
 *
 * // Configure FCL
 * fcl.config({
 *   "accessNode.api": "https://rest-testnet.onflow.org",
 *   "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn"
 * })
 *
 * // Create current user service
 * const currentUser = fcl.getCurrentUser({
 *   platform: "web"
 * })
 *
 * // Authenticate user
 * const user = await currentUser.authenticate()
 * console.log("Authenticated user:", user.addr)
 *
 * // Subscribe to authentication state changes
 * const currentUser = fcl.getCurrentUser({ platform: "web" })
 *
 * const unsubscribe = currentUser.subscribe((user) => {
 *   if (user.loggedIn) {
 *     console.log("User logged in:", user.addr)
 *     document.getElementById("login-btn").style.display = "none"
 *     document.getElementById("logout-btn").style.display = "block"
 *   } else {
 *     console.log("User logged out")
 *     document.getElementById("login-btn").style.display = "block"
 *     document.getElementById("logout-btn").style.display = "none"
 *   }
 * })
 *
 * // Clean up subscription
 * window.addEventListener("beforeunload", () => unsubscribe())
 *
 * // Sign transactions with user authorization
 * const currentUser = fcl.getCurrentUser({ platform: "web" })
 *
 * const txId = await fcl.mutate({
 *   cadence: `
 *     transaction(amount: UFix64, to: Address) {
 *       prepare(signer: AuthAccount) {
 *         // Transfer tokens logic here
 *       }
 *     }
 *   `,
 *   args: (arg, t) => [
 *     arg("10.0", t.UFix64),
 *     arg("0x01", t.Address)
 *   ],
 *   authz: currentUser.authorization
 * })
 *
 * // Sign custom messages
 * const currentUser = fcl.getCurrentUser({ platform: "web" })
 *
 * const message = Buffer.from("Hello, Flow!").toString("hex")
 * const signatures = await currentUser.signUserMessage(message)
 *
 * console.log("Message signatures:", signatures)
 */
const getCurrentUser = (cfg: CurrentUserConfig): CurrentUserService => {
  const partialContext = createPartialGlobalFCLContext()

  // Wrapper for backwards compatibility
  const getStorageProvider = async (): Promise<StorageProvider> => {
    if (cfg.getStorageProvider) return await cfg.getStorageProvider()
    return (await config.first(
      ["fcl.storage", "fcl.storage.default"],
      undefined
    )) as any
  }

  return _createUser({
    ...partialContext,
    getStorageProvider,
    platform: cfg.platform,
    actorName: NAME,
    discovery: cfg.discovery,
  })
}

export {createUser, getCurrentUser}
