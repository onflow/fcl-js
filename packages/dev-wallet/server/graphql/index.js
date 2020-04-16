import {buildSchema} from "graphql"
import path from "path"
import fs from "fs"

import * as rootValue from "./root"

const SCHEMA_SRC = path.resolve(__dirname, "schema.graphql")
const schema = buildSchema(fs.readFileSync(SCHEMA_SRC, "utf-8"))

export default {
  schema,
  rootValue,
  graphiql: true,
}
