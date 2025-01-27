import {AccountManager} from "../../accounts/account-manager"

export function ethAccounts(accountManager: AccountManager): string[] {
  return accountManager.getAccounts()
}

export function ethRequestAccounts() {
  throw new Error("Not implemented")
}
