import * as fclCore from "@onflow/fcl-core"
import {FLOW_METHODS} from "./constants"
import {PairingTypes, SessionTypes} from "@walletconnect/types"
import {UniversalProvider} from "@walletconnect/universal-provider"

// Create a new session proposal with the WalletConnect client
export async function createSessionProposal({
  signer,
  existingPairing,
}: {
  signer: InstanceType<typeof UniversalProvider>
  existingPairing?: PairingTypes.Struct
}) {
  const network = await fclCore.getChainId()

  // TODO: update
  const requiredNamespaces = {
    flow: {
      methods: [
        FLOW_METHODS.FLOW_AUTHN,
        FLOW_METHODS.FLOW_PRE_AUTHZ,
        FLOW_METHODS.FLOW_AUTHZ,
        FLOW_METHODS.FLOW_USER_SIGN,
      ],
      chains: [`flow:${network}`],
      events: ["chainChanged", "accountsChanged"],
    },
  }

  let cleanup: () => void
  const uri = new Promise<string>((resolve, reject) => {
    const onDisplayUri = (uri: string) => {
      resolve(uri)
    }
    signer.on("display_uri", onDisplayUri)
    cleanup = () => {
      signer.removeListener("display_uri", onDisplayUri)
      reject(new Error("WalletConnect Session Request aborted"))
    }
  })

  const session = await signer
    .connect({
      pairingTopic: existingPairing?.topic,
      namespaces: requiredNamespaces,
    })
    .finally(() => {
      cleanup()
    })

  return {
    uri: await uri,
    approval: () => session,
  }
}

export const request = async ({
  method,
  body,
  session,
  signer,
  abortSignal,
}: {
  method: any
  body: any
  session: SessionTypes.Struct
  signer: InstanceType<typeof UniversalProvider>
  abortSignal?: AbortSignal
}) => {
  const [chainId, addr, address] = makeSessionData(session)
  const data = JSON.stringify({...body, addr, address})

  const result: any = await Promise.race([
    signer.client.request({
      request: {
        method,
        params: [data],
      },
      chainId,
      topic: signer.session?.topic!,
    }),
    new Promise((_, reject) => {
      if (abortSignal?.aborted) {
        reject(new Error("WalletConnect Request aborted"))
      }
      abortSignal?.addEventListener("abort", () => {
        reject(new Error("WalletConnect Request aborted"))
      })
    }),
  ])

  if (typeof result !== "object" || result == null) return

  switch (result.status) {
    case "APPROVED":
      return result.data

    case "DECLINED":
      throw new Error(`Declined: ${result.reason || "No reason supplied"}`)

    case "REDIRECT":
      return result.data

    default:
      throw new Error(`Declined: No reason supplied`)
  }
}

export function makeSessionData(session: SessionTypes.Struct) {
  const [namespace, reference, address] = Object.values<any>(session.namespaces)
    .map(namespace => namespace.accounts)
    .flat()
    .filter(account => account.startsWith("flow:"))[0]
    .split(":")

  const chainId = `${namespace}:${reference}`
  const addr = address
  return [chainId, addr, address]
}
