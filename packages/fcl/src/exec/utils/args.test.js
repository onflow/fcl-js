import {formatArgs} from './args'

describe('formatArgs', () => {
  it('throws an error if argsValue is not an object or a function', () => {
    expect(() => formatArgs('invalid', 'code')).toThrow()
  });

  it('returns the same function if argsValue is a function', () => {
    const func = () => {};
    expect(formatArgs(func, {})).toBe(func)
  })
})
