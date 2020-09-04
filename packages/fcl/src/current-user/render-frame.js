const FRAME_ID = "FCL_IFRAME"

export function renderFrame(src) {
  if (document.getElementById(FRAME_ID)) return

  const $frame = document.createElement("iframe")
  $frame.src = src
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

  const unmount = () => {
    if (document.getElementById(FRAME_ID)) {
      document.getElementById(FRAME_ID).remove()
    }
  }

  return [$frame, unmount]
}
