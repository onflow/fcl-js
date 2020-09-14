import {
  html,
  useState,
  useEffect,
  useCallback,
} from "https://unpkg.com/htm/preact/standalone.module.js"
import {Header} from "../comps/header.js"
import {useConfig} from "../hooks/config.js"
import * as api from "../api/api.js"

const CHAR = "0123456789abcdef"
const randChar = () => CHAR[~~(Math.random() * CHAR.length)]
const rand = (length) => Array.from({length}, randChar).join("")
const randColor = () => `#${rand(6)}`
const uuid = () => [rand(8), rand(4), rand(4), rand(4), rand(12)].join("-")

const DEBUG = false

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

const AuthForm = ({config = {}, sessionId, onAuth = () => {}}) => {
  if (config == null) return null
  if (sessionId != null) return null

  const [email, setEmail] = useState("")
  const [passw, setPassw] = useState("")
  const [errors, setErrors] = useState([])

  const authenticate = async (e) => {
    e.preventDefault()
    const {errors, data} = await api.authenticate({email, passw})
    if (DEBUG)
      console.log("%capi.authenticate", "color:#0066ff;", {errors, data})
    if (errors) setErrors(errors)
    onAuth(data.authenticate.sessionId)
  }

  return html`
    <form onSubmit=${authenticate}>
      <small>${config.name}</small>
      <h3>Authenticate</h3>
      ${!!errors.length &&
      html`
        <strong>Errors</strong>
        <ul style="color:tomato;">
          ${errors.map((d, i) => html` <li key=${i}>${d.message}</li> `)}
        </ul>
      `}
      <div>
        <input
          value=${email}
          type="email"
          placeholder="email"
          onInput=${(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          value=${passw}
          type="password"
          placeholder="password"
          onInput=${(e) => setPassw(e.target.value)}
        />
      </div>
      <div>
        <button onClick=${authenticate}>Authenticate</button>
      </div>
    </form>
  `
}

const ApproveScope = ({
  sessionId,
  setSessionId,
  user,
  setUser,
  onHandshakeId,
  config,
}) => {
  const params = getParams()
  if (sessionId == null) return null
  if (user == null) return null
  if (config == null) return null

  const [dirty, setDirty] = useState(false)
  const [name, setName] = useState(user.name)
  const [avatar, setAvatar] = useState(user.avatar)
  const [cover, setCover] = useState(user.cover)
  const [color, setColor] = useState(user.color)
  const [bio, setBio] = useState(user.bio)

  useEffect(() => {
    const isDirty =
      name !== user.name ||
      avatar !== user.avatar ||
      cover !== user.cover ||
      color !== user.color ||
      bio !== user.bio
    setDirty(isDirty)
  }, [name, avatar, cover, color, bio])

  const upsert = async (e) => {
    e.preventDefault()
    const {error, data} = await api.upsertUser({
      input: {sessionId, name, avatar, cover, color, bio},
    })
    if (DEBUG) console.log("%api.upsertUser", "color:#0066ff;", {error, data})
    setUser(data.upsertUser)
  }

  const useProfile = async (e) => {
    e.preventDefault()
    const params = getParams()
    const {error, data} = await api.genHandshake({
      input: {
        sessionId,
        l6n: params.l6n,
        nonce: params.nonce,
      },
    })
    if (DEBUG)
      console.log("%capi.genhandshake", "color:#0066ff;", {error, data})
    onHandshakeId(data.genHandshake)
  }

  return html`
    <style>
      .row {
        display: flex;
      }
      .column {
        display: flex;
        flex-direction: column;
      }

      .profile-card h3 {
        font-size: 13px;
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .profile-card h3 em {
        font-weight: normal;
        font-style: normal;
        font-family: monospace;
        opacity: 0.5;
        font-size: 11px;
      }
      .cover {
        background: url(${cover}) no-repeat;
        background-size: cover;
        border-radius: 3px 3px;
        height: 144px;
        min-height: 144px;
        max-height: 144px;
        align-items: flex-end;
        justify-content: flex-end;
        border-bottom: 3px solid ${color};
      }

      .profile-card input,
      .profile-card textarea {
        border: 1px solid rgba(0, 0, 0, 0.3);
        margin-bottom: 8px;
        border-radius: 3px;
        box-sizing: border-box;
      }
      .profile-card button {
        flex: 1;
        color: ${color};
        border: 3px solid currentColor;
        font-size: 13px;
        line-height: 32px;
        padding: 0 21px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 3px;
      }
      .profile-card button + button {
        margin-left: 8px;
      }
      .profile-card hr {
        display: block;
        border: none;
        height: 2px;
        width: 100%;
        border-radius: 3px;
        background: ${color};
        opacity: 0.5;
      }
    </style>
    <div class="profile-card column">
      <h3>
        <span>${config.name}</span>
        <em>${params.l6n}</em>
      </h3>
      <hr />
      <div class="column" style="flex:1;overflow-y:scroll;">
        <h3 style="margin-top:13px;">
          <span>Public Profile</span>
          <em>${user.addr}</em>
        </h3>
        <div class="cover row">
          <input
            placeholder="Cover Photo URL"
            value=${cover}
            onInput=${(e) => setCover(e.target.value)}
          />
        </div>
        <div class="row" style="padding:0 13px;">
          <div
            class="column"
            style="align-items:center;justify-content:flex-start;"
          >
            <img
              src=${avatar}
              width="89"
              height="89"
              style="margin-bottom:8px;border:3px solid ${color};border-radius:3px;background:white;margin-top:-53px;"
              ondblclick=${(e) =>
                setAvatar(`https://avatars.onflow.org/avatar/${uuid()}.svg`)}
            />
            <input
              value=${avatar}
              style="width:89px;"
              placeholder="Avatar URL"
              onFocus=${(e) => e.target.select()}
              onInput=${(e) => setAvatar(e.target.value)}
              ondblclick=${(e) =>
                setAvatar(`https://avatars.onflow.org/avatar/${uuid()}.svg`)}
            />
            <input
              value=${color}
              style="width:89px;"
              placeholder="Color"
              onFocus=${(e) => e.target.select()}
              onInput=${(e) => setColor(e.target.value)}
              ondblclick=${(e) => setColor(randColor())}
            />
          </div>
          <div class="column" style="flex:1;margin-left:13px;">
            <input
              placeholder="Name"
              value=${name}
              style="font-size:21px;margin-top:13px;"
              onFocus=${(e) => e.target.select()}
              onInput=${(e) => setName(e.target.value)}
            />
            <textarea
              value=${bio}
              placeholder="Bio"
              style="width:90%;height:44px;"
              onFocus=${(e) => e.target.select()}
              onInput=${(e) => setBio(e.target.value)}
            />
          </div>
        </div>
        ${false &&
        html`
          <h3 style="margin-top:21px;">Requested Private Info</h3>
          <hr />
          <ul>
            <li>Email: <input /></li>
          </ul>
          <hr />
        `}
      </div>
      <div
        class="row"
        style="justify-content:center;align-items:center;margin-top:13px;"
      >
        <button onClick=${() => setSessionId(null)}>Log Out</button>
        ${dirty
          ? html` <button onClick=${upsert}>Save Changes</button> `
          : html` <button onClick=${useProfile}>Use This Profile</button> `}
      </div>
    </div>
  `
}

export default () => {
  const config = useConfig()
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"))
  const [user, setUser] = useState(null)
  const [handshakeId, setHandshakeId] = useState(null)

  useEffect(() => {
    if (sessionId == null) {
      localStorage.removeItem("sessionId")
      setUser(null)
      setHandshakeId(null)
      return
    } else {
      localStorage.setItem("sessionId", sessionId)
      api.me({sessionId}).then(({errors, data}) => {
        if (DEBUG) console.log("%capi.me", "color:#0066ff;", {errors, data})
        if (errors) setSessionId(null)
        else setUser(data.me)
      })
    }
  }, [sessionId])

  useEffect(() => {
    if (handshakeId == null) return
    api.handshake({sessionId, handshakeId}).then(({error, data}) => {
      if (DEBUG) console.log("%capi.handshake", "color:#0066ff;", {error, data})
      const {handshake: hs} = data
      const msg = {
        type: "FCL::CHALLENGE::RESPONSE",
        addr: hs.addr,
        paddr: hs.paddr,
        code: hs.handshakeId,
        exp: hs.exp,
        hks: hs.hooks,
        l6n: hs.l6n,
      }
      window.parent.postMessage(msg, msg.l6n)
    })
  }, [handshakeId])

  if (DEBUG)
    console.log("%cknowledge", "color:purple", {
      params: getParams(),
      config,
      sessionId,
      user,
      handshakeId,
    })

  return html`
    <style>
      .root {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .inner {
        background: white;
        padding: 13px;
        border-radius: 3px;
      }
    </style>
    <div class="root">
      <div class="inner">
        <${Header} />
        <${AuthForm}
          config=${config}
          sessionId=${sessionId}
          onAuth=${setSessionId}
        />
        <${ApproveScope}
          key=${user == null ? 0 : user.vsn}
          sessionId=${sessionId}
          setSessionId=${setSessionId}
          user=${user}
          setUser=${setUser}
          onHandshakeId=${setHandshakeId}
          config=${config}
        />
      </div>
    </div>
  `
}
