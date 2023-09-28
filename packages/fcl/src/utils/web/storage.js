const isServerSide = () => typeof window === "undefined"

export const SESSION_STORAGE = {
  can: !isServerSide(),
  get: async key => JSON.parse(sessionStorage.getItem(key)),
  put: async (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
}

export const LOCAL_STORAGE = {
  can: !isServerSide(),
  get: async key => JSON.parse(localStorage.getItem(key)),
  put: async (key, value) => localStorage.setItem(key, JSON.stringify(value)),
}
