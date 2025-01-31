import * as fcl from "@onflow/fcl"
import {AccountManager} from "../../accounts/account-manager"

export async function ethAccounts(
  accountManager: AccountManager
): Promise<string[]> {
  return await accountManager.getAccounts()
}

export async function ethRequestAccounts(accountManager: AccountManager) {
  await fcl.currentUser().authenticate()

  return await accountManager.getAccounts()
}
