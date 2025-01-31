import {keccak_256} from "@noble/hashes/sha3"
import {AccountManager} from "../../accounts/account-manager"
import {SignTypedDataParams} from "../../types/eth"

function hashTypedDataLegacy(data: any): string {
  return `0x${Buffer.from(keccak_256(Buffer.from(JSON.stringify(data)))).toString("hex")}`
}

function hashTypedDataV3(data: any): string {
  const domainHash = keccak_256(Buffer.from(JSON.stringify(data.domain)))
  const messageHash = keccak_256(Buffer.from(JSON.stringify(data.message)))

  const fullHash = keccak_256(
    Buffer.concat([
      Buffer.from("\x19\x01"), // EIP-712 prefix
      domainHash,
      messageHash,
    ])
  )

  return `0x${Buffer.from(fullHash).toString("hex")}`
}

function hashTypedDataV4(data: any): string {
  return `0x${Buffer.from(keccak_256(Buffer.from(JSON.stringify(data)))).toString("hex")}`
}

export async function signTypedData(
  accountManager: AccountManager,
  params: SignTypedDataParams,
  version: "eth_signTypedData" | "eth_signTypedData_v3" | "eth_signTypedData_v4"
) {
  const {address, data} = params

  if (!address || !data) {
    throw new Error("Missing signer address or typed data")
  }

  let hashedMessage: string
  if (version === "eth_signTypedData_v3") {
    hashedMessage = hashTypedDataV3(data)
  } else if (version === "eth_signTypedData_v4") {
    hashedMessage = hashTypedDataV4(data)
  } else {
    hashedMessage = hashTypedDataLegacy(data)
  }

  return await accountManager.signMessage(hashedMessage, address)
}
