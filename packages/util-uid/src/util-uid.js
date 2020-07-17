// Inspired by: https://github.com/lukeed/uid/blob/master/src/index.js , thank you Luke! https://github.com/lukeed

var HEX = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
var T = HEX.length

export function uid () {
  var str='', num=32
  while (num--) str += HEX[Math.random() * T | 0]
  return str
}
