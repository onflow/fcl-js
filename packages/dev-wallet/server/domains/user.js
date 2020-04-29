import * as CONFIG from "../config"
import {v4 as uuid} from "uuid"
import argon2 from "argon2"
import * as fcl from "@onflow/fcl"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {createSession} from "./session"
import {genKeys, signWithKey} from "../crypto"
import {CONTRACT} from "../flow/contract-noop"
import {createFlowAccount} from "../flow/create-flow-account"

const USERS = {}

const invariant = (fact, msg, ...rest) => {
  if (!fact) {
    const error = new Error(`INVARIANT ${msg}`)
    error.stack = error.stack
      .split("\n")
      .filter(d => !/at invariant/.test(d))
      .join("\n")
    console.error("\n\n---\n\n", error, "\n\n", ...rest, "\n\n---\n\n")
    throw error
  }
}

export const getUser = userId =>
  USERS[userId] != null ? [userId, USERS[userId]] : [null, null]

export const getUserBy = (key, value) =>
  Object.entries(USERS).find(([userId, u]) => u[key] === value) || [null, null]

export const getUserByEmail = email => getUserBy("email", email)

export const upsertUser = async (data = {}) => {
  let {
    email = null,
    pass = null,
    name = null,
    avatar = null,
    cover = null,
    color = null,
    bio = null,
    newPass = null,
    newEmail = null,
  } = data
  invariant(email, "upsertUser({ email }) -- email is required", data)
  invariant(pass, "upsertUser({ pass }) -- pass is required", data)
  let [userId, user] = getUserByEmail(email)

  if (user == null) {
    user = {
      userId: uuid(),
      email,
      pass: await argon2.hash(pass),
      ...(await createFlowAccount()),
    }
    userId = user.userId

    invariant(user.userId, "users require an userId")
    invariant(user.email, "users require an email")
    invariant(user.pass, "users require a password")
    invariant(user.addr, "users require a flow address")
    invariant(user.publicKey, "users require a publicKey")
    invariant(user.privateKey, "users require a privateKey")
    invariant(user.keyId != null, "users require a keyId")

    USERS[userId] = user
  }

  // validate passwords need to match
  invariant(await argon2.verify(user.pass, pass), "Invalid email or password")

  // update
  if (newEmail != null) user.email = email
  if (newPass != null) user.pass = await argon2.hash(pass)
  if (name != null) user.name = name
  if (avatar != null) user.avatar = avatar
  if (cover != null) user.cover = cover
  if (color != null) user.color = color
  if (bio != null) user.bio = bio

  if (user.avatar == null)
    user.avatar = `https://avatars.onflow.org/avatar/${user.addr}.svg`
  if (user.cover == null) user.cover = `https://placekitten.com/1440/480`
  if (user.color == null) user.color = "#ff0066"
  if (user.bio == null) user.bio = ""

  // Update users chain data here async once contracts are ready
  // eventually be smarter about this, only do it if the data changes

  // create session because apparently this function does everything
  const sessionId = createSession(user.userId)

  console.log("USER", USERS[user.userId])

  return {
    userId: user.userId,
    addr: user.addr,
    sessionId: sessionId,
  }
}
