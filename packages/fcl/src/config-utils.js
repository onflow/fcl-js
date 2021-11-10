import {config} from "@onflow/sdk"
import {invariant} from "@onflow/util-invariant"

const isServerSide = () => typeof window === "undefined"

const SESSION_STORAGE = {
  can: !isServerSide(),
  get: async key => JSON.parse(sessionStorage.getItem(key)),
  put: async (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
}

const LOCAL_STORAGE = {
  can: !isServerSide(),
  get: async key => JSON.parse(localStorage.getItem(key)),
  put: async (key, value) => localStorage.setItem(key, JSON.stringify(value)),
}

const NO_STORAGE = {
  can: false,
}

export const STORAGE_DEFAULT = SESSION_STORAGE
export const DISCOVERY_METHOD = "IFRAME/RPC"

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}

export async function buildAuthnConfig({ service }) {
  const discoveryWallet = await config.first([
    "discovery.wallet",
    "challenge.handshake",
  ])

  const discoveryWalletMethod = await config.first([
    "discovery.wallet.method",
    "discovery.wallet.method.default",
  ])

  const appDomainTag = await config.get("fcl.appDomainTag")
  const authnEndpoint = await config.get("discovery.authn.endpoint")
  const discoveryApiRequiredAndSet = Boolean(service) && Boolean(authnEndpoint)
  const isAuthnConfigured = discoveryWallet != null || discoveryApiRequiredAndSet

  invariant(
    isAuthnConfigured,
    `
      Required value for "discovery.wallet" or "discovery.authn.endpoint" not defined in config.
      See: "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/exec/query.md#configuration"
    `
  )

  return {discoveryWallet, discoveryWalletMethod, appDomainTag}
}
