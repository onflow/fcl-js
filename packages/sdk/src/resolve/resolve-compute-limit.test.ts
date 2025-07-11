import {
  initInteraction,
  pipe,
  makeTransaction,
} from "../interaction/interaction"
import {config} from "@onflow/config"
import {resolveComputeLimit} from "./resolve-compute-limit"
import {getGlobalContext} from "../context/global"

describe("resolveComputeLimit", () => {
  test("transaction compute limit has priority", async () => {
    const TRANSACTION_COMPUTE_LIMIT = 1234
    const CONFIG_COMPUTE_LIMIT = 4321
    await config.overload(
      {
        "fcl.limit": CONFIG_COMPUTE_LIMIT,
      },
      async () => {
        const ix = await pipe([
          makeTransaction,
          ix => ({
            ...ix,
            message: {
              ...ix.message,
              computeLimit: TRANSACTION_COMPUTE_LIMIT,
            },
          }),
          async ix => resolveComputeLimit(ix, await getGlobalContext()),
        ])(initInteraction())

        expect(ix.message.computeLimit).toBe(TRANSACTION_COMPUTE_LIMIT)
      }
    )
  })

  test("config compute limit is used if exists", async () => {
    const CONFIG_COMPUTE_LIMIT = 4321
    await config.overload(
      {
        "fcl.limit": CONFIG_COMPUTE_LIMIT,
      },
      async () => {
        const ix = await pipe([
          makeTransaction,
          async ix => resolveComputeLimit(ix, await getGlobalContext()),
        ])(initInteraction())
        expect(ix.message.computeLimit).toBe(CONFIG_COMPUTE_LIMIT)
      }
    )
  })
})
