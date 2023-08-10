function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]"
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]"
}

function isString(obj) {
  return typeof obj === "string" || obj instanceof String
}

function getPackageRoot() {
  return process.cwd()
}

module.exports = {
  isArray,
  isObject,
  isString,
  getPackageRoot,
}
