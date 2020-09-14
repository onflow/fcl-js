import * as CONFIG from "../config"
import * as db from "../domains/user"
import {sessionFor} from "../domains/session"
import {createHandshake, handshakeFor} from "../domains/handshake"
import {
  authorizationFor,
  approveAuthorization as approveAuthorizationFor,
  declineAuthorization as declineAuthorizationFor,
} from "../domains/authorization"

const invariant = (fact, msg, ...rest) => {
  if (!fact) {
    const error = new Error(`GQL INVARIANT ${msg}`)
    error.stack = error.stack
      .split("\n")
      .filter((d) => !/at invariant/.test(d))
      .join("\n")
    console.error("\n\n---\n\n", error, "\n\n", ...rest, "\n\n---\n\n")
    throw error
  }
}

// Creates or Updates an user account
export const upsertUser = async ({input}) => {
  console.log("GQL -- mutation/upsertUser", {input})
  // create or update the user with the supplied input (returns a session)
  const {userId} = await db.upsertUser(input)
  invariant(userId, "failed to upsert user")

  // get the users data
  const [_, user] = db.getUser(userId)
  invariant(user, `couldnt not find user with id of "${userId}"`)

  // return the newly created or updated data
  return user
}

// Authenticates using an email password combination
// If email doesnt exist it will create a new user
// with the email password combination
export const authenticate = async ({email, pass}) => {
  console.log("GQL -- mutation/authenticate", {email, pass})
  invariant(email, "email required")
  invariant(pass, "pass required")

  // create new user or authenticate old user (returns a session)
  const session = await db.upsertUser({email, pass})
  invariant(session, "failed to create session")

  // get the user from the userId inside the session
  const user = db.getUser(session.userId)
  invariant(user, "failed to get user for newly created sessionId")

  // return the session, plus the user
  return {
    ...session,
    user: db.getUser(session.userId),
  }
}

// Returns the users info for a given sessionId
export const me = async ({sessionId}) => {
  console.log("GQL -- query/me", {sessionId})
  invariant(sessionId, "sessionId required")

  // exchange userId from sessionId
  const userId = sessionFor(sessionId)
  invariant(userId, "Invalid SessionId")

  // get users data from the userId we got from the session
  const [_, user] = db.getUser(userId)
  invariant(user, "could not find user")

  // return the user
  return user
}

// Generates a handshake and associated handshakeId
// handshakeId will be used when FCL attempts to fetch hooks
// and private data
export const genHandshake = ({input}) => {
  console.log("GQL -- mutation/genHandshake", {input})
  const {sessionId, l6n, scope} = input
  invariant(sessionId, "sessionId required")
  invariant(l6n, "l6n required")

  // exchange sessionId for userId
  const userId = sessionFor(sessionId)
  invariant(userId != null, "Invalid SessionId")

  // generate handshakeId for given user and dapp
  // and return it
  return createHandshake({userId, l6n, scope})
}

// Returns the handshake info for a given sessionId and handshakeId
// sessionId is only used to verify if the user is authenticated
// while the handshakeId is used to retrieve the relevant information
// the frontend needs inorder to respond to FCLs challenge
export const handshake = ({sessionId, handshakeId}) => {
  console.log("GQL -- query/handshake", {sessionId, handshakeId})
  invariant(sessionId, "sessionId required")
  invariant(handshakeId, "handshakeId required")

  // exchange sessionId for userId so we know the session is valid
  const userId = sessionFor(sessionId)
  invariant(userId, "Invalid SessionId")

  // exchange handshakeId for the handshakes data
  const handshake = handshakeFor(handshakeId)
  invariant(handshake, "Invalid HandshakeId")

  // use userId inside of handshake to get users data
  const [_, user] = db.getUser(handshake.userId)
  invariant(user, "could not find user")
  invariant(
    userId === user.userId,
    "Session User and Handshake User did not match"
  )

  // augment handshake with additional provider data
  // and return it, because thats what this function is supposed to do
  return {
    ...handshake, // includes handshakeId, exp, l6n
    addr: user.addr, // The users flow address
    paddr: CONFIG.PID, // Will eventually be the providers onchain address that FCL can use to find more info about it
    hooks: CONFIG.HOST + "/flow/hooks", // Where FCL will get hook information
  }
}

// Returns the details of an authorization
export const authorization = async ({sessionId, authorizationId}) => {
  console.log("GQL -- query/authorization", {sessionId, authorizationId})
  invariant(sessionId, "sessionId required")
  invariant(authorizationId, "authorizationId required")

  // exchange sessionId for userId so we know the session is valid
  const userId = sessionFor(sessionId)
  invariant(userId, "Invalid SessionId")

  // get authorization for supplied authorizationId
  const authorization = authorizationFor(authorizationId)
  invariant(authorization, "count not find authorization")
  invariant(
    authorization.transaction,
    "count not find authorization.transaction",
    {authorization}
  )
  invariant(authorization.status, "count not find authorization.status", {
    authorization,
  })

  return {
    authorizationId,
    transaction: JSON.stringify(authorization.transaction),
    status: authorization.status,
  }
}

export const approveAuthorization = async ({input}) => {
  console.log("GQL -- mutation/approveAuthorization", input)
  const {authorizationId, sessionId} = input
  invariant(sessionId, "sessionId required")
  invariant(authorizationId, "authorizationId required")

  // exchange sessionId for userId so we know the session is valid
  const userId = sessionFor(sessionId)
  invariant(userId, "Invalid SessionId")

  return approveAuthorizationFor({authorizationId})
}

export const declineAuthorization = async ({input}) => {
  console.log("GQL -- mutation/approveAuthorization", input)
  const {authorizationId, sessionId} = input
  invariant(sessionId, "sessionId required")
  invariant(authorizationId, "authorizationId required")

  // exchange sessionId for userId so we know the session is valid
  const userId = sessionFor(sessionId)
  invariant(userId, "Invalid SessionId")

  return declineAuthorizationFor({authorizationId})
}

export const config = async () => {
  console.log("GQL -- query/config")
  return {
    accessNode: CONFIG.ACCESS_NODE,
    host: CONFIG.HOST,
    icon: CONFIG.ICON,
    name: CONFIG.NAME,
    origin: CONFIG.ORIGIN,
    pid: CONFIG.PID,
    port: CONFIG.PORT,
  }
}
