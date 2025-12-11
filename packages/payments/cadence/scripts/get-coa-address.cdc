import "EVM"

/// Get the EVM address for a Cadence account's COA (Cadence Owned Account)
/// Returns the EVM address as a hex string with 0x prefix, or nil if no COA exists
access(all) fun main(address: Address): String? {
    let account = getAccount(address)
    
    // Try to borrow the COA from the account's storage
    let coaRef = account.capabilities.borrow<&EVM.CadenceOwnedAccount>(
        /public/evm
    )
    
    if let coa = coaRef {
        // Get the address bytes and convert to hex string with 0x prefix
        let addressBytes = coa.address().bytes
        return "0x".concat(String.encodeHex(addressBytes))
    }
    
    return nil
}
