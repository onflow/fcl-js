import {config} from "@onflow/config"
import {invariant} from "@onflow/util-invariant"
import {getServiceRegistry} from "../current-user/exec-service/plugins"
import {Service} from "@onflow/typedefs"

export interface DiscoveryService extends Service {
  discoveryAuthnInclude: string[]
  discoveryAuthnExclude: string[]
  discoveryFeaturesSuggested: string[]
}

export const makeDiscoveryServices = async (): Promise<Service[]> => {
  const extensionServices = ((window as any)?.fcl_extensions || []) as Service[]
  return [
    ...extensionServices,
    ...(getServiceRegistry().getServices() as Service[]),
  ]
}

export async function getDiscoveryService(
  service?: Partial<Service>
): Promise<DiscoveryService> {
  const discoveryAuthnInclude = (await config.get(
    "discovery.authn.include",
    []
  )) as string[]
  const discoveryAuthnExclude = (await config.get(
    "discovery.authn.exclude",
    []
  )) as string[]
  const discoveryFeaturesSuggested = (await config.get(
    "discovery.features.suggested",
    []
  )) as string[]
  const discoveryWalletMethod = await config.first(
    ["discovery.wallet.method", "discovery.wallet.method.default"],
    undefined
  )
  const method = service?.method ? service.method : discoveryWalletMethod
  const endpoint =
    service?.endpoint ??
    (await config.first(["discovery.wallet", "challenge.handshake"], undefined))

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
