const TAB = "FCL_TAB"

let tab = null
let previousUrl = null

export function renderTab(src) {
  if (tab == null || tab?.closed) {
    tab = window.open(src, "_blank")
  } else if (previousUrl !== src) {
    tab.location.replace(src)
    tab.focus()
  } else {
    tab.focus()
  }

  previousUrl = src

  const unmount = () => {
    if (tab && !tab.closed) {
      tab.close()
    }
    tab = null
  }

  return [tab, unmount]
}
