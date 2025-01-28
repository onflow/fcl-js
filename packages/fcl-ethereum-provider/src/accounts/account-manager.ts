import * as fcl from "@onflow/fcl"
import { CurrentUser } from "@onflow/typedefs"

export class AccountManager {
  private user: typeof fcl.currentUser

  // For race-condition checks:
  private currentFetchId = 0

  // Track the last Flow address we fetched for
  private lastFlowAddr: string | null = null

  // The COA address (or null if none/not fetched)
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
      args: (arg: typeof fcl.arg, t: typeof fcl.t) => [arg(flowAddr, t.Address)],
    })

    if (!response) {
      throw new Error("COA account not found for the authenticated user")
    }
    return response as string
  }

  public async updateCOAAddress(force = false): Promise<void> {
    const snapshot = await this.user.snapshot()
    const currentFlowAddr = snapshot.addr

    // If user not logged in, reset everything
    if (!currentFlowAddr) {
      this.lastFlowAddr = null
      this.coaAddress = null
      return
    }

    const userChanged = this.lastFlowAddr !== currentFlowAddr
    if (force || userChanged) {
      this.lastFlowAddr = currentFlowAddr
      const fetchId = ++this.currentFetchId

      try {
        const address = await this.fetchCOAFromFlowAddress(currentFlowAddr)
        // Only update if this fetch is still the latest
        if (fetchId === this.currentFetchId) {
          this.coaAddress = address
        }
      } catch (error) {
        // If this fetch is the latest, clear
        if (fetchId === this.currentFetchId) {
          this.coaAddress = null
        }
        throw error
      }
    }
  }

  public getCOAAddress(): string | null {
    return this.coaAddress
  }

  public getAccounts(): string[] {
    return this.coaAddress ? [this.coaAddress] : []
  }

  public subscribe(callback: (accounts: string[]) => void) {
    this.user.subscribe(async (snapshot: CurrentUser) => {
      if (!snapshot.addr) {
        // user not authenticated => clear out
        this.lastFlowAddr = null
        this.coaAddress = null
        callback(this.getAccounts())
        return
      }

      await this.updateCOAAddress()
      callback(this.getAccounts())
    })
  }
}
