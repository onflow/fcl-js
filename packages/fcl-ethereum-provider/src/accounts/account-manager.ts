import * as fcl from "@onflow/fcl"
import {getCOAAddress} from "../rpc/handlers/eth-accounts"

export class AccountManager {
  private user: typeof fcl.currentUser
  private coaAddress: string | undefined

  constructor(user: typeof fcl.currentUser) {
    this.user = user
  }

  public async getUserSnapshot() {
    return this.user.snapshot()
  }

  public getCOAAddress(): string | undefined {
    return this.coaAddress
  }

  public getAccounts(): string[] {
    return this.coaAddress ? [this.coaAddress] : []
  }

  public setCOAAddress(addr: string): void {
    this.coaAddress = addr
  }

  subscribe(callback: (accounts: string[]) => void) {
    this.user.subscribe(async () => {
      const snapshot = await this.user.snapshot()

      if (!snapshot.addr) {
        // user not authenticated
        this.coaAddress = undefined
        callback(this.getAccounts())
        return
      }

      // const address = await getCOAAddress()

      callback(this.getAccounts());
    });
  }
}