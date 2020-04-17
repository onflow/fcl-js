import * as CONFIG from "../config"
import {createSign, createVerify, generateKeyPairSync} from "crypto"

export const sensorKey = (key, label, ...args) =>
  [label, [key.slice(0, 5), key.slice(key.length - 5)].join("..."), ...args]
    .filter(Boolean)
    .join(" ")

export const sensorKeys = obj => {
  if (obj == null) return obj
  const {privateKey, publicKey, ...rest} = obj
  return {
    ...rest,
    publicKey: sensorKey(publicKey, "PUBLIC", "type=spki", "format=der(hex)"),
    privateKey: sensorKey(
      privateKey,
      "PRIVATE",
      "type=pkcs8",
      "format=der(hex)",
      "cipher=aes-256-cbc"
    ),
  }
}

export const genKeys = () => {
  const {publicKey, privateKey} = generateKeyPairSync("rsa", {
    modulusLength: 1024, // 4096
    publicKeyEncoding: {
      type: "spki",
      format: "der",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "der",
      cipher: "aes-256-cbc",
      passphrase: CONFIG.SECRET,
    },
  })

  return {
    publicKey: publicKey.toString("hex"),
    privateKey: privateKey.toString("hex"),
  }
}

export const sign = (user, data) => {
  var sx = createSign("SHA384")
  sx.write(data)
  sx.end()
  return sx
    .sign({
      key: Buffer.from(user.privateKey, "hex"),
      format: "der",
      type: "pkcs8",
      passphrase: CONFIG.SECRET,
    })
    .toString("hex")
}

export const verify = (user, data, signature) => {
  var vx = createVerify("SHA384")
  vx.write(data)
  vx.end()
  return vx.verify(
    {key: Buffer.from(user.publicKey, "hex"), format: "der", type: "spki"},
    Buffer.from(signature, "hex")
  )
}
