import { encode as rlpEncode } from "@onflow/rlp"
import {genHash} from "./utils/hash.js"

export async function generateTemplateInterfaceId({
    interface,
}) {
    invariant(template != undefined, "interface must be defined")
    invariant(typeof template === "object", "interface must be an object")
    invariant(typeof template.f_type === "InteractionTemplateInterface", "Object must be an InteractionTemplate")

    const interfaceData = interface.data

    const encodedHex = rlpEncode([
        interfaceData.flip,
        Object.keys(interfaceData.arguments).map(
            argumentLabel => ([
                argumentLabel,
                interfaceData.arguments[argumentLabel].index,
                interfaceData.arguments[argumentLabel].type,
            ])
        )
    ]).toString("hex")

    return genHash(encodedHex)
}