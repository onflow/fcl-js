import {config} from "../config"

const FRAME_ID = "FCL_IFRAME_CHALLENGE"
const CHALLENGE_RESPONSE_EVENT = "FCL::CHALLENGE::RESPONSE"

function renderFrame({handshake, scope, nonce, l6n}) {
  if (document.getElementById(FRAME_ID)) return

  const src = [
    handshake,
    [
      `l6n=${encodeURIComponent(l6n)}`,
      `nonce=${encodeURIComponent(nonce)}`,
      scope && `scope=${scope.split(" ").join("+")}`,
    ]
      .filter(Boolean)
      .join("&"),
  ].join("?")

  const $frame = document.createElement("iframe")
  $frame.src = src
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
}

export async function authenticate() {
  const handshake = await config().get("challenge.handshake")
  const scope = await config().get("challenge.scope")
  const nonce = "asdf"
  const l6n = window.location.origin

  renderFrame({handshake, scope, nonce, l6n})

  window.addEventListener("message", ({data, origin}) => {
    if (data.type !== CHALLENGE_RESPONSE_EVENT) return
    if (document.getElementById(FRAME_ID)) {
      document.getElementById(FRAME_ID).remove()
    }

    console.log("RECEIVED", CHALLENGE_RESPONSE_EVENT, data)
  })
}
