import {findImports} from "./utils/find-imports.js"
import {genHash} from "./utils/hash.js"
import {generateDependencyPin} from "./generate-dependency-pin.js"
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

function generateImport({contractName, address}) {
    return ({ contractName, address, contract: "" })
}

export async function verifyDependencyPinsSame({
    template,
    blockHeight,
    networks = ["mainnet", "testnet", "emulator"]
}) {
    invariant(template != undefined, "generateDependencyPin({ template }) InteractionTemplate must be defined")
    invariant(typeof template === "object", "generateDependencyPin({ template }) InteractionTemplate must be an object")
    invariant(template.f_type === "InteractionTemplate", "generateDependencyPin({ template }) Template must be an InteractionTemplate")

    invariant(networks != undefined, "generateDependencyPin({ networks }) networks must be defined")
    invariant(blockHeight != undefined, "generateDependencyPin({ blockHeight }) blockHeight must be defined")
    invariant(typeof blockHeight === "number", "generateDependencyPin({ blockHeight }) blockHeight must be a number")

    let templateDependenciesPlaceholderKeys = Object.keys(template.data.dependencies)

    for (let templateDependencyPlaceholderKey of templateDependenciesPlaceholderKeys) {
        let templateDependencyPlaceholder = template.data.dependencies[templateDependencyPlaceholderKey]

        let templateDependencyPlaceholderContractNames = Object.keys(templateDependencyPlaceholder)

        for (let templateDependencyPlaceholderContractName of templateDependencyPlaceholderContractNames) {
            let templateDependencyPlaceholderContractNetworks = 
                template.data.dependencies[templateDependencyPlaceholderKey][templateDependencyPlaceholderContractName]

            for (let network of networks) {
                let templateDependency = templateDependencyPlaceholderContractNetworks[network]
                if (typeof templateDependency === "undefined") continue

                let pin = await generateDependencyPin({
                    address: templateDependency.address,
                    contractName: templateDependency.contract,
                    blockHeight,
                })

                if (pin !== templateDependency.pin) {
                    log({
                        title: "verifyDependencyPinsSame Debug Error",
                        message: `Could not recompute and match dependency pin.
                            address: ${templateDependency.address} | contract: ${templateDependency.contract}
                            computed: ${pin}
                            template: ${templateDependency.pin}
                        `,
                        level: 0
                    })
                    return false
                }
            }
        }
    }

    return true
}

export async function verifyDependencyPinsSameAtLatestSealedBlock({
    template,
    networks = ["mainnet", "testnet", "emulator"]
}) {
    let latestSealedBlock = await block({ sealed: true })
    let latestSealedBlockHeight = latestSealedBlock?.height

    return verifyDependencyPinsSame({ template, networks, blockHeight: latestSealedBlockHeight})
}   