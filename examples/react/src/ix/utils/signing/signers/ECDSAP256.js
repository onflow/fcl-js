import {ec as EC} from "elliptic"
import BN from "bn.js"
import KeyEncoder from "key-encoder"
import {SHA3} from "sha3"
import {bytes, bytesToBuffer, keyToBuffer} from "@onflow/bytes"

export function ECDSAPublicKey(algo, keyPair) {
  if (!(this instanceof ECDSAPublicKey))
    return new ECDSAPublicKey(algo, keyPair)
  this.algo = algo
  this.keyPair = keyPair
  this.toBuffer = () => {
    return Buffer.from(this.keyPair.getPublic("hex"), "hex")
  }
}

export function ECDSAPrivateKey(algo, keyPair) {
  if (!(this instanceof ECDSAPrivateKey))
    return new ECDSAPrivateKey(algo, keyPair)
  this.algo = algo
  this.keyPair = keyPair
  this.toBuffer = () => {
    return this.keyPair.getPrivate().toArrayLike(Buffer)
  }
  this.getPublicKey = () => {
    return new ECDSAPublicKey(this.algo, this.keyPair)
  }
}

export default function ECDSAP256Signer() {
  if (!(this instanceof ECDSAP256Signer)) return new ECDSAP256Signer()
  this.algo = "ecdsa_p256"
  this.signatureLength = 64
  this.privateKeyLength = 32
  this.hashpublicKeyLength = 64

  this.ec = new EC("p256")
  this.encoderOptions = {
    curveParameters: [1, 2, 840, 10045, 3, 1, 7],
    privatePEMOptions: {label: "EC PRIVATE KEY"},
    publicPEMOptions: {label: "PUBLIC KEY"},
    curve: new EC("p256"),
  }
  this.encoder = new KeyEncoder(this.encoderOptions)

  this.signTransactionPayload = (pk, payload) => {
    const sha3 = new SHA3(256)
    sha3.update(payload)
    const hash = bytes(Uint8Array.from(sha3.digest()), 32)
    const pkder = this.encoder.encodePrivate(pk, "raw", "der")
    console.log('pkdir', pkder)
    return this.signHash(this.decodePrivateKey(keyToBuffer(pkder)), hash)
  }

  this.signHash = (prKey, hash) => {
    if (prKey.algo !== this.algo) {
      throw new Error(
        `Private key uses ${prKey.algo} algorithm, expected ${this.algo}`
      )
    }

    const ecdsaPrKey = prKey
    const keyPair = ecdsaPrKey.keyPair

    const sig = keyPair.sign(bytesToBuffer(hash))

    const n = this.signatureLength / 2

    const r = sig.r.toArrayLike(Buffer, "be", n)
    const s = sig.s.toArrayLike(Buffer, "be", n)

    return Buffer.concat([r, s])
  }

  this.verifyHash = (pubKey, sig, hash) => {
    if (pubKey.algo !== this.algo) {
      throw new Error(
        `Public key uses ${pubKey.algo} algorithm, expected ${this.algo}`
      )
    }

    const ecdsaPubKey = pubKey
    const keyPair = ecdsaPubKey.keyPair

    const n = this.signatureLength / 2

    const r = new BN(sig.slice(0, n), "be")
    const s = new BN(sig.slice(n), "be")

    return keyPair.verify(bytesToBuffer(hash), {r: r, s: s})
  }

  this.generatePrivateKey = () => {
    const keyPair = this.ec.genKeyPair()
    return new ECDSAPrivateKey(this.algo, keyPair)
  }

  this.encodePrivateKey = prKey => {
    if (prKey.algo !== this.algo) {
      throw new Error(
        `Private key uses ${prKey.algo} algorithm, expected ${this.algo}`
      )
    }

    const hexStr = this.encoder.encodePrivate(
      prKey.toBuffer().toString("hex"),
      "raw",
      "der"
    )
    return Buffer.from(hexStr, "hex")
  }

  this.decodePrivateKey = der => {
    const hexStr = this.encoder.encodePrivate(der, "der", "raw")
    const buf = Buffer.from(hexStr, "hex")
    const keyPair = this.ec.keyFromPrivate(buf)
    return new ECDSAPrivateKey(this.algo, keyPair)
  }

  this.encodePublicKey = pubKey => {
    if (pubKey.algo !== this.algo) {
      throw new Error(
        `Public key uses ${pubKey.algo} algorithm, expected ${this.algo}`
      )
    }

    const hexStr = this.encoder.encodePublic(
      pubKey.toBuffer().toString("hex"),
      "raw",
      "der"
    )
    return Buffer.from(hexStr, "hex")
  }

  this.decodePublicKey = der => {
    const hexStr = this.encoder.encodePublic(der, "der", "raw")
    const buf = Buffer.from(hexStr, "hex")
    const keyPair = this.ec.keyFromPublic(buf)
    return new ECDSAPublicKey(this.algo, keyPair)
  }
}
