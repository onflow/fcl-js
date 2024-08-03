import fclCore from "@onflow/fcl-core"
import {FLOW_METHODS} from "./constants"
import {SignClient} from "@walletconnect/sign-client/dist/types/client"
import {PairingTypes, SessionTypes} from "@walletconnect/types"
import {LEVELS, log} from "@onflow/util-logger"

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
  cleanup,
}: {
  method: any
  body: any
  session: SessionTypes.Struct
  client: SignClient
  cleanup: any
}) =>
  new Promise(async (resolve, reject) => {
    const [chainId, addr, address] = makeSessionData(session)
    const data = JSON.stringify({...body, addr, address})

    const result = await client.request({
      topic: session.topic,
      chainId,
      request: {
        method,
        params: [data],
      },
    })
    onResponse(result)

    function onResponse(resp: any) {
      try {
        if (typeof resp !== "object") return

        switch (resp.status) {
          case "APPROVED":
            resolve(resp.data)
            break

          case "DECLINED":
            reject(`Declined: ${resp.reason || "No reason supplied"}`)
            break

          case "REDIRECT":
            resolve(resp)
            break

          default:
            reject(`Declined: No reason supplied`)
            break
        }
      } catch (error) {
        if (error instanceof Error) {
          log({
            title: `${error.name} "WC/RPC onResponse error"`,
            message: error.message,
            level: LEVELS.error,
          })
        }
        throw error
      }
    }
  })
    .catch(error => {
      if (error instanceof Error) {
        log({
          title: `${error.name} Error on WalletConnect client ${method} request`,
          message: error.message,
          level: LEVELS.error,
        })
      }
      throw error
    })
    .finally(() => {
      cleanup?.()
    })

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
