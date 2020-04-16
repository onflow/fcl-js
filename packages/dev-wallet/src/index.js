import {html, render} from "https://unpkg.com/htm/preact/standalone.module.js"

const route = async path => {
  const {default: Comp} = await import(path)
  render(
    html`
      <${Comp} />
    `,
    document.getElementById("Root")
  )
}

const url = new URL(location)

switch (url.pathname) {
  case "/":
    route("/pages/root.js")
    break
  case "/flow/authenticate":
    route("/pages/authn.js")
    break
  default:
    route("/pages/four-oh-four.js")
    break
}
