import type {Service} from "@onflow/typedefs"

export function injectExtService(service: Service): void {
  if (service.type === "authn" && service.endpoint != null) {
    if (!Array.isArray((window as any).fcl_extensions)) {
      ;(window as any).fcl_extensions = []
    }
    ;(window as any).fcl_extensions.push(service)
  } else {
    console.warn("Authn service is required")
  }
}
