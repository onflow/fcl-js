import {html, render} from "https://unpkg.com/htm/preact/standalone.module.js"

const route = async (path, props = {}) => {
  const {default: Comp} = await import(path)
  render(
    html`
      <${Comp} ...${props} />
    `,
    document.getElementById("Root")
  )
}

const url = new URL(location)
const test = regex => {
  return typeof regex === "string"
    ? regex === url.pathname
    : regex.test(url.pathname)
}

const authzIdFromPathname = pathname => {
  const parts = pathname.split("/")
  return parts[parts.length - 1]
}

switch (true) {
  case test(/\/authorization\/[0-9a-zA-Z\-]+$/):
    route("/pages/authorization.js", {
      authorizationId: authzIdFromPathname(url.pathname),
    })
    break
  case test("/authorizations"):
    route("/pages/authorizations.js")
    break
  case test("/flow/authenticate"):
    route("/pages/flow-authenticate.js")
    break
  case test("/"):
    route("/pages/root.js")
    break
  default:
    route("/pages/four-oh-four.js")
    break
}
