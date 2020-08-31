import * as rlp from "rlp"
import {ec as EC} from "elliptic"
import {encodeTransactionPayload, encodeTransactionEnvelope} from "./encode.js"

// const crypto = require('crypto');

// Object.defineProperty(global.self, 'crypto', {
//   value: {
//     getRandomValues: arr => crypto.randomBytes(arr.length)
//   }
// });

// Object.defineProperty(global, 'crypto', crypto);

// console.log(self.crypto)

const merge = require("deepmerge")
const fs = require('fs');

const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890";

function genRandomPublicKey(len = 128) {
    const hex = '0123456789abcdef';
    let output = '';
    for (let i = 0; i < len; ++i) {
        output += hex.charAt(Math.floor(Math.random() * hex.length));
    }

    const toHex = hex => Buffer.from(hex, "hex").toString("hex")
    return toHex(output);
}

// const getRandomFromAlphabet = () => alphabet.split("")[~~(Math.random() * alphabet.length)]
// const genRandomPublicKey = () => Array.from({ length: Math.ceil(Math.random() * 128) + 128 }).map(() => getRandomFromAlphabet()).join("");

// const encodePublicKeyForFlow = () => {
//     const pk = genRandomPublicKey()
//     const pkBuffer = Buffer.from(genRandomPublicKey(), "hex")
//     const signature = Math.random() >= 0.5 ? 2 : 3
//     const hash = Math.random() >= 0.5 ? 1 : 3
//     const weight = Math.ceil(Math.random() * 1000)

//     // const ec = new EC("p256")

//     // const keys = ec.genKeyPair()
//     // const privateKey = keys.getPrivate("hex")
//     // const publicKey = keys.getPublic("hex").replace(/^04/, "")

//     // console.log('keys', keys) 
//     // console.log('pkBuffer', pkBuffer)
//     // console.log('pkBuffer rlp', rlp.encode([Buffer.from(publicKey, "hex")]).toString("hex"))
//     // console.log('signature', signature)
//     // console.log('hash', hash)
//     // console.log('weight', weight)

//     return rlp
//         .encode([
//             Buffer.from(genRandomPublicKey(), "hex"), // publicKey hex to binary
//             Math.random() >= 0.5 ? 2 : 3, // P256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
//             Math.random() >= 0.5 ? 1 : 3, // SHA3-256 per https://github.com/onflow/flow/blob/master/docs/accounts-and-keys.md#supported-signature--hash-algorithms
//             Math.ceil(Math.random() * 1000), // give key full weight
//         ])
//         .toString("hex")
// }


const pk = `4519e9fbf966c6589faf
e60903c0da5f55c5cb50
aee5d870f097b35dfb6d
e13c170718cd92f50811
cdd9290e51c2766440b6
5031ae482cca79e3c479
96e0423a`;

const combineMerge = (target, source, options) => {
    // empty list always overwrites target
    if (source.length == 0) return source
  
    const destination = target.slice()
  
    source.forEach((item, index) => {
      if (typeof destination[index] === "undefined") {
        destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
      } else if (options.isMergeableObject(item)) {
        destination[index] = merge(target[index], item, options)
      } else if (target.indexOf(item) === -1) {
        destination.push(item)
      }
    })
  
    return destination
  }
  
const buildEnvelopeTx = partialTx =>
  merge(baseEnvelopeTx, partialTx, {arrayMerge: combineMerge})

const buildPayloadTx = partialTx =>
    merge(basePayloadTx, partialTx, {arrayMerge: combineMerge})


const SEND_FLOW_TOKEN_CDC =
`import FungibleToken from 0xee82856bf20e2aa6
transaction(amount: UFix64, to: Address) {
let vault: @FungibleToken.Vault
prepare(signer: AuthAccount) {
self.vault <- signer
.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)!
.withdraw(amount: amount)
}
execute {
getAccount(to)
.getCapability(/public/flowTokenReceiver)!
.borrow<&{FungibleToken.Receiver}>()!
.deposit(from: <-self.vault)
}
}`

const CREATE_ACCOUNT_CDC =
`transaction(publicKeys: [String]) {
prepare(signer: AuthAccount) {
let acct = AuthAccount(payer: signer)
for key in publicKeys {
acct.addPublicKey(key.decodeHex())
}
}
}`

const ADD_NEW_KEY_CDC =
`transaction(publicKey: String) {
prepare(signer: AuthAccount) {
let acct = AuthAccount(payer: signer)
acct.addPublicKey(publicKey.decodeHex())
}
}`

const basePayloadTx = {
    script: `transaction(msg: String) { execute { log(msg) } }`,
    arguments: [{ type: "String", value: "Hello, Zondax!"}],
    refBlock: "f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b",
    gasLimit: 42,
    proposalKey: {
        address: "f8d6e0586b0a20c7",
        keyId: 4,
        sequenceNum: 10,
    },
    payer: "f8d6e0586b0a20c7",
    authorizers: ["f8d6e0586b0a20c7"]
}

const baseEnvelopeTx = {
    ...basePayloadTx,
    payloadSigs: [
        {
            address: "f8d6e0586b0a20c7",
            keyId: 4,
            sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
        },
    ],
}

// Test case format:
// [
//   <test name>,
//   <tx obj>,
//   <encoded payload>,
//   <encoded envelope>,
// ]
const validPayloadCases = [
    [
        "Example Transaction - Valid Payload - Complete Transaction",
        buildPayloadTx({})
    ],
    [
        "Example Transaction - Valid Payload - Empty Script",
        buildPayloadTx({script: ""})
    ],
    [
        "Example Transaction - Valid Payload - Null Reference Block",
        buildPayloadTx({refBlock: null})
    ],
    [
        "Example Transaction - Valid Payload - Zero Gas Limit",
        buildPayloadTx({gasLimit: 0})
    ],
    [
        "Example Transaction - Valid Payload - Zero proposerKey.keyId",
        buildPayloadTx({proposalKey: {keyId: 0}})
    ],
    [
        "Example Transaction - Valid Payload - Zero proposalKey.sequenceNum",
        buildPayloadTx({proposalKey: {sequenceNum: 0}})
    ],
    [
        "Example Transaction - Valid Payload - Empty Authorizers",
        buildPayloadTx({authorizers: []})
    ],
    [
        "Example Transaction - Valid Payload - Multiple Authorizers",
        buildPayloadTx({authorizers: ["f8d6e0586b0a20c7", "r3e6h1234g4j16b8"]})
    ],
    ...(Array.from({ length: 20 }).map((_, i) => 
        [
            "Send Flow Token Transaction - Valid Payload - Valid Arguments #" + i,
            buildPayloadTx({
                script: SEND_FLOW_TOKEN_CDC,
                arguments: [
                    {
                        type: "UFix64",
                        value: (Math.random() * 10000).toFixed(2).toString(),
                    },
                    {
                        type: "Address",
                        value: "0xf8d6e0586b0a20c7"
                    }
                ]
            })
        ]
    )),
    ...(Array.from({ length: 5 }).map((_, i) => 
        [
            "Send Flow Token Transaction - Valid Payload - Valid Arguments -- EXTREME #" + i,
            buildPayloadTx({
                script: SEND_FLOW_TOKEN_CDC,
                arguments: [
                    {
                        type: "UFix64",
                        value: (Math.random() * 2**40).toFixed(2).toString(),
                    },
                    {
                        type: "Address",
                        value: "0xf8d6e0586b0a20c7"
                    }
                ]
            })
        ]
    )),
    ...(Array.from({ length: 20 }).map((_, i) => 
        [
            "Create Account Transaction - Valid Payload - Valid Arguments #" + i,
            buildPayloadTx({
                script: CREATE_ACCOUNT_CDC,
                arguments: [
                    {
                        type: "Array",
                        value: Array.from({ length: Math.ceil(Math.random() * 4) }).map(() => (
                            {
                                type: "String",
                                value: genRandomPublicKey()
                            }
                        ))
                    }
                ]
            })
        ]
    )),
    ...(Array.from({ length: 5 }).map((_, i) => 
        [
            "Create Account Transaction - Valid Payload - Valid Arguments -- EXTREME #" + i,
            buildPayloadTx({
                script: CREATE_ACCOUNT_CDC,
                arguments: [
                    {
                        type: "Array",
                        value: Array.from({ length: Math.ceil(Math.random() * 5) + 5 }).map(() => (
                            {
                                type: "String",
                                value: genRandomPublicKey()
                            }
                        ))
                    }
                ]
            })
        ]
    )),
    ...(Array.from({ length: 20 }).map((_, i) => 
        [
            "Add New Key Transaction - Valid Payload - Valid Arguments #" + i,
            buildPayloadTx({
                script: ADD_NEW_KEY_CDC,
                arguments: [
                    {
                        type: "String",
                        value: genRandomPublicKey()
                    }
                ]
            })
        ]
    ))
].map(x => ({
    title: x[0],
    valid: true,
    testnet: false,
    payloadMessage: x[1],
    envelopeMessage: {
        ...x[1],
        payloadSigs: [
            {
                address: "f8d6e0586b0a20c7",
                keyId: 4,
                sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
            },
        ],
    },
    encodedTransactionPayloadHex: encodeTransactionPayload(x[1]),
    encodedTransactionEnvelopeHex: encodeTransactionEnvelope({
        ...x[1],
        payloadSigs: [
            {
                address: "f8d6e0586b0a20c7",
                keyId: 4,
                sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
            },
        ],
    })
}))
  
  // Test case format:
  // [
  //   <test name>,
  //   <tx obj>,
  //   <encoded envelope>,
  // ]
const validEnvelopeCases = [
    [
        "Example Transaction - Valid Envelope - Empty payloadSigs",
        buildEnvelopeTx({payloadSigs: []})
    ],
    [
        "Example Transaction - Valid Envelope - Zero payloadSigs.0.key",
        buildEnvelopeTx({payloadSigs: [{keyId: 0}]})
    ],
    [
        "Example Transaction - Valid Envelope - Out-of-order payloadSigs -- By Signer",
        buildEnvelopeTx({
        authorizers: ["f8d6e0586b0a20c7", "r3e6h1234g4j16b8", "h3k1n7357j9p28u4"],
        payloadSigs: [
            {address: "h3k1n7357j9p28u4", keyId: 0, sig: "c"},
            {address: "f8d6e0586b0a20c7", keyId: 0, sig: "a"},
            {address: "r3e6h1234g4j16b8", keyId: 0, sig: "b"},
        ],
        })
    ],
    [
        "Example Transaction - Valid Envelope - Out-of-order payloadSigs -- By keyId",
        buildEnvelopeTx({
        authorizers: ["f8d6e0586b0a20c7"],
        payloadSigs: [
            {address: "f8d6e0586b0a20c7", keyId: 2, sig: "c"},
            {address: "f8d6e0586b0a20c7", keyId: 0, sig: "a"},
            {address: "f8d6e0586b0a20c7", keyId: 1, sig: "b"},
        ],
        })
    ],
    ...(Array.from({ length: 20 }).map((_, i) => 
        [
            "Send Flow Token Transaction - Valid Envelope - Valid Arguments #" + i,
            buildEnvelopeTx({
                script: SEND_FLOW_TOKEN_CDC,
                arguments: [
                    {
                        type: "UFix64",
                        value: (Math.random() * 10000).toFixed(2).toString(),
                    },
                    {
                        type: "Address",
                        value: "0xf8d6e0586b0a20c7"
                    }
                ]
            })
        ]
    )),
    ...(Array.from({ length: 5 }).map((_, i) => 
        [
            "Send Flow Token Transaction - Valid Envelope - Valid Arguments -- EXTREME #" + i,
            buildEnvelopeTx({
                script: SEND_FLOW_TOKEN_CDC,
                arguments: [
                    {
                        type: "UFix64",
                        value: (Math.random() * 2**40).toFixed(2).toString(),
                    },
                    {
                        type: "Address",
                        value: "0xf8d6e0586b0a20c7"
                    }
                ]
            })
        ]
    )),
    ...(Array.from({ length: 20 }).map((_, i) => 
        [
            "Create Account Transaction - Valid Envelope - Valid Arguments #" + i,
            buildEnvelopeTx({
                script: CREATE_ACCOUNT_CDC,
                arguments: [
                    {
                        type: "Array",
                        value: Array.from({ length: Math.ceil(Math.random() * 4) }).map(() => (
                            {
                                type: "String",
                                value: genRandomPublicKey()
                            }
                        ))
                    }
                ]
            })
        ]
    )),
    ...(Array.from({ length: 5 }).map((_, i) => 
        [
            "Create Account Transaction - Valid Envelope - Valid Arguments -- EXTREME #" + i,
            buildEnvelopeTx({
                script: CREATE_ACCOUNT_CDC,
                arguments: [
                    {
                        type: "Array",
                        value: Array.from({ length: Math.ceil(Math.random() * 5) + 5 }).map(() => (
                            {
                                type: "String",
                                value: genRandomPublicKey()
                            }
                        ))
                    }
                ]
            })
        ]
    )),
    ...(Array.from({ length: 20 }).map((_, i) => 
        [
            "Add New Key Transaction - Valid Envelope - Valid Arguments #" + i,
            buildEnvelopeTx({
                script: ADD_NEW_KEY_CDC,
                arguments: [
                    {
                        type: "String",
                        value: genRandomPublicKey()
                    }
                ]
            })
        ]
    ))
].map(x => ({
    title: x[0],
    valid: true,
    testnet: false,
    envelopeMessage: x[1],
    encodedTransactionEnvelopeHex: encodeTransactionEnvelope(x[1]),
}))

fs.writeFileSync("validPayloadCases.json", JSON.stringify(validPayloadCases, null, 2))
fs.writeFileSync("validEnvelopeCases.json", JSON.stringify(validEnvelopeCases, null, 2))

test("placeholder", () => {
    expect(1).toBe(1)
})
