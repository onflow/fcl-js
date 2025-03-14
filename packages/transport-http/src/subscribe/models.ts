export enum Action {
  LIST_SUBSCRIPTIONS = "list_subscriptions",
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
}
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
  action: Action.LIST_SUBSCRIPTIONS
}

export interface ListSubscriptionsMessageResponse extends BaseMessageResponse {
  action: Action.LIST_SUBSCRIPTIONS
  subscriptions?: SubscriptionEntry[]
}

export interface SubscribeMessageRequest extends BaseMessageRequest {
  action: Action.SUBSCRIBE
  topic: string
  arguments: Record<string, any>
}

export interface SubscribeMessageResponse extends BaseMessageResponse {
  action: Action.SUBSCRIBE
  topic: string
}

export interface UnsubscribeMessageRequest extends BaseMessageRequest {
  action: Action.UNSUBSCRIBE
}

export type UnsubscribeMessageResponse = BaseMessageResponse & {
  action: Action.UNSUBSCRIBE
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

// TODO: START

type Message<
  Request extends BaseMessageRequest,
  Response extends BaseMessageResponse,
> = {
  Request: Request
  Response: Response
}

type ListSubscriptions = Message<
  ListSubscriptionsMessageRequest,
  ListSubscriptionsMessageResponse
>

type Subscribe = Message<SubscribeMessageRequest, SubscribeMessageResponse>

type Unsubscribe = Message<
  UnsubscribeMessageRequest,
  UnsubscribeMessageResponse
>

// TODO: END

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
