export type Service = {
  f_type: "Service"
  f_vsn: "1.0.0"
  type:
    | "authn"
    | "authz"
    | "user-signature"
    | "pre-authz"
    | "open-id"
    | "back-channel-rpc"
    | "authn-refresh"
  method:
    | "HTTP/POST"
    | "IFRAME/RPC"
    | "POP/RPC"
    | "TAB/RPC"
    | "EXT/RPC"
    | "DATA"
  uid: string
  endpoint: string
  id: string
  identity?: {
    f_type: "Identity"
    f_vsn: "1.0.0"
    address: string
    keyId?: number
  }
  provider?: {
    f_type: "ServiceProvider"
    address: string
    name?: string
    description?: string
    icon?: string
    website?: string
    supportUrl?: string
    supportEmail?: string
  }
  data?: Record<string, any>
  params?: Record<string, any>
}

export type AuthnResponse = {
  f_type: "AuthnResponse"
  f_vsn: "1.0.0"
  addr: string
  services: Service[]
}

export type CompositeSignature = {
  f_type: "CompositeSignature"
  f_vsn: "1.0.0"
  addr: string
  keyId: number
  signature: string
  extensionData?: string
}

export type Signable = {
  f_type: "Signable"
  f_vsn: "1.0.1"
  addr: string
  keyId: number
  voucher: {
    cadence: string
    refBlock: string
    computeLimit: number
    arguments: {type: string; value: unknown}[]
    proposalKey: {address: string; keyId: number; sequenceNum: number}
    payer: string
    authorizers: string[]
  }
}
