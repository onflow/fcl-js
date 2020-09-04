export function serviceOfType(services = [], type) {
  return services.find(service => service.type === type)
}
