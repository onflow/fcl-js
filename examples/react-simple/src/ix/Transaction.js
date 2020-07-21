import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"
import {signingFunction} from "./utils/signing-function.js"

export const Transaction = () => {
  const [result, setResult] = useState(null)

  const run = async () => {

    /*
      Transaction
      -----------

      Transactions are declared by building an interaction and specifying a transaction within it.
      This is done by specifying Cadence code within the transaction builder.

      Transactions also require other pieces of information as so they can be sent.

      Proposer, Payer and Authorizers
      --------------------------------

      Transactions require a proposer, payer and an array of authorizers.

      - The proposer specifies the Account for which the sequence number of one of it's keys will be used and incremented by this transaction.
      - The payer specifies the Account for which will pay for the transaction.
      - Each authorizer specifies an AuthAccount which can be used within the cadence code of the transaction.

      To declare a proposer, authorizer or payer, you must specify an authorization.
      An authorization consists of an account address, a signing function, and a keyId.

      The signing function is a function with an interface as such:

          const signingFunction = ({
            message,          // The message to be signed.
            addr,             // The address specified in the authorization.
            keyId,            // The keyId specified in the authorization.
            roles: {      
              proposer,       // Denotes if this authorization is acting as a proposer.
              authorizer,     // Denotes if this authorization is acting as a authorizer.
              payer,          // Denotes if this authorization is acting as a payer.
            },
            interaction,      // The full interaction object such that the message can be reconstructed if desired, for security.
          }) => { ... }

      The signing function must return an object as such:

          {
            addr,       // The address of the Flow Account which produced this signature.
            keyId,      // The keyId used to produce the signature.
            signature   // A hex encoded string of the signature produced by this function.
          }
      
      The signing function produces a signature of the message using the key with the keyId as specified.

      Arguments
      ---------

      Transactions can also contain arguments. Arguments are variables that are passed into a transaction.
      Specifying arguments is done by specifying an array of arguments.
      Each argument consumes a JavaScript value, and an associated Cadence type identifier.
      
      Denoting an argument is done by calling the args and arg builder as such:

          sdk.args([ sdk.arg("my string value", t.String) ])

      Validators
      ----------

      To check that everything has gone as expected while building and resolving your transaction, validators act as a
      mechanism to check the interaction object has been formulated to your desired specification.

      Lets assume you expect only one argument to be included in this transaction interaction, a validator for such looks like:
      
          sdk.validator((ix, {Ok, Bad}) => {
            if (Object.keys(ix.arguments).length > 1) return Bad(ix, "This transaction should only have one authorization!")
            return Ok(ix)
          })

      Resolvers
      ---------

      Before a transaction interaction is ready to be sent, it must, if not yet ready, be first be passed through a sequence of resolvers.
      Resolvers fill in and further prepare an interaction into a state where it is ready to be sent.
      Note, the order of the resolvers does matter, since the result of a prior resolver may be needed for one that proceeds it.

      resolveRefBlockId({ node: "my-access-node" })   // Will populate the block id for which this transaction will be executed against if not already specified.
      resolveProposerSequenceNumber({ node: "my-access-node" })   // Will populate the proposers sequence number if not already specifies.
      resolveArguments  // Will prepare each argument such that it can be send and used with this transaction interaction.
      resolveAccounts   // Will prepare each account such that it can be used for this transaction interaction.
      resolveSignatures // Will retrieve a signature for a specified account.
      resolveValidators // Will execute each validator specified for this interaction.

    */

    const response = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.transaction`transaction(message: String) { prepare(acct: AuthAccount) {} execute { log(message) } }`,
      sdk.args([sdk.arg("Hello, World!", t.String)]),
      sdk.payer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)),
      sdk.proposer(sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0, seqNum)),
      sdk.authorizations([sdk.authorization("f8d6e0586b0a20c7", signingFunction, 0)]),
      sdk.validator((ix, {Ok, Bad}) => {
        if (Object.keys(ix.arguments).length > 1) return Bad(ix, "This transaction should only have one argument!")
        return Ok(ix)
    })
    ]), [
      sdk.resolve([
        sdk.resolveRefBlockId({ node: "http://localhost:8080" }),
        sdk.resolveProposerSequenceNumber({ node: "http://localhost:8080" }),
        sdk.resolveArguments,
        sdk.resolveAccounts,
        sdk.resolveSignatures,
        sdk.resolveValidators,
      ]),
    ]), { node: "http://localhost:8080" })

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <button onClick={run}>
        Run <strong>Transaction</strong>
      </button>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
