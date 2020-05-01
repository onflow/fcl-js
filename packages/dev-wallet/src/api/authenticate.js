import {gql} from "../utils/gql.js"

export const query = gql`
  mutation Authenticate($email: String, $passw: String) {
    authenticate(email: $email, pass: $passw) {
      sessionId
      userId
      addr
    }
  }
`
