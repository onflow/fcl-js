// WALLET INTERACTIONS
declare module "@onflow/fcl" {

  export interface AuthenticateOptions {
    service: WalletService;
  }

  /**
   * Calling this method will authenticate the current user via any wallet that supports FCL.
   * Once called, FCL will initiate communication with the configured `discovery.wallet`
   * endpoint which lets the user select a wallet to authenticate with.
   * Once the wallet provider has authenticated the user, FCL will set the values on the
   * [current user object]{@link CurrentUserObject} for future use and authorization.
   *
   * @param options `authenticate` can also take a service returned from {@link discovery}
   *
   * @see {@link https://docs.onflow.org/fcl/reference/api/#authenticate}
   */
  export function authenticate(options?: AuthenticateOptions): void;

  // Ref: https://docs.onflow.org/fcl/reference/api/#unauthenticate
  /**
   * Logs out the current user and sets the values on the [current user object]{@link CurrentUserObject} to null.
   */
  export function unauthenticate(): void;

  /**
   * A **convenience method** that calls {@link unauthenticate} and then {@link authenticate} for the current user.
   * @see {@link https://docs.onflow.org/fcl/reference/api/#reauthenticate}
   */
  export function reauthenticate(): void;

  /**
   * A **convenience method** that calls and is equivalent to {@link authenticate}.
   * @see {@link https://docs.onflow.org/fcl/reference/api/#signup}
   */
  export function signUp(): void;

  /**
   * A **convenience method** that calls and is equivalent to {@link authenticate}.
   * @see {@link https://docs.onflow.org/fcl/reference/api/#login}
   */
  export function logIn(): void;

  /**
   * A **convenience method** that produces the needed authorization details for the
   * current user to submit transactions to Flow. It defines a signing function that
   * connects to a user's wallet provider to produce signatures to submit transactions.
   * @see {@link https://docs.onflow.org/fcl/reference/api/#authz}
   */
  export function authz(): AuthorizationObject;

  /**
   * Holds the [current user]{@link CurrentUserObject}, if set, and offers a set of
   * functions to manage the authentication and authorization of the user.
   */
  export function currentUser(): CurrentUserObject;

  export namespace currentUser {
    /**
     * @param callback The callback will be called with the [current user]{@link CurrentUserObject}
     * as the first argument when the current user is set or removed.
     */
    function subscribe(callback: (user: CurrentUserObject) => void): void;

    /**
     * Returns the [current user object]{@link CurrentUserObject}.
     * This is the same object that is set and available on {@link subscribe}.
     */
    function snapshot(): CurrentUserObject;

    /**
     * Equivalent to {@link fcl.authenticate}.
     * @param options `authenticate` can also take a service returned from {@link fcl.discovery}
     */
    function authenticate(options?: AuthenticateOptions): void;

    /**
     * Equivalent to {@link fcl.unauthenticate}.
     * @see {@link https://docs.onflow.org/fcl/reference/api/#currentuserunauthenticate}
     */
    function unauthenticate(): void;

    /**
     * Equivalent to {@link fcl.authz}.
     * @see {@link https://docs.onflow.org/fcl/reference/api/#currentuserauthorization}
     */
    function authorization(): AuthorizationObject;

    /**
     * A method to use allowing the user to personally sign data via FCL Compatible Wallets/Services.
     * ⚠️ This method requires the current user's wallet to support a signing service endpoint.
     * Currently, only Blocto is compatible with this feature by default.
     * @param message A hexadecimal string to be signed
     * @see {@link https://docs.onflow.org/fcl/reference/api/#currentusersignusermessage}
     */
    function signUserMessage(message: string): Promise<CompositeSignature[]>;

    // TODO: add resolveArgument
  }

  /**
   * @see {@link https://github.com/onflow/fcl-js/blob/master/packages/fcl/src/wallet-provider-spec/draft-v2.md#compositesignature}
   */
  export interface CompositeSignature {
    f_type: "CompositeSignature";
    f_vsn: string;
    addr: Address;
    keyId: number;
    signature: string;
  }

  /**
   * Discovery abstracts away code so that developers don't have to deal with the
   * discovery of Flow compatible wallets, integration, or authentication.
   * Using `discovery` from FCL allows dapps to list and authenticate with
   * wallets while having full control over the UI.
   * Common use cases for this are login or registration pages.
   * 
   * (Alternatively, if you don't need control over your UI you can
   * continue to use the `discovery.wallet` config value documented
   * in the Quickstart for the simplest configuration.)
   * @see {@link https://docs.onflow.org/fcl/reference/api/#discovery-1}
   */
  export namespace discovery {
    /**
     * By default, limited functionality services, like Ledger,
     * require apps to opt-in in order to display to users.
     * This is so users don't authenticate only to later find out
     * certain services cannot complete certain actions.
     * To enable specific limited functionality services in an application,
     * use the `discovery.authn.include` property in your configuration
     * with a value of an array of services you'd like your app to
     * opt-in to displaying for users.
     * @see {@link https://docs.onflow.org/fcl/reference/api/#authn}
     */
    namespace authn {
      /**
       * Return a list of `authn` services.
       * @see {@link https://docs.onflow.org/fcl/reference/api/#discoveryauthnsnapshot}
       */
      function snapshot(): Promise<WalletService[]>;

      /**
       * @param callback The callback sent to `subscribe` will be called with a list of `authn` services.
       * @see {@link https://docs.onflow.org/fcl/reference/api/#discoveryauthnsubscribecallback}
       */
      // TODO: check syntax of param in https://github.com/onflow/fcl-js or with FCL dev team
      function subscribe(callback: (res: { results: WalletService[] }) => void): void;
    }
  }

  export interface Service {
    f_type: "Service";
    f_vsn: string;
    type: "authn";
    method?: string;
    uid: string;
    endpoint: string;
  }

  /**
   * @see {@link https://github.com/onflow/fcl-discovery/blob/master/data/services.json}
   */
  export interface WalletService extends Service {
    provider: {
      address: Address;
      name: string;
      icon: string;
      description: string;
      color: string;
      supportEmail: string;
      website: string;
    };
  }

  export interface DapperWalletService extends WalletService {
    id: string;
  }

  export interface OtherService extends Service {
    identity: {
      f_type: "Service";
      f_vsn: string;
      address: Address;
      keyId: number;
    };
    params: {
      key: string;
      value: string;
      __typename: "Data";
    };
  }

  export interface DevWalletService extends Service {
    identity: {
      address: Address;
    };
    provider: {
      address: null;
      description: string;
      icon: null;
      name: string;
    };
  }

  /**
   * @see {@link https://docs.onflow.org/fcl/reference/api/#address}
   */
  export type Address = string;

  /**
  * Consumes a payload and produces a signature for a transaction.
  * @see {@link https://docs.onflow.org/fcl/reference/api/#signing-function}
  */
  export type SigningFunction = (options: SigningPayload) => Promise<SignableObject>;

  /**
  * @see {@link https://docs.onflow.org/fcl/reference/api/#payload}
  */
  export interface SigningPayload {
    /**
    * The encoded string which needs to be used to produce the signature.
    */
    message: string;
    /**
    * The encoded string which needs to be used to produce the signature.
    */
    addr: Address;
    /**
    * The encoded string which needs to be used to produce the signature.
    */
    keyId: string;
    /**
    * The encoded string which needs to be used to produce the signature.
    */
    roles: string;
    /**
    * The raw transactions information, can be used to create the message
    * for additional safety and lack of trust in the supplied message.
    */
    voucher: object;
  }

  /**
  * @see {@link https://docs.onflow.org/fcl/reference/api/#currentuserobject}
  */
  export interface CurrentUserObject {
    /**
    * The public address of the current user
    */
    addr: Address | undefined;
    /**
    * Allows wallets to specify a [content identifier]{@link https://docs.ipfs.io/concepts/content-addressing/} for user metadata.
    */
    cid: string | undefined;
    /**
    * Allows wallets to specify a time-frame for a valid session.
    */
    expiresAt: number | undefined;
    /**
    * A type identifier used internally by FCL.
    */
    f_type: string | undefined;
    /**
    * FCL protocol version.
    */
    f_vsn: string | undefined;
    /**
    * If the user is logged in.
    */
    loggedIn: boolean | undefined;
    /**
    * A list of trusted services that express ways of interacting with the current user's identity,
    * including means to further discovery, [authentication, authorization]{@link https://gist.github.com/orodio/a74293f65e83145ec8b968294808cf35#you-know-who-the-user-is}, or other kinds of interactions.
    */
    services: (WalletService | DapperWalletService | DevWalletService | OtherService)[] | undefined;
  }
  
  /**
  * An authorization function must produce the information of the user that is going
  * to sign and a signing function to use the information to produce a signature.
  *
  * 📣 By default FCL exposes `fcl.authz` that produces the authorization object
  * for the current user (given they are signed in and only on the browser).
  * Replace this with your own function that conforms to this interface to
  * use it wherever an authorization object is needed.
  * @see {@link https://docs.onflow.org/fcl/reference/api/#authorizationobject}
  */
  export interface AuthorizationObject {
    /**
    * The address of the authorizer
    */
    addr: Address;
    /**
    * A function that allows FCL to sign using the authorization details and produce a valid signature.
    */
    signingFunction: SigningFunction;
    /**
    * The index of the key to use during authorization. (Multiple keys on an account is possible).
    */
    keyId: number;
    /**
    * A number that is incremented per transaction using they keyId.
    */
    sequenceNum: number;
  }
  
  /**
  * An object that contains all the information needed for FCL to sign a message with the user's signature.
  * @see {@link https://docs.onflow.org/fcl/reference/api/#signableobject}
  */
  export interface SignableObject {
    /**
    * The address of the authorizer
    */
    addr: Address;
    /**
    * The index of the key to use during authorization. (Multiple keys on an account is possible).
    */
    keyId: number;
    /**
    * A {@link SigningFunction} that can produce a valid signature for a user from a message.
    */
    signature: SigningFunction;
  }
}
  