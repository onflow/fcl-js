import {config} from "@onflow/config"

/**
 * @description Extracts configuration values that match a given regular expression pattern from the Flow configuration.
 * This utility function filters the configuration entries using the provided regex pattern and returns a simplified
 * object with the matching keys (with the regex pattern removed) and their corresponding values.
 *
 * @param regex Regular expression pattern to filter configuration keys. The matched portion will be removed from the resulting keys
 * @returns Promise that resolves to an object containing the filtered configuration entries with simplified keys
 *
 * @example
 * // Extract all configuration keys starting with "accessNode"
 * const accessNodeConfig = await configLens(/^accessNode\./)
 * // If config has "accessNode.api" = "https://rest-mainnet.onflow.org"
 * // Result: { "api": "https://rest-mainnet.onflow.org" }
 *
 * // Extract wallet-related configuration
 * const walletConfig = await configLens(/^wallet\./)
 * // Filters keys like "wallet.discovery.api" and returns simplified object
 */
export async function configLens(regex: RegExp): Promise<Record<string, any>> {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}
