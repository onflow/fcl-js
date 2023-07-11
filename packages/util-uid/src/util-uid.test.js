import {uid} from "./util-uid.js"

test("placeholder", () => {
  expect(uid()).not.toBe(1)
})
