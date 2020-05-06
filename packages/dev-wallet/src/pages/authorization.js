import {
  html,
  useState,
  useEffect,
  useCallback,
} from "https://unpkg.com/htm/preact/standalone.module.js"
import {useConfig} from "../hooks/config.js"
import * as api from "../api/api.js"

const DEBUG = false

export default ({authorizationId}) => {
  const config = useConfig()
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"))
  const [user, setUser] = useState(null)
  const [authorization, setAuthorization] = useState(null)

  useEffect(() => {
    if (sessionId == null) {
      localStorage.removeItem("sessionId")
      setUser(null)
      setAuthorization(null)
    } else {
      localStorage.setItem("sessionId", sessionId)
      api.me({sessionId}).then(({errors, data}) => {
        if (DEBUG) console.log("%capi.me", "color:#0066ff;", {errors, data})
        if (errors) setSessionId(null)
        else setUser(data.me)
      })
      api.authorization({sessionId, authorizationId}).then(({errors, data}) => {
        if (DEBUG)
          console.log("%capi.authorization", "color:#0066ff;", {errors, data})
        if (data) setAuthorization(data.authorization)
      })
    }
  }, [sessionId])

  if (sessionId == null)
    return html`
      <div>Authenticate</div>
    `
  if (user == null)
    return html`
      <div>Loading...</div>
    `
  if (authorization == null)
    return html`
      <div>Loading...</div>
    `

  const transaction = JSON.parse(authorization.transaction)

  const input = {sessionId, authorizationId}

  return html`
    <div>
      <h3>Authorization: ${authorization.status}</h3>
      <div>AuthzId: ${authorizationId}</div>
      <div>
        <span>As: </span>
        <strong
          >${Object.entries(transaction.roles)
            .filter(([key, value]) => value)
            .map(([key]) => key.toUpperCase())
            .join(" ")}
        </strong>
      </div>
      <div>
        <pre>${transaction.interaction.message.cadence}</pre>
      </div>
      <div>
        <button onClick=${() => api.approveAuthorization({input})}>
          Approve
        </button>
        <button onClick=${() => api.declineAuthorization({input})}>
          Decline
        </button>
      </div>
    </div>
  `
}
