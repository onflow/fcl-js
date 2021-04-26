const merge = require("deepmerge")

import {encodeTransactionPayload, encodeTransactionEnvelope} from "./encode.js"
import * as root from "./encode.js"

it("export contract interface", () => {
  expect(root).toStrictEqual(
    expect.objectContaining({
      encodeTransactionPayload: expect.any(Function),
      encodeTransactionEnvelope: expect.any(Function),
    })
  )
})

const baseTx = {
  cadence: `transaction { execute { log("Hello, World!") } }`,
  arguments: [],
  refBlock: "f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b",
  computeLimit: 42,
  proposalKey: {
    address: "01",
    keyId: 4,
    sequenceNum: 10,
  },
  payer: "01",
  authorizers: ["01"],
  payloadSigs: [
    {
      address: "01",
      keyId: 4,
      sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    },
  ],
}

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

const buildTx = partialTx =>
  merge(baseTx, partialTx, {arrayMerge: combineMerge})

describe("encode transaction", () => {
  const invalidPayloadCases = [
    ["empty", {}],
    ["non-object", "foo"],

    ["null cadence", buildTx({cadence: null})],
    ["null computeLimit", buildTx({computeLimit: null})],
    ["null proposalKey", buildTx({proposalKey: null})],
    ["null proposalKey.address", buildTx({proposalKey: {address: null}})],
    ["null proposalKey.keyId", buildTx({proposalKey: {keyId: null}})],
    [
      "null proposalKey.sequenceNum",
      buildTx({proposalKey: {sequenceNum: null}}),
    ],
    ["null payer", buildTx({payer: null})],
    ["null authorizers", buildTx({authorizers: null})],

    ["non-string cadence", buildTx({cadence: 42})],
    ["non-string refBlock", buildTx({refBlock: 42})],
    ["non-number computeLimit", buildTx({computeLimit: "foo"})],
    ["non-object proposalKey", buildTx({proposalKey: "foo"})],
    ["non-string proposalKey.address", buildTx({proposalKey: {address: 42}})],
    ["non-number proposalKey.keyId", buildTx({proposalKey: {keyId: "foo"}})],
    [
      "non-number proposalKey.sequenceNum",
      buildTx({proposalKey: {sequenceNum: "foo"}}),
    ],
    ["non-string payer", buildTx({payer: 42})],
    ["non-array authorizers", buildTx({authorizers: {}})],
  ]

  const invalidEnvelopeCases = [
    ...invalidPayloadCases,
    ["null payloadSigs", buildTx({payloadSigs: null})],
    ["null payloadSigs.0.address", buildTx({payloadSigs: [{address: null}]})],
    ["null payloadSigs.0.keyId", buildTx({payloadSigs: [{keyId: null}]})],
    ["null payloadSigs.0.sig", buildTx({payloadSigs: [{sig: null}]})],

    ["non-array payloadSigs", buildTx({payloadSigs: {}})],
    [
      "non-string payloadSigs.0.address",
      buildTx({payloadSigs: [{address: 42}]}),
    ],
    [
      "non-number payloadSigs.0.keyId",
      buildTx({payloadSigs: [{keyId: "foo"}]}),
    ],
    ["non-string payloadSigs.0.sig", buildTx({payloadSigs: [{sig: 42}]})],
  ]

  // Test case format:
  // [
  //   <test name>,
  //   <tx obj>,
  //   <encoded payload>,
  //   <encoded envelope>,
  // ]
  const validPayloadCases = [
    [
      "complete tx",
      buildTx({}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c9880000000000000001",
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f899f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c9880000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ],
    [
      "empty cadence",
      buildTx({cadence: ""}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f84280c0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c9880000000000000001",
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f869f84280c0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c9880000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"
    ],
    [
      "null refBlock",
      buildTx({refBlock: null}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a000000000000000000000000000000000000000000000000000000000000000002a880000000000000001040a880000000000000001c9880000000000000001",
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f899f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a000000000000000000000000000000000000000000000000000000000000000002a880000000000000001040a880000000000000001c9880000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"
    ],
    [
      "zero computeLimit",
      buildTx({computeLimit: 0}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b80880000000000000001040a880000000000000001c9880000000000000001",
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f899f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b80880000000000000001040a880000000000000001c9880000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"
    ],
    [
      "zero proposalKey.key",
      buildTx({proposalKey: {keyId: 0}}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001800a880000000000000001c9880000000000000001",
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f899f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001800a880000000000000001c9880000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"
    ],
    [
      "zero proposalKey.sequenceNum",
      buildTx({proposalKey: {sequenceNum: 0}}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a8800000000000000010480880000000000000001c9880000000000000001",
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f899f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a8800000000000000010480880000000000000001c9880000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"
    ],
    [
      "empty authorizers",
      buildTx({authorizers: []}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f869b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c0",
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f890f869b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c0e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"
    ],
    [
      "multiple authorizers",
      buildTx({authorizers: ["01", "02"]}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f87bb07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001d2880000000000000001880000000000000002",
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f8a2f87bb07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001d2880000000000000001880000000000000002e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"
    ],
  ]

  // Test case format:
  // [
  //   <test name>,
  //   <tx obj>,
  //   <encoded envelope>,
  // ]
  const validEnvelopeCases = [
    [
      "empty payloadSigs",
      buildTx({payloadSigs: []}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f875f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c9880000000000000001c0"
    ],
    [
      "zero payloadSigs.0.key",
      buildTx({payloadSigs: [{keyId: 0}]}),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f899f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c9880000000000000001e4e38080a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"
    ],
    [
      "out-of-order payloadSigs -- by signer",
      buildTx({
        authorizers: ["01", "02", "03"],
        payloadSigs: [
          {address: "03", keyId: 0, sig: "c"},
          {address: "01", keyId: 0, sig: "a"},
          {address: "02", keyId: 0, sig: "b"},
        ],
      }),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f893f884b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001db880000000000000001880000000000000002880000000000000003ccc3808080c3018080c3028080"
    ],
    [
      "out-of-order payloadSigs -- by key ID",
      buildTx({
        authorizers: ["01"],
        payloadSigs: [
          {address: "01", keyId: 2, sig: "c"},
          {address: "01", keyId: 0, sig: "a"},
          {address: "01", keyId: 1, sig: "b"},
        ],
      }),
      "464c4f572d56302e302d7472616e73616374696f6e0000000000000000000000f881f872b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207dc0a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a880000000000000001040a880000000000000001c9880000000000000001ccc3808080c3800180c3800280"
    ],
  ]

  describe("payload", () => {
    describe("invalid", () => {
      test.each(invalidPayloadCases)("%s", (_, tx) => {
        expect(() => encodeTransactionPayload(tx)).toThrow()
      })
    })

    describe("valid", () => {
      test.each(validPayloadCases)("%s", (_, tx, expectedPayload) => {
        expect(encodeTransactionPayload(tx)).toBe(expectedPayload)
      })
    })
  })

  describe("envelope", () => {
    describe("invalid", () => {
      test.each(invalidEnvelopeCases)("%s", (_, tx) => {
        expect(() => encodeTransactionEnvelope(tx)).toThrow()
      })
    })

    describe("valid", () => {
      test.each(validPayloadCases)(
        "%s",
        (_, tx, expectedPayload, expectedEnvelope) => {
          expect(encodeTransactionEnvelope(tx)).toBe(expectedEnvelope)
        }
      )

      test.each(validEnvelopeCases)("%s", (_, tx, expectedEnvelope) => {
        expect(encodeTransactionEnvelope(tx)).toBe(expectedEnvelope)
      })
    })
  })
})
