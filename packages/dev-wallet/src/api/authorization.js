import {gql} from "../utils/gql.js"

export const query = gql`
  query Authorization($authorizationId: ID, $sessionId: ID) {
    authorization(sessionId: $sessionId, authorizationId: $authorizationId) {
      transaction
      status
    }
  }
`
