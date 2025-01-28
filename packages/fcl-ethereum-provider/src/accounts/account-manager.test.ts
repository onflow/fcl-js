import {AccountManager} from "./account-manager"
import {mockUser} from "../__mocks__/fcl"
import * as fcl from "@onflow/fcl"

describe("account manager", () => {
  describe("getAddresses", () => {
    it("should return the addresses", () => {
      const accountManager = new AccountManager(mockUser)
      expect(accountManager.getAddresses()).toEqual(["0x1", "0x2"])
    })
  })
})
