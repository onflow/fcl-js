import {parseArguments} from './index'

describe('parseArguments', () => {
  it('should correctly parse a well-formatted cadence transaction', () => {
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
