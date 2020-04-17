import {exec} from "../db"
import {v4 as uuid} from "uuid"

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const EXPIRE_DELTA = DAY * 7

export const getSession = token =>
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

export const createSession = userId =>
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
