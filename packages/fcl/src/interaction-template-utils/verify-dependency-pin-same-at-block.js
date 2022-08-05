import {generateDependencyPin} from "./generate-dependency-pin.js"
import {
    invariant,
    block,
} from "@onflow/sdk"
import {log} from "@onflow/util-logger"

export async function verifyDependencyPinsSame({
    template,
    blockHeight,
    network,
}) {
    invariant(template != undefined, "generateDependencyPin({ template }) -- template must be defined")
    invariant(typeof template === "object", "generateDependencyPin({ template }) -- template must be an object")
    invariant(template.f_type === "InteractionTemplate", "generateDependencyPin({ template }) -- template must be an InteractionTemplate")

    invariant(network != undefined, "generateDependencyPin({ network }) network must be defined")
    invariant(blockHeight != undefined, "generateDependencyPin({ blockHeight }) blockHeight must be defined")
    invariant(typeof blockHeight === "number", "generateDependencyPin({ blockHeight }) blockHeight must be a number")

    let templateDependenciesPlaceholderKeys = Object.keys(template.data.dependencies)

    for (let templateDependencyPlaceholderKey of templateDependenciesPlaceholderKeys) {
        let templateDependencyPlaceholder = template.data.dependencies[templateDependencyPlaceholderKey]

        let templateDependencyPlaceholderContractNames = Object.keys(templateDependencyPlaceholder)

        for (let templateDependencyPlaceholderContractName of templateDependencyPlaceholderContractNames) {
            let templateDependencyPlaceholderContractNetworks = 
                template.data.dependencies[templateDependencyPlaceholderKey][templateDependencyPlaceholderContractName]

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

    return true
}

export async function verifyDependencyPinsSameAtLatestSealedBlock({
    template,
    network,
}) {
    let latestSealedBlock = await block({ sealed: true })
    let latestSealedBlockHeight = latestSealedBlock?.height

    return verifyDependencyPinsSame({ template, network, blockHeight: latestSealedBlockHeight})
}   