import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {getServiceRegistry} from "../current-user/exec-service/plugins"
import {Service} from "@onflow/typedefs"
import {FCLContext} from "../context"

export interface DiscoveryService extends Service {
  discoveryAuthnInclude: string[]
  discoveryAuthnExclude: string[]
  discoveryFeaturesSuggested: string[]
}

/**
 * @description Creates an array of discovery services by combining extension services from the
 * window object with registered services from the service registry. This is used internally
 * by FCL to gather all available wallet and authentication services.
 *
 * @returns Promise that resolves to an array of available services
 *
 * @example
 * // Get all available discovery services
 * const services = await makeDiscoveryServices()
 * console.log(services.length) // Number of available services
 * services.forEach(service => {
 *   console.log(`Service: ${service.provider?.name}, Type: ${service.type}`)
 * })
 */
export const makeDiscoveryServices = async (): Promise<Service[]> => {
  const extensionServices = ((window as any)?.fcl_extensions || []) as Service[]
  return [
    ...extensionServices,
    ...(getServiceRegistry().getServices() as Service[]),
  ]
}

/**
 * @description Creates and configures a discovery service object used for wallet authentication.
 * This function combines the provided service configuration with discovery-related settings from
 * the FCL configuration to create a complete service definition for wallet authentication flows.
 *
 * @param context FCL context containing configuration and SDK
 * @param service Optional partial service configuration to override defaults
 * @param service.method Optional communication method for the service
 * @param service.endpoint Optional endpoint URL for the service
 * @returns Promise that resolves to a complete discovery service configuration
 * @throws Error if required configuration values are missing
 *
 * @example
 * // Get discovery service with default configuration
 * const discoveryService = await getDiscoveryService(context)
 * console.log(discoveryService.endpoint) // Configured discovery endpoint
 *
 * // Override discovery service endpoint
 * const customService = await getDiscoveryService(context, {
 *   endpoint: "https://wallet.example.com/authn",
 *   method: "HTTP/POST"
 * })
 *
 * // Use with custom wallet service
 * const walletService = await getDiscoveryService(context, {
 *   endpoint: "https://my-wallet.com/fcl",
 *   provider: {
 *     name: "My Wallet",
 *     icon: "https://my-wallet.com/icon.png"
 *   }
 * })
 */
export async function getDiscoveryService(
  context: Pick<FCLContext, "config">,
  service?: Partial<Service>
): Promise<DiscoveryService> {
  const discoveryAuthnInclude = (await context.config.get(
    "discovery.authn.include",
    []
  )) as string[]
  const discoveryAuthnExclude = (await context.config.get(
    "discovery.authn.exclude",
    []
  )) as string[]
  const discoveryFeaturesSuggested = (await context.config.get(
    "discovery.features.suggested",
    []
  )) as string[]
  const discoveryWalletMethod = await context.config.first(
    ["discovery.wallet.method", "discovery.wallet.method.default"],
    undefined
  )
  const method = service?.method ? service.method : discoveryWalletMethod
  const endpoint =
    service?.endpoint ??
    (await context.config.first(
      ["discovery.wallet", "challenge.handshake"],
      undefined
    ))

  invariant(
    endpoint as any,
    `
    If no service is passed to "authenticate," then "discovery.wallet" must be defined in fcl config.
    See: "https://docs.onflow.org/fcl/reference/api/#setting-configuration-values"
    `
  )

  return {
    ...service,
    type: "authn",
    endpoint,
    method,
    discoveryAuthnInclude,
    discoveryAuthnExclude,
    discoveryFeaturesSuggested,
  } as DiscoveryService
}
