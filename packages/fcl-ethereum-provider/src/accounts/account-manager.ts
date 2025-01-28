import * as fcl from "@onflow/fcl"

export class AccountManager {
  private user: typeof fcl.currentUser
  private accounts: string[] = [];

  constructor(user: typeof fcl.currentUser) {
    this.user = user
  }

  public async getUserSnapshot() {
    return this.user.snapshot()
  }

  getAccounts(): string[] {
    return this.accounts;
  }

  setAccounts(accounts: string[]): void {
    this.accounts = accounts;
  }

  subscribe(callback: (accounts: string[]) => void) {
    this.user.subscribe(async () => {
      const snapshot = await fcl.currentUser().snapshot();

      const updatedAccounts = snapshot.addr ? [snapshot.addr] : [];
      this.setAccounts(updatedAccounts);

      callback(this.getAccounts());
    });
  }
}