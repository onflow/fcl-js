import * as fcl from "@onflow/fcl"
import {AccountManager} from "../../accounts/account-manager"

export async function ethAccounts(
  accountManager: AccountManager
): Promise<string[]> {
  return accountManager.getAccounts()
}

export async function ethRequestAccounts(
  user: typeof fcl.currentUser,
  accountManager: AccountManager
) {
  await user.authenticate()

  await accountManager.updateCOAAddress()

  return accountManager.getAccounts()
}
