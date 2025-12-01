import type {
  CurrentUser as BaseCurrentUser,
  Transaction,
} from "@onflow/typedefs"

/**
 * Extended CurrentUser interface with methods needed by React hooks
 */
export interface CurrentUser extends BaseCurrentUser {
  /**
   * Subscribe to user state changes
   */
  subscribe: (callback: (user: CurrentUser) => void) => () => void
  /**
   * Authorization function for the current user
   */
  authorization?: any
}

/**
 * Platform-agnostic Flow client interface
 * Used by both @onflow/fcl (web) and @onflow/fcl-react-native (mobile)
 */
export interface FlowClient {
  currentUser: {
    subscribe: (callback: (user: any) => void) => () => void
    authorization?: any
    authenticate?: () => Promise<any>
    unauthenticate?: () => void
    [key: string]: any
  }
  mutate: (...args: any[]) => Promise<string>
  query: (...args: any[]) => Promise<any>
  queryRaw: (...args: any[]) => Promise<any>
  verifyUserSignatures: (...args: any[]) => Promise<any>
  getChainId: () => Promise<string | null>
  tx: (id: string) => any
  events: (eventNameOrFilter: string | any) => any
  authenticate: () => Promise<any>
  unauthenticate: () => void
  signUserMessage: (message: string) => Promise<any>
  serialize: (...args: any[]) => any
  send: (...args: any[]) => Promise<any>
  decode: (response: any) => Promise<any>
  account: (address: string) => Promise<any>
  block: (...args: any[]) => Promise<any>
  [key: string]: any
}
