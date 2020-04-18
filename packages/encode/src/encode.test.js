const merge = require('deepmerge')

import {encodeTransactionPayload, encodeTransactionEnvelope} from "./encode"

const baseTx = {
  script: `transaction { execute { log("Hello, World!") } }`,
  refBlock: "f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b",
  gasLimit: 42,
  proposalKey: {
    address: "01",
    key: 4,
    sequenceNum: 10,
  },
  payer: "01",
  authorizers: ["01"],
  payloadSigs: [{
    address: "01",
    key: 4,
    sig: "f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
  }]
}

const combineMerge = (target, source, options) => {
  // empty list always overwrites target
  if (source.length == 0) return source

	const destination = target.slice()

	source.forEach((item, index) => {
		if (typeof destination[index] === 'undefined') {
			destination[index] = options.cloneUnlessOtherwiseSpecified(item, options)
		} else if (options.isMergeableObject(item)) {
			destination[index] = merge(target[index], item, options)
		} else if (target.indexOf(item) === -1) {
			destination.push(item)
		}
  })
  
	return destination
}

const buildTx = (partialTx) => merge(baseTx, partialTx, { arrayMerge: combineMerge })

describe("encode transaction", () => {

  const invalidPayloadCases = [
    ["empty", {},],
    ["non-object", "foo",],

    ["null script", buildTx({ script: null }),],
    ["null refBlock", buildTx({ refBlock: null }),],
    ["null gasLimit", buildTx({ gasLimit: null }),],
    ["null proposalKey", buildTx({ proposalKey: null }),],
    ["null proposalKey.address", buildTx({ proposalKey: { address: null } }),],
    ["null proposalKey.key", buildTx({ proposalKey: { key: null } }),],
    ["null proposalKey.sequenceNum", buildTx({ proposalKey: { sequenceNum: null } }),],
    ["null payer", buildTx({ payer: null }),],
    ["null authorizers", buildTx({ authorizers: null }),],

    ["non-string script", buildTx({ script: 42 }),],
    ["non-string refBlock", buildTx({ refBlock: 42 }),],
    ["non-number gasLimit", buildTx({ gasLimit: "foo" }),],
    ["non-object proposalKey", buildTx({ proposalKey: "foo" }),],
    ["non-string proposalKey.address", buildTx({ proposalKey: { address: 42 } }),],
    ["non-number proposalKey.key", buildTx({ proposalKey: { key: "foo" } }),],
    ["non-number proposalKey.sequenceNum", buildTx({ proposalKey: { sequenceNum: "foo" } }),],
    ["non-string payer", buildTx({ payer: 42 }),],
    ["non-array authorizers", buildTx({ authorizers: {} }),],
  ]

  const invalidEnvelopeCases = [
    ...invalidPayloadCases,
    ["null payloadSigs", buildTx({ payloadSigs: null }),],
    ["null payloadSigs.0.address", buildTx({ payloadSigs: [ { address: null } ] }),],
    ["null payloadSigs.0.key", buildTx({ payloadSigs: [ { key: null } ] }),],
    ["null payloadSigs.0.sig", buildTx({ payloadSigs: [ { sig: null } ] }),],

    ["non-array payloadSigs", buildTx({ payloadSigs: {} }),],
    ["non-string payloadSigs.0.address", buildTx({ payloadSigs: [ { address: 42 } ] }),],
    ["non-number payloadSigs.0.key", buildTx({ payloadSigs: [ { key: "foo" } ] }),],
    ["non-string payloadSigs.0.sig", buildTx({ payloadSigs: [ { sig: 42 } ] }),],
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
      "f895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001",
      "f8bcf895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ],
    [
      "empty script",
      buildTx({ script: "" }),
      "f86580a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001",
      "f88cf86580a0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ],
    [
      "zero gasLimit",
      buildTx({ gasLimit: 0 }),
      "f895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b80940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001",
      "f8bcf895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b80940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ],
    [
      "zero proposalKey.key",
      buildTx({ proposalKey: { key: 0 } }),
      "f895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001800a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001",
      "f8bcf895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001800a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ],
    [
      "zero proposalKey.sequenceNum",
      buildTx({ proposalKey: { sequenceNum: 0 } }),
      "f895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a9400000000000000000000000000000000000000010480940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001",
      "f8bcf895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a9400000000000000000000000000000000000000010480940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ],
    [
      "empty authorizers",
      buildTx({ authorizers: [] }),
      "f880b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001c0",
      "f8a7f880b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001c0e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ],
    [
      "multiple authorizers",
      buildTx({ authorizers: ["01", "02"] }),
      "f8aab07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001ea940000000000000000000000000000000000000001940000000000000000000000000000000000000002",
      "f8d1f8aab07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001ea940000000000000000000000000000000000000001940000000000000000000000000000000000000002e4e38004a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ]
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
      buildTx({ payloadSigs: [] }),
      "f898f895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001c0",
    ],
    [
      "zero payloadSigs.0.key",
      buildTx({ payloadSigs: [ { key: 0 }] }),
      "f8bcf895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001e4e38080a0f7225388c1d69d57e6251c9fda50cbbf9e05131e5adb81e5aa0422402f048162",
    ],
    [
      "out-of-order payloadSigs -- by signer",
      buildTx({
        authorizers: ["01", "02", "03"],
        payloadSigs: [
          { address: "03", key: 0, sig: "c" },
          { address: "01", key: 0, sig: "a" },
          { address: "02", key: 0, sig: "b" },
        ] 
      }),
      "f8cff8c0b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001f83f940000000000000000000000000000000000000001940000000000000000000000000000000000000002940000000000000000000000000000000000000003ccc3808080c3018080c3028080",
    ],
    [
      "out-of-order payloadSigs -- by key ID",
      buildTx({
        authorizers: ["01"],
        payloadSigs: [
          { address: "01", key: 2, sig: "c" },
          { address: "01", key: 0, sig: "a" },
          { address: "01", key: 1, sig: "b" },
        ] 
      }),
      "f8a4f895b07472616e73616374696f6e207b2065786563757465207b206c6f67282248656c6c6f2c20576f726c64212229207d207da0f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b2a940000000000000000000000000000000000000001040a940000000000000000000000000000000000000001d5940000000000000000000000000000000000000001ccc3808080c3800180c3800280",
    ]
  ]


  describe("payload", () => {
    describe("invalid",() => {
      test.each(invalidPayloadCases)("%s", (_, tx) => {
        expect(() => encodeTransactionPayload(tx)).toThrow()
      })
    })

    describe("valid",() => {
      test.each(validPayloadCases)("%s", (_, tx, expectedPayload) => {
        expect(encodeTransactionPayload(tx)).toBe(expectedPayload)
      })
    })
  })
    
  describe("envelope", () => {
    describe("invalid",() => {
      test.each(invalidEnvelopeCases)("%s", (_, tx) => {
        expect(() => encodeTransactionEnvelope(tx)).toThrow()
      })
    })

    describe("valid",() => {
      test.each(validPayloadCases)("%s", (_, tx, expectedPayload, expectedEnvelope) => {
        expect(encodeTransactionEnvelope(tx)).toBe(expectedEnvelope)
      })

      test.each(validEnvelopeCases)("%s", (_, tx, expectedEnvelope) => {
        expect(encodeTransactionEnvelope(tx)).toBe(expectedEnvelope)
      })
    })
  })
})
