export async function genHash(utf8String) {
    return typeof window !== "undefined" ?
        await (async () => {
            const encoder = new TextEncoder()
            const data = encoder.encode(utf8String)
            const hashBuffer = await crypto.subtle.digest('SHA-256', data)
            const hashArray = Array.from(new Uint8Array(hashBuffer))     
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') 
            return hashHex
        })()
        :
        (() => {
            let crypto = require("crypto")
            return crypto.createHash("sha256").update(utf8String).digest("hex")
        })()
}