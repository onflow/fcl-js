import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

function fetchAccount(address) {
  if (address == null) return Promise.resolve(null)
  return fcl.account(address)
}

export function useAccount(address) {
  const [acct, setAcct] = useState(null)
  useEffect(() => {
    fetchAccount(address).then(setAcct)
  }, [address])

  return [acct, () => fetchAccount(address).then(setAcct)]
}
