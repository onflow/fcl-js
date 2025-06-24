import {URL} from "../utils/url"
import {Service} from "@onflow/typedefs"

/**
 * @description Creates a URL object from a service endpoint, optionally including service parameters
 * as query string parameters. This is used internally by FCL to construct URLs for service endpoints
 * with their associated parameters.
 *
 * @param service The service object containing endpoint and optional parameters
 * @param includeParams Whether to include service parameters as URL query parameters
 * @returns URL object constructed from the service endpoint and parameters
 *
 * @example
 * // Create URL with parameters
 * const service = {
 *   endpoint: "https://wallet.example.com/authn",
 *   params: {
 *     appIdentifier: "MyApp",
 *     nonce: "abc123"
 *   }
 * }
 * const url = urlFromService(service, true)
 * console.log(url.toString())
 * // "https://wallet.example.com/authn?appIdentifier=MyApp&nonce=abc123"
 */
export function urlFromService(
  service: Service,
  includeParams: boolean = true
): URL {
  const url = new URL(service.endpoint)
  if (includeParams) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  return url
}
