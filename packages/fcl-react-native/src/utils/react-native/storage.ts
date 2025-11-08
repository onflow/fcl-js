// Lazy load AsyncStorage to avoid TurboModule errors in Expo Go
let AsyncStorage: any = null
const getAsyncStorageModule = async () => {
  if (!AsyncStorage) {
    const module = await import("@react-native-async-storage/async-storage")
    AsyncStorage = module.default
  }
  return AsyncStorage
}

const safeParseJSON = (str?: string | null) => {
  if (str == null) return null
  try {
    return JSON.parse(str)
  } catch (error) {
    return null
  }
}

export const getAsyncStorage = async () => {
  try {
    const Storage = await getAsyncStorageModule()
    const ASYNC_STORAGE = {
      can: true,
      get: async (key: string) =>
        safeParseJSON(await Storage.getItem(key)),
      put: async (key: string, value: any) =>
        await Storage.setItem(key, JSON.stringify(value)),
    }
    return ASYNC_STORAGE
  } catch (error) {
    console.warn("AsyncStorage not available, using fallback storage", error)
    // Return a fallback storage that doesn't persist
    return {
      can: false,
      get: async (key: string) => null,
      put: async (key: string, value: any) => {},
    }
  }
}
