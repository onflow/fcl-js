import * as fcl from "@onflow/fcl";

interface UserSnapshot {
  addr?: string;
}

export class AccountManager {
  private coaAddress: string | null = null;
  private lastFlowAddress: string | null = null;

  constructor(public user: ReturnType<typeof fcl.currentUser>) {}

  getAccounts(): string[] {
    return this.coaAddress ? [this.coaAddress] : [];
  }

  setAccounts(coaAddress: string | null): void {
    this.coaAddress = coaAddress;
  }

  subscribe(callback: (accounts: string[]) => void) {
    this.user.subscribe(async (snapshot: UserSnapshot) => {
      const flowAddress = snapshot.addr || null;

      if (flowAddress !== this.lastFlowAddress) {
        this.lastFlowAddress = flowAddress;

        if (flowAddress) {
          try {
            // Only fetch COA if it's not already cached
            if (!this.coaAddress) {
              const coaAddress = await this.fetchCOAAddress(flowAddress);
              this.setAccounts(coaAddress);
            }
          } catch (error) {
            console.error("Error fetching COA address:", error);
            this.setAccounts(null);
          }
        } else {
          // If the user logs out, clear stored COA
          this.setAccounts(null);
        }
      }

      callback(this.getAccounts());
    });
  }

  private async fetchCOAAddress(flowAddress: string): Promise<string> {
    const cadenceScript = `
      import EVM

      access(all)
      fun main(address: Address): String? {
          if let coa = getAuthAccount<auth(BorrowValue) &Account>(address).storage.borrow<&EVM.CadenceOwnedAccount>(
              from: /storage/evm
          ) {
              return coa.address().toString()
          }
          return nil
      }
    `;

    const response = await fcl.query({
      cadence: cadenceScript,
      args: (arg, t) => [arg(flowAddress, t.Address)],
    });

    if (!response) {
      throw new Error("COA not found for the given Flow address");
    }

    return response;
  }
}