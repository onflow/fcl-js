declare module '@onflow/fcl' {
  type EventObject = {
    /**
     * A string containing the event name. A event name in Flow must follow the
     * format `A.{AccountAddress}.{ContractName}.{EventName}` eg.
     * `A.ba1132bc08f82fe2.Debug.Log`.
     */
    type: string;
    /**
     * Can be used to query transaction information, eg. via a Flow block
     * explorer.
     */
    transactionId: string;
    /**
     * Used to prevent replay attacks.
     */
    transactionIndex: number;
    /**
     * Used to prevent replay attacks.
     */
    eventIndex: number;
    /**
     * The data emitted from the event.
     */
    data: Record<string, unknown>;
  };

  type Status =
    /**
     * Unknown
     */
    | 0
    /**
     * Transaction Pending - Awaiting Finalization
     */
    | 1
    /**
     * Transaction Finalized - Awaiting Execution
     */
    | 2
    /**
     * Transaction Executed - Awaiting Sealing
     */
    | 3
    /**
     * Transaction Sealed - Transaction Complete. At this point the transaction
     * result has been committed to the blockchain.
     */
    | 4
    /**
     * Transaction Expired
     */
    | 5;

  type GRPCStatus =
    /**
     * OK - Not an error; returned on success.
     */
    | 0
    /**
     * CANCELLED - 	The operation was cancelled, typically by the caller.
     */
    | 1
    /**
     * UNKNOWN - Unknown error. For example, this error may be returned when a
     * Status value received from another address space belongs to an error
     * space that is not known in this address space. Also errors raised by APIs
     * that do  not return enough error information may be converted to this
     * error.
     */
    | 2
    /**
     * INVALID_ARGUMENT - The client specified an invalid argument. Note that
     * this differs from FAILED_PRECONDITION. INVALID_ARGUMENT indicates
     * arguments that are problematic regardless of the state of the system
     * (e.g., a malformed file name).
     */
    | 3
    /**
     * DEADLINE_EXCEEDED - The deadline expired before the operation could
     * complete. For operations that change the state of the system, this error
     * may be returned even if the operation has completed successfully. For
     * example, a successful response from a server could have been delayed
     * long.
     */
    | 4
    /**
     * NOT_FOUND - Some requested entity (e.g., file or directory) was not
     * found. Note to server developers: if a request is denied for an entire
     * class of users, such as gradual feature rollout or undocumented
     * allowlist, NOT_FOUND may be used. If a request is denied for some users
     * within a class of users, such as user-based access control,
     * PERMISSION_DENIED must be used.
     */
    | 5
    /**
     * ALREADY_EXISTS - The entity that a client attempted to create (e.g., file
     * or directory) already exists.
     */
    | 6
    /**
     * PERMISSION_DENIED - The caller does not have permission to execute the
     * specified operation. PERMISSION_DENIED must not be used for rejections
     * caused by exhausting some resource (use RESOURCE_EXHAUSTED instead for
     * those errors). PERMISSION_DENIED must not be used if the caller can not
     * be identified (use UNAUTHENTICATED instead for those errors). This error
     * code does not imply the request is valid or the requested entity exists
     * or satisfies other pre-conditions.
     */
    | 7
    /**
     * RESOURCE_EXHAUSTED - Some resource has been exhausted, perhaps a per-user
     * quota, or perhaps the entire file system is out of space.
     */
    | 8
    /**
     * FAILED_PRECONDITION - The operation was rejected because the system is
     * not in a state required for the operation's execution. For example, the
     * directory to be deleted is non-empty, an rmdir operation is applied to a
     * non-directory, etc. Service implementors can use the following guidelines
     * to decide between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE: (a) Use
     * UNAVAILABLE if the client can retry just the failing call. (b) Use
     * ABORTED if the client should retry at a higher level (e.g., when a
     * client-specified test-and-set fails, indicating the client should restart
     * a read-modify-write sequence). (c) Use FAILED_PRECONDITION if the client
     * should not retry until the system state has been explicitly fixed. E.g.,
     * if an "rmdir" fails because the directory is non-empty,
     * FAILED_PRECONDITION should be returned since the client should not retry
     * unless the files are deleted from the directory.
     */
    | 9
    /**
     * ABORTED - The operation was aborted, typically due to a concurrency issue
     * such as a sequencer check failure or transaction abort. See the
     * guidelines above for deciding between FAILED_PRECONDITION, ABORTED, and
     * UNAVAILABLE.
     */
    | 10
    /**
     * OUT_OF_RANGE - The operation was attempted past the valid range. E.g.,
     * seeking or reading past end-of-file. Unlike INVALID_ARGUMENT, this error
     * indicates a problem that may be fixed if the system state changes. For
     * example, a 32-bit file system will generate INVALID_ARGUMENT if asked to
     * read at an offset that is not in the range [0,2^32-1], but it will
     * generate OUT_OF_RANGE if asked to read from an offset past the current
     * file size. There is a fair bit of overlap between FAILED_PRECONDITION and
     * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
     * when it applies so that callers who are iterating through a space can
     * easily look for an OUT_OF_RANGE error to detect when they are done.
     */
    | 11
    /**
     * UNIMPLEMENTED - The operation is not implemented or is not
     * supported/enabled in this service.
     */
    | 12
    /**
     * INTERNAL - Internal errors. This means that some invariants expected by
     * the underlying system have been broken. This error code is reserved for
     * serious errors.
     */
    | 13
    /**
     * UNAVAILABLE - The service is currently unavailable. This is most likely a
     * transient condition, which can be corrected by retrying with a backoff.
     * Note that it is not always safe to retry non-idempotent operations.
     */
    | 14
    /**
     * DATA_LOSS - Unrecoverable data loss or corruption.
     */
    | 15
    /**
     * UNAUTHENTICATED - The request does not have valid authentication
     * credentials for the operation.
     */
    | 16;

  type TransactionObject = {
    /**
     * An array of events that were emitted during the transaction.
     */
    events: EventObject[];
    /**
     * The status of the transaction on the blockchain.
     */
    status: Status;
    /**
     * An error message if it exists. Default is an empty string `''`.
     */
    errorMessage: string;
    /**
     * The status from the GRPC response.
     */
    statusCode: GRPCStatus;
  };

  type Transaction = {
    /**
     * Provides the transaction once status 4 is returned.
     */
    onceSealed(): Promise<TransactionObject>;
  };

  /**
   * A utility function that lets you set the transaction to get subsequent
   * status updates (via polling) and the finalized result once available.
   * The poll rate is set at 2500ms and will update at that interval until
   * transaction is sealed.
   *
   * @param transactionId - A valid transaction id.
   *
   * ```typescript
   * import * as fcl from '@onflow/fcl';
   *
   * const transaction = await fcl.tx(transactionId).onceSealed();
   * ```
   */
  export function tx(transactionId: string): Transaction;

  type Environment = 'local' | 'canarynet' | 'testnet' | 'mainnet';

  type ConfigurationOptions = {
    /**
     * API URL for the Flow Blockchain Access Node you want to be communicating
     * with. See all available access node endpoints
     * {@link https://docs.onflow.org/access-api/#flow-access-node-endpoints
     * |here}.
     */
    'accessNode.api': string;
    /**
     * Used in conjunction with stored interactions.
     */
    env?: Environment;
    /**
     * Points FCL at the Wallet or Wallet Discovery mechanism.
     */
    'discovery.wallet': string;
    /**
     * ALPHA - Endpoint for alternative configurable Wallet Discovery mechanism.
     * Read more on
     * {@link https://docs.onflow.org/fcl/reference/api/#discovery|discovery}.
     */
    'discovery.authn.endpoint'?: string;
    /**
     * Your applications title, can be requested by wallets and other services.
     */
    'app.detail.title'?: string;
    /**
     * Url for your applications icon, can be requested by wallets and other
     * services.
     */
    'app.detail.icon'?: string;
    /**
     * @deprecated - Use `discovery.wallet` instead.
     */
    'challenge.handshake'?: string;
  };

  type Configuration = {
    /**
     * Set a configuration value.
     *
     * @param key - The key of the value to set. Must be one of the options for
     * the configuration at initialization.
     * @param value - The value to set.
     */
    put(key: keyof ConfigurationOptions, value: string): Configuration;
    /**
     * Set a configuration value.
     *
     * @param key - The key of the value to set. May start with `'0x'`.
     * Configuration keys that start with `'0x'` will be replaced in FCL scripts
     * and transactions, this allows you to write your script or transaction
     * Cadence code once and not have to change it when you point your
     * application at a difference instance of the Flow Blockchain.
     * @param value - The value to set.
     */
    put(key: string, value: string | number): Configuration;
    /**
     * Get a configuration value.
     *
     * @param key - The key of the value to get.
     * @param fallback - An optional fallback value to return in case the value
     * was not set.
     */
    get(
      key: string,
      fallback?: string | number,
    ): Promise<string | number | undefined>;
  };

  /**
   * FCL has a mechanism that lets you configure various aspects of FCL. The
   * main idea here (from an FCL perspective) should be that when you move from
   * one instance of the Flow Blockchain to another (Local Emulator to Testnet
   * to Mainnet) the only thing you should need to change (once again from an
   * FCL perspective) is your configuration.
   *
   * ```typescript
   * import { config } from "@onflow/fcl";
   *
   * const configuration = config({
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
  export function config(options: ConfigurationOptions): Configuration;
}
