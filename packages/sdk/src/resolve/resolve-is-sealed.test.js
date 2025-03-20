import {
  initInteraction,
  pipe,
  makeTransaction,
} from "../interaction/interaction"
import {config} from "@onflow/config"
import {resolveIsSealed} from "./resolve-is-sealed"

describe("resolveIsSealed", () => {
  test("interaction isSealed has priority", async () => {
    await config.overload(
      {
        "fcl.isSealed": false,
      },
      async () => {
        const ix = await pipe([
          makeTransaction,
          ix => ({
            ...ix,
            block: {
              ...ix.block,
              isSealed: true,
            },
          }),
          resolveIsSealed,
        ])(initInteraction())

        expect(ix.block.isSealed).toBe(true)
      }
    )
  })

  test("config isSealed is used if exists", async () => {
    await config.overload(
      {
        "fcl.isSealed": false,
      },
      async () => {
        const ix = await pipe([makeTransaction, resolveIsSealed])(
          initInteraction()
        )

        expect(ix.block.isSealed).toBe(false)
      }
    )
  })

  test("fallback to isSealed=true (hard finality)", async () => {
    const ix = await pipe([makeTransaction, resolveIsSealed])(initInteraction())

    expect(ix.block.isSealed).toBe(true)
  })
})
