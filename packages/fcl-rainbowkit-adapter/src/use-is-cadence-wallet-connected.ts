import * as fcl from "@onflow/fcl"
import {CurrentUser} from "@onflow/typedefs"
import {Config, getAccount, watchAccount} from "@wagmi/core"
import {useEffect, useState} from "react"

export async function useIsCadenceWalletConnected(config: Config) {
  const [wagmiAccount, setWagmiAccount] = useState(() => getAccount(config))
  const [fclAccount, setFclAccount] = useState<CurrentUser | null>(() => null)

  useEffect(() => {
    const unsub = watchAccount(config, {
      onChange: account => {
        const isCadenceWallet = account?.address !== undefined
        setWagmiAccount(getAccount(config))
      },
    })

    return () => {
      unsub()
    }
  }, [config])

  useEffect(() => {
    const unsubscribe = fcl.currentUser().subscribe((user: CurrentUser) => {
      setFclAccount(user)
    })

    return () => {
      unsubscribe()
    }
  })

  return (
    fclAccount?.addr !== undefined &&
    fclAccount?.loggedIn === true &&
    wagmiAccount.isConnected
  )
}
