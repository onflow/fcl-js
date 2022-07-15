import {
    account,
    invariant,
    block,
    send,
    getAccount,
    atBlockHeight,
    config,
    decode
} from "@onflow/sdk"
import {log} from "@onflow/util-logger"
import {query} from "../exec/query.js"
import {genHash} from "./utils/hash.js"
import {findImports} from "./utils/find-imports.js"

function generateImport({contractName, address}) {
    return ({ contractName, address, contract: "" })
}

export async function generateDependencyPin({
    address,
    contractName,
    blockHeight,
}) {
    invariant(address != undefined, "generateDependencyPin({ address }) -- address must be defined")
    invariant(contractName != undefined, "generateDependencyPin({ contractName }) -- contractName must be defined")
    invariant(blockHeight != undefined, "generateDependencyPin({ blockHeight }) -- blockHeight must be defined")
    invariant(typeof address === "string", "generateDependencyPin({ address }) -- address must be a string")
    invariant(typeof contractName === "string", "generateDependencyPin({ contractName }) -- contractName must be a string")
    invariant(typeof blockHeight === "number", "generateDependencyPin({ blockHeight }) -- blockHeight must be a number")
    
    let horizon = [
        generateImport({ contractName, address })
    ]   

    for (const horizonImport of horizon) {
        let account = await send([
            getAccount(
                await config().get(horizonImport.address, horizonImport.address)
            ),
            atBlockHeight(blockHeight)
        ]).then(decode)

        horizonImport.contract = account.contracts?.[horizonImport.contractName]

        let contractImports = findImports(horizonImport.contract)

        horizon.push(...contractImports)
    }

    let contractHashes = horizon.map(iport => genHash(iport.contract))

    let contractHashesJoined = contractHashes.join("") 

    return genHash(contractHashesJoined)
}

export async function generateDependencyPinAtLatestSealedBlock({
    address,
    contractName,
}) {
    let latestSealedBlock = await block({ sealed: true })
    let latestSealedBlockHeight = latestSealedBlock?.height

    return generateDependencyPin({ address, contractName, blockHeight: latestSealedBlockHeight})
}
