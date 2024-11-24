import {invariant} from "@onflow/util-invariant"

const FRAME = "FCL_IFRAME"

const FRAME_STYLES = `
  position:fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 100%;
  width: 100vw;
  display:block;
  background:rgba(0,0,0,0.25);
  z-index: 2147483647;
  box-sizing: border-box;
  color-scheme: light;
`

export function renderFrame(src) {
  invariant(
    !document.getElementById(FRAME),
    "Attempt at triggering multiple Frames",
    {src}
  )

  const $frame = document.createElement("iframe")
  $frame.src = src
  $frame.id = FRAME
  $frame.allow = "usb *; hid *; clipboard-write"
  $frame.frameBorder = "0"
  $frame.style.cssText = FRAME_STYLES
  document.body.append($frame)

  const unmount = () => {
    if (document.getElementById(FRAME)) {
      document.getElementById(FRAME).remove()
    }
  }

  return [$frame.contentWindow, unmount]
}
