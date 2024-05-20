const isServerSide = () => typeof window === "undefined"

const getSessionStorage = () => {
  try {
    const SESSION_STORAGE = {
      can: !isServerSide(),
      get: async key => JSON.parse(sessionStorage.getItem(key)),
      put: async (key, value) =>
        sessionStorage.setItem(key, JSON.stringify(value)),
    }
    return SESSION_STORAGE
  } catch (error) {
    return null
  }
}

export const getDefaultConfig = () => {
  return {
    "discovery.wallet.method.default": "IFRAME/RPC",
    "fcl.storage.default": getSessionStorage(),
  }
}
