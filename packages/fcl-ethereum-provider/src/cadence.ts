import {getContractAddress} from "./util/eth"
import {ContractType} from "./constants"

export const createCOATx = (chainId: number) => `
import EVM from ${getContractAddress(ContractType.EVM, chainId)}

transaction() {
    prepare(signer: auth(SaveValue, IssueStorageCapabilityController, PublishCapability) &Account) {
        let storagePath = /storage/evm
        let publicPath = /public/evm

        let coa: @EVM.CadenceOwnedAccount <- EVM.createCadenceOwnedAccount()
        signer.storage.save(<-coa, to: storagePath)

        let cap = signer.capabilities.storage.issue<&EVM.CadenceOwnedAccount>(storagePath)
        signer.capabilities.publish(cap, at: publicPath)
    }
}
`
