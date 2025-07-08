import {URL} from "../utils/url"
import {Service} from "@onflow/typedefs"

/**
 * @description Fetches additional services from a remote endpoint using an authorization code.
 * This function handles both modern service arrays and legacy wallet provider formats for
 * backward compatibility.
 *
 * @param servicesURL The URL endpoint to fetch services from
 * @param code The authorization code to include in the request
 * @returns Promise resolving to an array of Service objects
 *
 * @example
 * // Fetch services from a wallet provider
 * const services = await fetchServices(
 *   "https://wallet.example.com/services",
 *   "auth_code_123"
 * )
 */
export async function fetchServices(
  servicesURL: string | null,
  code: string | null
): Promise<Service[]> {
  if (servicesURL == null || code == null) return []

  const url = new URL(servicesURL)
  url.searchParams.append("code", code)

  const resp: any = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(d => d.json())

  if (Array.isArray(resp)) return resp

  // Backwards compatibility for First-Gen Wallet Providers
  const services: Service[] = []

  // Convert authorizations into authz services
  if (Array.isArray(resp.authorizations)) {
    for (let service of resp.authorizations) {
      services.push({
        type: "authz",
        keyId: resp.keyId,
        ...service,
      })
    }
  }

  // Convert Provider info into an authn service
  if (resp.provider != null) {
    services.push({
      type: "authn",
      id: "wallet-provider#authn",
      ...resp.provider,
    })
  }

  return services
}
