const FRAME_ID = "FCL_IFRAME"

export function renderFrame(src) {
  if (document.getElementById(FRAME_ID)) return

  const $frame = document.createElement("iframe")
  $frame.src = src
  $frame.id = FRAME_ID
  $frame.allow = "usb *"
  $frame.frameBorder = "0"
  $frame.style.cssText = `
    position:fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    height: 100vh;
    width: 100vw;
    display:block;
    background:rgba(0,0,0,0.25);
    z-index: 2147483647;
    box-sizing: border-box;
  `
  document.body.append($frame)

  const unmount = () => {
    if (document.getElementById(FRAME_ID)) {
      document.getElementById(FRAME_ID).remove()
    }
  }

  return [$frame, unmount]
}
