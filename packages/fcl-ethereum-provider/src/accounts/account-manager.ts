import * as fcl from "@onflow/fcl"

export class AccountManager {
  constructor(private user: typeof fcl.currentUser) {}

  getAccounts(): string[] {
    // ... get coa address
    return []
  }

  subscribe(callback: (accounts: string[]) => void) {
    // ...
  }
}
