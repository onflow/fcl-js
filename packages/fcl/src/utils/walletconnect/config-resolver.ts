import {isServer} from "./util"
import {request, createSessionProposal} from "@onflow/fcl-wc"

function isObject(item: any): boolean {
  return item !== null && typeof item === "object" && !Array.isArray(item)
}

function deepMerge<T extends object>(
  target: T,
  ...sources: Array<Partial<T>>
): T {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const sourceValue = source[key]
        if (isObject(sourceValue) && isObject(target[key])) {
          target[key] = deepMerge(target[key] as any, sourceValue as any)
        } else {
          ;(target as any)[key] = sourceValue
        }
      }
    }
  }
  return deepMerge(target, ...sources)
}

export function discoveryConfigResolver() {
  // Guard against SSR
  if (isServer) {
    return (config: any) => config
  }

  //TODO: should this really block discovery?
  const walletConnectUri = "https://walletconnect.org/walletconnect/v1"

  return async (config: any) => {
    // Wait for next tick to try to prevent race conditions
    await new Promise(resolve => setTimeout(resolve, 0))

    const walletConnectConfig = {}

    return deepMerge({
      client: {},
    })
  }
}
