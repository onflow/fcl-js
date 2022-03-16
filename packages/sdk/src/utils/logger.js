import {config} from "../config"

export const LOGGER_LEVELS = {
  "debug": 0,
  "info": 1,
  "log": 2,
  "warn": 3,
  "error": 4
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
  const configLoggerLevel =  await config.get("logger.level", LOGGER_LEVELS.debug)

  // If config level is below message level then don't show it
  if (configLoggerLevel < level) return

  switch(level) {
    case LOGGER_LEVELS.warn:
      console.warn(buildLoggerMessage(title, message))
    case LOGGER_LEVELS.error:
      console.error(buildLoggerMessage(title, message))
      break;
    default:
      console.log(buildLoggerMessage(title, message))
  }
}