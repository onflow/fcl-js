import {gql} from "../utils/gql.js"

export const query = gql`
  query Handshake($sessionId: ID, $handshakeId: ID) {
    handshake(sessionId: $sessionId, handshakeId: $handshakeId) {
      handshakeId
      addr
      paddr
      exp
      hooks
      l6n
    }
  }
`
