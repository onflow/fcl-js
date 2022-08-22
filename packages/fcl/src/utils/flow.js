export const getNetwork = async () => {
  // const {network} = await config().first(["discovery.wallet.method.default"])
  // Unable to determine access node network
  // try again or specify flow.netork in config
  await fcl
    .query({
      cadence: `
        pub fun main(): UFix64 {
          var networkCodeWords = {
              "MAINNET": UInt64(0x0),
              "TESTNET": UInt64(0x6834ba37b3980209),
              "EMULATOR": UInt64(0x1cb159857af02018)
          }
          return getAccount(Address(UInt64(0xe467b9dd11fa00df) ^ networkCodeWords["MAINNET"]!)).balance
        }
     `,
    })
    .then(console.log)
    .catch(console.warn)

  // return network
}
