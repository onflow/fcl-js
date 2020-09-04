import {urlFromService} from "./url-from-service"
import {renderFrame} from "./render-frame"

export function renderAuthzFrame(service) {
  var url = urlFromService(service)
  return renderFrame(url.href)
}
