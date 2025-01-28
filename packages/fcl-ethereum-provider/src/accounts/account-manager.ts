import * as fcl from "@onflow/fcl"

export class AccountManager {
  private user: typeof fcl.currentUser
  private lastFlowAddr: string | null = null
  private coaAddress: string | null = null

  // Keep track of which fetch is the latest to prevent race conditions
  private currentFetchId = 0

  constructor(user: typeof fcl.currentUser) {
    this.user = user
  }

  private async fetchCOAFromFlowAddress(flowAddr: string): Promise<string> {
    const cadenceScript = `
      import EVM

      access(all)
      fun main(address: Address): String? {
          if let coa = getAuthAccount(address)
              .storage
              .borrow<&EVM.CadenceOwnedAccount>(from: /storage/evm) {
              return coa.address().toString()
          }
          return nil
      }
    `
    const response = await fcl.query({
      cadence: cadenceScript,
      args: (arg, t) => [arg(flowAddr, t.Address)],
    })

    if (!response) {
      throw new Error("COA account not found for the authenticated user")
    }
    return response as string
  }

  public getCOAAddress(): string | null {
    return this.coaAddress
  }

  public setCOAAddress(addr: string | null): void {
    this.coaAddress = addr
  }

  public getAccounts(): string[] {
    return this.coaAddress ? [this.coaAddress] : []
  }

  public subscribe(callback: (accounts: string[]) => void) {
    this.user.subscribe(async () => {
      const snapshot = await this.user.snapshot()
      const currentFlowAddr = snapshot.addr

      if (!currentFlowAddr) {
        // user not authenticated => clear
        this.lastFlowAddr = null
        this.setCOAAddress(null)
        callback(this.getAccounts())
        return
      }

      // If the user changed address, we fetch.
      // But we also set a "fetchId" so we know
      // which fetch call is the "latest."
      if (this.lastFlowAddr !== currentFlowAddr) {
        this.lastFlowAddr = currentFlowAddr

        const fetchId = ++this.currentFetchId

        try {
          const address = await this.fetchCOAFromFlowAddress(currentFlowAddr)

          if (fetchId === this.currentFetchId) {
            this.setCOAAddress(address)
          }
        } catch (error) {
          if (fetchId === this.currentFetchId) {
            this.setCOAAddress(null)
          }
        }
      }

      callback(this.getAccounts())
    })
  }
}