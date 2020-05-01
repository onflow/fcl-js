import {gql} from "../utils/gql.js"

export const query = gql`
  mutation UpsertUser($input: UpsertUserInput) {
    upsertUser(input: $input) {
      userId
      addr
      vsn
      email
      name
      avatar
      cover
      color
      bio
    }
  }
`
