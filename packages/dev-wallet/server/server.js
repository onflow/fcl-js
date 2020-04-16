import path from "path"
import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import compression from "compression"
import {promisify} from "util"
import graphqlHTTP from "express-graphql"
import graphqlConfig from "./graphql"
import * as CONFIG from "./config"
import {render} from "./render"
import "./db"

const SRC = path.resolve(__dirname, "../src")
const app = express()

app
  .use(compression())
  .use(bodyParser.json())
  .use(express.static(SRC))

app
  .route("/")
  .get(render)
  .head(render)

app.use("/graphql", graphqlHTTP(graphqlConfig))

app
  .route("*")
  .get(render)
  .head(render)

export const start = async () => {
  console.log("Dev Wallet Config", CONFIG)
  await promisify(app.listen)
    .bind(app)(CONFIG.PORT)
    .then(_ => console.log(`Dev Wallet Started: ${CONFIG.HOST}`))
}
