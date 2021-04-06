import {
  build,
  resolve,
  ref,
  transaction,
  proposer,
  payer,
  limit,
  meta,
  authorizations,
  authorization,
} from "../sdk.js"

const META = {
  title: "Kitty Kangol",
  description: "A cool cat hat",
  price: "10",
  image: {
    url: "https://i.imgur.com/a/JPmBk9R.png",
    width: "200",
    height: "200",
    alt: "An adorable NFT",
  },
}

test("meta in resolve-accounts", async () => {
  const ix = await resolve(
    await build([
      transaction``,
      limit(156),
      proposer(authorization("01", () => ({signature: "123"}), 1, 123)),
      authorizations([authorization("01", () => ({signature: "123"}), 1, 123)]),
      payer(authorization("01", () => ({signature: "123"}), 1, 123)),
      ref("123"),
      meta(META),
    ])
  )

  expect(ix.metadata).toStrictEqual(META)
})
