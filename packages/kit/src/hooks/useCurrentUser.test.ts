import {renderHook} from "@testing-library/react"
import * as fcl from "@onflow/fcl"
import {useCurrentFlowUser} from "./useCurrentFlowUser"
import {FlowProvider} from "../provider"

jest.mock("@onflow/fcl", () => {
  const defaultUser = {
    f_type: "USER",
    f_vsn: "1.0.0",
    loggedIn: false,
    services: [],
  }

  return {
    config: () => ({
      subscribe: jest.fn(() => () => {}),
      load: jest.fn(),
    }),
    currentUser: {
      subscribe: jest.fn(callback => {
        callback(defaultUser)
        return () => {}
      }),
    },
    authenticate: jest.fn(),
    unauthenticate: jest.fn(),
  }
})

const defaultUser = {
  f_type: "USER",
  f_vsn: "1.0.0",
  loggedIn: false,
  services: [],
}

describe("useCurrentFlowUser", () => {
  test("initializes with the correct default user state", () => {
    const {result} = renderHook(() => useCurrentFlowUser(), {
      wrapper: FlowProvider,
    })

    expect(result.current.user).toEqual(defaultUser)
  })
})
