import "EVM"
import "FlowEVMBridgeConfig"

access(all) fun main(evmAddressHex: String): String? {
    let evmAddress = EVM.addressFromString(evmAddressHex)
    
    if let vaultType = FlowEVMBridgeConfig.getTypeAssociated(with: evmAddress) {
        return vaultType.identifier
    }
    
    return nil
}

