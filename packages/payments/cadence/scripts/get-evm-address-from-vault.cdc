import "EVM"
import "FlowEVMBridgeConfig"

access(all) fun main(vaultIdentifier: String): String? {
    let vaultType = CompositeType(vaultIdentifier)
        ?? panic("Could not construct type from identifier: ".concat(vaultIdentifier))
    
    if let evmAddress = FlowEVMBridgeConfig.getEVMAddressAssociated(with: vaultType) {
        return evmAddress.toString()
    }
    
    return nil
}

