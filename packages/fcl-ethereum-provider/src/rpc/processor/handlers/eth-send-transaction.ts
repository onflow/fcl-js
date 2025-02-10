import {AccountManager} from "../../../accounts/account-manager"

export async function ethSendTransaction(
  accountManager: AccountManager,
  params: any
) {
  return await accountManager.sendTransaction(params)
}
