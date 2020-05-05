const FRAME_ID = "FCL_IFRAME_AUTHZ"

export function renderAuthzFrame(hook) {
  if (document.getElementById(FRAME_ID)) return
  var url = new URL(hook.endpoint)
  for (let [key, value] of Object.entries(hook.params || {})) {
    url.searchParams.append(key, value)
  }

  const $frame = document.createElement("iframe")
  $frame.src = url.href
  $frame.id = FRAME_ID
  $frame.style.height = hook.height || "500px"
  $frame.style.maxHeight = "90vh"
  $frame.style.width = hook.width || "400px"
  $frame.style.maxWidth = "90vw"
  $frame.style.display = "block"
  $frame.style.background = hook.background || "#fff"
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
