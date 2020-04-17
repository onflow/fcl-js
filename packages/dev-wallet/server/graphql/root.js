import * as CONFIG from "../config"
import argon2 from "argon2"
import {getUserByEmail, getUserById, createUser} from "../repo/user"
import {getSession, createSession} from "../repo/session"

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
