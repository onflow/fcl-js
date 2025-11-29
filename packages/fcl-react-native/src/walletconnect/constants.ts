export const SERVICE_PLUGIN_NAME = "fcl-wc-plugin-react-native"

export const WC_SERVICE_METHOD = "WC/RPC"

export const FLOW_METHODS = {
  FLOW_AUTHN: "flow_authn",
  FLOW_AUTHZ: "flow_authz",
  FLOW_PRE_AUTHZ: "flow_pre_authz",
  FLOW_USER_SIGN: "flow_user_sign",
  // Additional methods returned by wallets in PreAuthzResponse
  FLOW_SIGN_PAYER: "flow_sign_payer",
  FLOW_SIGN_PROPOSER: "flow_sign_proposer",
}

export const REQUEST_TYPES = {
  SESSION_REQUEST: "session_request",
  SIGNING_REQUEST: "signing_request",
}
