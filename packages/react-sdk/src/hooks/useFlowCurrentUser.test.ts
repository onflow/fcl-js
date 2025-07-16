import {renderHook, act} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {useFlowCurrentUser} from "./useFlowCurrentUser"
// Import directly from the new hook, not from the deprecated one
import {FlowProvider} from "../provider"
import {CurrentUser} from "@onflow/typedefs"
import {defaultUser, authenticatedUser} from "../__mocks__/user"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

describe("useFlowCurrentUser", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  test("initializes with the correct default user state", () => {
    const {result} = renderHook(() => useFlowCurrentUser(), {
      wrapper: FlowProvider,
    })

    expect(result.current.user).toEqual(defaultUser)
  })

  test("updates user state when subscription emits a new user", () => {
    let subscribeCallback: (user: CurrentUser) => void = () => {}

    const subscribeMock = jest.mocked(fcl.currentUser.subscribe)

    subscribeMock.mockImplementation((callback: any) => {
      subscribeCallback = callback
      callback(defaultUser)
      return () => {}
    })

    const {result} = renderHook(() => useFlowCurrentUser(), {
      wrapper: FlowProvider,
    })

    act(() => {
      subscribeCallback(authenticatedUser)
    })

    expect(result.current.user).toEqual(authenticatedUser)
  })

  test("authenticate calls fcl.authenticate and returns the authenticated user", async () => {
    const authenticateMock = jest.mocked(fcl.authenticate)
    authenticateMock.mockResolvedValueOnce(authenticatedUser)

    const {result} = renderHook(() => useFlowCurrentUser(), {
      wrapper: FlowProvider,
    })

    let returnedUser: CurrentUser | undefined
    await act(async () => {
      returnedUser = await result.current.authenticate()
    })

    expect(fcl.authenticate).toHaveBeenCalledTimes(1)

    expect(returnedUser).toEqual(authenticatedUser)
  })

  test("unauthenticate calls fcl.unauthenticate and updates user state", async () => {
    const {result} = renderHook(() => useFlowCurrentUser(), {
      wrapper: FlowProvider,
    })

    await act(async () => {
      result.current.unauthenticate()
    })

    expect(fcl.unauthenticate).toHaveBeenCalledTimes(1)

    expect(result.current.user).toEqual(defaultUser)
  })

  test("unsubscribes from user changes on unmount", () => {
    const unsubscribeMock = jest.fn()

    const subscribeMock = jest.mocked(fcl.currentUser.subscribe)
    subscribeMock.mockImplementation((callback: any) => {
      return unsubscribeMock
    })

    const {unmount} = renderHook(() => useFlowCurrentUser(), {
      wrapper: FlowProvider,
    })

    unmount()

    expect(unsubscribeMock).toHaveBeenCalledTimes(1)
  })
})
