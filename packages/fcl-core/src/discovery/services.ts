import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {getServiceRegistry} from "../current-user/exec-service/plugins"
import {getChainId} from "../utils"
import {VERSION} from "../VERSION"
import {makeDiscoveryServices} from "./utils"
import {URL} from "../utils/url"
import {Service} from "@onflow/typedefs"

export interface GetServicesParams {
  types: string[]
}

export interface DiscoveryRequestBody {
  type: string[]
  fclVersion: string
  include: string[]
  exclude: string[]
  features: {
    suggested: string[]
  }
  clientServices: Service[]
  supportedStrategies: string[]
  userAgent?: string
  network: string
}

export async function getServices({
  types,
}: GetServicesParams): Promise<Service[]> {
  const endpoint = await config.get("discovery.authn.endpoint")
  invariant(
    Boolean(endpoint),
    `"discovery.authn.endpoint" in config must be defined.`
  )

  const include = await config.get("discovery.authn.include", [])
  const exclude = await config.get("discovery.authn.exclude", [])
  const url = new URL(endpoint)

  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: types,
      fclVersion: VERSION,
      include,
      exclude,
      features: {
        suggested: await config.get("discovery.features.suggested", []),
      },
      clientServices: await makeDiscoveryServices(),
      supportedStrategies: getServiceRegistry().getStrategies(),
      userAgent: window?.navigator?.userAgent,
      network: await getChainId(),
    } as DiscoveryRequestBody),
  }).then(d => d.json())
}
