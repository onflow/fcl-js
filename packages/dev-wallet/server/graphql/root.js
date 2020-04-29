import * as CONFIG from "../config"
import * as db from "../domains/user"
import {sessionFor} from "../domains/session"

export const upsertUser = async ({input}) => {
  const {userId} = await db.upsertUser(input)
  const [_, user] = db.getUser(userId)
  console.log(user)
  return user
}

export const authenticate = async ({email, pass}) => {
  const session = await db.upsertUser({email, pass})
  return {
    ...session,
    user: db.getUser(session.userId),
  }
}

export const me = async ({sessionId}) => {
  const userId = sessionFor(sessionId)
  if (userId == null) throw new Error("Invalid SessionId")
  const [_, user] = db.getUser(userId)
  return user
}

export const info = async () => ({
  accessNode: CONFIG.ACCESS_NODE,
  host: CONFIG.HOST,
  icon: CONFIG.ICON,
  name: CONFIG.NAME,
  origin: CONFIG.ORIGIN,
  pid: CONFIG.PID,
  port: CONFIG.PORT,
})
