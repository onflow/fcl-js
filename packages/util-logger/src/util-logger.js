import {config} from "@onflow/config"

export const LEVELS = Object.freeze({
  debug: 5,
  info: 4,
  log: 3,
  warn: 2,
  error: 1,
})

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
