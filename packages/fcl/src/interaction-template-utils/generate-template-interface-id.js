import { encode as rlpEncode } from "@onflow/rlp"
import {genHash} from "./utils/hash.js"

export async function generateTemplateInterfaceId({
    templateInterface,
}) {
    invariant(templateInterface != undefined, "generateTemplateInterfaceId({ templateInterface }) -- templateInterface must be defined")
    invariant(typeof templateInterface === "object", "generateTemplateInterfaceId({ templateInterface }) -- templateInterface must be an object")
    invariant(typeof templateInterface.f_type === "InteractionTemplateInterface", "generateTemplateInterfaceId({ templateInterface }) -- templateInterface object must be an InteractionTemplate")

    const interfaceData = templateInterface.data

    const encodedHex = rlpEncode([
        await genHash(interfaceData.flip),
        await Promise.all(Object.keys(interfaceData.arguments).map(
            async argumentLabel => ([
                await genHash(argumentLabel),
                await genHash(String(interfaceData.arguments[argumentLabel].index)),
                await genHash(interfaceData.arguments[argumentLabel].type),
            ])
        ))
    ]).toString("hex")

    return genHash(encodedHex)
}