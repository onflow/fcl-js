import React from "react"
import {renderHook, waitFor} from "@testing-library/react"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {useFlowRevertibleRandom} from "./useFlowRevertibleRandom"
import {useFlowQuery} from "./useFlowQuery"
import {createMockFclInstance} from "../__mocks__/flow-client"

jest.mock("./useFlowBlock")
jest.mock("./useFlowQuery")

const wrapper = ({children}: {children: React.ReactNode}) => (
  <TestProvider
    config={{flowNetwork: "emulator", accessNodeUrl: "http://localhost"}}
  >
    {children}
  </TestProvider>
)

describe("useFlowRandom", () => {
  beforeEach(() => {
    queryClient.clear()
  })

  afterEach(() => {
    setMockFlowClient(null)
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
