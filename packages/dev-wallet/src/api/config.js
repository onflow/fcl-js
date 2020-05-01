import {gql} from "../utils/gql.js"

export const query = gql`
  query Config {
    config {
      name
      host
      pid
    }
  }
`
