import * as sdk from "@onflow/sdk"

export const getNetwork = async () => {
  return await sdk
    .send([
      sdk.script(`
          pub fun main(): String {
    
            var networkCodeWords = {
              "mainnet": UInt64(0x0),
              "testnet": UInt64(0x6834ba37b3980209),
              "local": UInt64(0x1cb159857af02018)
            }
          
            for network in networkCodeWords.keys{
              if getAccount(Address(UInt64(0xe467b9dd11fa00df) ^ networkCodeWords[network]!)).balance>0.0 {
                return network 
              }
            }
          
            return "unknown"
          }`),
    ])
    .then(sdk.decode)
}
