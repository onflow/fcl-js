import {response} from "./response.js"

test("Response - Snapshot", async () => {
    const resp = response()

    expect(resp).toMatchSnapshot()
})