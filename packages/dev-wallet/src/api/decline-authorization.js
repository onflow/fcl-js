import {gql} from "../utils/gql.js"

export const query = gql`
  mutation DeclineAuthorization($input: DeclineAuthorizationInput) {
    authorizationId: declineAuthorization(input: $input)
  }
`
