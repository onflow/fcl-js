import {uid} from "./util-uid"

test("it should generate a unique 32 character alphanumeric string", () => {
  const set = new Set()
  for (let i = 0; i < 1000; i++) {
    const id = uid()
    expect(id).toMatch(/^[a-zA-Z0-9]{32}$/)
    expect(set.has(id)).toBe(false)
    set.add(id)
  }
  expect(set.size).toBe(1000)
})
