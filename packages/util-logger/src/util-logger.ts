interface IConfig {
  get: <T>(key: string) => T
}

type Config = (IConfig & (() => IConfig)) | null

// Config dependency injected into logger to break circular dependency
let config: Config = null
export const setConfig = (_config: any) => {
  config = _config
}

/**
 * The levels of the logger
 */
export enum LEVELS {
  debug = 5,
  info = 4,
  log = 3,
  warn = 2,
  error = 1,
}

/**
 * Builds a message formatted for the logger
 * @param options - The options for the log
 * @param options.title - The title of the log
 * @param options.message - The message of the log
 * @returns The message formatted for the logger
 * @example
 * buildLoggerMessageArgs({ title: "My Title", message: "My Message" })
 */
const buildLoggerMessageArgs = (options: {
  title: string
  message: string
}): string[] => {
  const {title, message} = options
  return [
    `
    %c${title}
    ============================

    ${message}

    ============================
    `
      .replace(/\n[^\S\r\n]+/g, "\n")
      .trim(),
    "font-weight:bold;font-family:monospace;",
  ]
}

/**
 * Logs messages based on the level of the message and the level set in the config
 * @param options - The options for the log
 * @param options.title - The title of the log
 * @param options.message - The message of the log
 * @param options.level - The level of the log
 * @param options.always - Whether to always show the log
 * @example
 * log({ title: "My Title", message: "My Message", level: LEVELS.warn, always: false })
 */
export const log = async (options: {
  title: string
  message: string
  level: number
  always?: boolean
}) => {
  const {title, message, level, always} = options
  const configLoggerLevel =
    (await config?.()?.get<number>("logger.level")) ?? LEVELS.warn

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
 * Logs a deprecation notice.  If a callback is provided this function returns a function that will call the callback and log the deprecation notice, otherwise it just logs the deprecation notice.
 * @param options - The options for the log
 * @param options.pkg - The package that is being deprecated
 * @param options.subject - The subject of the deprecation
 * @param options.transition - The transition path for the deprecation
 * @param options.level - The level of the log
 * @param options.message - The message of the log
 * @param options.callback - A callback to run after the log
 * @returns A function that will call the callback and log the deprecation notice if the callback is provided
 * @example
 * // Logs a deprecation notice
 * log.deprecate({ pkg: "@onflow/fcl", subject: "Some item", transition: "https://github.com/onflow/flow-js-sdk", message: "Descriptive message", level: LEVELS.warn, callback: () => {} })
 * @example
 * function someFunction() { ... }
 * const deprecatedFunction = log.deprecate({ pkg: "@onflow/fcl", subject: "Some item", transition: "https://github.com/foo/bar/TRANSITIONS.md", message: "Descriptive message", level: LEVELS.warn, callback: someFunction })
 * deprecatedFunction() // Calls someFunction and logs the deprecation notice
 */
log.deprecate = <T, U>(options: {
  pkg?: string
  subject?: string
  transition?: string
  level?: number
  message?: string
  callback?: (...args: T[]) => U
}): ((...args: T[]) => Promise<U>) | Promise<void> => {
  const {
    pkg,
    subject,
    transition,
    level = LEVELS.warn,
    message = "",
    callback = null,
  } = options

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
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
    return async (...args: T[]) => {
      await logMessage()
      return await callback(...args)
    }
  }
  return logMessage()
}
