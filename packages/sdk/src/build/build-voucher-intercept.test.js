import {initInteraction} from "../interaction/interaction"
import {voucherIntercept} from "./build-voucher-intercept"

describe("Build voucherIntercept", () => {
  test("Build voucherIntercept", async () => {
    const checkFunc = async () => "test func"

    const ix = await voucherIntercept(checkFunc)(initInteraction())

    expect(ix.assigns["ix.voucher-intercept"]).toEqual(checkFunc)
  })
})
