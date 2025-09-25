export type ProvisionAccountRequest = {
  publicKey: string
  signatureAlgorithm: "ECDSA_P256" | "ECDSA_secp256k1"
  hashAlgorithm: "SHA2_256"
}

export type ProvisionAccountResponse = {
  address: string // 0x-prefixed Flow address
}

const STORAGE_KEY = "passkey-wallet:accountApi"
const HARDWARE_WALLET_API =
  "https://hardware-wallet-api-testnet.staging.onflow.org/accounts"

export const setAccountApiFromReadyPayload = (readyMsg: any) => {
  try {
    const service = readyMsg?.body?.service ?? readyMsg?.service
    const accountApi = service?.data?.accountApi as string | undefined
    if (accountApi) localStorage.setItem(STORAGE_KEY, accountApi)
  } catch {}
}

const getAccountApi = (): string => {
  const fromStorage = localStorage.getItem(STORAGE_KEY)
  if (fromStorage) return fromStorage
  const fromEnv = (window as any).__PASSKEY_WALLET_ACCOUNT_API__ as
    | string
    | undefined
  if (fromEnv) return fromEnv
  // Hardcoded default per requested spec
  return HARDWARE_WALLET_API
}

export async function createAccountWithPublicKey(
  publicKeySec1Hex: string,
  _opts?: {signAlgo?: number; hashAlgo?: number; weight?: number}
): Promise<string> {
  const api = getAccountApi()
  // Hardware wallet API expects hex publicKey without SEC1 0x04 prefix
  const trimmed = publicKeySec1Hex.startsWith("04")
    ? publicKeySec1Hex.slice(2)
    : publicKeySec1Hex
  const body: ProvisionAccountRequest = {
    publicKey: trimmed,
    signatureAlgorithm: "ECDSA_P256",
    hashAlgorithm: "SHA2_256",
  }
  const res = await fetch(api, {
    method: "POST",
    headers: {Accept: "application/json", "Content-Type": "application/json"},
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Account API error: ${res.status}`)
  const json = (await res.json()) as ProvisionAccountResponse
  if (!json?.address) throw new Error("Account API missing address in response")
  return json.address
}
