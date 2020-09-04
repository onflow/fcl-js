const FRAME_ID = "FCL_IFRAME_CHALLENGE"

export function renderAuthnFrame({handshake, scope, nonce, l6n}) {
  if (document.getElementById(FRAME_ID)) return
  var url = new URL(handshake)
  url.searchParams.append("l6n", l6n)
  url.searchParams.append("nonce", nonce)
  if (scope) url.searchParams.append("scope", scope.split(" ").join("+"))

  const $frame = document.createElement("iframe")
  $frame.src = url.href
  $frame.id = FRAME_ID
  $frame.allow = "usb"
  $frame.style.position = "fixed"
  $frame.style.top = "0px"
  $frame.style.right = "0px"
  $frame.style.left = "0px"
  $frame.style.bottom = "0px"
  $frame.style.height = "100vh"
  $frame.style.width = "100vw"
  $frame.style.display = "block"
  $frame.style.background = "rgba(0,0,0,0.25)"
  $frame.frameBorder = "0"
  $frame.style.boxSizing = "border-box"
  $frame.style.border = "1px solid white"
  document.body.append($frame)

  return () => {
    if (document.getElementById(FRAME_ID)) {
      document.getElementById(FRAME_ID).remove()
    }
  }
}
