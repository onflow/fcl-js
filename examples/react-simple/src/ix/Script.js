import React, {useState} from "react"
import * as sdk from "@onflow/sdk"
import * as t from "@onflow/types"

export const Script = () => {
  const [result, setResult] = useState(null)

  const run = async () => {

    /*

      Script
      ------
      
      Scripts are declared by building an interaction and specifying a script within it.
      This is done by specifying Cadence code within the script builder.

      Declaring a script that returns an integer may look like such:

        sdk.script`
          pub fun main(): Int {
            return 1
          }
        `

      Script Arguments
      ----------------

      Scripts can consume arguments. These arguments are populated into the main function.
      Declaring arguments for a Script requires calling the sdk.args and sdk.arg builders like such:
          
        sdk.args([sdk.arg(1, t.Int), sdk.arg(2, t.Int)]),

      The order of the arguments here matters, since the order will correspond to the order of the 
      arguments in the main function of your Cadence script.

      Resolvers
      ---------

      In order to resolve any script arguments specified in the interaction,
      the interaction muse be passed through the resolveArguments and resolveParams resolvers.

    */

    const response = await sdk.send(await sdk.pipe(await sdk.build([
      sdk.script`                                                         
        pub fun main(arg1: Int, arg2: Int): Int {
          return arg1 + arg2
        }
      `,
      sdk.args([sdk.arg(1, t.Int), sdk.arg(2, t.Int)]),                   
    ]), [
      sdk.resolve([
        sdk.resolveParams,
        sdk.resolveArguments,
      ]),
    ]), { node: "http://localhost:8080" })

    setResult(await sdk.decodeResponse(response))
  }

  return (
    <div>
      <button onClick={run}>
        Run <strong>Script</strong>
      </button>
      <pre>{JSON.stringify(result)}</pre>
    </div>
  )
}
