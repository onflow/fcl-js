import {config} from "@onflow/config"
import {SdkContext} from "./context"
import {getGlobalTransport} from "./get-global-transport"
import {invariant} from "@onflow/util-invariant"
import {log} from "@onflow/util-logger"

const DEFAULT_COMPUTE_LIMIT = 10

let cachedContext: Promise<SdkContext> | undefined

export async function createGlobalContext(): Promise<SdkContext> {
  const globalConfig = await config().all()

  return {
    get transport() {
      return getGlobalTransport(globalConfig)
    },
    get accessNodeUrl() {
      const accessNodeUrl = globalConfig["accessNode.api"] as string | undefined
      invariant(
        !!accessNodeUrl,
        `Either opts.node or "accessNode.api" in config must be defined.`
      )
      return accessNodeUrl
    },
    get computeLimit() {
      const computeLimit = globalConfig["fcl.limit"] as number | undefined
      if (!computeLimit) {
        log.deprecate({
          pkg: "FCL/SDK",
          subject:
            "The built-in default compute limit (DEFAULT_COMPUTE_LIMIT=10)",
          transition:
            "https://github.com/onflow/flow-js-sdk/blob/master/packages/sdk/TRANSITIONS.md#0009-deprecate-default-compute-limit",
        })
        return DEFAULT_COMPUTE_LIMIT
      }
      return computeLimit
    },
    get customResolver() {
      const customResolver = globalConfig["sdk.resolve"] as
        | ((args: any) => Promise<any>)
        | undefined
      return customResolver
    },
    get customDecoders() {
      return Object.fromEntries(
        Object.entries(globalConfig).filter(([key]) =>
          key.startsWith("decoder.")
        )
      ) as Record<string, (data: any) => any>
    },
    get contracts() {
      return Object.fromEntries(
        Object.entries(globalConfig)
          .filter(([key]) => key.startsWith("system.contracts."))
          .map(([key, value]) => [key.replace("system.contracts.", ""), value])
      ) as Record<string, string>
    },
    get debug() {
      return Object.fromEntries(
        Object.entries(globalConfig).filter(([key]) => key.startsWith("debug."))
      )
    },
    get legacyContractIdentifiers() {
      return Object.fromEntries(
        Object.entries(globalConfig).filter(([key]) => key.startsWith("0x"))
      ) as Record<string, string>
    },
  }
}

export async function getGlobalContext(): Promise<SdkContext> {
  if (!cachedContext) {
    // Watch for changes in the config and recreate the context if needed
    config().subscribe(() => {
      cachedContext = createGlobalContext()
    })

    // Create the context for the first time
    cachedContext = createGlobalContext()
  }
  return cachedContext instanceof Promise ? cachedContext : cachedContext
}

export function withGlobalContext<
  T extends (context: SdkContext) => (...args: any[]) => Promise<any>,
>(
  fn: T
): (
  ...args: Parameters<ReturnType<T>>
) => Promise<Awaited<ReturnType<ReturnType<T>>>> {
  return async (
    ...args: Parameters<ReturnType<T>>
  ): Promise<Awaited<ReturnType<ReturnType<T>>>> => {
    const context = await getGlobalContext()
    return fn(context)(...args)
  }
}
