import {useEffect, useMemo, useState} from "react"
import "./App.css"
import {ready, approve, decline} from "./wallet/messaging"
import type {AuthnResponse, Service, Signable} from "./wallet/types"
import {
  encodeMessageFromSignable,
  encodeTransactionPayload,
  hexToBytes,
} from "./wallet/encode"
import {
  createCredential,
  loadCredential,
  getAssertion,
  bytesToHex,
  derToP256Raw,
  sha256,
} from "./wallet/webauthn"
import {encode as rlpEncode} from "@onflow/rlp"
import {createAccountWithPublicKey} from "./wallet/provision"
import {setAccountApiFromReadyPayload} from "./wallet/provision"

const WALLET_NAME = "Passkey Wallet"
const WALLET_UID_PREFIX = "passkey-wallet"
const ICON_URL = new URL("/vite.svg", window.location.origin).toString()

function buildServices(addr: string): Service[] {
  const endpoint = window.location.origin + window.location.pathname
  return [
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authn",
      method: "POP/RPC",
      uid: `${WALLET_UID_PREFIX}#authn`,
      endpoint,
      id: addr,
      identity: {f_type: "Identity", f_vsn: "1.0.0", address: addr, keyId: 0},
      provider: {
        f_type: "ServiceProvider",
        address: "0x0",
        name: WALLET_NAME,
        icon: ICON_URL,
      },
    },
    {
      f_type: "Service",
      f_vsn: "1.0.0",
      type: "authz",
      method: "POP/RPC",
      uid: `${WALLET_UID_PREFIX}#authz`,
      endpoint,
      id: addr,
      identity: {f_type: "Identity", f_vsn: "1.0.0", address: addr, keyId: 0},
    },
  ]
}

export default function App() {
  const [readyPayload, setReadyPayload] = useState<any>()
  const [address, setAddress] = useState<string>("0xUSER")
  const [credId, setCredId] = useState<string | undefined>()
  const [uiError, setUiError] = useState<string | undefined>()
  const [chainKeyHex, setChainKeyHex] = useState<string | undefined>()
  const [chainKeyMatches, setChainKeyMatches] = useState<boolean | undefined>()
  const [passkeyPubHex, setPasskeyPubHex] = useState<string | undefined>()
  const [debugMode, setDebugMode] = useState<boolean>(false)
  const [hostOrigin, setHostOrigin] = useState<string>("")
  const [viewMode, setViewMode] = useState<"authn" | "authz" | "home">("home")
  const [signable, setSignable] = useState<Signable | undefined>()

  // no-op placeholder removed

  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      const {data} = ev
      if (!data || typeof data !== "object") return
      const type = (data as any).type
      if (type === "FCL:VIEW:READY:RESPONSE") {
        setHostOrigin(ev.origin)
        const body = (data as any).body || (data as any)
        setReadyPayload(body)
        // Determine view mode
        if (body?.voucher) {
          setViewMode("authz")
          setSignable(body as Signable)
        } else {
          setViewMode("authn")
          setSignable(undefined)
        }
        try {
          setAccountApiFromReadyPayload(data as any)
        } catch {}
      } else if (type === "FCL:VIEW:CLOSE") {
        if (!debugMode) window.close()
      }
    }
    window.addEventListener("message", onMsg)
    // Tell FCL we are ready to receive
    ready()
    const saved = loadCredential()
    if (saved) {
      setCredId(saved.credentialId)
      if (saved.address) setAddress(saved.address)
      if (saved.publicKeySec1Hex)
        setPasskeyPubHex(saved.publicKeySec1Hex.toLowerCase())
    }
    // removed multi-account initialization
    const url = new URL(window.location.href)
    setDebugMode(url.searchParams.get("debug") === "1")
    return () => window.removeEventListener("message", onMsg)
  }, [])

  useEffect(() => {
    const run = async () => {
      try {
        const saved = loadCredential()
        if (!saved?.publicKeySec1Hex) return
        const addr = address && address !== "0xUSER" ? address : saved.address
        if (!addr) return
        // REST testnet access node
        const res = await fetch(
          `https://rest-testnet.onflow.org/v1/accounts/${addr.replace(/^0x/, "")}`
        )
        if (!res.ok) return
        const json = await res.json()
        const keys = json?.account?.keys || []
        const pk = keys[0]?.public_key as string | undefined
        if (!pk) return
        setChainKeyHex(pk.toLowerCase())
        const trimmed = saved.publicKeySec1Hex.toLowerCase().replace(/^04/, "")
        setChainKeyMatches(pk.toLowerCase() === trimmed)
      } catch {}
    }
    run()
  }, [address])

  // Resize the popup window to logical dimensions per view
  useEffect(() => {
    try {
      const baseWidth = 660
      const baseHeight = viewMode === "authz" ? 720 : 560
      if (window.resizeTo) {
        // Avoid making it smaller than current to not annoy users
        const targetW = Math.max(window.outerWidth || baseWidth, baseWidth)
        const targetH = Math.max(window.outerHeight || baseHeight, baseHeight)
        window.resizeTo(targetW, targetH)
      }
    } catch {}
  }, [viewMode])

  const doRegister = async () => {
    try {
      const rec = await createCredential()
      setCredId(rec.credentialId)
      if (rec.publicKeySec1Hex) {
        const newAddr = await createAccountWithPublicKey(rec.publicKeySec1Hex, {
          signAlgo: 1, // ECDSA_P256
          hashAlgo: 1, // SHA2_256
          weight: 1000,
        })
        const updated = {...rec, address: newAddr}
        localStorage.setItem(
          "passkey-wallet:credential",
          JSON.stringify(updated)
        )
        setAddress(newAddr)
        // account switches to newly created address automatically
      }
    } catch (e: any) {
      decline(e?.message || "Passkey registration failed")
    }
  }

  const doAuthn = async () => {
    try {
      // If no stored address, try to provision via account API when we have a passkey pubkey
      let addr = address
      const saved = loadCredential()
      if (
        (!addr || addr === "0xUSER") &&
        saved?.publicKeySec1Hex &&
        !saved?.address
      ) {
        let newAddr: string
        try {
          newAddr = await createAccountWithPublicKey(saved.publicKeySec1Hex, {
            signAlgo: 1, // ECDSA_P256
            hashAlgo: 1, // SHA2_256
            weight: 1000,
          })
        } catch (e: any) {
          const msg = String(e?.message || e || "")
          if (msg.includes("Account API not configured")) {
            setUiError(
              "Account API not configured. Set VITE_PASSKEY_ACCOUNT_API or pass service.data.accountApi from the host."
            )
            return
          }
          throw e
        }
        addr = newAddr
        // persist address alongside credential
        const updated = {...saved, address: newAddr}
        localStorage.setItem(
          "passkey-wallet:credential",
          JSON.stringify(updated)
        )
        setAddress(newAddr)
      }
      const services = buildServices(addr)
      const resp: AuthnResponse = {
        f_type: "AuthnResponse",
        f_vsn: "1.0.0",
        addr,
        services,
      }
      approve(resp)
    } catch (e: any) {
      decline(e?.message || "Authn failed")
    }
  }

  const doAuthz = async () => {
    try {
      const signable: Signable | undefined =
        (readyPayload as any)?.body || (readyPayload as any)
      if (!signable) throw new Error("No signable payload provided")
      // Construct the correct message for this signer
      const msgHex = encodeMessageFromSignable(signable as any, address)
      const payloadMsgHex = encodeTransactionPayload(signable.voucher as any)
      const role = msgHex === payloadMsgHex ? "payload" : "envelope"
      // FLIP 264: Use the signable message hash per account key's hashAlgo.
      // Key was provisioned with SHA2_256, so compute SHA-256(msgHex) as challenge.
      const challenge = await sha256(hexToBytes(msgHex))
      // WebAuthn assertion for passkey credential using hashed challenge
      const {signature, clientDataJSON, authenticatorData} = await getAssertion(
        credId,
        challenge
      )
      // Debug prints (non-sensitive snippets)
      // ED flag is bit 6 of flags in authenticatorData (index 32)
      const flags = authenticatorData[32]
      const ED = (flags & 0x80) !== 0 // actually bit 7 in some docs; we print flags
      const dbg = {
        addr: address,
        keyId: 0,
        role,
        challengeFirst4: Array.from(challenge.slice(0, 4)),
        authDataLen: authenticatorData.length,
        clientDataLen: clientDataJSON.length,
        sigDerLen: signature.length,
        flags,
        ED,
      }
      console.debug("[passkey-wallet] authz dbg", dbg)
      try {
        ;(window as any).opener?.postMessage(
          {type: "PASSKEY_WALLET:DBG", payload: dbg},
          "*"
        )
      } catch {}
      // Flow expects raw P-256 r||s (64 bytes) in signature field; extension_data carries WebAuthn materials
      const sigHex = bytesToHex(derToP256Raw(signature))
      // Attach WebAuthn materials per FLIP-264:
      // extension_data = 0x01 || RLP([authenticatorData, clientDataJSON])
      const rlpEncoded = rlpEncode([authenticatorData, clientDataJSON]) as any
      const rlpBytes =
        rlpEncoded instanceof Uint8Array
          ? (rlpEncoded as Uint8Array)
          : new Uint8Array(rlpEncoded)
      const signatureExtension = new Uint8Array(1 + rlpBytes.length)
      signatureExtension[0] = 0x01
      signatureExtension.set(rlpBytes, 1)
      const dbg2 = {
        sigLen: signature.length,
        sigFirst4: Array.from(signature.slice(0, 4)),
        extLen: signatureExtension.length,
        extFirst4: Array.from(signatureExtension.slice(0, 4)),
      }
      console.debug("[passkey-wallet] authz dbg2", dbg2)
      try {
        ;(window as any).opener?.postMessage(
          {type: "PASSKEY_WALLET:DBG2", payload: dbg2},
          "*"
        )
      } catch {}
      const composite = {
        f_type: "CompositeSignature",
        f_vsn: "1.0.0",
        addr: address,
        keyId: 0,
        signature: sigHex,
        signatureExtension,
      }
      console.log("[passkey-wallet] CompositeSignature", composite)
      try {
        ;(window as any).opener?.console?.log(
          "[passkey-wallet→host] CompositeSignature",
          composite
        )
      } catch {}
      try {
        ;(window as any).opener?.postMessage(
          {type: "PASSKEY_WALLET:COMPOSITE_SIGNATURE", payload: composite},
          "*"
        )
      } catch {}
      approve(composite)
    } catch (e: any) {
      decline(e?.message || "Authz failed")
    }
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "block",
    background: "#fff",
    padding: 12,
    fontFamily: "ui-sans-serif,system-ui",
  }
  const cardStyle: React.CSSProperties = {
    background: "transparent",
    borderRadius: 0,
    width: "min(92vw, 660px)",
    maxHeight: "none",
    overflow: "visible",
    boxShadow: "none",
    padding: 0,
    margin: "0 auto",
  }
  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid #ddd",
    padding: 8,
    borderRadius: 8,
  }
  const buttonStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#f8f9fa",
    cursor: "pointer",
  }
  const buttonPrimary: React.CSSProperties = {
    ...buttonStyle,
    background: "#000",
    color: "#fff",
    border: "1px solid #000",
  }
  const buttonDanger: React.CSSProperties = {
    ...buttonStyle,
    background: "#fff",
    color: "#b00020",
    border: "1px solid #b00020",
  }
  const footerStyle: React.CSSProperties = {
    position: "sticky",
    bottom: 0,
    background: "#fff",
    borderTop: "1px solid #eee",
    padding: 12,
    marginTop: 16,
  }
  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 6,
    background: "#f1f3f5",
    fontSize: 12,
    color: "#333",
  }
  const divider: React.CSSProperties = {
    height: 1,
    background: "#eee",
    margin: "8px 0",
  }
  const mono: React.CSSProperties = {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 12,
  }

  // removed balance formatter (no multi-account balances)

  const appMeta = useMemo(() => {
    try {
      const payload = readyPayload ? {body: readyPayload} : undefined
      const body = readyPayload ?? undefined
      const params = (payload as any)?.params ?? (body as any)?.params
      const app =
        (payload as any)?.app ||
        (body as any)?.app ||
        (payload as any)?.config?.app ||
        (body as any)?.config?.app ||
        params?.app
      const url: string | undefined = app?.url || app?.href || params?.url
      const name: string | undefined = app?.name
      const icon: string | undefined = app?.icon
      const originUrl = url || hostOrigin || document.referrer || ""
      return {
        name: name || (originUrl ? new URL(originUrl).host : ""),
        icon,
        url: originUrl,
      }
    } catch {
      return {
        name: hostOrigin || "",
        icon: undefined as string | undefined,
        url: hostOrigin,
      }
    }
  }, [readyPayload, hostOrigin])

  const hasCredential = !!credId
  const hasAddress = !!address && address !== "0xUSER"
  const maskedCred = credId
    ? `${credId.slice(0, 6)}...${credId.slice(-6)}`
    : "none"

  const renderHeader = (
    title: string,
    subtitle?: string,
    extra?: React.ReactNode
  ) => (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 6,
        }}
      >
        {appMeta.icon && (
          <img
            src={appMeta.icon}
            alt="app icon"
            style={{width: 28, height: 28, borderRadius: 6}}
            onError={(e: any) => (e.currentTarget.style.display = "none")}
          />
        )}
        <div>
          <h3 style={{margin: 0, fontSize: 18}}>{title}</h3>
          {subtitle && (
            <div style={{marginTop: 4, color: "#666", fontSize: 13}}>
              {subtitle}
            </div>
          )}
        </div>
        {extra}
      </div>
      <div style={divider} />
    </>
  )

  const renderAuthn = () => (
    <div style={pageStyle}>
      <div style={cardStyle}>
        {renderHeader(
          "Connect to Passkey Wallet",
          appMeta.name ? `${appMeta.name} wants to connect` : undefined,
          appMeta.url ? (
            <span style={{marginLeft: "auto", ...badgeStyle}}>
              {new URL(appMeta.url).host}
            </span>
          ) : undefined
        )}
        <div style={{display: "grid", gap: 10}}>
          <div>
            <div style={{fontWeight: 600, color: "#333", marginBottom: 6}}>
              Selected account
            </div>
            <input
              value={hasAddress ? address : "No account"}
              readOnly
              style={inputStyle}
            />
          </div>
          {!hasCredential && (
            <div style={{color: "#666", fontSize: 13}}>
              No passkey found. Create one to continue.
            </div>
          )}
          <div
            style={{display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4}}
          >
            {!hasCredential && (
              <button onClick={doRegister} style={buttonStyle}>
                Create New Passkey
              </button>
            )}
            {hasCredential && (
              <button onClick={doRegister} style={buttonStyle}>
                Add Another Passkey
              </button>
            )}
          </div>
        </div>
        <div style={{marginTop: 12, fontSize: 12, color: "#666"}}>
          <div>Account: {hasAddress ? address : "none"}</div>
          <div>Passkey: {maskedCred}</div>
          {uiError && (
            <div style={{color: "#b00020", marginTop: 8}}>{uiError}</div>
          )}
        </div>
        <div style={footerStyle}>
          <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
            <button
              onClick={() => decline("User declined")}
              style={buttonDanger}
            >
              Deny
            </button>
            <button onClick={doAuthn} style={buttonPrimary}>
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAuthz = () => {
    const v = signable?.voucher as any
    const cadence: string = v?.cadence || ""
    const cadencePreview = cadence.split("\n").slice(0, 16).join("\n")
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          {renderHeader(
            "Approve Transaction",
            appMeta.name ? `Requested by ${appMeta.name}` : undefined,
            appMeta.url ? (
              <span style={{marginLeft: "auto", ...badgeStyle}}>
                {new URL(appMeta.url).host}
              </span>
            ) : undefined
          )}
          <div style={{display: "grid", gap: 10}}>
            {cadence && (
              <div>
                <div style={{fontWeight: 600, color: "#333", marginBottom: 6}}>
                  Cadence
                </div>
                <pre
                  style={{
                    ...mono,
                    background: "#f8f9fa",
                    padding: 8,
                    borderRadius: 8,
                    overflowX: "auto",
                    textAlign: "left",
                  }}
                >
                  {cadencePreview}
                </pre>
              </div>
            )}
            <div style={{display: "grid", gap: 6}}>
              <div style={{fontWeight: 600, color: "#333"}}>Details</div>
              <div style={{fontSize: 13, color: "#333"}}>
                <span style={{fontWeight: 600}}>Payer:</span> {v?.payer}
              </div>
              <div style={{fontSize: 13, color: "#333"}}>
                <span style={{fontWeight: 600}}>Proposer:</span>{" "}
                {v?.proposalKey?.address}
              </div>
              <div style={{fontSize: 13, color: "#333"}}>
                <span style={{fontWeight: 600}}>Authorizers:</span>{" "}
                {(v?.authorizers || []).join(", ")}
              </div>
              {typeof v?.computeLimit === "number" && (
                <div style={{fontSize: 13, color: "#333"}}>
                  <span style={{fontWeight: 600}}>Compute limit:</span>{" "}
                  {v.computeLimit}
                </div>
              )}
              {Array.isArray(v?.arguments) && v.arguments.length > 0 && (
                <div style={{fontSize: 13, color: "#333"}}>
                  <span style={{fontWeight: 600}}>Arguments:</span>{" "}
                  {v.arguments.length}
                </div>
              )}
            </div>
          </div>
          <div style={{marginTop: 12, fontSize: 12, color: "#666"}}>
            <div>Signing as: {hasAddress ? address : "no account"}</div>
          </div>
          <div style={footerStyle}>
            <div style={{display: "flex", gap: 8, justifyContent: "flex-end"}}>
              <button
                onClick={() => decline("User declined")}
                style={buttonDanger}
              >
                Deny
              </button>
              <button onClick={doAuthz} style={buttonPrimary}>
                Approve Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderHome = () => (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{margin: 0, marginBottom: 8}}>{WALLET_NAME}</h2>
        <p style={{marginTop: 0, color: "#555"}}>
          {hasCredential ? "Passkey found" : "No passkey found"}
        </p>
        {hasAddress && (
          <>
            <p style={{marginTop: 8, color: "#333", fontWeight: 600}}>
              Address
            </p>
            <input value={address} readOnly style={inputStyle} />
          </>
        )}
        <div style={{marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap"}}>
          {!hasCredential && (
            <button onClick={doRegister} style={buttonPrimary}>
              Create Passkey Wallet
            </button>
          )}
          {hasCredential && (
            <button onClick={doAuthn} style={buttonPrimary}>
              Sign in with Passkey
            </button>
          )}
          <button onClick={doRegister} style={buttonStyle}>
            Create New Passkey
          </button>
          <button onClick={doAuthn} style={buttonStyle}>
            Continue
          </button>
          <button onClick={doAuthz} style={buttonStyle}>
            Authorize
          </button>
        </div>
        <div style={{marginTop: 16, fontSize: 12, color: "#666"}}>
          <div>Account: {hasAddress ? address : "none"}</div>
          <div>Passkey: {maskedCred}</div>
          {chainKeyHex && (
            <div>
              On-chain key matches passkey: {chainKeyMatches ? "yes" : "no"}
            </div>
          )}
          {chainKeyHex && passkeyPubHex && (
            <div style={{marginTop: 4}}>
              <div>
                On-chain pubkey: {chainKeyHex.slice(0, 10)}…
                {chainKeyHex.slice(-10)}
              </div>
              <div>
                Passkey pubkey: {passkeyPubHex.slice(0, 10)}…
                {passkeyPubHex.slice(-10)}
              </div>
            </div>
          )}
          {uiError && (
            <div style={{color: "#b00020", marginTop: 8}}>{uiError}</div>
          )}
        </div>
      </div>
    </div>
  )

  return viewMode === "authn"
    ? renderAuthn()
    : viewMode === "authz"
      ? renderAuthz()
      : renderHome()
}
