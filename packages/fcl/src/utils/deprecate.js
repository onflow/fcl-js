import * as logger from "@onflow/util-logger"

export const deprecate = async ({title, message, level, always}) => {
  await logger.log({title, message, level, always})
}
