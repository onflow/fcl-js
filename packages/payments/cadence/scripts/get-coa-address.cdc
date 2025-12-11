import "EVM"

/// Get the EVM address for a Cadence account's COA (Cadence Owned Account)
/// Returns the EVM address as a hex string, or nil if no COA exists
access(all) fun main(address: Address): String? {
    let account = getAccount(address)
    
    // Try to borrow the COA from the account's storage
    let coaRef = account.capabilities.borrow<&EVM.CadenceOwnedAccount>(
        /public/evm
    )
    
    if let coa = coaRef {
        return coa.address().toString()
    }
    
    return nil
}
