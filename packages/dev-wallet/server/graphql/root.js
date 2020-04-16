import * as CONFIG from "../config"
import {exec} from "../db"
import argon2 from "argon2"
import {v4 as uuid} from "uuid"
import {generateKeyPair} from "crypto"

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const EXPIRE_DELTA = DAY * 7

const genKeys = async () =>
  new Promise(resolve => {
    generateKeyPair(
      "rsa",
      {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
          cipher: "aes-256-cbc",
          passphrase: CONFIG.SECRET,
        },
      },
      (err, publicKey, privateKey) => {
        const keys = {publicKey, privateKey}
        return err == null
          ? (console.log(`genKeys()`, keys), resolve(keys))
          : (console.error(`genKeys()`, err), resolve(null))
      }
    )
  })

const getUserByEmail = email =>
  new Promise(resolve =>
    exec(db => {
      db.serialize(() => {
        db.get("SELECT * FROM USERS WHERE email = ?", [email], (err, user) => {
          return err == null
            ? (console.log(`getUserByEmail(${email})`, user), resolve(user))
            : (console.error(`getUserByEmail(${email})`, err), resolve(null))
        })
      })
    })
  )

const getUserById = userId =>
  new Promise(resolve =>
    exec(db => {
      db.serialize(() => {
        db.get(
          "SELECT * FROM USERS WHERE userId = ?",
          [userId],
          (err, user) => {
            return err == null
              ? (console.log(`getUserById(${userId})`, user), resolve(user))
              : (console.error(`getUserById(${userId})`, err), resolve(null))
          }
        )
      })
    })
  )

const createUser = (email, password) =>
  new Promise(async resolve => {
    const userId = uuid()
    const passwordHash = await argon2.hash(password)
    const {publicKey, privateKey} = await genKeys()

    const user = {userId, email, passwordHash, privateKey, publicKey}

    exec((db, log) => {
      db.serialize(() => {
        db.run(
          "INSERT INTO USERS (userId, email, passwordHash, privateKey, publicKey) VALUES (?, ?, ?, ?, ?)",
          [userId, email, passwordHash, privateKey, publicKey],
          (err, row) => {
            return err == null
              ? (console.log(`createUser(${email}, ****)`, user), resolve(user))
              : (console.error(`createUser(${email}, ***)`, err), resolve(null))
          }
        )
      })
    })
  })

const getSession = token =>
  new Promise(async resolve => {
    exec(db => {
      db.serialize(() => {
        db.get(
          "SELECT * FROM SESSIONS WHERE token = ?",
          [token],
          (err, session) => {
            return err == null
              ? (console.log(`getSession(${token})`, session), resolve(session))
              : (console.error(`getSession(${token})`, err), resolve(null))
          }
        )
      })
    })
  })

const createSession = userId =>
  new Promise(async resolve => {
    const token = uuid()
    const expiresAt = Date.now() + EXPIRE_DELTA

    exec(db => {
      db.serialize(() => {
        db.run(
          "INSERT INTO SESSIONS (token, userId, expiresAt) VALUES (?, ?, ?)",
          [token, userId, expiresAt],
          (err, row) => {
            const session = {token, userId, expiresAt}
            return err == null
              ? (console.log(`createSession(${userId})`, session),
                resolve(session))
              : (console.error(`createSession(${userId})`, err),
                resolve(session))
          }
        )
      })
    })
  })

export const authenticate = async ({email, password}) => {
  let user = await getUserByEmail(email)
  if (user == null) {
    await createUser(email, password)
    user = await getUserByEmail(email)
  }
  if (!(await argon2.verify(user.passwordHash, password))) {
    throw new Error("Invalid Email or Password")
  }
  const session = await createSession(user.userId)

  return {...session, user: user}
}

export const me = async ({token}) => {
  let session = await getSession(token)
  if (session == null) {
    throw new Error("Invalid Session Token")
  }
  let user = await getUserById(session.userId)
  return user
}

export const info = async () => ({
  pid: CONFIG.PID,
  name: CONFIG.NAME,
  icon: CONFIG.ICON,
})
