import * as fcl from "@onflow/fcl"
import { template as setCode } from "@onflow/six-set-code"

export async function Send(code: string) {
    const response = await fcl.send([
        setCode({
            proposer: fcl.currentUser().authorization,
            authorization: fcl.currentUser().authorization,     
            payer: fcl.currentUser().authorization,             
            code: code,
        })
    ])

    try {
      return await fcl.tx(response).onceExecuted()
    } catch (error) {
      return error;
    }
}