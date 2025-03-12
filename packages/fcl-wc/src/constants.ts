export enum FLOW_METHODS {
  FLOW_AUTHN = "flow_authn",
  FLOW_PRE_AUTHZ = "flow_pre_authz",
  FLOW_AUTHZ = "flow_authz",
  FLOW_USER_SIGN = "flow_user_sign",
}

export enum REQUEST_TYPES {
  SESSION_REQUEST = "session_proposal",
  SIGNING_REQUEST = "signing_request",
}

export const SERVICE_PLUGIN_NAME = "fcl-plugin-service-walletconnect"
export const WC_SERVICE_METHOD = "WC/RPC"
