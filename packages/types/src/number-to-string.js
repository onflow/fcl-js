function zeros (length) {
    const arr = []
    for (let i = 0; i < length; i++) {
      arr.push(0)
    }
    return arr
  }
  
  function roundDigits (split, precision) {
    // create a clone
    const rounded = {
      sign: split.sign,
      coefficients: split.coefficients,
      exponent: split.exponent
    }
    const c = rounded.coefficients
  
    // prepend zeros if needed
    while (precision <= 0) {
      c.unshift(0)
      rounded.exponent++
      precision++
    }
  
    if (c.length > precision) {
      const removed = c.splice(precision, c.length - precision)
  
      if (removed[0] >= 5) {
        let i = precision - 1
        c[i]++
        while (c[i] === 10) {
          c.pop()
          if (i === 0) {
            c.unshift(0)
            rounded.exponent++
            i++
          }
          i--
          c[i]++
        }
      }
    }
  
    return rounded
  }
  
  function splitNumber (value) {
    // parse the input value
    const match = String(value).toLowerCase().match(/^0*?(-?)(\d+\.?\d*)(e([+-]?\d+))?$/)
  
    if (!match) {
      throw new SyntaxError('Invalid number ' + value)
    }
  
    const sign = match[1]
    const digits = match[2]
    let exponent = parseFloat(match[4] || '0')
  
    const dot = digits.indexOf('.')
    exponent += (dot !== -1) ? (dot - 1) : (digits.length - 1)
    
    const coefficients = digits
      .replace('.', '') // remove the dot (must be removed before removing leading zeros)
      .replace(/^0*/, function (zeros) {
        // remove leading zeros, add their count to the exponent
        exponent -= zeros.length
        return ''
      })
      .replace(/0*$/, '') // remove trailing zeros
      .split('')
      .map(function (d) {
        return parseInt(d)
      })
  
    if (coefficients.length === 0) {
      coefficients.push(0)
      exponent++
    }
  
    return {
      sign: sign,
      coefficients: coefficients,
      exponent: exponent
    }
  }
  
  export function convertNumberToString (value) {
    // handle special cases
    if (value === Infinity) {
      return 'Infinity'
    } else if (value === -Infinity) {
      return '-Infinity'
    } else if (isNaN(value)) {
      return 'NaN'
    }
  
    if (isNaN(value) || !isFinite(value)) {
      return String(value)
    }
  
    let precision;

    const splitValue = splitNumber(value)
    const rounded = (typeof precision === 'number')
      ? roundDigits(splitValue, splitValue.exponent + 1 + precision)
      : splitValue
    let c = rounded.coefficients
    let p = rounded.exponent + 1 // exponent may have changed
  
    // append zeros if needed
    const pp = p + (precision || 0)
    if (c.length < pp) {
      c = c.concat(zeros(pp - c.length))
    }
  
    // prepend zeros if needed
    if (p < 0) {
      c = zeros(-p + 1).concat(c)
      p = 1
    }
  
    // insert a dot if needed
    if (p < c.length) {
      c.splice(p, 0, (p === 0) ? '0.' : '.')
    }
  
    return rounded.sign + c.join('')
  }
