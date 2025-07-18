import React from "react"
import {renderHook, waitFor} from "@testing-library/react"
import {FlowProvider} from "../provider/FlowProvider"
import {useFlowBlock} from "./useFlowBlock"
import {useFlowRevertibleRandom} from "./useFlowRevertibleRandom"
import {useFlowQuery} from "./useFlowQuery"
import {createFlowClient} from "@onflow/fcl"
import {createMockFclInstance} from "../__mocks__/flow-client"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

jest.mock("./useFlowBlock")
jest.mock("./useFlowQuery")

const wrapper = ({children}: {children: React.ReactNode}) => (
  <FlowProvider
    config={{flowNetwork: "emulator", accessNodeUrl: "http://localhost"}}
  >
    {children}
  </FlowProvider>
)

describe("useFlowRandom", () => {
  afterEach(() => {
    jest
      .mocked(createFlowClient)
      .mockReturnValue(createMockFclInstance().mockFclInstance)

    jest.clearAllMocks()
  })

  test("fetches random UInt256 within given bounds", async () => {
    const min = "0"
    const max = "100"
    const count = 3
    const expectedBlockHeight = 123
    const expectedRandomValue = "40"

    jest.mocked(useFlowQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any)

    const {result, rerender} = renderHook(
      () => useFlowRevertibleRandom({min, max, count}),
      {wrapper}
    )

    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(result.current.data).toBeNull()

    jest.mocked(useFlowQuery).mockReturnValue({
      data: Array(count).fill({
        blockHeight: expectedBlockHeight,
        value: expectedRandomValue,
      }),
      isLoading: false,
      error: null,
    } as any)

    rerender()

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toHaveLength(count)
    expect(result.current.data?.[0].blockHeight).toEqual(expectedBlockHeight)
    expect(result.current.data?.[0].value).toEqual(expectedRandomValue)
  })
})
