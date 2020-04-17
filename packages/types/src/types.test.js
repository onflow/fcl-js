import * as t from "./types.js"
;[
  [t.Identity, 0, 0, 0],
  [t.Identity, "a", "a", "a"],
  [t.Identity, null, null, null],
].forEach(([cast, input, asParam, asInjection]) => {
  describe(cast.label, () => {
    test(`t.${cast.label}.asParam(${input})`, () => {
      expect(cast.asParam(input)).toBe(asParam)
    })
    test(`t.${cast.label}.asInjection(${input})`, () => {
      expect(cast.asInjection(input)).toBe(asInjection)
    })
  })
})
