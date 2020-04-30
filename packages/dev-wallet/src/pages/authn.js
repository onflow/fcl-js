import {
  html,
  useState,
  useEffect,
  useCallback,
} from "https://unpkg.com/htm/preact/standalone.module.js"
import {Header} from "../comps/header.js"
import {gql} from "../utils/gql.js"
import {useConfig} from "../hooks/config.js"

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

const AuthForm = ({sessionId, onAuth = () => {}}) => {
  if (sessionId != null) return null
  const query = gql`
    mutation Authn($email: String, $passw: String) {
      authenticate(email: $email, pass: $passw) {
        sessionId
        userId
        addr
      }
    }
  `

  const [email, setEmail] = useState("")
  const [passw, setPassw] = useState("")
  const [errors, setErrors] = useState([])

  const authenticate = async e => {
    e.preventDefault()
    const {errors, data} = await query({email, passw})
    if (errors) setErrors(errors)
    onAuth(data.authenticate)
  }

  return html`
    <form onSubmit=${authenticate}>
      <h3>Authenticate</h3>
      ${!!errors.length &&
        html`
          <strong>Errors</strong>
          <ul style="color:tomato;">
            ${errors.map(
              (d, i) => html`
                <li key=${i}>${d.message}</li>
              `
            )}
          </ul>
        `}
      <div>
        <input
          value=${email}
          type="email"
          placeholder="email"
          onInput=${e => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          value=${passw}
          type="password"
          placeholder="password"
          onInput=${e => setPassw(e.target.value)}
        />
      </div>
      <div>
        <button onClick=${authenticate}>
          Authenticate
        </button>
      </div>
    </form>
  `
}

const queryMe = gql`
  query Me($sessionId: ID) {
    me(sessionId: $sessionId) {
      userId
      addr
      vsn
      email
      name
      avatar
      cover
      color
      bio
    }
  }
`

const upsertMe = gql`
  mutation Upsert($input: UpsertUserInput) {
    upsertUser(input: $input) {
      userId
      addr
      vsn
      email
      name
      avatar
      cover
      color
      bio
    }
  }
`

const ApproveScope = ({sessionId, setSessionId, user, setUser, onCode}) => {
  if (sessionId == null) return null
  if (user == null) return null

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

  const upsert = async e => {
    e.preventDefault()
    console.log("SESSION_ID", sessionId)
    const resp = await upsertMe({
      input: {sessionId, name, avatar, cover, color, bio},
    })
    setUser(resp.data.upsertUser)
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
      .profile-card {
        max-width: 377px;
        padding: 13px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 3px;
      }
      .cover {
        background: url(${cover}) no-repeat;
        background-size: cover;
        border-radius: 3px 3px;
        height: 144px;
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
    </style>
    <div class="profile-card column">
      <div class="cover row">
        <input
          placeholder="Cover Photo URL"
          value=${cover}
          onInput=${e => setCover(e.target.value)}
        />
      </div>
      <div class="row" style="padding:0 13px;">
        <div class="column" style="align-items:center;justify-content:center;">
          <img
            src=${avatar}
            width="89"
            height="89"
            style="margin-bottom:8px;border:3px solid ${color};border-radius:3px;background:white;margin-top:-50px;"
          />
          <input
            value=${avatar}
            onInput=${e => setAvatar(e.target.value)}
            style="width:89px;"
            placeholder="Avatar URL"
          />
          <input
            value=${color}
            onInput=${e => setColor(e.target.value)}
            style="width:89px;"
            placeholder="Color"
          />
        </div>
        <div class="column" style="flex:1;margin-left:13px;">
          <input
            placeholder="Name"
            value=${name}
            onInput=${e => setName(e.target.value)}
            style="font-size:21px;margin-top:13px;"
          />
          <textarea
            value=${bio}
            onInput=${e => setBio(e.target.value)}
            placeholder="Bio"
            style="width:90%;height:89px;"
          />
        </div>
      </div>
      <div class="row" style="justify-content:center;align-items:center;">
        <button onClick=${() => setSessionId(null)}>Log Out</button>
        ${dirty
          ? html`
              <button onClick=${upsert}>Save Changes</button>
            `
          : html`
              <button onClick=${() => onCode("TEMP_CODE")}>
                Use This Profile
              </button>
            `}
      </div>
    </div>
  `
}

export default () => {
  const config = useConfig()
  const [sessionId, setSessionId] = useState(localStorage.getItem("sessionId"))
  const [user, setUser] = useState(null)
  const [code, setCode] = useState(null)

  useEffect(() => {
    if (sessionId == null) {
      localStorage.removeItem("sessionId")
      setUser(null)
      setCode(null)
      return
    } else {
      localStorage.setItem("sessionId", sessionId)
      queryMe({sessionId}).then(({errors, data}) => {
        if (errors) setSessionId(null)
        else setUser(data.me)
      })
    }
  }, [sessionId])

  useEffect(() => {
    if (code == null) return
    const params = getParams()
    const message = {
      type: "FCL::CHALLENGE::RESPONSE",
      addr: user.addr,
      paddr: config.pid,
      code: code,
      exp: 0,
      hks: config.host + "/flow/hooks/" + user.userId,
      nonce: params.nonce,
      l6n: params.l6n,
    }
    window.parent.postMessage(message, params.l6n)
  }, [code])

  return html`
    <div>
      <${Header} />
      <${AuthForm}
        sessionId=${sessionId}
        onAuth=${d => setSessionId(d.sessionId)}
      />
      <${ApproveScope}
        key=${user == null ? 0 : user.vsn}
        sessionId=${sessionId}
        setSessionId=${setSessionId}
        user=${user}
        setUser=${setUser}
        onCode=${setCode}
      />
    </div>
  `
}
