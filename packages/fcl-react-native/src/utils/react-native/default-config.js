import AsyncStorage from "@react-native-async-storage/async-storage"

const getAsyncStorage = () => {
  try {
    const ASYNC_STORAGE = {
      can: true,
      get: async key => JSON.parse(await AsyncStorage.getItem(key)),
      put: async (key, value) =>
        await AsyncStorage.setItem(key, JSON.stringify(value)),
    }
    return ASYNC_STORAGE
  } catch (error) {
    return null
  }
}

export const getDefaultConfig = () => {
  return {
    "discovery.wallet.method.default": "DEEPLINK/RPC",
    "fcl.storage.default": getAsyncStorage(),
  }
}
