import React, {useState, useEffect, FC} from "react"
import * as fcl from "@onflow/fcl"

import Card from '../components/Card'

interface SignInOutButtonProps {
  user: User;
}

interface User {
  loggedIn: boolean;
}

const SignInOutButton : FC<SignInOutButtonProps> = ({ user: { loggedIn } }) => {
  const signInOrOut = async (event: any) => {
    event.preventDefault()

    if (loggedIn) {
      fcl.unauthenticate()
    } else {
      fcl.authenticate()
    }
  }

  return (
    <button onClick={signInOrOut}>
      {loggedIn ? 'Sign Out' : 'Sign In/Up'}
    </button>
  )
}

const CurrentUser = () => {
  const [user, setUser] = useState({ loggedIn: false })

  useEffect(() =>
    fcl
      .currentUser()
      .subscribe((user: any) => setUser({...user}))
  , [])

  return (
    <Card>
      <SignInOutButton user={user} />
    </Card>
  )
}

export default CurrentUser
