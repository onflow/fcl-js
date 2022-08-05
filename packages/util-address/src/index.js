export function sansPrefix(address) {
  if (address == null) return null
  return address.replace(/^0x/, "").replace(/^Fx/, "")
}

export function withPrefix(address) {
  if (address == null) return null
  return "0x" + sansPrefix(address)
}

export function display(address) {
  return withPrefix(address)
}

// [n,k,d]-Linear code parameters
// The linear code used in the account addressing is a [64,45,7]
// It generates a [64,45]-code, which is the space of Flow account addresses.
//
// n is the size of the code words in bits,
// which is also the size of the account addresses in bits.
const linearCodeN = 64

// Columns of the parity-check matrix H of the [64,45]-code used for Flow addresses.
// H is a (n x p) matrix with coefficients in GF(2), each column is converted into
// a big endian integer representation of the GF(2) column vector.
// H is used to verify a code word is a valid account address.
const parityCheckMatrixColumns = [
	0x00001, 0x00002, 0x00004, 0x00008,
	0x00010, 0x00020, 0x00040, 0x00080,
	0x00100, 0x00200, 0x00400, 0x00800,
	0x01000, 0x02000, 0x04000, 0x08000,
	0x10000, 0x20000, 0x40000, 0x7328d,
	0x6689a, 0x6112f, 0x6084b, 0x433fd,
	0x42aab, 0x41951, 0x233ce, 0x22a81,
	0x21948, 0x1ef60, 0x1deca, 0x1c639,
	0x1bdd8, 0x1a535, 0x194ac, 0x18c46,
	0x1632b, 0x1529b, 0x14a43, 0x13184,
	0x12942, 0x118c1, 0x0f812, 0x0e027,
	0x0d00e, 0x0c83c, 0x0b01d, 0x0a831,
	0x0982b, 0x07034, 0x0682a, 0x05819,
	0x03807, 0x007d2, 0x00727, 0x0068e,
	0x0067c, 0x0059d, 0x004eb, 0x003b4,
	0x0036a, 0x002d9, 0x001c7, 0x0003f,
].map(BigInt)

const NETWORK_CODEWORDS = {
  "mainnet": BigInt(0),
  "testnet": BigInt(0x6834ba37b3980209),
  "emulator": BigInt(0x1cb159857af02018)
}

const NETWORKS = new Set(["mainnet", "testnet", "emulator"])

export function isValidAddressForNetwork({
  address,
  network
}) {
  if (!address) throw new Error("isValidAddressForNetwork({ address }) -- address is required")
  if (typeof address !== "string") throw new Error("isValidAddressForNetwork({ address }) -- address must be a string")
  if (!network) throw new Error("isValidAddressForNetwork({ network }) -- network is required")
  if (typeof network !== "string") throw new Error("isValidAddressForNetwork({ network }) -- network must be a string")

  if (!(NETWORKS.has(network))) throw new Error(`isValidAddressForNetwork({ network }) -- network=${network} is not supported`)

  let networkCodeword = NETWORK_CODEWORDS[network]

  if (typeof networkCodeword === "undefined") throw new Error(`isValidAddressForNetwork -- Could not find network codeword for network=${network}`)

	let codeWord = BigInt(address)
	codeWord ^= networkCodeword

	if (codeWord === BigInt(0)) {
		return false
	}

	// Multiply the code word GF(2)-vector by the parity-check matrix
	let parity = BigInt(0)
	for (let i = 0; i < linearCodeN; i++) {
		if ((codeWord & BigInt(1)) === BigInt(1)) {
			parity ^= parityCheckMatrixColumns[i]
		}
		codeWord >>= BigInt(1)
	}
	return (parity === BigInt(0)) && (codeWord === BigInt(0))
}
