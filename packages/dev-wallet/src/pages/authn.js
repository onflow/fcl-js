import {
  html,
  useState,
  useEffect,
} from "https://unpkg.com/htm/preact/standalone.module.js"

const getParams = () => {
  const {searchParams: params} = new URL(location)
  return {
    l6n: params.get("l6n"),
    nonce: params.get("nonce"),
    scope: params.get("scope"),
    redirect: params.get("redirect"),
    key: `CHALLENGE::${params.get("l6n")}::${params.get("nonce")}`,
  }
}

export default () => {
  const [email, setEmail] = useState("")
  const [passw, setPassw] = useState("")

  useEffect(() => {
    const px = getParams()
    localStorage.setItem(px.key, JSON.stringify(px))
  }, [])

  return html`
    <input
      value=${email}
      type="email"
      placeholder="email"
      onChange=${e => setEmail(e.target.value)}
    />
    <input
      value=${passw}
      type="password"
      placeholder="password"
      onChange=${e => setPassw(e.target.value)}
    />
    <button>Authenticate</button>
  `
}
