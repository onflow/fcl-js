import React from "react"
import {renderHook, waitFor} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {FlowProvider} from "../provider/FlowProvider"
import {useFlowBlock} from "./useFlowBlock"
import {useFlowRandom} from "./useFlowRandom"
import {useFlowQuery} from "./useFlowQuery"

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
    jest.clearAllMocks()
  })

  test("fetches random UInt256 within given bounds", async () => {
    jest.mocked(useFlowQuery).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    } as any)

    jest.mocked(useFlowBlock).mockReturnValue({
      data: {height: 123},
      isLoading: false,
      error: null,
    } as any)

    const expectedRandomValue = "123456789"
    const min = "100000000"
    const max = "200000000"

    const {result, rerender} = renderHook(
      () =>
        useFlowRandom({
          min,
          max,
        }),
      {
        wrapper,
      }
    )

    await waitFor(() => expect(result.current.isLoading).toBe(true))
    expect(result.current.data).toBeNull()

    jest.mocked(useFlowQuery).mockReturnValue({
      data: expectedRandomValue,
      isLoading: false,
      error: null,
    } as any)

    rerender()

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual(expectedRandomValue)
  })
})
