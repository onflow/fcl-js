export type StorageProvider = {
  can: boolean
  get: (key: string) => Promise<any>
  put: (key: string, value: any) => Promise<void>
}
