import {parseArguments} from './index'

describe('parseArguments', () => {
  it('should correctly parse arguments from a Cadence script', () => {
    const cadenceCode = `
      pub struct ExampleStruct {
        pub var exampleMsg: String
        init(exampleMsg: String) {
         self.exampleMsg = exampleMsg
        }
      }
  
      pub fun main(msg: String): ExampleStruct {
        return ExampleStruct(exampleMsg: msg)
      }
    `
    expect(parseArguments(cadenceCode)).toEqual([{ name: 'msg', type: 'String' }])
  })

  it('should correctly parse a Cadence transaction', () => {
    const cadenceCode = `
      transaction(amount: UFix64, to: Address) {
        // ... 
      }
    `
    expect(parseArguments(cadenceCode)).toEqual([
      { name: 'amount', type: 'UFix64' },
      { name: 'to', type: 'Address' }
    ])
  })

  it('should return an empty array if no arguments are provided', () => {
    const cadenceCode = `
      transaction() {
        // ... 
      }
    `
    expect(parseArguments(cadenceCode)).toEqual([])
  })

  it('should throw an error if cadence transaction is not well-formatted', () => {
    const cadenceCode = `
      transaction amount: UFix64, to: Address {
        // ... 
      }
    `
    expect(() => parseArguments(cadenceCode)).toThrow()
  })
})
