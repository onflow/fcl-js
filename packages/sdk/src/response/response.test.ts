import {response} from "./response"

test("Response - Snapshot", async () => {
  const resp = response()

  expect(resp).toMatchSnapshot()
})
