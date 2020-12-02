import {resolveSignatures} from "./index.js"

test("exports function", () => {
  expect(typeof resolveSignatures).toBe("function")
})

test("Golden Path", async () => {
  const signingFunction = jest.fn(() => ({
    addr: "foo",
    keyId: 0,
    signature: "SIGNATURE",
  }))

  const ix = await resolveSignatures({
    tag: 4,
    message: {
      cadence: "foo",
      arguments: [],
      computeLimit: 10,
    },
    accounts: {
      foo: {
        addr: "foo",
        keyId: 0,
        sequenceNum: 0,
        signingFunction: signingFunction,
        role: {
          proposer: false,
          authorizer: true,
          payer: false,
        },
      },
    },
    proposer: "foo",
    authorizations: ["foo"],
    payer: "foo",
  })

  expect(ix).toMatchSnapshot()
})
