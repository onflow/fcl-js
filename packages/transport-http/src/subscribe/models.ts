export enum Action {
  LIST_SUBSCRIPTIONS = "list_subscriptions",
  SUBSCRIBE = "subscribe",
  UNSUBSCRIBE = "unsubscribe",
}
export interface BaseMessageRequest {
  action: Action
}

export interface BaseMessageResponse {
  action?: Action
  success: boolean
  error_message?: string
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
  id: string
}

export interface UnsubscribeMessageRequest extends BaseMessageRequest {
  action: Action.UNSUBSCRIBE
  id: string
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

export type SubscriptionDataMessage = {
  id: string
  data: any
}
