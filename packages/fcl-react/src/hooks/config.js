import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

export function useConfig(key, fallback) {
  const [value, set] = useState(null)
  useEffect(() => {
    fcl.config().get(key, fallback).then(set)
  }, [key])

  return value
}
