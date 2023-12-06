export function injectExtService(service) {
  if (service.type === "authn" && service.endpoint != null) {
    if (!Array.isArray(window.fcl_extensions)) {
      window.fcl_extensions = []
    }
    window.fcl_extensions.push(service)
  } else {
    console.warn("Authn service is required")
  }
}
