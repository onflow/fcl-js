import {renderHook, act} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {useCurrentFlowUser} from "./useCurrentFlowUser"
import {FlowProvider} from "../provider"
import {CurrentUser} from "@onflow/typedefs"

const defaultUser: CurrentUser = {
  f_type: "USER",
  f_vsn: "1.0.0",
  loggedIn: false,
  services: [],
}

const authenticatedUser: CurrentUser = {
  f_type: "USER",
  f_vsn: "1.0.0",
  loggedIn: true,
  addr: "0x1234",
  services: [],
}

jest.mock("@onflow/fcl", () => {
  let currentUserState = defaultUser

  return {
    config: () => ({
      subscribe: jest.fn(() => () => {}),
      load: jest.fn(),
    }),
    currentUser: {
      subscribe: jest.fn().mockImplementation((callback: any) => {
        callback(currentUserState)
        return () => {}
      }),
      snapshot: () => currentUserState,
    },
    authenticate: jest.fn().mockImplementation(() => {
      currentUserState = authenticatedUser
      return Promise.resolve(authenticatedUser)
    }),
    unauthenticate: jest.fn().mockImplementation(() => {
      currentUserState = defaultUser
    }),
  }
})

describe("useCurrentFlowUser", () => {
  test("initializes with the correct default user state", () => {
    const {result} = renderHook(() => useCurrentFlowUser(), {
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

    const {result} = renderHook(() => useCurrentFlowUser(), {
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

    const {result} = renderHook(() => useCurrentFlowUser(), {
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
    const {result} = renderHook(() => useCurrentFlowUser(), {
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

    const {unmount} = renderHook(() => useCurrentFlowUser(), {
      wrapper: FlowProvider,
    })

    unmount()

    expect(unsubscribeMock).toHaveBeenCalledTimes(1)
  })
})
