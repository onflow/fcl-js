import * as fcl from "@onflow/fcl"

export class AccountManager {
  private accounts: string[] = [];

  constructor(private user: typeof fcl.currentUser) {}

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