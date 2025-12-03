import {InteractionAccount} from "@onflow/typedefs"
import {act, renderHook} from "@testing-library/react"
import {createMockFclInstance, MockFclInstance} from "../__mocks__/flow-client"
import {
  TestProvider,
  setMockFlowClient,
  queryClient,
} from "../__mocks__/TestProvider"
import {useFlowAuthz} from "./useFlowAuthz"

const createMockAccount = (): Partial<InteractionAccount> => ({
  tempId: "MOCK_TEMP_ID",
  resolve: null,
})

describe("useFlowAuthz", () => {
  let mockFcl: MockFclInstance

  beforeEach(() => {
    queryClient.clear()
    mockFcl = createMockFclInstance()
    setMockFlowClient(mockFcl.mockFclInstance)
  })

  afterEach(() => {
    setMockFlowClient(null)
    jest.clearAllMocks()
  })

  test("returns authorization function from current user", () => {
    const {result} = renderHook(() => useFlowAuthz(), {
      wrapper: TestProvider,
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
      wrapper: TestProvider,
    })

    const mockAccount = createMockAccount()

    await act(async () => {
      await result.current(mockAccount)
    })

    expect(mockAuthzFn).toHaveBeenCalledWith(mockAccount)
  })

  test("returns stable authorization reference", () => {
    const {result, rerender} = renderHook(() => useFlowAuthz(), {
      wrapper: TestProvider,
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
        wrapper: TestProvider,
      }
    )

    expect(result.current).toBe(customFlowClient.currentUser.authorization)
  })

  test("creates custom authorization with authorization function", () => {
    const customAuthz = (account: Partial<InteractionAccount>) => ({
      ...account,
      addr: "0xBACKEND",
      keyId: 0,
      signingFunction: jest.fn(),
    })

    const {result} = renderHook(() => useFlowAuthz({authz: customAuthz}), {
      wrapper: TestProvider,
    })

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe("function")
    expect(result.current).toBe(customAuthz)
  })

  test("custom authorization returns correct account data", () => {
    const customAddress = "0xBACKEND"
    const customKeyId = 5
    const mockSigningFunction = jest.fn()

    const customAuthz = (account: Partial<InteractionAccount>) => ({
      ...account,
      addr: customAddress,
      keyId: customKeyId,
      signingFunction: mockSigningFunction,
    })

    const {result} = renderHook(() => useFlowAuthz({authz: customAuthz}), {
      wrapper: TestProvider,
    })

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

    const customAuthz = (account: Partial<InteractionAccount>) => ({
      ...account,
      addr: "0xBACKEND",
      keyId: 0,
      signingFunction: mockSigningFunction,
    })

    const {result} = renderHook(() => useFlowAuthz({authz: customAuthz}), {
      wrapper: TestProvider,
    })

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
    const customAuthz = (account: Partial<InteractionAccount>) => ({
      ...account,
      addr: "0xBACKEND",
      keyId: 0,
      signingFunction: jest.fn(),
    })

    const {result} = renderHook(() => useFlowAuthz({authz: customAuthz}), {
      wrapper: TestProvider,
    })

    // User is not logged in (defaultUser.loggedIn === false)
    // But custom auth should still work
    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe("function")
    expect(result.current).toBe(customAuthz)
  })
})
