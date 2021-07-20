const POP = "FCL_POP"

let popup = null
let previousUrl = null

function popupWindow(url, windowName, win, w, h) {
  const y = win.top.outerHeight / 2 + win.top.screenY - h / 2
  const x = win.top.outerWidth / 2 + win.top.screenX - w / 2
  return win.open(
    url,
    windowName,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
  )
}

export function renderFrame(src) {
  if (popup == null || popup?.closed) {
    popup = popupWindow(src, POP, window, 600, 600)
  } else if (previousUrl !== src) {
    popup = popupWindow(src, POP, window, 600, 600)
    popup.focus()
  } else {
    popup.focus()
  }

  previousUrl = src

  var timer = setInterval(function () {
    if (popup && popup.closed) {
      clearInterval(timer)
      popup = null
    }
  }, 1000)

  const unmount = () => {
    if (popup && !popup.closed) {
      popup.close()
      popup = null
    }
  }

  return [popup, unmount]
}

/* import {invariant} from "@onflow/util-invariant"

const FRAME = "FCL_IFRAME"

const FRAME_STYLES = `
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

export function renderFrame(src) {
  invariant(
    !document.getElementById(FRAME),
    "Attempt at triggering multiple Frames",
    {src}
  )

  const $frame = document.createElement("iframe")
  $frame.src = src
  $frame.id = FRAME
  $frame.allow = "usb *; hid *"
  $frame.frameBorder = "0"
  $frame.style.cssText = FRAME_STYLES
  document.body.append($frame)

  const unmount = () => {
    if (document.getElementById(FRAME)) {
      document.getElementById(FRAME).remove()
    }
  }

  return [$frame, unmount]
}
 */
