import {useState} from "react"
import * as fcl from "@onflow/fcl"

import {
  IDLE,
  PROCESSING,
  SUCCESS,
  ERROR,
  PENDING_AUTH,
  SUBMITTING_TO_CHAIN,
  UNKNOWN,
  PENDING,
  FINALIZED,
  EXECUTED,
  SEALED,
  EXPIRED,
} from "../constants"

const sleep = (ms = 3000) => new Promise(r => setTimeout(r, ms))

// prettier-ignore
const statusKeys = txStatus => {
  switch (txStatus.status) {
    case 0: return UNKNOWN
    case 1: return PENDING
    case 2: return FINALIZED
    case 3: return EXECUTED
    case 4: return SEALED
    case 5: return EXPIRED
    default: return UNKNOWN
  }
}

const EMPTY_DETAILS = {txId: null, txStatus: null, error: null}

export function useTransaction(fns = []) {
  const [status, setStatus] = useState(IDLE) // IDLE, PROCESSING, SUCCESS, ERROR
  const [txStatus, setTxStatus] = useState(IDLE) // IDLE, PROCESSING, PENDING_AUTH, SUBMITTING_TO_CHAIN, PENDING, FINALIZED, EXECUTED, SEALED, EXPIRED, UNKNOWN
  const [details, setDetails] = useState(EMPTY_DETAILS)

  async function exec(args = []) {
    setStatus(PROCESSING)
    setTxStatus(PROCESSING)
    setDetails(() => EMPTY_DETAILS)

    if (args.length) {
      fns.push(ix => {
        ix.message.arguments = []
        ix.arguments = {}
        return ix
      })
      fns.push(fcl.args(args))
    }
    try {
      setTxStatus(PENDING_AUTH)
      var txId = await fcl.send(fns).then(fcl.decode)

      setTxStatus(SUBMITTING_TO_CHAIN)
      setDetails(details => ({...details, txId}))

      var unsub = fcl.tx(txId).subscribe(txStatus => {
        txStatus.label = statusKeys(txStatus)
        setTxStatus(statusKeys(txStatus))
        setDetails(details => ({...details, txStatus}))
      })

      // prettier-ignore
      await fcl.tx(txId).onceSealed()
        .catch(error => {
          unsub()
          throw error
        })

      unsub()
      setStatus(SUCCESS)
    } catch (error) {
      console.error("useTx", error, {fns})
      setStatus(ERROR)
      setTxStatus(ERROR)
      setDetails(details => ({...details, error}))
    } finally {
      await sleep()
      setStatus(IDLE)
      setTxStatus(IDLE)
    }
  }

  return [exec, status, txStatus, details]
}
