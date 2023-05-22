import {formatArgs} from './args'

describe('formatArgs', () => {
  it('throws an error if argsValue is not an object or a function', () => {
    expect(() => formatArgs('invalid', 'code')).toThrow()
  });

  it('returns the same function if argsValue is a function', () => {
    const func = () => {};
    expect(formatArgs(func, {})).toBe(func)
  })

  it('throws an error if the number of provided arguments does not match the number of parsed arguments', () => {
    const argsValue = { name: 'John', age: 30 }
    const cadence = `
      pub fun main(name: String, age: UInt8, address: Address) {
        ...
      }
    `
    expect(() => formatArgs(argsValue, cadence)).toThrow()
  })

  it('throws an error if any of the parsed arguments are composite types', () => {
    const argsValue = { name: 'John', age: 30, composite: {} }
    const cadence = `
      pub fun main(name: String, age: UInt8, composite: Struct) {
        ...
      }
    `
    expect(() => formatArgs(argsValue, cadence)).toThrow()
  })

  it('throws an error if an invalid argument is provided', () => {
    const argsValue = { name: 'John', invalidArg: 'value' }
    const cadence = `
      pub fun main(name: String, age: UInt8) {
        ...
      }
    `
    expect(() => formatArgs(argsValue, cadence)).toThrow()
  })

  it('throws an error if an argument with an invalid type is provided', () => {
    const argsValue = { name: 'John' }
    const cadence = `
      pub fun main(name: UInt8) {
        ...
      }
    `
    expect(() => formatArgs(argsValue, cadence)).toThrow()
  })
})
