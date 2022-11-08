import {
  encodeKey,
  ECDSA_P256,
  ECDSA_secp256k1,
  SHA2_256,
  SHA3_256,
} from "./index.js"

const PUBLIC_KEYS = [
  "0bfcd8790c3ce88f3fac9d4bd23514f48bf0cdd1f6c3c8bdf87b11489b1bbeca1ef805ec2ee76451e9bdb265284f78febaeacbc8b0827e0a7baafee4e655d0b5",
  "92b3189b1a3b5d01fd807efbda46524d2ae4802b4c4a24ae571fd02da4bf9b8855ee51c7710f6a5b39f1097677dbb8c36a8268fa90011edc94d9d6028d8c9f47",
  "da19babe1066af1a75139b43c4f7ee2872d12d1ebdb21fd5d471ae74eb26f1912513ef59057086208c1ed0583f8eac714c90f6412f08f1d86f0ddf69189a13aa",
]

const CURVES = [ECDSA_P256, ECDSA_secp256k1]

const HASHINGS = [SHA2_256, SHA3_256]

const WEIGHTS = [0, 32, 512, 1000]

for (let [key_index, key] of PUBLIC_KEYS.entries()) {
  for (let [curve_index, curve] of CURVES.entries()) {
    for (let [hash_index, hash] of HASHINGS.entries()) {
      for (let [weight_index, weight] of WEIGHTS.entries()) {
        test(`key:${key_index} curve:${curve_index} hash:${hash_index} weight:${weight_index}`, () => {
          expect(encodeKey(key, curve, hash, weight)).toMatchSnapshot()
        })
      }
    }
  }
}
