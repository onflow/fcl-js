import {interaction} from "../interaction/interaction.js"
import {voucherIntercept} from "./build-voucher-intercept"

describe("Build voucherIntercept", () => {
  test("Build voucherIntercept", async () => {
    const checkFunc = async () => "test func"

    const ix = await voucherIntercept(checkFunc)(interaction())

    expect(ix.assigns["ix.voucher-intercept"]).toEqual(checkFunc)
  })
})
