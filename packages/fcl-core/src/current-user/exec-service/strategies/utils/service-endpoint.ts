import {URL} from "../../../../utils/url"
import {Service} from "@onflow/typedefs"

/**
 * @description Creates a URL object from a service endpoint with additional parameters including
 * the application origin and service-specific parameters. This function is used internally by
 * FCL strategies to construct the complete URL for service communication.
 *
 * @param service The service object containing endpoint and optional parameters
 * @returns URL object with all parameters appended as query string parameters
 *
 * @example
 * // Create URL from service
 * const service = {
 *   endpoint: "https://wallet.example.com/authn",
 *   params: {
 *     appName: "MyApp",
 *     nonce: "abc123"
 *   }
 * }
 * const url = serviceEndpoint(service)
 * console.log(url.toString())
 * // https://wallet.example.com/authn?l6n=https://myapp.com&appName=MyApp&nonce=abc123
 */
export function serviceEndpoint(service: Service): URL {
  const url = new URL(service.endpoint)
  if (window?.location?.origin) {
    url.searchParams.append("l6n", window.location.origin)
  }
  if (service.params != null) {
    for (let [key, value] of Object.entries(service.params || {})) {
      url.searchParams.append(key, value)
    }
  }
  return url
}
