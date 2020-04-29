import {v4 as uuid} from "uuid"

const SESSIONS = {}

export const createSession = userId => {
  const sessionId = uuid()
  SESSIONS[sessionId] = userId
  // console.log(`createSession(${userId}) -> ${sessionId}`, SESSIONS)
  return sessionId
}

export const sessionFor = sessionId => {
  // console.log(`sessionFor(${sessionId}) -> ${SESSIONS[sessionId]}`, SESSIONS)
  return SESSIONS[sessionId]
}
