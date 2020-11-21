import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

function fetchScript(fns = [], args = []) {
  if (args.length) {
    fns.push(ix => {
      ix.message.arguments = []
      ix.arguments = {}
      return ix
    })
    fns.push(fcl.args(args))
  }

  return fcl.send(fns).then(fcl.decode)
}

export function useScript(fns = []) {
  const [result, setResult] = useState(null)
  return [
    (args = []) => {
      return fetchScript(fns, args).then(setResult)
    },
    result,
  ]
}
