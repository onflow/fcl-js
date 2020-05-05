export const compositeIdFromProvider = (provider = {}) => {
  const addr = provider.addr
  const pid = provider.pid
  if (addr == null || pid == null) return null
  return `${addr}/${pid}`
}
