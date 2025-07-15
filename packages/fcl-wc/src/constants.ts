export const FLOW_METHODS = {
  FLOW_AUTHN: "flow_authn",
  FLOW_PRE_AUTHZ: "flow_pre_authz",
  FLOW_AUTHZ: "flow_authz",
  FLOW_USER_SIGN: "flow_user_sign",
} as const

export type FLOW_METHODS = (typeof FLOW_METHODS)[keyof typeof FLOW_METHODS]

export const REQUEST_TYPES = {
  SESSION_REQUEST: "session_proposal",
  SIGNING_REQUEST: "signing_request",
} as const

export type REQUEST_TYPES = (typeof REQUEST_TYPES)[keyof typeof REQUEST_TYPES]

export const SERVICE_PLUGIN_NAME = "fcl-plugin-service-walletconnect"
export const WC_SERVICE_METHOD = "WC/RPC"
