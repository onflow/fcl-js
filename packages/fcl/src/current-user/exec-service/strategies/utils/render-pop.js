const POP = "FCL_POP"

let popup = null
let previousUrl = null

function popupWindow(url, windowName, win, w, h) {
  const y = win.top.outerHeight / 2 + win.top.screenY - h / 2
  const x = win.top.outerWidth / 2 + win.top.screenX - w / 2
  const popup = win.open(
    url,
    windowName,
    `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
  )
  if (!popup)
    throw new Error("Popup failed to open (was it blocked by a popup blocker?)")
  return popup
}

export function renderPop(src) {
  if (popup == null || popup?.closed) {
    const urlParams = new URLSearchParams(window.location.search);
    const width = urlParams.get('width') || 640
    const height = urlParams.get('height') || 770
    popup = popupWindow(src, POP, window, width, height)
  } else if (previousUrl !== src) {
    popup.location.replace(src)
    popup.focus()
  } else {
    popup.focus()
  }

  previousUrl = src

  const unmount = () => {
    if (popup && !popup.closed) {
      popup.close()
    }
    popup = null
  }

  return [popup, unmount]
}
