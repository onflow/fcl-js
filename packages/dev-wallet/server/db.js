import path from "path"
import * as CONFIG from "./config"

const DB_SRC = path.resolve(__dirname, "../db", CONFIG.PID + ".db")
// const DB_SRC = `:${CONFIG.PID}:`
const sqlite3 = require("sqlite3").verbose()

const log = label => (err, v) => {
  return err != null ? console.error(label, err) : console.log(label, v)
}

const _log = label => (err, _v) => {
  if (err) console.error(label, error)
}

export const open = (log = _log) => {
  return new sqlite3.Database(DB_SRC, log("DB CONNECT"))
}

export const close = (db, log = _log) => {
  return db.close(log("DB CLOSE"))
}

export const exec = async callback => {
  const db = open(_log)
  await callback(db, log, _log)
  close(db, _log)
}

exec((db, _, log) => {
  /** IMPORTANT NOTE ABOUT PRIVATE KEYS
   *
   *  This code base is an example implementation of a
   *  wallet provider. It has a focus on the wallet
   *  providers interactions with flow and the fcl. In
   *  order to highlight those interactions we have made
   *  the concious desicion to store the private keys as
   *  plain text on the user in the db. Hopefully this is
   *  obviously insecure. If you are creating a production
   *  level wallet provider we trust that you have thought
   *  long and hard about how to do this particular aspect
   *  safely and securely and are following all best
   *  practices.
   */
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS USERS", log("Drop USERS"))
    db.run("DROP TABLE IF EXISTS SESSIONS", log("Drop SESSIONS"))
    db.run("DROP TABLE IF EXISTS FLOW_ACCOUNTS", log("Drop FLOW_ACCOUNTS"))
    db.run("DROP TABLE IF EXISTS TOKENS", log("Drop TOKENS"))
    db.run(
      `
        CREATE TABLE USERS (
          userId       TEXT PRIMARY KEY,     -- the providers internal id for the user
          email        TEXT UNIQUE NOT NULL, -- the email used as a username for the provider, can be requested as a scope
          passwordHash TEXT NOT NULL,        -- the users password hashed
          privateKey   TEXT NOT NULL,        -- a bad bad not good place and way to store the private key
          publicKey    TEXT NOT NULL         -- a bad bad not good place and way to store the public key
        );
      `,
      log("Create USERS")
    )
    db.run(
      `
        CREATE TABLE SESSIONS (
          token     TEXT PRIMARY KEY, -- need something so the user can stay authenticated for a bit inside of the provider
          userId    TEXT NOT NULL,    -- who the authentication if for
          expiresAt INTEGER NOT NULL  -- when that authentication expires
        );
      `,
      log("Create SESSIONS")
    )
    db.run(
      `
        CREATE TABLE FLOW_ACCOUNTS (
          addr   TEXT PRIMARY KEY, -- the flow address
          userId TEXT NOT_NULL,    -- which user this flow address is associated with
          name   TEXT,             -- the optional name the user wants to be associated with this flow address
          avatar TEXT,             -- the optional avatar the user wants to be associated with this flow address
          bio    TEXT              -- the optional bio the user wants to be assocated with the flow address
        );
      `,
      log("Create FLOW_ACCOUNTS")
    )
    db.run(
      `
        CREATE TABLE TOKENS (
          token     TEXT PRIMARY KEY, -- this will be supplied when asking for the hooks as the "code" param
          userId    TEXT NOT_NULL,    -- the providers internal id for the user
          addr      TEXT NOT_NULL,    -- the flow address that is associated with the token
          expiresAt INTEGER NOT_NULL, -- when this token expires
          scope     TEXT              -- the scopes that were requested during the challenge
          l6n       TEXT              -- dApp origin
        )
      `,
      log("Create TOKENS")
    )
  })
})
