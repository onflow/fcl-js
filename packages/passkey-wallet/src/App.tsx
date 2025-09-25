import {useEffect, useState} from "react"
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

  // no-op placeholder removed

  useEffect(() => {
    const onMsg = (ev: MessageEvent) => {
      const {data} = ev
      if (!data || typeof data !== "object") return
      const type = (data as any).type
      if (type === "FCL:VIEW:READY:RESPONSE") {
        setReadyPayload((data as any).body || (data as any))
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f7f7",
    padding: 16,
    fontFamily: "ui-sans-serif,system-ui",
  }
  const cardStyle: React.CSSProperties = {
    background: "#fff",
    borderRadius: 12,
    width: "min(92vw, 520px)",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
    padding: 16,
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

  const hasCredential = !!credId
  const hasAddress = !!address && address !== "0xUSER"
  const maskedCred = credId
    ? `${credId.slice(0, 6)}...${credId.slice(-6)}`
    : "none"

  return (
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
}
