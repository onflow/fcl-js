import {renderFrame} from "./render-frame"

export function renderAuthnFrame({handshake, l6n}) {
  var url = new URL(handshake)
  url.searchParams.append("l6n", l6n)
  return renderFrame(url.href)
}
