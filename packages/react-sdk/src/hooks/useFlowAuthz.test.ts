import * as fcl from "@onflow/fcl"
import {InteractionAccount} from "@onflow/typedefs"
import {act, renderHook} from "@testing-library/react"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {FlowProvider} from "../provider"
import {useFlowAuthz} from "./useFlowAuthz"

jest.mock("@onflow/fcl", () => require("../__mocks__/fcl").default)

const createMockAccount = (): Partial<InteractionAccount> => ({
  tempId: "MOCK_TEMP_ID",
  resolve: null,
})

describe("useFlowAuthz", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    mockFcl = createMockFclInstance()
    jest.mocked(fcl.createFlowClient).mockReturnValue(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("returns authorization function from current user", () => {
    const {result} = renderHook(() => useFlowAuthz(), {
      wrapper: FlowProvider,
    })

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe("function")
    expect(result.current).toBe(
      mockFcl.mockFclInstance.currentUser.authorization
    )
  })

  test("authorization function can be called", async () => {
    const mockAuthzFn = jest.fn().mockResolvedValue({
      tempId: "CURRENT_USER",
      resolve: jest.fn(),
    })

    mockFcl.mockFclInstance.currentUser.authorization = mockAuthzFn

    const {result} = renderHook(() => useFlowAuthz(), {
      wrapper: FlowProvider,
    })

    const mockAccount = createMockAccount()

    await act(async () => {
      await result.current(mockAccount)
    })

    expect(mockAuthzFn).toHaveBeenCalledWith(mockAccount)
  })

  test("returns stable authorization reference", () => {
    const {result, rerender} = renderHook(() => useFlowAuthz(), {
      wrapper: FlowProvider,
    })

    const firstAuth = result.current
    expect(firstAuth).toBeDefined()

    // Rerender should return the same authorization function
    rerender()

    expect(result.current).toBe(firstAuth)
  })

  test("uses custom flowClient when provided", () => {
    const customMockFcl = createMockFclInstance()
    const customFlowClient = customMockFcl.mockFclInstance as any

    const {result} = renderHook(
      () =>
        useFlowAuthz({
          flowClient: customFlowClient,
        }),
      {
        wrapper: FlowProvider,
      }
    )

    expect(result.current).toBe(customFlowClient.currentUser.authorization)
  })

  test("creates custom authorization with address and signing function", () => {
    const customAddress = "0xBACKEND"
    const mockSigningFunction = jest.fn().mockResolvedValue({
      signature: "mock_signature",
    })

    const {result} = renderHook(
      () =>
        useFlowAuthz({
          authz: {
            address: customAddress,
            keyId: 0,
            signingFunction: mockSigningFunction,
          },
        }),
      {
        wrapper: FlowProvider,
      }
    )

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe("function")
  })

  test("custom authorization returns correct account data", () => {
    const customAddress = "0xBACKEND"
    const customKeyId = 5
    const mockSigningFunction = jest.fn()

    const {result} = renderHook(
      () =>
        useFlowAuthz({
          authz: {
            address: customAddress,
            keyId: customKeyId,
            signingFunction: mockSigningFunction,
          },
        }),
      {
        wrapper: FlowProvider,
      }
    )

    const mockAccount = createMockAccount()
    const authResult = result.current(
      mockAccount
    ) as Partial<InteractionAccount>

    expect(authResult.addr).toBe(customAddress)
    expect(authResult.keyId).toBe(customKeyId)
    expect(authResult.signingFunction).toBe(mockSigningFunction)
  })

  test("custom authorization signing function can be called", async () => {
    const mockSigningFunction = jest.fn().mockResolvedValue({
      addr: "0xBACKEND",
      keyId: 0,
      signature: "mock_signature_123",
    })

    const {result} = renderHook(
      () =>
        useFlowAuthz({
          authz: {
            address: "0xBACKEND",
            keyId: 0,
            signingFunction: mockSigningFunction,
          },
        }),
      {
        wrapper: FlowProvider,
      }
    )

    const mockAccount = createMockAccount()
    const authResult = result.current(
      mockAccount
    ) as Partial<InteractionAccount>

    const mockSignable = {
      message: "test_message",
      addr: "0xBACKEND",
      keyId: 0,
      roles: {proposer: false, authorizer: true, payer: false},
      voucher: {},
    }

    const signatureResult = await authResult.signingFunction!(mockSignable)

    expect(mockSigningFunction).toHaveBeenCalledWith(mockSignable)
    expect(signatureResult).toEqual({
      addr: "0xBACKEND",
      keyId: 0,
      signature: "mock_signature_123",
    })
  })

  test("custom authorization works even when user is not logged in", () => {
    const mockSigningFunction = jest.fn()

    const {result} = renderHook(
      () =>
        useFlowAuthz({
          authz: {
            address: "0xBACKEND",
            signingFunction: mockSigningFunction,
          },
        }),
      {
        wrapper: FlowProvider,
      }
    )

    // User is not logged in (defaultUser.loggedIn === false)
    // But custom auth should still work
    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe("function")
  })

  test("uses keyId 0 by default for custom authorization", () => {
    const mockSigningFunction = jest.fn()

    const {result} = renderHook(
      () =>
        useFlowAuthz({
          authz: {
            address: "0xBACKEND",
            signingFunction: mockSigningFunction,
            // keyId not provided
          },
        }),
      {
        wrapper: FlowProvider,
      }
    )

    const mockAccount = createMockAccount()
    const authResult = result.current(
      mockAccount
    ) as Partial<InteractionAccount>

    expect(authResult.keyId).toBe(0)
  })
})
