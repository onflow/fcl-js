const execSync = require("child_process").execSync

export function createAccountCLI(publicKey) {
  return execSync(`flow accounts create --key ${publicKey}`, {encoding: "utf-8"})
}
