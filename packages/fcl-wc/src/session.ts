import * as fclCore from "@onflow/fcl-core"
import {FLOW_METHODS} from "./constants"
import {SignClient} from "@walletconnect/sign-client/dist/types/client"
import {PairingTypes, SessionTypes} from "@walletconnect/types"

// Create a new session proposal with the WalletConnect client
export async function createSessionProposal({
  client,
  existingPairing,
}: {
  client: SignClient
  existingPairing?: PairingTypes.Struct
}) {
  const network = await fclCore.getChainId()

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

  const {uri, approval} = await client.connect({
    pairingTopic: existingPairing?.topic,
    requiredNamespaces,
  })

  if (!uri) {
    throw new Error(
      "FCL-WC: Error creating session proposal. Could not create a proposal URI."
    )
  }

  return {uri, approval}
}

export const request = async ({
  method,
  body,
  session,
  client,
  abortSignal,
}: {
  method: any
  body: any
  session: SessionTypes.Struct
  client: SignClient
  abortSignal?: AbortSignal
}) => {
  const [chainId, addr, address] = makeSessionData(session)
  const data = JSON.stringify({...body, addr, address})

  const result: any = await Promise.race([
    client.request({
      topic: session.topic,
      chainId,
      request: {
        method,
        params: [data],
      },
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
