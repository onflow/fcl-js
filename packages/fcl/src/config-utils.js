import {config} from "@onflow/sdk"

export async function configLens(regex) {
  return Object.fromEntries(
    Object.entries(await config().where(regex)).map(([key, value]) => [
      key.replace(regex, ""),
      value,
    ])
  )
}

export async function getStorageConfig() {
  const storageDefault =
    STORAGE_OPTIONS[await config.get("fcl.storage.default")]
  const storageConfig = await config.first([
    "fcl.storage",
    "fcl.storage.default",
  ])
  STORAGE_OPTIONS[storageConfig] == null &&
    console.warn(
      `Invalid fcl.storage value ${storageConfig}. Using default SESSION_STORAGE`
    )
  return STORAGE_OPTIONS[storageConfig] || storageDefault
}

export const STORAGE_OPTIONS = {
  SESSION_STORAGE: {
    can: true,
    get: async key => JSON.parse(sessionStorage.getItem(key)),
    put: async (key, value) =>
      sessionStorage.setItem(key, JSON.stringify(value)),
  },

  LOCAL_STORAGE: {
    can: true,
    get: async key => JSON.parse(localStorage.getItem(key)),
    put: async (key, value) => localStorage.setItem(key, JSON.stringify(value)),
  },
  NO_STORAGE: {
    can: false,
  },
}
