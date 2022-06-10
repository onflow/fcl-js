import * as logger from "@onflow/util-logger"

const buildWarningMessage = ({name, transitionsPath}) => {
  logger.log.deprecate({
    pkg: "FCL/SDK",
    subject: `The ${name} builder`,
    transition: transitionsPath,
  })
}

const buildErrorMessage = ({name, transitionsPath}) => {
  logger.log.deprecate({
    pkg: "FCL/SDK",
    message: `The ${name} builder has been removed from the Flow JS-SDK/FCL.`,
    transition: transitionsPath,
    level: logger.LEVELS.error,
  })
}

const warn = deprecated => buildWarningMessage(deprecated)

const error = deprecated => {
  buildErrorMessage(deprecated)
}

export const deprecate = {
  warn,
  error,
}

const getByValue = (map, searchValue) => {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) return key
  }
}

// Allows access to old and new field names while showing deprecation warning for old
export const applyRenamings = (originalObject, deprecationsMap) => {
  return new Proxy(originalObject, {
    get: (obj, property) => {
      if (getByValue(deprecationsMap, property)) {
        const originalProperty = getByValue(deprecationsMap, property)
        return Reflect.get(obj, originalProperty)
      }
      if (deprecationsMap.has(property)) {
        logger.log.deprecate({
          pkg: "FCL/SDK",
          subject: property,
          message: `Please use "${deprecationsMap.get(property)}" instead.`,
        })
      }
      return Reflect.get(obj, property)
    },
  })
}
