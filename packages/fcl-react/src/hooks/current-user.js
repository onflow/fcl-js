import {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

export function useCurrentUser() {
  const [user, setUser] = useState({addr: null, cid: null, loggedIn: false})
  useEffect(() => fcl.currentUser().subscribe(setUser), [])
  return [user, user.loggedIn]
}
