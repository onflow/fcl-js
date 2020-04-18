import {pipe, put} from "@onflow/interaction"

export async function proposer(...args) {
    if (typeof args[0] === "function") return put("tx.proposer", await args[0]())
    if (typeof args[0] === "object") return put("tx.proposer", args[0])
    const [addr, proposalKeyIndex, sequenceNumber] = args
    return pipe([
        put("tx.proposer", proposalKey(
            addr,
            proposalKeyIndex,
            sequenceNumber
        ))
    ])
}

export function proposalKey(addr, proposalKeyIndex, sequenceNumber) {
    return {addr, proposalKeyIndex, sequenceNumber}
}
