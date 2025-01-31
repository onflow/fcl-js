import {keccak_256} from "@noble/hashes/sha3"
import {TypedData} from "./types/eth"
import {hashTypedDataLegacy, hashTypedDataV3, hashTypedDataV4} from "./hash-utils"

jest.mock("@noble/hashes/sha3", () => ({
  keccak_256: jest.fn(() => Buffer.from("abcdef1234567890", "hex")),
}))

describe("Hash Utils", () => {
  const mockTypedData: TypedData = {
    domain: { name: "Ether Mail", chainId: 1 },
    message: { from: "Alice", to: "Bob", contents: "Hello" },
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "chainId", type: "uint256" },
      ],
      Mail: [
        { name: "from", type: "string" },
        { name: "to", type: "string" },
        { name: "contents", type: "string" },
      ],
    },
    primaryType: "Mail",
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should hash data correctly for eth_signTypedData (legacy)", () => {
    const result = hashTypedDataLegacy(mockTypedData)

    expect(keccak_256).toHaveBeenCalledWith(Buffer.from(JSON.stringify(mockTypedData), "utf8"))
    expect(result).toBe("0xabcdef1234567890")
  })

  it("should hash data correctly for eth_signTypedData_v3", () => {
    const result = hashTypedDataV3(mockTypedData)

    expect(keccak_256).toHaveBeenCalledTimes(3) // domain, message, and final hash
    expect(keccak_256).toHaveBeenCalledWith(Buffer.from(JSON.stringify(mockTypedData.domain), "utf8"))
    expect(keccak_256).toHaveBeenCalledWith(Buffer.from(JSON.stringify(mockTypedData.message), "utf8"))
    expect(keccak_256).toHaveBeenCalledWith(expect.any(Buffer)) // Final concatenated hash
    expect(result).toBe("0xabcdef1234567890")
  })

  it("should hash data correctly for eth_signTypedData_v4", () => {
    const result = hashTypedDataV4(mockTypedData)

    expect(keccak_256).toHaveBeenCalledWith(Buffer.from(JSON.stringify(mockTypedData), "utf8"))
    expect(result).toBe("0xabcdef1234567890")
  })
})