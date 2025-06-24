import type {Service} from "@onflow/typedefs"

/**
 * @description Injects an external authentication service into the global FCL extensions array.
 * This function is used by wallet providers to register their authentication services with FCL,
 * making them available for user authentication. The service must be of type "authn" and have
 * a valid endpoint.
 *
 * @param service The authentication service to inject. Must have type "authn" and a valid endpoint
 *
 * @example
 * // Register a wallet authentication service
 * const walletService = {
 *   type: "authn",
 *   endpoint: "https://example-wallet.com/fcl/authn",
 *   method: "HTTP/POST",
 *   identity: { address: "0x123..." },
 *   provider: { name: "Example Wallet" }
 * }
 * fcl.WalletUtils.injectExtService(walletService)
 */
export function injectExtService(service: Service): void {
  if (service.type === "authn" && service.endpoint != null) {
    if (!Array.isArray((window as any).fcl_extensions)) {
      ;(window as any).fcl_extensions = []
    }
    ;(window as any).fcl_extensions.push(service)
  } else {
    console.warn("Authn service is required")
  }
}
