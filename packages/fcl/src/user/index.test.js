import {user} from "./"

const idle = () => new Promise(resolve => setTimeout(resolve, 0))

const IDENTITY = expect.objectContaining({
  acct: expect.any(String),
  name: expect.any(String),
  avatar: expect.any(String),
  bio: expect.any(String),
  hooks: expect.any(Object),
})

describe("user", () => {
  const u = user("foo")

  test("snapshot", async () => {
    expect(await u.snapshot()).toStrictEqual(IDENTITY)
  })

  test("subscribe", async () => {
    const fn = jest.fn()
    const unsub = u.subscribe(fn)
    await idle()

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenNthCalledWith(1, IDENTITY)
  })
})
