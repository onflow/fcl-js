const merge = require("deepmerge")

import {encodeTransactionPayload, encodeTransactionEnvelope, encodeTxIdFromVoucher} from "./encode.js"
import * as root from "./encode.js"

it("export contract interface", () => {
  expect(root).toStrictEqual(
    expect.objectContaining({
      encodeTransactionPayload: expect.any(Function),
      encodeTransactionEnvelope: expect.any(Function),
      encodeTxIdFromVoucher: expect.any(Function),
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

const baseVoucher = {
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
  envelopeSigs: [],
}

const buildVoucher = partialVoucher =>
  merge(baseVoucher, partialVoucher, {arrayMerge: combineMerge})

describe("encode txId from voucher", () => {
  const invalidPayloadCases = [
    ["empty", {}],
    ["non-object", "foo"],

    ["null cadence", buildVoucher({cadence: null})],
    ["null computeLimit", buildVoucher({computeLimit: null})],
    ["null proposalKey", buildVoucher({proposalKey: null})],
    ["null proposalKey.address", buildVoucher({proposalKey: {address: null}})],
    ["null proposalKey.keyId", buildVoucher({proposalKey: {keyId: null}})],
    [
      "null proposalKey.sequenceNum",
      buildVoucher({proposalKey: {sequenceNum: null}}),
    ],
    ["null payer", buildVoucher({payer: null})],
    ["null authorizers", buildVoucher({authorizers: null})],

    ["non-string cadence", buildVoucher({cadence: 42})],
    ["non-string refBlock", buildVoucher({refBlock: 42})],
    ["non-number computeLimit", buildVoucher({computeLimit: "foo"})],
    ["non-object proposalKey", buildVoucher({proposalKey: "foo"})],
    ["non-string proposalKey.address", buildVoucher({proposalKey: {address: 42}})],
    ["non-number proposalKey.keyId", buildVoucher({proposalKey: {keyId: "foo"}})],
    [
      "non-number proposalKey.sequenceNum",
      buildVoucher({proposalKey: {sequenceNum: "foo"}}),
    ],
    ["non-string payer", buildVoucher({payer: 42})],
    ["non-array authorizers", buildVoucher({authorizers: {}})],
  ]

  const invalidPayloadSigsCases = [
    ["null payloadSigs", buildVoucher({payloadSigs: null})],
    ["null payloadSigs.0.address", buildVoucher({payloadSigs: [{address: null}]})],
    ["null payloadSigs.0.keyId", buildVoucher({payloadSigs: [{keyId: null}]})],
    ["null payloadSigs.0.sig", buildVoucher({payloadSigs: [{sig: null}]})],

    ["non-array payloadSigs", buildVoucher({payloadSigs: {}})],
    [
      "non-string payloadSigs.0.address",
      buildVoucher({payloadSigs: [{address: 42}]}),
    ],
    [
      "non-number payloadSigs.0.keyId",
      buildVoucher({payloadSigs: [{keyId: "foo"}]}),
    ],
    ["non-string payloadSigs.0.sig", buildVoucher({payloadSigs: [{sig: 42}]})],
  ]

  const invalidEnvelopeSigsCases = [
    ["null envelopeSigs", buildVoucher({envelopeSigs: null})],
    ["null envelopeSigs.0.address", buildVoucher({envelopeSigs: [{address: null}]})],
    ["null envelopeSigs.0.keyId", buildVoucher({envelopeSigs: [{keyId: null}]})],
    ["null envelopeSigs.0.sig", buildVoucher({envelopeSigs: [{sig: null}]})],

    ["non-array envelopeSigs", buildVoucher({envelopeSigs: {}})],
    [
      "non-string envelopeSigs.0.address",
      buildVoucher({envelopeSigs: [{address: 42}]}),
    ],
    [
      "non-number envelopeSigs.0.keyId",
      buildVoucher({envelopeSigs: [{keyId: "foo"}]}),
    ],
    ["non-string envelopeSigs.0.sig", buildVoucher({envelopeSigs: [{sig: 42}]})],
  ]

  // Test case format:
  // [
  //   <test name>,
  //   <tx obj>,
  //   <tx id>, // These values are calculated using Flow Go SDK test code.
  // ]
  const validCases = [
    [
      "complete tx",
      buildVoucher({}),
      "118d6462f1c4182501d56f04a0cd23cf685283194bb316dceeb215b353120b2b"
    ],
    [
      "complete tx with envelope sig",
      buildVoucher({envelopeSigs: [{ address: "01", keyId: 4, sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"}]}),
      "363172029cc6bfc5df3f99e84393e82b6c11e2a920c0e8c3229d077ae8bc31f7"
    ],
    [
      "empty cadence",
      buildVoucher({cadence: ""}),
      "41dbbb83852ec8aa84dbeff03e29c0ed9c4a17b374eb0aa81695d83ccb344faf",
    ],
    [
      "null refBlock",
      buildVoucher({refBlock: null}),
      "b01ac14da3e2a64e4c2e0a341ae2da832ff366b4c18b665fdd1fb5837e6128e0",
    ],
    [
      "zero computeLimit",
      buildVoucher({computeLimit: 0}),
      "c149bf2077e174ccbf190f28eecda915f355333afb247f5c2ec44c2d041faf64",
    ],
    [
      "zero proposalKey.key",
      buildVoucher({proposalKey: {keyId: 0}}),
      "1627bf4a626af55e0230b466b3828cb54822e53585f704e99a37abbbe6fbe51a",
    ],
    [
      "zero proposalKey.sequenceNum",
      buildVoucher({proposalKey: {sequenceNum: 0}}),
      "3e9541ecee13b87a1c7be5e9ef0a00e4d48937a6f3df25167ffab2d4b4c846f4",
    ],
    [
      "multiple authorizers",
      buildVoucher({authorizers: ["01", "02"]}),
      "6c4b45769cabadf30a103693195845ae633907f701cdcfa775bb830b6c80cb5b",
    ],
    [
      "empty payloadSigs",
      buildVoucher({payloadSigs: []}),
      "c56b673a57fb94d546b9c30ac637d20021d04faf046e2cd5ea32591b7175794e"
    ],
    [
      "out-of-order payloadSigs -- by signer",
      buildVoucher({
        authorizers: ["01", "02", "03"],
        payloadSigs: [
          {address: "03", keyId: 0, sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"},
          {address: "01", keyId: 0, sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"},
          {address: "02", keyId: 0, sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"},
        ],
      }),
      "b67576744b0d051ba81e4d6635a47b9c8973b3adc7410bcd213880d5094b264a"
    ],
    [
      "out-of-order payloadSigs -- by key ID",
      buildVoucher({
        authorizers: ["01"],
        payloadSigs: [
          {address: "01", keyId: 2, sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"},
          {address: "01", keyId: 0, sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"},
          {address: "01", keyId: 1, sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162"},
        ],
      }),
      "183a74ecc0782fbffc364cac0c404ee01144ae258841b806a6274259bfc7ef8b"
    ],
  ]

  describe("invalid", () => {
    test.each(invalidPayloadCases)("%s", (_, voucher) => {
      expect(() => encodeTxIdFromVoucher(voucher)).toThrow()
    })

    test.each(invalidPayloadSigsCases)("%s", (_, voucher) => {
      expect(() => encodeTxIdFromVoucher(voucher)).toThrow()
    })

    test.each(invalidEnvelopeSigsCases)("%s", (_, voucher) => {
      expect(() => encodeTxIdFromVoucher(voucher)).toThrow()
    })
  })

  describe("valid", () => {
    test.each(validCases)("%s", (_, voucher, expectedTxId) => {
      expect(encodeTxIdFromVoucher(voucher)).toBe(expectedTxId)
    })
  })
})
