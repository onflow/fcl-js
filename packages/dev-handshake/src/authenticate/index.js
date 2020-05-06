import {html, render} from "https://unpkg.com/htm/preact/standalone.module.js"

const pro = (pid, authn, label, icon) => ({
  [pid]: {
    pid,
    authn,
    label,
    icon: icon || `https://avatars.onflow.org/avatar/${pid}.svg`,
  },
})

// TODO: store on chain
const PROVIDERS = {
  ...pro(
    "asdf8701",
    "http://localhost:8701/flow/authenticate",
    "Flow Dev Wallet"
  ),
  ...pro(
    "asdf8702",
    "http://localhost:8702/flow/authenticate",
    "Potato Wallet"
  ),
  ...pro(
    "asdf8703",
    "http://localhost:8703/flow/authenticate",
    "Carrot Wallet"
  ),
}

const redirectUrl = base => {
  const url = new URL(base)
  for (let [k, v] of new URL(location).searchParams.entries()) {
    url.searchParams.append(k, v)
  }
  url.searchParams.delete("provider")
  url.searchParams.delete("force")
  return url
}

const Provider = ({pid}) => {
  const provider = PROVIDERS[pid]

  return provider == null
    ? null
    : html`
        <li>
          <a href=${redirectUrl(provider.authn)}>
            <img src=${provider.icon} height="16" />
            <strong>${provider.label}</strong>
          </a>
        </li>
      `
}

const mapProvider = pid =>
  html`
    <${Provider} key=${pid} pid=${pid} />
  `

const previousProviders = () => {
  return Object.entries(localStorage)
    .filter(([key]) => /^provider::/.test(key))
    .map(([_, value]) => value)
    .filter(Boolean)
}

const Previous = () => {
  const providers = previousProviders()

  return providers.length <= 0
    ? null
    : html`
        <h3>Previously Used Providers</h3>
        <ul>
          ${providers.map(mapProvider)}
        </ul>
        <hr />
      `
}

const Recommended = () => {
  const url = new URL(location)
  const pid = url.searchParams.get("provider")
  if (pid == null || PROVIDERS[pid] == null) return null

  return html`
    <h3>Recommended Provider</h3>
    <ul>
      <${Provider} pid=${pid} />
    </ul>
    <hr />
  `
}

const All = () => {
  const providers = Object.keys(PROVIDERS)

  return html`
    <h3>All Providers</h3>
    <ul>
      ${providers.map(mapProvider)}
    </ul>
  `
}

const Scope = () => {
  const {searchParams: params} = new URL(location)
  const scope = params.get("scope")
  const l6n = params.get("l6n")
  return scope == null
    ? null
    : html`
        <code>${l6n}</code>
        <ul>
          ${scope.split(/\s/g).map(
            d => html`
              <li key=${d}><code>${d}</code></li>
            `
          )}
        </ul>
      `
}

const Root = () => {
  const url = new URL(location)
  const params = url.searchParams

  if (!(params.has("l6n") && params.has("nonce"))) {
    return html`
      <h3>Invalid Query Parameters</h3>
      <p>
        <code>l6n</code> and <code>nonce</code> are required query paramaters.
      </p>
    `
  }
  if (
    params.has("provider") &&
    params.has("force") &&
    !previousProviders().length
  ) {
    const provider = PROVIDERS[params.get("provider")]
    if (provider != null) location.replace(redirectUrl(provider.authn))
  }

  return html`
    <h1>Flow Handshake</h1>
    <${Scope} />
    <${Previous} />
    <${Recommended} />
    <${All} />
  `
}

render(
  html`
    <${Root} />
  `,
  document.getElementById("Root")
)
