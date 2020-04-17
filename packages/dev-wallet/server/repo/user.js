import {exec} from "../db"
import argon2 from "argon2"
import {v4 as uuid} from "uuid"
import {genKeys, sensorKeys} from "../crypto"

export const getUserByEmail = email =>
  new Promise(resolve =>
    exec(db => {
      db.serialize(() => {
        db.get("SELECT * FROM USERS WHERE email = ?", [email], (err, user) => {
          return err == null
            ? (console.log(`getUserByEmail(${email})`, sensorKeys(user)),
              resolve(user))
            : (console.error(`getUserByEmail(${email})`, err), resolve(null))
        })
      })
    })
  )

export const getUserById = userId =>
  new Promise(resolve =>
    exec(db => {
      db.serialize(() => {
        db.get(
          "SELECT * FROM USERS WHERE userId = ?",
          [userId],
          (err, user) => {
            return err == null
              ? (console.log(`getUserById(${userId})`, sensorKeys(user)),
                resolve(user))
              : (console.error(`getUserById(${userId})`, err), resolve(null))
          }
        )
      })
    })
  )

export const createUser = (email, password) =>
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
              ? (console.log(`createUser(${email}, ****)`, sensorKeys(user)),
                resolve(user))
              : (console.error(`createUser(${email}, ***)`, err), resolve(null))
          }
        )
      })
    })
  })
