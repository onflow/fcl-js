import {AccountManager} from "../../accounts/account-manager";

export function ethAccounts(accountManager: AccountManager): string[] {
  return accountManager.getAccounts();
}

export async function ethRequestAccounts(accountManager: AccountManager): Promise<string[]> {
  await accountManager.user.authenticate();

  return accountManager.getAccounts();
}