import * as CONFIG from "./config"
import path from "path"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import compression from "compression"
import {promisify} from "util"
import graphqlHTTP from "express-graphql"
import graphqlConfig from "./graphql"
import {render} from "./render"
import * as hs from "./domains/handshake"
import * as db from "./domains/user"
import * as authz from "./domains/authorization"
import chalk from "chalk"
import emoji from "node-emoji"
import latest from "latest-version"
import pkgJSON from "../package.json"

const SRC = path.resolve(__dirname, "../src")
const app = express()

app
  .use(cors())
  .use(compression())
  .use(bodyParser.json({limit: "5mb"}))
  .use(express.static(SRC))

app.get("/flow/hooks", cors(), (req, res) => {
  console.log("API -- GET /flow/hooks", {query: req.query, body: req.body})
  const {code} = req.query
  if (code == null) return res.status(400).send("Missing 'code' query param")

  const handshake = hs.handshakeFor(code)
  if (handshake == null) return res.status(404).send("Code Not Found")

  const [_, user] = db.getUser(handshake.userId)
  if (user == null) return res.status(404).send("User Not Found")

  // These are the private hooks FCL is looking for
  // Since there are no on-chain public hooks yet
  // we are overloading/augmenting with "private"
  // hooks for now. As a wallet provider this is our
  // opportunity to overload what ever we want in
  // the public hooks.
  res.status(200).send({
    addr: user.addr, // Used by FCL to fetch public hooks
    keyId: user.keyId, // FCL will use the keyId when the account is a proposer
    // Opportunity to overload the public indentity
    // If you dont want to overload something you can omit them or set their value to null
    identity: {
      name: user.name,
      avatar: user.avatar,
      cover: user.cover,
      color: user.color,
      bio: user.bio,
    },
    // The private information requested by the dapp in the scope
    // Wallet providers shouldnt send any private data that wasnt
    // both requested by the dapp, and approved by the user to send
    scoped: {
      email: user.email,
    },
    // the wallet providers information, this will be used to build a composite ID
    // as well as be available under fcl.provider()
    provider: {
      pid: user.userId, // provider scoped id, the internal value this wallet provider uses to uniquely identify a user
      addr: CONFIG.PID, // this is the flow address of the provider (this config will eventually be CONFIG.ADDR)
      name: CONFIG.NAME,
      icon: CONFIG.ICON,
      // when the users code expires, this address will be used
      // to reauthenticate (skipping the handshake step)
      authn: CONFIG.AUTHN,
    },
    // How to authorize a transaction
    // Currently only HTTP/POST is supported by FCL
    // Overloading will be done based on the strategies
    // id value. The idea here is most of these
    // should be public, but maybe the wallet provider
    // wants to give fcl a way to authorize things only
    // when they are the currentUser.
    authorizations: [
      // FCL will send the following given the hook below
      //
      // POST http://localhost:8701/flow/authorize
      //        ?userId=c20e93b3-8682-4769-9667-0c1e88a72173
      // ---
      // {
      //   message: MESSAGE_TO_SIGN,
      //   addr: FLOW_ADDRESS_THAT_IS_SIGNING,
      //   keyId?: WHICH_KEY_TO_USER_WHEN_SIGNING,
      //   roles: {
      //     proposer: Boolean,
      //     authorizer: Boolean,
      //     payer: Boolean
      //   },
      //   interaction: RAW_INTERACTION, // used
      // }
      {
        id: `${CONFIG.PID}#authz-http-post`,
        addr: user.addr,
        method: "HTTP/POST",
        endpoint: `${CONFIG.HOST}/flow/authorize`,
        params: {userId: user.userId},
      },
    ],
  })
})

// handles authorization hook CONFIG.PID#authz-http-post
app.post("/flow/authorize", cors(), (req, res) => {
  console.log("API -- POST /flow/authorize", {query: req.query, body: req.body})
  const {userId} = req.query
  if (userId == null)
    return res.status(400).send("Missing 'userId' query param")

  const [_, user] = db.getUser(userId)
  if (user == null) return res.status(404).send("User Not Found")

  const transaction = req.body
  if (transaction == null) return res.status(400).send("no body")
  if (transaction.message == null)
    return res.status(400).send("No 'message' to sign")
  const authorizationId = authz.createAuthorization({userId, transaction})
  const authorization = authz.authorizationFor(authorizationId)

  // setTimeout(() => authz.approveAuthorization({authorizationId}), 3000)

  return res.status(200).send({
    status: authorization.status,
    reason: authorization.reason,
    compositeSignature: authorization.compositeSignature,
    authorizationUpdates: {
      method: "HTTP/GET",
      endpoint: `${CONFIG.HOST}/flow/authorize`,
      params: {authorizationId, userId},
    },
    local: [
      {
        method: "BROWSER/IFRAME",
        endpoint: `${CONFIG.HOST}/authorization/${authorizationId}`,
        width: "377",
        background: "#fff",
      },
    ],
  })
})

app.get("/flow/authorize", cors(), (req, res) => {
  console.log("API -- GET /flow/authorize", {query: req.query, body: req.body})
  const {authorizationId, userId} = req.query
  if (authorizationId == null)
    return res.status(400).send("Missing 'authorizationId' query param")
  if (userId == null)
    return res.status(400).send("Missing 'userId' query param")

  const [_, user] = db.getUser(userId)
  if (user == null) return res.status(404).send("User Not Found")
  if (userId !== user.userId) return res.status(400).send("userId mismatch")

  const authorization = authz.authorizationFor(authorizationId)
  if (authorization == null)
    return res.status(404).send("Authorization Not Found")

  return res.status(200).send({
    status: authorization.status,
    reason: authorization.reason,
    compositeSignature: authorization.compositeSignature,
    authorizationUpdates: {
      method: "HTTP/GET",
      endpoint: `${CONFIG.HOST}/flow/authorize`,
      params: {authorizationId: authorization.authorizationId, userId},
    },
  })
})

app
  .route("/")
  .get(render)
  .head(render)

app.use("/graphql", graphqlHTTP(graphqlConfig))

app
  .route("*")
  .get(render)
  .head(render)

const script = `
import * as fcl from "@onflow/fcl"

fcl.config()
  .put("challenge.handshake", "${CONFIG.AUTHN}")
`

const intro = `
${chalk.dim(pkgJSON.name + "@" + pkgJSON.version)}
${chalk.dim("*** *** *** *** *** *** ***")}

:tada: ${chalk.blue(CONFIG.NAME)} has started:
${chalk.dim("*")} Origin:          ${chalk.blue.underline(CONFIG.HOST)}
${chalk.dim("*")} FCL Authn:       ${chalk.blue.underline(CONFIG.AUTHN)}
${chalk.dim("*")} GraphiQL:        ${chalk.blue.underline(
  CONFIG.HOST + "/graphql"
)}
${chalk.dim("*")} Access Node:     ${chalk.blue.underline(CONFIG.ACCESS_NODE)}
${chalk.dim("*")} Service Address: ${chalk.blue(CONFIG.SERVICE_ADDR)}
${chalk.dim("*")} Private Key:     ${chalk.blue(CONFIG.PK)}

Include this code in development to configure fcl:

${chalk.cyan(script.trim())}

${chalk.dim("*** *** *** *** *** *** ***")}
`.trim()

export const start = async () => {
  await promisify(app.listen)
    .bind(app)(CONFIG.PORT)
    .then(async _ => {
      console.log(emoji.emojify(intro))

      const currentVersion = pkgJSON.version
      const latestVersion = await latest(pkgJSON.name)
      if (currentVersion !== latestVersion) {
        console.log("\n")
        console.log(
          `
${chalk.red.dim("*** *** *** *** *** *** ***")}

${chalk.red.bold("The version of " + chalk.blue(pkgJSON.name))}
${chalk.red.bold("you are using is " + chalk.underline("Out of Date"))}

${chalk.blue(pkgJSON.name)}:
${chalk.dim("*")} Installed: ${chalk.red(currentVersion)}
${chalk.dim("*")} Latest:    ${chalk.green(latestVersion)}

If you installed ${chalk.blue("@onflow/dev-wallet")} globally
You can update it with: ${chalk.cyan(
            "npm install -g @onflow/dev-wallet@" + latestVersion
          )}

${chalk.red.dim("*** *** *** *** *** *** ***")}
    `.trim()
        )
      }
    })
}
