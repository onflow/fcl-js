import {config} from "../config"

export const LOGGER_LEVELS = {
  "debug": 5,
  "info": 4,
  "log": 3,
  "warn": 2,
  "error": 1
}

const buildLoggerMessage = (title, message) => {
  return `
    %c${title}
    ============================
    ${message}
    ============================
    `,
    "font-weight:bold;font-family:monospace;"
}

export const logger = async (title, message, level) => {
  const configLoggerLevel =  await config.get("logger.level", 0)

  // If config level is below message level then don't show it
  if (configLoggerLevel < level) return

  switch(level) {
    case LOGGER_LEVELS.debug:
      console.debug(buildLoggerMessage(title, message))
      break;
    case LOGGER_LEVELS.info:
      console.info(buildLoggerMessage(title, message))
      break;
    case LOGGER_LEVELS.warn:
      console.warn(buildLoggerMessage(title, message))
      break;
    case LOGGER_LEVELS.error:
      console.error(buildLoggerMessage(title, message))
      break;
    default:
      console.log(buildLoggerMessage(title, message))
  }
}