import AsyncStorage from "@react-native-async-storage/async-storage"

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
    }
    return ASYNC_STORAGE
  } catch (error) {
    return null
  }
}
