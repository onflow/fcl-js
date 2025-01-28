import {AccountManager} from "../../accounts/account-manager"

export async function ethAccounts(
  accountManager: AccountManager
): Promise<string[]> {
  const address = await accountManager.getAddress()
  return address ? [address] : []
}

export function ethRequestAccounts() {
  throw new Error("Not implemented")
}
