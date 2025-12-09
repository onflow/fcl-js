// Use require() to avoid Rollup/Metro interop issues with peer dependencies
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AsyncStorage =
  require("@react-native-async-storage/async-storage").default

const safeParseJSON = (str?: string | null) => {
  if (str == null) return null
  try {
    return JSON.parse(str)
  } catch (error) {
    return null
  }
}

export const getAsyncStorage = () => {
  try {
    const ASYNC_STORAGE = {
      can: true,
      get: async (key: string) =>
        safeParseJSON(await AsyncStorage.getItem(key)),
      put: async (key: string, value: any) =>
        await AsyncStorage.setItem(key, JSON.stringify(value)),
      removeItem: async (key: string) => await AsyncStorage.removeItem(key),
    }
    return ASYNC_STORAGE
  } catch (error) {
    console.warn("AsyncStorage not available, using fallback storage", error)
    // Return a fallback storage that doesn't persist
    return {
      can: false,
      get: async (key: string) => null,
      put: async (key: string, value: any) => {},
      removeItem: async (key: string) => {},
    }
  }
}
