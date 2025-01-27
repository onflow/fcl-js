import {currentUser} from "@onflow/fcl"

export class AccountManager {
  constructor(private user: typeof currentUser) {}

  getAccounts(): string[] {
    // ... get coa address
    return []
  }

  subscribe(callback: (accounts: string[]) => void) {
    // ...
  }
}
