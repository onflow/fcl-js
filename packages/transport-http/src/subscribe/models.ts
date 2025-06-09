export const Action = {
  LIST_SUBSCRIPTIONS: "list_subscriptions",
  SUBSCRIBE: "subscribe",
  UNSUBSCRIBE: "unsubscribe",
} as const

export type Action = (typeof Action)[keyof typeof Action]

export interface BaseMessageRequest {
  action: Action
  subscription_id: string
}

export interface BaseMessageResponse {
  action?: Action
  error?: {
    code: number
    message: string
  }
  subscription_id: string
}

export interface ListSubscriptionsMessageRequest extends BaseMessageRequest {
  action: typeof Action.LIST_SUBSCRIPTIONS
}

export interface ListSubscriptionsMessageResponse extends BaseMessageResponse {
  action: typeof Action.LIST_SUBSCRIPTIONS
  subscriptions?: SubscriptionEntry[]
}

export interface SubscribeMessageRequest extends BaseMessageRequest {
  action: typeof Action.SUBSCRIBE
  topic: string
  arguments: Record<string, any>
}

export interface SubscribeMessageResponse extends BaseMessageResponse {
  action: typeof Action.SUBSCRIBE
  topic: string
}

export interface UnsubscribeMessageRequest extends BaseMessageRequest {
  action: typeof Action.UNSUBSCRIBE
}

export type UnsubscribeMessageResponse = BaseMessageResponse & {
  action: typeof Action.UNSUBSCRIBE
  id: string
}

export type SubscriptionEntry = {
  id: string
  topic: string
  arguments: Record<string, any>
}

export type MessageRequest =
  | ListSubscriptionsMessageRequest
  | SubscribeMessageRequest
  | UnsubscribeMessageRequest

export type MessageResponse =
  | ListSubscriptionsMessageResponse
  | SubscribeMessageResponse
  | UnsubscribeMessageResponse

export type SubscriptionDataMessage = {
  subscription_id: string
  payload: any
}
export class SocketError extends Error {
  code: number

  private constructor(code: number, message: string) {
    super(message)
    this.name = "SocketError"
    this.code = code
  }

  static fromMessage(error: {code: number; message: string}) {
    return new SocketError(error.code, error.message)
  }
}
