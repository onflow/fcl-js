import {Service} from "@onflow/typedefs"

/**
 * @description Merges two arrays of services into a single array. This is a simple concatenation
 * operation used internally by FCL to combine service arrays from different sources.
 * The function handles undefined/null inputs gracefully by treating them as empty arrays.
 *
 * @param sx1 First array of services to merge
 * @param sx2 Second array of services to merge
 * @returns Combined array containing all services from both input arrays
 *
 * @example
 * // Merge wallet services with discovery services
 * const walletServices = [
 *   { type: "authn", endpoint: "wallet1.com" },
 *   { type: "authz", endpoint: "wallet1.com" }
 * ]
 * const discoveryServices = [
 *   { type: "authn", endpoint: "wallet2.com" }
 * ]
 * const allServices = mergeServices(walletServices, discoveryServices)
 */
export function mergeServices(
  sx1: Service[] = [],
  sx2: Service[] = []
): Service[] {
  // TODO: Make this smarter
  return [...sx1, ...sx2]
}
