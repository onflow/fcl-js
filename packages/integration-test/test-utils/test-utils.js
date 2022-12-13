const execSync = require("child_process").execSync

export function createAccountCLI(publicKey) {
  return execSync(`flow accounts create --key ${publicKey}`, {
    encoding: "utf-8",
  })
}

// Get address from CLI output and maybe trim the 0x part out of the result
export function getAddressFromCLIOutput(output, keepPrefix) {
  let address = output
    .substring(output.indexOf("0x"), output.indexOf("0x") + 18)
  
  return keepPrefix? address : address.substring(2)
}

export function getTransactionIdFromCLIOutput(output) {
  // output has format: "Transaction ID: xxxxxxxx"
  // length of "Transaction ID: " is 16
  // length of transaction id is 64
  return output.substring(output.indexOf("Transaction ID:"), output.indexOf("Transaction ID:") + 80).substring(16)
}