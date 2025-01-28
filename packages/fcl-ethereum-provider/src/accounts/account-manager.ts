import * as fcl from "@onflow/fcl"

export class AccountManager {
  private user: typeof fcl.currentUser
  private coaAddress: string | null = null

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

  public async updateCOAAddress(): Promise<void> {
    const snapshot = await this.user.snapshot()
    if (!snapshot.addr) {
      // user is not logged in
      this.setCOAAddress(null)
      return
    }
    const fetched = await this.fetchCOAFromFlowAddress(snapshot.addr)
    this.setCOAAddress(fetched)
  }

  public subscribe(callback: (accounts: string[]) => void) {
    this.user.subscribe(async () => {
      const snapshot = await this.user.snapshot()
      if (!snapshot.addr) {
        // user not authenticated
        this.setCOAAddress(null)
        callback(this.getAccounts())
        return
      }

      const address = await this.fetchCOAFromFlowAddress(snapshot.addr)
      this.setCOAAddress(address)

      callback(this.getAccounts())
    })
  }
}