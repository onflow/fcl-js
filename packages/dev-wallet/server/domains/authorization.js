import {v4 as uuid} from "uuid"
import * as db from "./user"
import {signWithKey} from "../crypto"

const PENDING = "PENDING"
const APPROVED = "APPROVED"
const DECLINED = "DECLINED"
const AUTHORIZATIONS = {}

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

export const createAuthorization = ({userId, transaction}) => {
  invariant(userId, "createAuthorization({userId}) -- userId is required")
  invariant(
    transaction,
    "createAuthorization({transaction}) -- transaction is required"
  )

  // Generate authorizationId, this will be used as a single lookup later
  const authorizationId = uuid()

  // Store authorization information
  AUTHORIZATIONS[authorizationId] = {
    authorizationId,
    vsn: 0,
    userId,
    transaction,
    status: PENDING,
    reason: null,
    compositeSignature: null,
    // compositeSignature: {
    //   addr: user.addr,
    //   keyId: user.keyId,
    //   signature: null,
    // },
  }

  return authorizationId
}

export const authorizationIdsFor = userId => {
  invariant(userId, "authorizationIdsFor({userId}) -- userId required")
  return Object.values(AUTHORIZATIONS).reduce((acc, authorization) => {
    return authorization.userId === userId
      ? [...acc, authorization.authorizationId]
      : acc
  }, [])
}

export const authorizationFor = authorizationId => {
  return AUTHORIZATIONS[authorizationId]
}

export const approveAuthorization = ({authorizationId}) => {
  invariant(
    authorizationId,
    "approveAuthorization({authorizationId}) -- authorizationId required",
    {authorizationId}
  )
  const authorization = AUTHORIZATIONS[authorizationId]
  invariant(authorization, "Unknown Authorization", {
    authorizationId,
    authorization,
  })
  const transaction = authorization.transaction
  invariant(transaction, "No Transaction", {
    authorizationId,
    authorization,
    transaction,
  })
  invariant(transaction.message, "No 'transaction.message' to Sign", {
    authorizationId,
    authorization,
    transaction,
  })

  const [_, user] = db.getUser(authorization.userId)
  invariant(user, `Unknown User for authorizationId: ${authorizationId}`, {
    authorizationId,
    authorization,
    transaction,
    user,
  })
  invariant(authorization.userId === user.userId, "UserId Mismatch", {
    authorizationId,
    authorization,
    transaction,
    user,
  })

  const addr = user.addr
  invariant(transaction.addr === user.addr, "Flow Address Mismatch", {
    authorizationId,
    authorization,
    transaction,
    user,
  })

  const keyId = transaction.keyId || user.keyId
  invariant(keyId != null, "Missing keyId", {
    authorizationId,
    authorization,
    transaction,
    user,
  })
  // Our users only have one flow account and
  // then only one key per flow account so these
  // should always be the users keyId
  invariant(keyId === user.keyId, "Invalid keyId", {
    authorizationId,
    authorization,
    transaction,
    user,
  })

  const signature = signWithKey(user.privateKey, transaction.message)

  authorization.vsn += 1
  authorization.status = APPROVED
  authorization.compositeSignature = {addr, keyId, signature}

  invariant(authorization.status === APPROVED, "Incorrect Status", {
    authorization,
  })
  invariant(
    authorization.compositeSignature != null,
    "Missing CompositeSignature",
    {authorization}
  )
  invariant(
    authorization.compositeSignature.addr != null,
    "Missing compSig address",
    {authorization}
  )
  invariant(
    authorization.compositeSignature.keyId != null,
    "Missing keyId address",
    {authorization}
  )
  invariant(
    authorization.compositeSignature.signature != null,
    "Missing keyId signature",
    {authorization}
  )

  return authorizationId
}
export const declineAuthorization = ({authorizationId}) => {
  invariant(
    authorizationId,
    "declineAuthorization({authorizationId}) -- authorizationId required",
    authorizationId
  )

  const authorization = AUTHORIZATIONS[authorizationId]
  invariant(authorization, `Unknown Authorization`, {
    authorizationId,
    authorization,
  })

  authorization.vsn += 1
  authorization.status = DECLINED
  authorization.reason = "They Said No"

  invariant(authorization.status === DECLINED, "Inorrect Status")
  invariant(authorization.reaons != null, "Missing Reason")

  return [authorizationId, vsn, authorization]
}
