import {CompositeSignature} from "./CompositeSignature"

describe("wallet utils", () => {
  test("returns composite signature", () => {
    const COMPOSITE_SIGNATURE = {
      f_type: "CompositeSignature",
      f_vsn: "1.0.0",
      addr: "0x1",
      keyId: 0,
      signature: "foo",
    }
    const compSig = new CompositeSignature("1", 0, "foo")
    expect(compSig).toEqual(COMPOSITE_SIGNATURE)
  })
})
