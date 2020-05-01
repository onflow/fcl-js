import {
  html,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js"
import {useConfig} from "../hooks/config.js"

export const Header = () => {
  return null
  const {searchParams: params} = new URL(location)
  const config = useConfig()
  const [more, setMore] = useState(false)

  if (config == null)
    return html`
      <div>Loading...</div>
    `

  if (!more)
    return html`
      <div>
        <h3>${config.name}</h3>
        <button onClick=${() => setMore(true)}>Show Details</button>
      </div>
      <hr />
    `

  return html`
    <div>
      <h3>Authenticate With ${config.name}</h3>
      <button onClick=${() => setMore(false)}>Hide Details</button>
      <div style="display:flex;">
        <ul>
          <li><strong>l6n:</strong> ${params.get("l6n")}</li>
          <li><strong>nonce:</strong> ${params.get("nonce")}</li>
          <li><strong>scope:</strong> ${params.get("scope")}</li>
          <li><strong>redirect:</strong> ${params.get("redirect")}</li>
        </ul>
        <ul>
          <li><strong>pid:</strong> ${config.pid}</li>
          <li><strong>url:</strong> ${config.host}</li>
        </ul>
      </div>
    </div>
    <hr />
  `
}
