import {execStrategy} from "@onflow/fcl-core"

export async function execDiscovery({
  customRpc,
  opts,
  args,
  abortSignal,
}: {
  customRpc: any
  opts: any
  args: any
  abortSignal: any
}) {
  // Update the discovery config to enable RPC support
  const discoveryConfig = {
    ...opts.config,
    client: {
      ...opts.config.client,
      discoveryRpcEnabled: true,
    },
  }

  // Execute base discovery request
  return execStrategy(
    {
      ...opts,
      config: discoveryConfig,
      customRpc,
      abortSignal,
    },
    // @ts-ignore - Pass the rest of the arguments (protect against future changes)
    ...args.slice(1)
  )
}
