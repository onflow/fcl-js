import { AccountManager } from "../../accounts/account-manager";

async function getCOAAddress(accountManager: AccountManager): Promise<string> {
  const accounts = accountManager.getAccounts();

  if (accounts.length === 0) {
    throw new Error("COA account not found for the authenticated user");
  }

  return accounts[0];
}

export function ethAccounts(accountManager: AccountManager): string[] {
  return accountManager.getAccounts();
}

export async function ethRequestAccounts(accountManager: AccountManager): Promise<string[]> {
  await accountManager.user.authenticate();

  const coaAddress = await getCOAAddress(accountManager);
  accountManager.setAccounts(coaAddress);

  return accountManager.getAccounts();
}