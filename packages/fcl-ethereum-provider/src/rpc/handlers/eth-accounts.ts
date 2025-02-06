import {AccountManager} from "../../accounts/account-manager"

export async function ethAccounts(
  accountManager: AccountManager
): Promise<string[]> {
  return await accountManager.getAccounts()
}

export async function ethRequestAccounts(accountManager: AccountManager, chainId: number): Promise<string[]> {
  await accountManager.authenticate()

  return await accountManager.getAndCreateAccounts(chainId)
}
