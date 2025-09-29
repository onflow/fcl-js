export type PublicKeyCredentialDescriptorJSON = {
  type: PublicKeyCredentialType
  id: string
  transports?: AuthenticatorTransport[]
}

export type WebAuthnCredentialRecord = {
  credentialId: string
  publicKeySec1Hex?: string
  address?: string
}

const b64uToBytes = (b64u: string): Uint8Array => {
  const pad = "=".repeat((4 - (b64u.length % 4)) % 4)
  const b64 = (b64u + pad).replace(/-/g, "+").replace(/_/g, "/")
  const raw = atob(b64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i)
  return arr
}

const bytesToB64u = (bytes: Uint8Array): string => {
  const bin = String.fromCharCode(...bytes)
  const b64 = btoa(bin)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
  return b64
}

export const generateChallenge = (length = 32): Uint8Array => {
  const c = new Uint8Array(length)
  crypto.getRandomValues(c)
  return c
}

const toArrayBuffer = (u8: Uint8Array): ArrayBuffer =>
  u8.buffer instanceof ArrayBuffer
    ? u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength)
    : new Uint8Array(u8).slice().buffer

export const sha256 = async (
  bytes: Uint8Array | ArrayBuffer
): Promise<Uint8Array> => {
  const data = bytes instanceof ArrayBuffer ? bytes : toArrayBuffer(bytes)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return new Uint8Array(digest)
}

const STORAGE_KEY = "passkey-wallet:credential"

export const saveCredential = (rec: WebAuthnCredentialRecord) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rec))
}

export const loadCredential = (): WebAuthnCredentialRecord | null => {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export const createCredential = async (): Promise<WebAuthnCredentialRecord> => {
  const challenge = generateChallenge()
  const rp = {name: "Passkey Wallet", id: window.location.hostname}
  const user = {
    id: crypto.getRandomValues(new Uint8Array(16)),
    name: "flow-user",
    displayName: "Flow User",
  }
  const pubKey: PublicKeyCredentialCreationOptions = {
    challenge: toArrayBuffer(challenge),
    rp,
    user,
    pubKeyCredParams: [
      {type: "public-key", alg: -7},
      {type: "public-key", alg: -257},
    ],
    authenticatorSelection: {userVerification: "preferred"},
    timeout: 60000,
    attestation: "none",
  }
  const cred = (await navigator.credentials.create({
    publicKey: pubKey,
  })) as PublicKeyCredential
  const att = cred.response as AuthenticatorAttestationResponse
  const attObj = new Uint8Array(att.attestationObject as ArrayBuffer)
  const cosePubKey = extractCosePublicKeyFromAttestation(attObj)
  const publicKeySec1Hex = coseEcP256ToSec1UncompressedHex(cosePubKey)
  const record: WebAuthnCredentialRecord = {
    credentialId: cred.id,
    publicKeySec1Hex,
  }
  saveCredential(record)
  return record
}

export const getAssertion = async (
  allowIdB64u?: string,
  challengeArg?: Uint8Array
) => {
  const challenge = challengeArg ?? generateChallenge()
  const allow: PublicKeyCredentialDescriptor[] | undefined = allowIdB64u
    ? [{type: "public-key", id: toArrayBuffer(b64uToBytes(allowIdB64u))}]
    : undefined
  const options: PublicKeyCredentialRequestOptions = {
    challenge: toArrayBuffer(challenge),
    allowCredentials: allow,
    userVerification: "preferred",
    timeout: 60000,
  }
  const assertion = (await navigator.credentials.get({
    publicKey: options,
  })) as PublicKeyCredential
  const resp = assertion.response as AuthenticatorAssertionResponse
  return {
    assertion,
    clientDataJSON: new Uint8Array(resp.clientDataJSON as ArrayBuffer),
    authenticatorData: new Uint8Array(resp.authenticatorData as ArrayBuffer),
    signature: new Uint8Array(resp.signature as ArrayBuffer),
  }
}

export const bytesToHex = (b: Uint8Array) =>
  Array.from(b)
    .map(x => x.toString(16).padStart(2, "0"))
    .join("")
export const hexToBytes = (hex: string) =>
  new Uint8Array((hex.match(/.{1,2}/g) || []).map(b => parseInt(b, 16)))
export const bytesToBase64Url = bytesToB64u
export const base64UrlToBytes = b64uToBytes

// Convert ASN.1 DER-encoded ECDSA (r,s) signature into 64-byte raw (r||s)
export const derToP256Raw = (der: Uint8Array): Uint8Array => {
  let offset = 0
  const readLen = (): number => {
    let len = der[offset++]
    if (len & 0x80) {
      const numBytes = len & 0x7f
      len = 0
      for (let i = 0; i < numBytes; i++) len = (len << 8) | der[offset++]
    }
    return len
  }
  if (der[offset++] !== 0x30) throw new Error("Invalid DER: expected SEQUENCE")
  /* const seqLen = */ readLen()
  if (der[offset++] !== 0x02) throw new Error("Invalid DER: expected INTEGER r")
  let rLen = readLen()
  let r = der.slice(offset, offset + rLen)
  offset += rLen
  if (der[offset++] !== 0x02) throw new Error("Invalid DER: expected INTEGER s")
  let sLen = readLen()
  let s = der.slice(offset, offset + sLen)
  // Drop leading 0x00 if present (ensures positive integer)
  if (r[0] === 0x00) r = r.slice(1)
  if (s[0] === 0x00) s = s.slice(1)
  // Left-pad to 32 bytes
  const pad = (x: Uint8Array) =>
    x.length < 32
      ? new Uint8Array([...new Uint8Array(32 - x.length).fill(0), ...x])
      : x.length > 32
        ? x.slice(-32)
        : x
  const r32 = pad(r)
  const s32 = pad(s)
  const out = new Uint8Array(64)
  out.set(r32, 0)
  out.set(s32, 32)
  return out
}

// COSE/CBOR helpers
// Using a lightweight CBOR decoder for browsers
import {decode as cborDecodeLib} from "cbor-x"
type CborValue = any
const cborDecode = (buf: ArrayBuffer | Uint8Array): CborValue =>
  cborDecodeLib(buf instanceof Uint8Array ? buf : new Uint8Array(buf))

type CoseKey = Map<number, any> | {[key: number]: any}

const getFromCose = (cose: CoseKey, label: number) => {
  return cose instanceof Map ? cose.get(label) : (cose as any)[label]
}

const extractCosePublicKeyFromAttestation = (
  attestationObject: Uint8Array
): CoseKey => {
  const decoded: any = cborDecode(attestationObject)
  const authData: Uint8Array = decoded.authData
  // Parse authenticator data to reach the credentialPublicKey (CBOR)
  let offset = 0
  offset += 32 // rpIdHash
  const flags = authData[offset]
  offset += 1 // flags
  offset += 4 // signCount
  const FLAG_AT = 0x40
  if ((flags & FLAG_AT) === 0)
    throw new Error("Attested credential data not present")
  // attestedCredentialData
  offset += 16 // AAGUID
  const credIdLen = (authData[offset] << 8) | authData[offset + 1]
  offset += 2
  offset += credIdLen // skip credentialId
  const coseBytes = authData.slice(offset)
  return cborDecode(coseBytes)
}

const coseEcP256ToSec1UncompressedHex = (cose: CoseKey): string => {
  // COSE labels: -1 = crv (1=P-256), -2 = x, -3 = y
  const crv = getFromCose(cose, -1)
  if (crv !== 1) throw new Error("Unsupported COSE curve (expected P-256)")
  const x: Uint8Array = getFromCose(cose, -2)
  const y: Uint8Array = getFromCose(cose, -3)
  if (!x || !y || x.length !== 32 || y.length !== 32) {
    throw new Error("Invalid P-256 public key coordinates")
  }
  const uncompressed = new Uint8Array(1 + 32 + 32)
  uncompressed[0] = 0x04
  uncompressed.set(x, 1)
  uncompressed.set(y, 33)
  return bytesToHex(uncompressed)
}
