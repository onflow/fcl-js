import * as logger from "@onflow/util-logger"

const buildWarningMessage = ({name, transitionsPath}) => {
  console.warn(
    `
    %cFCL/SDK Deprecation Notice
    ============================
    The ${name} builder has been deprecated and will be removed in future versions of the Flow JS-SDK/FCL.
    You can learn more (including a guide on common transition paths) here: ${transitionsPath}
    ============================
  `,
    "font-weight:bold;font-family:monospace;"
  )
}

const buildErrorMessage = ({name, transitionsPath}) => {
  console.error(
    `
    %cFCL/SDK Deprecation Notice
    ============================
    The ${name} builder has been removed from the Flow JS-SDK/FCL.
    You can learn more (including a guide on common transition paths) here: ${transitionsPath}
    ============================
  `,
    "font-weight:bold;font-family:monospace;"
  )
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
        logger.log({
          title: "FCL/SDK Deprecation Notice",
          message: `"${property}" will be deprecated in a future version.
            Please use "${deprecationsMap.get(property)}" instead.`,
          level: logger.LEVELS.warn,
        })
      }
      return Reflect.get(obj, property)
    },
  })
}
