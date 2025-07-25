import {invariant} from "@onflow/util-invariant"
import {getServiceRegistry} from "../current-user/exec-service/plugins"
import {getChainId} from "../utils"
import {VERSION} from "../VERSION"
import {makeDiscoveryServices} from "./utils"
import {URL} from "../utils/url"
import {Service} from "@onflow/typedefs"
import {FCLContext} from "../context"

export interface GetServicesParams {
  types: string[]
  context: Pick<FCLContext, "config">
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

/**
 * @description Fetches available wallet services from the discovery endpoint based on the
 * requested service types. This function queries the FCL discovery service to find compatible
 * wallet providers that support the specified service types.
 *
 * @param params Object containing the types of services to discover
 * @returns Promise resolving to an array of Service objects from the discovery endpoint
 *
 * @example
 * // Discover authentication services
 * const services = await getServices({ types: ["authn"] })
 * console.log(services) // Array of available wallet authentication services
 */
export async function getServices({
  context,
  types,
}: GetServicesParams): Promise<Service[]> {
  const endpoint = await context.config.get("discovery.authn.endpoint")
  invariant(
    Boolean(endpoint),
    `"discovery.authn.endpoint" in config must be defined.`
  )

  const include = await context.config.get("discovery.authn.include", [])
  const exclude = await context.config.get("discovery.authn.exclude", [])
  const url = new URL(endpoint as string)

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
        suggested: await context.config.get("discovery.features.suggested", []),
      },
      clientServices: await makeDiscoveryServices(),
      supportedStrategies: getServiceRegistry().getStrategies(),
      userAgent: window?.navigator?.userAgent,
      network: await getChainId(),
    } as DiscoveryRequestBody),
  }).then(d => d.json())
}
