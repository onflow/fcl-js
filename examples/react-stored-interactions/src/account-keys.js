import React from "react"
import * as rlp from "rlp"

const DEFAULT_SIGNATURE_ALGORITHM = 2
const DEFAULT_HASH_ALGORITHM = 1
const DEFAULT_WEIGHT = 1000

export const defaultAccountKey = {
  signatureAlgorithm: DEFAULT_SIGNATURE_ALGORITHM,
  hashAlgorithm: DEFAULT_HASH_ALGORITHM,
  weight: DEFAULT_WEIGHT,
}

export const encodeAccountKey = ({ publicKey, signatureAlgorithm, hashAlgorithm, weight })  =>
  rlp
    .encode([
      Buffer.from(publicKey, "hex"),
      signatureAlgorithm,
      hashAlgorithm,
      weight,
    ])
    .toString("hex")

const parseNumber = (n) => n ? parseInt(n, 10) : 0

const AccountKeyInput = ({ accountKey, onChange }) => {
  return (
    <div>
      <input
        placeholder="public key"
        value={accountKey.publicKey}
        onChange={e => onChange({ ...accountKey, publicKey: e.target.value})}
      />
      <select 
        value={accountKey.signatureAlgorithm} 
        onChange={e => onChange({ ...accountKey, signatureAlgorithm: parseNumber(e.target.value)})} >
        <option value={2}>ECDSA_P256</option>
        <option value={3}>ECDSA_secp256k1</option>
      </select>
      <select 
        value={accountKey.hashAlgorithm} 
        onChange={e => onChange({ ...accountKey, hashAlgorithm: parseNumber(e.target.value)})} >
        <option value={1}>SHA2_256</option>
        <option value={3}>SHA3_256</option>
      </select>
      <input
        placeholder="weight"
        value={accountKey.weight}
        onChange={e => onChange({ ...accountKey, weight: parseNumber(e.target.value)})} />
    </div>
  );
};

export default AccountKeyInput;
