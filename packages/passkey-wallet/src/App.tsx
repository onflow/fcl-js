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
  const [darkMode, setDarkMode] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<
    Array<{address: string; credentialId?: string; balance?: string}>
  >([])
  const [isRegistering, setIsRegistering] = useState<boolean>(false)

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
    // initialize accounts list from storage and saved address
    try {
      const raw = localStorage.getItem("passkey-wallet:accounts")
      const list: Array<{address: string; credentialId?: string}> = raw
        ? JSON.parse(raw)
        : []
      const addrs = new Set<string>(list.map(x => x.address.toLowerCase()))
      if (saved?.address && !addrs.has(saved.address.toLowerCase())) {
        list.push({address: saved.address, credentialId: saved.credentialId})
      }
      const unique = Array.from(
        new Map(list.map(x => [x.address.toLowerCase(), x])).values()
      )
      localStorage.setItem("passkey-wallet:accounts", JSON.stringify(unique))
      setAccounts(unique)
    } catch {}
    const url = new URL(window.location.href)
    setDebugMode(url.searchParams.get("debug") === "1")
    try {
      const mq =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
      const init = !!mq?.matches
      setDarkMode(init)
      const onChange = (e: MediaQueryListEvent) => setDarkMode(!!e.matches)
      mq?.addEventListener?.("change", onChange)
      return () => {
        window.removeEventListener("message", onMsg)
        mq?.removeEventListener?.("change", onChange)
      }
    } catch {
      return () => window.removeEventListener("message", onMsg)
    }
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

  // Fetch balances for accounts list
  useEffect(() => {
    let aborted = false
    const fetchBalances = async () => {
      try {
        const results: Array<{
          address: string
          credentialId?: string
          balance?: string
        }> = []
        for (const acc of accounts) {
          try {
            const res = await fetch(
              `https://rest-testnet.onflow.org/v1/accounts/${acc.address.replace(/^0x/, "")}`
            )
            if (!res.ok) {
              results.push({
                address: acc.address,
                credentialId: acc.credentialId,
                balance: "0",
              })
              continue
            }
            const json = await res.json()
            const bal = json?.account?.balance
            results.push({
              address: acc.address,
              credentialId: acc.credentialId,
              balance:
                bal == null ? "0" : typeof bal === "string" ? bal : String(bal),
            })
          } catch {
            results.push({
              address: acc.address,
              credentialId: acc.credentialId,
              balance: "0",
            })
          }
        }
        if (!aborted) setAccounts(results)
      } catch {}
    }
    if (accounts.length > 0) fetchBalances()
    return () => {
      aborted = true
    }
  }, [accounts.length])

  // Ensure body has no margin and hide window scrollbars (use internal scroll areas)
  useEffect(() => {
    const prevMargin = document.body.style.margin
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.margin = "0"
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    return () => {
      document.body.style.margin = prevMargin
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [])

  // Resize popup to fit content (min/max bounds)
  useEffect(() => {
    const measureAndResize = () => {
      try {
        if (!window.resizeTo) return
        const doc = document.documentElement
        const body = document.body
        const contentHeight = Math.max(
          doc.scrollHeight,
          body.scrollHeight,
          doc.offsetHeight,
          body.offsetHeight,
          doc.clientHeight
        )
        const rootEl = (document.getElementById("root") || body) as HTMLElement
        const rootWidth =
          Math.ceil(
            rootEl.scrollWidth || rootEl.getBoundingClientRect().width
          ) || 620
        const innerTargetWidth = Math.min(660, Math.max(560, rootWidth + 8))
        const chromeW = Math.max(
          0,
          (window.outerWidth || 0) - (window.innerWidth || 0)
        )
        const chromeH = Math.max(
          0,
          (window.outerHeight || 0) - (window.innerHeight || 0)
        )
        const outerW = Math.max(
          window.outerWidth || 0,
          Math.round(innerTargetWidth + chromeW)
        )
        const minH = 480
        const maxH = 900
        const innerTargetHeight = Math.min(maxH, Math.max(minH, contentHeight))
        const outerH = Math.max(
          window.outerHeight || 0,
          Math.round(innerTargetHeight + chromeH)
        )
        window.resizeTo(outerW, outerH)
      } catch {}
    }
    const id = window.requestAnimationFrame(measureAndResize)
    return () => window.cancelAnimationFrame(id)
  }, [viewMode, accounts.length, readyPayload, uiError, address, darkMode])

  const doRegister = async () => {
    try {
      setIsRegistering(true)
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
        try {
          const raw = localStorage.getItem("passkey-wallet:accounts")
          const list: Array<{address: string; credentialId?: string}> = raw
            ? JSON.parse(raw)
            : []
          if (
            !list.find(x => x.address.toLowerCase() === newAddr.toLowerCase())
          )
            list.push({address: newAddr, credentialId: rec.credentialId})
          localStorage.setItem("passkey-wallet:accounts", JSON.stringify(list))
          setAccounts(list)
        } catch {}
      }
    } catch (e: any) {
      decline(e?.message || "Passkey registration failed")
    } finally {
      setIsRegistering(false)
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
      // Prefer the credentialId stored for the selected address, fallback to global credId
      const acctCredId = accounts.find(
        a => a.address.toLowerCase() === address.toLowerCase()
      )?.credentialId
      const {signature, clientDataJSON, authenticatorData} = await getAssertion(
        acctCredId || credId,
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

  const theme = useMemo(
    () => ({
      bg: darkMode ? "#0b0d12" : "#fff",
      text: darkMode ? "#e6e6e6" : "#111",
      subtext: darkMode ? "#9aa4b2" : "#555",
      border: darkMode ? "#263040" : "#ddd",
      panel: darkMode ? "#141922" : "#f8f9fa",
      divider: darkMode ? "#1f2937" : "#eee",
      badgeBg: darkMode ? "#1f2937" : "#f1f3f5",
      primary: darkMode ? "#7b93ff" : "#000",
      primaryText: darkMode ? "#0b0d12" : "#fff",
      danger: "#b00020",
    }),
    [darkMode]
  )

  const pageStyle: React.CSSProperties = {
    minHeight: "auto",
    display: "block",
    background: theme.bg,
    padding: 8,
    fontFamily: "ui-sans-serif,system-ui",
    overflowX: "hidden",
  }
  const cardStyle: React.CSSProperties = {
    background: "transparent",
    borderRadius: 0,
    width: "100%",
    maxWidth: "640px",
    maxHeight: "none",
    overflow: "visible",
    boxShadow: "none",
    padding: 0,
    margin: "0 auto",
  }
  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: `1px solid ${theme.border}`,
    padding: 8,
    borderRadius: 8,
    background: darkMode ? "#0f1420" : "#fff",
    color: theme.text,
  }
  const buttonStyle: React.CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${theme.border}`,
    background: theme.panel,
    cursor: "pointer",
    color: theme.text,
  }
  const buttonPrimary: React.CSSProperties = {
    ...buttonStyle,
    background: theme.primary,
    color: theme.primaryText,
    border: `1px solid ${theme.primary}`,
  }
  const buttonDanger: React.CSSProperties = {
    ...buttonStyle,
    background: darkMode ? "transparent" : "#fff",
    color: theme.danger,
    border: `1px solid ${theme.danger}`,
  }
  const footerStyle: React.CSSProperties = {
    position: "sticky",
    bottom: 0,
    background: theme.bg,
    borderTop: `1px solid ${theme.divider}`,
    padding: 12,
    marginTop: 16,
  }
  const badgeStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "2px 6px",
    borderRadius: 6,
    background: theme.badgeBg,
    fontSize: 12,
    color: theme.text,
  }
  const shimmer: React.CSSProperties = {
    position: "relative",
    overflow: "hidden",
    background: darkMode ? "#101623" : "#e9ecef",
  }
  const shimmerAfter: React.CSSProperties = {
    content: '""' as any,
    position: "absolute",
    top: 0,
    left: -200,
    height: "100%",
    width: 200,
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
    animation: "shimmer 1.2s infinite",
  }
  const divider: React.CSSProperties = {
    height: 1,
    background: theme.divider,
    margin: "8px 0",
  }
  const mono: React.CSSProperties = {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    fontSize: 12,
  }
  const contentStyle: React.CSSProperties = {
    maxHeight: "calc(100vh - 120px)",
    overflowY: "auto",
  }

  const formatFlow = (bal?: string | number) => {
    if (bal == null) return "—"
    const raw = String(bal).trim()
    if (raw === "") return "—"
    if (raw.includes(".")) {
      const [i, f = ""] = raw.split(".")
      const intPart = i.replace(/^0+(?=\d)/, "") || "0"
      const fracTrimmed = f.replace(/0+$/, "")
      return fracTrimmed ? `${intPart}.${fracTrimmed}` : intPart
    }
    const s = raw.replace(/^0+/, "") || "0"
    const fracLen = 8
    if (s === "0") return "0"
    if (s.length <= fracLen) {
      const frac = s.padStart(fracLen, "0").replace(/0+$/, "")
      return frac ? `0.${frac}` : "0"
    }
    const intPart =
      s.slice(0, s.length - fracLen).replace(/^0+(?=\d)/, "") || "0"
    const fracPart = s.slice(-fracLen).replace(/0+$/, "")
    return fracPart ? `${intPart}.${fracPart}` : intPart
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
  const selectedAccount = useMemo(
    () =>
      accounts.find(
        a => a.address?.toLowerCase() === (address || "").toLowerCase()
      ),
    [accounts, address]
  )
  const selectedCredId = selectedAccount?.credentialId || credId
  const maskedSelectedCred = selectedCredId
    ? `${selectedCredId.slice(0, 6)}...${selectedCredId.slice(-6)}`
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
        <div style={{display: "grid", gap: 10, ...contentStyle}}>
          <div>
            <div style={{fontWeight: 600, color: theme.text, marginBottom: 6}}>
              Choose an account
            </div>
            <div style={{display: "grid", gap: 8}}>
              {isRegistering && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: `1px solid ${theme.border}`,
                    borderRadius: 10,
                    padding: 10,
                    background: theme.bg,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      ...shimmer,
                    }}
                  >
                    <div style={shimmerAfter} />
                  </div>
                  <div style={{flex: 1, minWidth: 0}}>
                    <div style={{height: 12, borderRadius: 4, ...shimmer}}>
                      <div style={shimmerAfter} />
                    </div>
                    <div
                      style={{
                        height: 10,
                        marginTop: 6,
                        width: "60%",
                        borderRadius: 4,
                        ...shimmer,
                      }}
                    >
                      <div style={shimmerAfter} />
                    </div>
                  </div>
                  <span style={{...badgeStyle, opacity: 0.7}}>Creating…</span>
                </div>
              )}
              {accounts.length === 0 && (
                <div style={{color: theme.subtext, fontSize: 13}}>
                  No accounts found.
                </div>
              )}
              {accounts.map(acc => {
                const selected =
                  address?.toLowerCase() === acc.address.toLowerCase()
                return (
                  <button
                    key={acc.address}
                    onClick={() => setAddress(acc.address)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      textAlign: "left",
                      background: selected
                        ? darkMode
                          ? "#16203a"
                          : "#eef1ff"
                        : theme.bg,
                      border: selected
                        ? `1px solid ${darkMode ? "#7b93ff" : "#4c6fff"}`
                        : `1px solid ${theme.border}`,
                      padding: 10,
                      borderRadius: 10,
                      cursor: "pointer",
                      color: theme.text,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: "inline-flex",
                        width: 28,
                        height: 28,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        border: `1px solid ${theme.border}`,
                        background: theme.panel,
                      }}
                    >
                      {/* person icon */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle cx="12" cy="8" r="4" stroke={theme.text} />
                        <path
                          d="M4 20c0-3.3137 3.5817-6 8-6s8 2.6863 8 6"
                          stroke={theme.text}
                        />
                      </svg>
                    </span>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: theme.text,
                          fontSize: 14,
                        }}
                      >
                        {acc.address}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: theme.subtext,
                          marginTop: 2,
                        }}
                      >
                        Balance: {formatFlow(acc.balance)} FLOW
                      </div>
                    </div>
                    {selected && (
                      <span
                        style={{
                          ...badgeStyle,
                          background: darkMode ? "#7b93ff" : "#4c6fff",
                          color: darkMode ? "#0b0d12" : "#fff",
                        }}
                      >
                        Selected
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
          {!hasCredential && (
            <div style={{color: theme.subtext, fontSize: 13}}>
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
        <div style={{marginTop: 12, fontSize: 12, color: theme.subtext}}>
          <div>Account: {hasAddress ? address : "none"}</div>
          <div>Passkey: {maskedSelectedCred}</div>
          {uiError && (
            <div style={{color: theme.danger, marginTop: 8}}>{uiError}</div>
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
          <div style={{display: "grid", gap: 10, ...contentStyle}}>
            {cadence && (
              <div>
                <div style={{fontWeight: 600, color: "#333", marginBottom: 6}}>
                  Cadence
                </div>
                <pre
                  style={{
                    ...mono,
                    background: darkMode ? "#0f1420" : "#f8f9fa",
                    color: theme.text,
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
              <div style={{fontWeight: 600, color: theme.text}}>Details</div>
              <div style={{fontSize: 13, color: theme.text}}>
                <span style={{fontWeight: 600}}>Payer:</span> {v?.payer}
              </div>
              <div style={{fontSize: 13, color: theme.text}}>
                <span style={{fontWeight: 600}}>Proposer:</span>{" "}
                {v?.proposalKey?.address}
              </div>
              <div style={{fontSize: 13, color: theme.text}}>
                <span style={{fontWeight: 600}}>Authorizers:</span>{" "}
                {(v?.authorizers || []).join(", ")}
              </div>
              {typeof v?.computeLimit === "number" && (
                <div style={{fontSize: 13, color: theme.text}}>
                  <span style={{fontWeight: 600}}>Compute limit:</span>{" "}
                  {v.computeLimit}
                </div>
              )}
              {Array.isArray(v?.arguments) && v.arguments.length > 0 && (
                <div style={{fontSize: 13, color: theme.text}}>
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
          <div>Passkey: {maskedSelectedCred}</div>
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
