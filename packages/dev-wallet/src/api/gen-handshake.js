import {gql} from "../utils/gql.js"

export const query = gql`
  mutation GenHandshake($input: GenHandshakeInput) {
    genHandshake(input: $input)
  }
`
