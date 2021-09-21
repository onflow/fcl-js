import {config} from "@onflow/sdk"
import {invariant} from "@onflow/util-invariant"

const SESSION_STORAGE = {
  can: true,
  get: async key => JSON.parse(sessionStorage.getItem(key)),
  put: async (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
}

const LOCAL_STORAGE = {
  can: true,
  get: async key => JSON.parse(localStorage.getItem(key)),
  put: async (key, value) => localStorage.setItem(key, JSON.stringify(value)),
}

const NO_STORAGE = {
  can: false,
}

export const STORAGE_DEFAULT = SESSION_STORAGE
export const APP_DOMAIN_TAG = "APP-V0.0-user"
export const DISCOVERY_METHOD = "IFRAME/RPC"

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}

export async function buildAuthnConfig() {
  const discoveryWallet = await config.first([
    "discovery.wallet",
    "challenge.handshake",
  ])

  const discoveryWalletMethod = await config.first([
    "discovery.wallet.method",
    "discovery.wallet.method.default",
  ])

  const appDomainTag = await config.first([
    "fcl.appDomainTag",
    "fcl.appDomainTag.default",
  ])

  invariant(
    discoveryWallet != null,
    `
      Required value for discovery.wallet not defined in config.
      See: "https://github.com/onflow/flow-js-sdk/blob/master/packages/fcl/src/exec/query.md#configuration"
    `
  )

  return {discoveryWallet, discoveryWalletMethod, appDomainTag}
}
