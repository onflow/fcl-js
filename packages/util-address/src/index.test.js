import {isValidAddressForNetwork} from "./index.js"

describe("Derive cadence by network", () => {
  let mainnetAddress = "0xe467b9dd11fa00df"
  let testnetAddress = "0x8c5303eaa26202d6"
  let emulatorAddress = "0xf8d6e0586b0a20c7"

  let invalidAddress = "0x123ABC456DEF"

  test("It verifies address as correct for mainnet", async () => {
    let isValid = isValidAddressForNetwork({
      address: mainnetAddress,
      network: "mainnet"
    })

    expect(isValid).toEqual(true)
  })

  test("It verifies address as correct for testnet", async () => {
    let isValid = isValidAddressForNetwork({
      address: testnetAddress,
      network: "testnet"
    })

    expect(isValid).toEqual(true)
  })

  test("It verifies address as correct for emulator", async () => {
    let isValid = isValidAddressForNetwork({
      address: emulatorAddress,
      network: "emulator"
    })

    expect(isValid).toEqual(true)
  })

  test("It verifies address as incorrect for mainnet", async () => {
    let isValid = isValidAddressForNetwork({
      address: invalidAddress,
      network: "mainnet"
    })

    expect(isValid).toEqual(false)
  })
})
