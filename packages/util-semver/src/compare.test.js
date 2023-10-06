import {compare} from "./compare"

// taken from semver.org
const sortOrder = [
  "1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0",
  "1.0.0 < 2.0.0 < 2.1.0 < 2.1.1",
  "1.0.0-alpha < 1.0.0",
]

describe("semver compare", () => {
  // Check that examples are sorted properly
  sortOrder.forEach((order, i) => {
    const items = order.split(" < ")
    test(`sorts order #${i} correctly`, () => {
      expect([...items].sort(compare)).toEqual(items)
    })
  })

  test(`compares equivalent versions properly`, () => {
    expect(compare("1.0.0", "1.0.0")).toBe(0)
    expect(compare("1.0.0+build", "1.0.0")).toBe(0)
    expect(compare("1.0.0+build", "1.0.0+otherbuild")).toBe(0)
  })

  test(`throws on invalid input`, () => {
    expect(() => compare("1.0.0", "")).toThrow()
    expect(() => compare("", "1.0.0")).toThrow()
    expect(() => compare("", "")).toThrow()
    expect(() => compare("1.0.0", null)).toThrow()
    expect(() => compare(null, "1.0.0")).toThrow()
    expect(() => compare("1.0.a", "1.0.0")).toThrow()
  })
})
