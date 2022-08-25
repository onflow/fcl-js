const TAB = "FCL_TAB"

let tab = null
let previousUrl = null

export function renderTab(src) {
  if (tab == null || tab?.closed) {
    tab = window.open(src, "_blank")
    if (!tab){
      // use current window to navigate to dapper wallet
      window.location.assign(src);
    }
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
    } else {
      // somehow get the referrer and redirect back
      window.location.assign(document.referrer);
    }
    tab = null
  }

  return [tab, unmount]
}
