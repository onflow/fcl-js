import {config} from "@onflow/sdk"

export const LOGGER_LEVELS = Object.freeze({
  "debug": 5,
  "info": 4,
  "log": 3,
  "warn": 2,
  "error": 1
})

const buildLoggerMessageArgs = ({title, message}) => {
  return [`
    %c${title}
    ============================
    ${message}
    ============================
    `,
    "font-weight:bold;font-family:monospace;"
  ]
}

export const logger = async (title, message, level) => {
  const configLoggerLevel =  await config.get("logger.level", 0)

  // If config level is below message level then don't show it
  if (configLoggerLevel < level) return

  const loggerMessageArgs = buildLoggerMessageArgs({title, message})

  switch(level) {
    case LOGGER_LEVELS.debug:
      console.debug(...loggerMessageArgs)
      break;
    case LOGGER_LEVELS.info:
      console.info(...loggerMessageArgs)
      break;
    case LOGGER_LEVELS.warn:
      console.warn(...loggerMessageArgs)
      break;
    case LOGGER_LEVELS.error:
      console.error(...loggerMessageArgs)
      break;
    default:
      console.log(...loggerMessageArgs)
  }
}