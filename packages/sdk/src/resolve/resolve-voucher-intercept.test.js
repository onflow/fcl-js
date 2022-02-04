import {resolveVoucherIntercept} from "./resolve-voucher-intercept.js"

test("exports function", () => {
  expect(typeof resolveVoucherIntercept).toBe("function")
})

test("voucherIntercept is executed", async () => {
  let executed = false

  const checkFunc = async voucher => {
    executed = true
    expect(typeof voucher).toBe("object")
  }

  const ix = {
    tag: "TRANSACTION",
    assigns: {
      "ix.voucher-intercept": checkFunc,
    },
    message: {
      cadence: "",
      refBlock: "123",
      computeLimit: 156,
      proposer: null,
      payer: null,
      authorizations: [],
      params: [],
      arguments: [],
    },
    accounts: {
      foo: {
        kind: "ACCOUNT",
        tempId: "foo",
        addr: "foo",
        keyId: 1,
        sequenceNum: 123,
        signature: null,
        signingFunction: () => ({signature: "123"}),
        resolve: null,
        role: {proposer: false, authorizer: false, payer: true, param: false},
      },
    },
    proposer: "foo",
    authorizations: ["foo"],
    payer: "foo",
  }

  await resolveVoucherIntercept(ix)

  expect(executed).toBe(true)
})

test("voucherIntercept throws error", async () => {
  let executed = false

  const checkFuncThrowError = async voucher => {
    executed = true
    throw new Error("test error")
  }

  const ix = {
    tag: "TRANSACTION",
    assigns: {
      "ix.voucher-intercept": checkFuncThrowError,
    },
    message: {
      cadence: "",
      refBlock: "123",
      computeLimit: 156,
      proposer: null,
      payer: null,
      authorizations: [],
      params: [],
      arguments: [],
    },
    accounts: {
      foo: {
        kind: "ACCOUNT",
        tempId: "foo",
        addr: "foo",
        keyId: 1,
        sequenceNum: 123,
        signature: null,
        signingFunction: () => ({signature: "123"}),
        resolve: null,
        role: {proposer: false, authorizer: false, payer: true, param: false},
      },
    },
    proposer: "foo",
    authorizations: ["foo"],
    payer: "foo",
  }

  await expect(resolveVoucherIntercept(ix)).rejects.toThrow()

  expect(executed).toBe(true)
})
