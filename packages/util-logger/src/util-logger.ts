import {config} from "@onflow/config"

/**
 * The levels of the logger
 * 
 * @typedef {Object} LEVELS
 * @property {number} debug - The debug level
 * @property {number} info - The info level
 * @property {number} log - The log level
 * @property {number} warn - The warn level
 * @property {number} error - The error level
 * 
 */
export const LEVELS = Object.freeze({
  debug: 5,
  info: 4,
  log: 3,
  warn: 2,
  error: 1,
})

/**
 * Builds a message formatted for the logger
 * 
 * @param {Object} options - The options for the log
 * @param {string} options.title - The title of the log
 * @param {string} options.message - The message of the log
 * @returns {Array<string>} - The message formatted for the logger
 * 
 * @example
 * buildLoggerMessageArgs({ title: "My Title", message: "My Message" })
 */
const buildLoggerMessageArgs = ({title, message}) => {
  return [
    `
    %c${title}
    ============================

    ${message}

    ============================
    `
      .replace(/\n[^\S\r\n]+/g, "\n")
      .trim(),
    ,
    "font-weight:bold;font-family:monospace;",
  ]
}

/**
 * Logs messages based on the level of the message and the level set in the config
 * 
 * @param {Object} options - The options for the log
 * @param {string} options.title - The title of the log
 * @param {string} options.message - The message of the log
 * @param {number} options.level - The level of the log
 * @param {boolean} options.always - Whether to always show the log
 * @returns {Promise<void>}
 * 
 * @example
 * log({ title: "My Title", message: "My Message", level: LEVELS.warn, always: false })
 * 
 */
export const log = async ({title, message, level, always = false}) => {
  const configLoggerLevel = await config.get("logger.level", LEVELS.warn)

  // If config level is below message level then don't show it
  if (!always && configLoggerLevel < level) return

  const loggerMessageArgs = buildLoggerMessageArgs({title, message})

  switch (level) {
    case LEVELS.debug:
      console.debug(...loggerMessageArgs)
      break
    case LEVELS.info:
      console.info(...loggerMessageArgs)
      break
    case LEVELS.warn:
      console.warn(...loggerMessageArgs)
      break
    case LEVELS.error:
      console.error(...loggerMessageArgs)
      break
    default:
      console.log(...loggerMessageArgs)
  }
}

/**
 * Logs a deprecation notice
 * 
 * @param {Object} options - The options for the log
 * @param {string} options.pkg - The package that is being deprecated
 * @param {string} options.subject - The subject of the deprecation
 * @param {string} options.transition - The transition path for the deprecation
 * @param {number} options.level - The level of the log
 * @param {string} options.message - The message of the log
 * @param {Function} options.callback - A callback to run after the log
 * @returns {Promise<void>}
 * 
 * @example
 * log.deprecate({ pkg: "@onflow/fcl", subject: "Some item", transition: "https://github.com/onflow/flow-js-sdk", message: "Descriptive message", level: LEVELS.warn, callback: () => {} })
 * 
 */
log.deprecate = ({
  pkg,
  subject,
  transition,
  level = LEVELS.warn,
  message = "",
  callback = null,
}) => {
  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const logMessage = () =>
    log({
      title: `${pkg ? pkg + " " : ""}Deprecation Notice`,
      message: `
      ${
        subject
          ? `${capitalizeFirstLetter(
              subject
            )} is deprecated and will cease to work in future releases${
              pkg ? " of " + pkg : ""
            }.`
          : ""
      }${message ? "\n" + message : ""}${
        transition
          ? `\nYou can learn more (including a guide on common transition paths) here: ${transition}`
          : ""
      }
    `.trim(),
      level,
    })

  if (typeof callback === "function") {
    return async (...args) => {
      await logMessage()
      return await callback(...args)
    }
  }
  return logMessage()
}
