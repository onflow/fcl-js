import {uid} from "./util-uid"

test("placeholder", () => {
  expect(uid()).not.toBe(1)
})
