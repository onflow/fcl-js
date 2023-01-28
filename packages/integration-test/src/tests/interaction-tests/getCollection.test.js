import * as fcl from "@onflow/fcl"
import { createAccountCLI, getTransactionIdFromCLIOutput } from "../../../test-utils/test-utils"

describe("getCollection test", () => {

  test("getCollection test", async () => {
    let output = createAccountCLI("c53a754d5fcab9757beef7682c627d7907c98da1d78672da179a07a171c66eaf8a9386bb26c639254bde640b400289692c69a700bd5626df15f7c3b63fb33fbe")
    const transactionId1 = getTransactionIdFromCLIOutput(output)

    const block1 = await fcl
      .send([
        fcl.getBlock(
        ),
      ])
      .then(fcl.decode)
    const collectionId1 = block1.collectionGuarantees[0].collectionId

    output = createAccountCLI("17c360e59d84982e22ecf27ddb19947299f485fd7ccdcfbd62b598ca787044368e4a76edf562a8017308c816630404ecb7191b60e61066a89d43a89799a85529")
    const transactionId2 = getTransactionIdFromCLIOutput(output)

    const block2 = await fcl
      .send([
        fcl.getBlock(
        ),
      ])
      .then(fcl.decode)
    const collectionId2 = block2.collectionGuarantees[0].collectionId

    const collection1 = await fcl
    .send([
      fcl.getCollection(collectionId1
      ),
    ])
    .then(fcl.decode)

    expect(collection1.id).toMatch(collectionId1)
    expect(collection1.transactionIds).toContain(transactionId1)

    const collection2 = await fcl
    .send([
      fcl.getCollection(collectionId2
      ),
    ])
    .then(fcl.decode)

    expect(collection2.id).toMatch(collectionId2)
    expect(collection2.transactionIds).toContain(transactionId2)
  })
})
