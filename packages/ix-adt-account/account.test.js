const {account} = require("./account.cjs.js")

test("Snapshot of empty account structure", () => {
  expect(account()).toMatchSnapshot()
})
