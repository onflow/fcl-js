declare module "@onflow/fcl" {
  export type Environment = "local" | "canarynet" | "testnet" | "mainnet";

  type AccountProofData = {
    // e.g. "Awesome App (v0.0)" - A human readable string to identify your application during signing
    appIdentifier: string;
    // e.g. "75f8587e5bd5f9dcc9909d0dae1f0ac5814458b2ae129620502cb936fde7120a" - minimum 32-byte random nonce as hex string
    nonce: string;
  };
  type AccountProofDataResolver = () => Promise<AccountProofData | null>;

  /**
   * @see {@link https://docs.onflow.org/fcl/reference/api/#common-configuration-keys}
   * @see {@link https://docs.onflow.org/fcl/reference/configure-fcl/}
   */
  export interface ConfigurationOptions {
    /**
     * API URL for the Flow Blockchain Access Node you want to be communicating
     * with. See all available access node endpoints
     * [here]{@link https://docs.onflow.org/access-api/#flow-access-node-endpoints}.
     * @example "https://rest-testnet.onflow.org"
     */
    "accessNode.api": string;
    /**
     * Your applications title, can be requested by wallets and other services.
     * @example "Cryptokitties"
     */
    "app.detail.title"?: string;
    /**
    * Url for your applications icon, can be requested by wallets and other
    * services.
    * @example "https://fcl-discovery.onflow.org/images/blocto.png"
    */
    "app.detail.icon"?: string;
    /**
     * Points FCL at the Wallet or Wallet Discovery mechanism.
     * @deprecated Use `discovery.wallet` instead.
     */
    "challenge.handshake"?: string;
    /**
     * Endpoint for alternative configurable Wallet Discovery mechanism.
     * Read more on [discovery]{@link https://docs.onflow.org/fcl/reference/api/#discovery}
     * @example "https://fcl-discovery.onflow.org/api/testnet/authn"
     */
    "discovery.authn.endpoint"?: string;
    /**
     * Points FCL at the Wallet or Wallet Discovery mechanism.
     * @example "https://fcl-discovery.onflow.org/testnet/authn"
     */
    "discovery.wallet": string;
    /**
     * Used in conjunction with stored interactions.
     * @deprecated
     */
    env?: Environment;
    /**
     * Specifies fallback compute limit if not provided in transaction.
     * @example 100
     */
    "fcl.limit"?: number;
    /**
     * Used in conjunction with stored interactions and provides 
     * FCLCryptoContract address for `testnet` and `mainnet`.
     */
    "flow.network"?: Environment;
    // TODO: these options are not documented; are there more?
    "discovery.wallet.method"?: string;
    "fcl.accountProof.resolver"?: AccountProofDataResolver;
    "service.OpenID.scopes"?: string
  }

  export interface Configuration {
    /**
     * Set a configuration value.
     *
     * @param key - The key of the value to set.
     * May start with `'0x'`.
     * Configuration keys that start with `'0x'` will be replaced in FCL scripts
     * and transactions, this allows you to write your script or transaction
     * Cadence code once and not have to change it when you point your
     * application at a difference instance of the Flow Blockchain.
     * @param value - The value to set.
     */
    put(key: keyof ConfigurationOptions | string, value: string | number): Configuration;
    /**
     * Get a configuration value.
     *
     * @param key - The key of the value to get.
     * @param fallback - An optional fallback value to return in case the value
     * was not set.
     */
    get(key: string, fallback?: string | number): Promise<string | number | undefined>;
    // TODO: all
    // TODO: first
    // TODO: update
    // TODO: delete
    // TODO: where
    // TODO: subscribe
    // TODO: overload
  }

  /**
   * FCL has a mechanism that lets you configure various aspects of FCL. The
   * main idea here (from an FCL perspective) should be that when you move from
   * one instance of the Flow Blockchain to another (Local Emulator to Testnet
   * to Mainnet) the only thing you should need to change (once again from an
   * FCL perspective) is your configuration.
   *
   * ```typescript
   * import * as fcl from "@onflow/fcl"
   *
   * const configuration = fcl.config({
   *   "accessNode.api": "https://access-testnet.onflow.org",
   *   "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
   *   "0xProfile": "0xba1132bc08f82fe2"
   * });
   *
   * configuration.put('foo', 'bar');
   * configuration.get('foo').then(console.log); // ↵ "bar"
   * ```
   *
   * @param options - The initial configuration values.
   */
  export function config(options?: ConfigurationOptions): Configuration;
}
