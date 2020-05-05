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
  $frame.style.height = "500px"
  $frame.style.maxHeight = "90vh"
  $frame.style.width = "400px"
  $frame.style.maxWidth = "90vw"
  $frame.style.display = "block"
  $frame.style.background = "#fff"
  $frame.style.position = "fixed"
  $frame.style.top = "5vh"
  $frame.style.right = "calc(50vw)"
  $frame.style.transform = "translateX(50%)"
  $frame.style.boxShadow = "0 4px 8px -4px black"
  $frame.frameBorder = "0"
  document.body.append($frame)

  return () => {
    if (document.getElementById(FRAME_ID)) {
      document.getElementById(FRAME_ID).remove()
    }
  }
}
