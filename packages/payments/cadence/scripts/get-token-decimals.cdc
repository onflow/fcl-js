import "EVM"
import "FlowEVMBridgeUtils"

access(all) fun main(evmAddressHex: String): UInt8 {
    let evmAddress = EVM.addressFromString(evmAddressHex)
    return FlowEVMBridgeUtils.getTokenDecimals(evmContractAddress: evmAddress)
}

