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
        // Get the address bytes - it's a fixed-size array [UInt8; 20]
        // Convert to variable-size array for String.encodeHex
        let addressBytes = coa.address().bytes
        let variableBytes: [UInt8] = []
        for byte in addressBytes {
            variableBytes.append(byte)
        }
        return "0x".concat(String.encodeHex(variableBytes))
    }
    
    return nil
}
