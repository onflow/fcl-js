import {
  initInteraction,
  pipe,
  makeTransaction,
  makeGetAccount,
  makeScript,
  makeGetBlock,
} from "../interaction/interaction"
import {config} from "@onflow/config"
import {resolveIsSealed} from "./resolve-is-sealed"

describe("resolveIsSealed", () => {
  test("interaction isSealed has priority", async () => {
    await config.overload(
      {
        "fcl.experimental.softFinality": true,
      },
      async () => {
        const ix = await pipe([
          makeGetAccount,
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

  test("config expirimental soft finality is used if exists", async () => {
    await config.overload(
      {
        "fcl.experimental.softFinality": true,
      },
      async () => {
        const ix = await pipe([makeGetAccount, resolveIsSealed])(
          initInteraction()
        )

        expect(ix.block.isSealed).toBe(false)
      }
    )
  })

  test("fallback to isSealed=true for getAccount (hard finality)", async () => {
    const ix = await pipe([makeGetAccount, resolveIsSealed])(initInteraction())

    expect(ix.block.isSealed).toBe(true)
  })

  test("fallback to isSealed=true for script (hard finality)", async () => {
    const ix = await pipe([makeScript, resolveIsSealed])(initInteraction())

    expect(ix.block.isSealed).toBe(true)
  })

  test("do not override for getBlock", async () => {
    const ix = await pipe([makeGetBlock, resolveIsSealed])(initInteraction())

    expect(ix.block.isSealed).toBe(null)
  })

  test("do not override for getBlockHeader", async () => {
    const ix = await pipe([makeTransaction, resolveIsSealed])(initInteraction())

    expect(ix.block.isSealed).toBe(null)
  })
})
