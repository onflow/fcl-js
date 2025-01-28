import * as fcl from "@onflow/fcl";
import {AccountManager} from "../../accounts/account-manager"

async function getCOAAddress(): Promise<string> {
  const cadenceScript = `
    import EVM

    /// Retrieves the EVM address from the provided Flow account address's COA stored in the standard path
    ///
    /// @param address: The Flow account address
    ///
    /// @return The EVM address as a string or nil if the COA is not found
    ///
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

  const user = await fcl.currentUser().snapshot();
  if (!user.addr) {
    throw new Error("User is not authenticated");
  }

  const response = await fcl.query({
    cadence: cadenceScript,
    args: (arg, t) => [arg(user.addr, t.Address)],
  });

  // If the response is null, the COA does not exist
  if (!response) {
    throw new Error("COA account not found for the authenticated user");
  }

  return response as string;
}

export function ethAccounts(accountManager: AccountManager): string[] {
  return accountManager.getAccounts()
}

export async function ethRequestAccounts(accountManager: AccountManager) {
  await fcl.currentUser().authenticate()

  const coaAddress = await getCOAAddress();

  accountManager.setAccounts([coaAddress]);

  return accountManager.getAccounts()
}
