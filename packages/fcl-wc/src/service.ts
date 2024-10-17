import {invariant} from "@onflow/util-invariant"
import {log, LEVELS} from "@onflow/util-logger"
import {isMobile, openDeeplink} from "./utils"
import {FLOW_METHODS, REQUEST_TYPES} from "./constants"
import {SignClient} from "@walletconnect/sign-client/dist/types/client"
import {createSessionProposal, makeSessionData, request} from "./session"
import {withConfirmationPrompt} from "./ui/util/with-confirmation-prompt"

type WalletConnectModalType =
  typeof import("@walletconnect/modal").WalletConnectModal

export const SERVICE_PLUGIN_NAME = "fcl-plugin-service-walletconnect"
export const WC_SERVICE_METHOD = "WC/RPC"

export const makeServicePlugin = (
  client: Promise<SignClient | null>,
  opts: {
    projectId: string
    includeBaseWC: boolean
    wallets: any[]
    wcRequestHook: any
    pairingModalOverride: any
  } = {
    projectId: "",
    includeBaseWC: false,
    wallets: [],
    wcRequestHook: null,
    pairingModalOverride: null,
  }
) => ({
  name: SERVICE_PLUGIN_NAME,
  f_type: "ServicePlugin",
  type: "discovery-service",
  serviceStrategy: {
    method: WC_SERVICE_METHOD,
    exec: makeExec(
      client,
      opts,
      import("@walletconnect/modal").then(m => m.WalletConnectModal)
    ),
  },
  services: [],
})

const makeExec = (
  clientPromise: Promise<SignClient | null>,
  {wcRequestHook, pairingModalOverride}: any,
  WalletConnectModal: Promise<WalletConnectModalType>
) => {
  const exec = async ({
    service,
    body,
    opts,
    abortSignal,
  }: {
    service: any
    body: any
    opts: any
    abortSignal?: AbortSignal
  }) => {
    const client = await clientPromise
    invariant(!!client, "WalletConnect is not initialized")

    let session: any, pairing: any
    const method = service.endpoint
    const appLink = validateAppLink(service)
    const pairings = client.pairing.getAll({active: true})

    if (pairings.length > 0) {
      pairing = pairings?.find(p => p.peerMetadata?.url === service.uid)
    }

    if (client.session.length > 0) {
      const lastKeyIndex = client.session.keys.length - 1
      session = client.session.get(client.session.keys.at(lastKeyIndex)!)
    }

    if (session == null) {
      session = await new Promise((resolve, reject) => {
        function onClose() {
          reject(`Declined: Externally Halted`)
        }

        connectWc(WalletConnectModal)({
          service,
          onClose,
          appLink,
          client,
          method,
          pairing,
          wcRequestHook,
          pairingModalOverride,
          abortSignal,
        }).then(resolve, reject)
      })
    }

    if (wcRequestHook && wcRequestHook instanceof Function) {
      wcRequestHook({
        type: REQUEST_TYPES.SIGNING_REQUEST,
        method,
        service,
        session: session ?? null,
        pairing: pairing ?? null,
        uri: null,
      })
    }

    if (
      isMobile() &&
      method !== FLOW_METHODS.FLOW_AUTHN &&
      method !== FLOW_METHODS.FLOW_AUTHZ
    ) {
      openDeeplink(appLink)
    }

    // Make request to the WalletConnect client and return the result
    const res = await request({
      method,
      body,
      session,
      client,
      abortSignal,
    })

    if (method === FLOW_METHODS.FLOW_AUTHN) {
      // Patch to rewrite all service uid's to match the authn service uid
      res?.services?.forEach((srv: any) => {
        srv.uid = service.uid
      })
    }

    return res

    function validateAppLink({uid}: {uid: string}) {
      if (!(uid && /^(ftp|http|https):\/\/[^ "]+$/.test(uid))) {
        log({
          title: "WalletConnect Service Warning",
          message: `service.uid should be a valid universal link url. Found: ${uid}`,
          level: LEVELS.warn,
        })
      }
      return uid
    }
  }

  return async ({service, body, opts, abortSignal, user}: any) => {
    return await withConfirmationPrompt(user, async signal => {
      const combinedAbortSignal = new AbortController()
      signal.addEventListener("abort", () => {
        combinedAbortSignal.abort(signal.reason)
      })
      abortSignal?.addEventListener("abort", () => {
        combinedAbortSignal.abort(abortSignal?.reason)
      })

      return await exec({
        service,
        body,
        opts,
        abortSignal: combinedAbortSignal.signal,
      })
    })
  }
}

// Connect to WalletConnect directly from the browser via deep link or WalletConnectModal
function connectWc(WalletConnectModal: Promise<WalletConnectModalType>) {
  return async ({
    service,
    onClose,
    appLink,
    client,
    method,
    pairing,
    wcRequestHook,
    pairingModalOverride,
    abortSignal,
  }: {
    service: any
    onClose: any
    appLink: string
    client: SignClient
    method: string
    pairing: any
    wcRequestHook: any
    pairingModalOverride: any
    abortSignal?: AbortSignal
  }) => {
    const projectId = client.opts?.projectId
    invariant(
      !!projectId,
      "Cannot establish connection, WalletConnect projectId is undefined"
    )

    let _uri: string | null = null,
      walletConnectModal: any

    try {
      const {uri, approval} = await createSessionProposal({
        client,
        existingPairing: pairing,
      })
      _uri = uri

      if (wcRequestHook && wcRequestHook instanceof Function) {
        wcRequestHook({
          type: REQUEST_TYPES.SESSION_REQUEST,
          method,
          service,
          session: null,
          pairing: pairing ?? null,
          uri: uri ?? null,
        })
      }

      if (isMobile()) {
        const queryString = new URLSearchParams({uri: uri}).toString()
        let url = pairing == null ? appLink + "?" + queryString : appLink
        openDeeplink(url)
      } else if (!pairing) {
        if (!pairingModalOverride) {
          walletConnectModal = new (await WalletConnectModal)({
            projectId,
            walletConnectVersion: 2,
          })
          walletConnectModal.openModal({uri, onClose})
        } else {
          pairingModalOverride(uri, onClose)
        }
      }

      const session = await Promise.race([
        approval(),
        new Promise((_, reject) => {
          if (abortSignal?.aborted) {
            reject(new Error("Session request aborted"))
          }
          abortSignal?.addEventListener("abort", () => {
            reject(new Error("Session request aborted"))
          })
        }),
      ])
      return session
    } catch (error) {
      if (error instanceof Error) {
        log({
          title: `${error.name} Error establishing WalletConnect session`,
          message: `
          ${error.message}
          uri: ${_uri}
        `,
          level: LEVELS.error,
        })
      }
      onClose()
      throw error
    } finally {
      walletConnectModal?.closeModal()
    }
  }
}
