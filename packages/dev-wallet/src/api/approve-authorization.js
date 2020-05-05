import {gql} from "../utils/gql.js"

export const query = gql`
  mutation ApproveAuthorization($input: ApproveAuthorizationInput) {
    authorizationId: approveAuthorization(input: $input)
  }
`
