import * as logger from "@onflow/util-logger"

/**
 * Asserts fact is true, otherwise logs error and optionally throws
 * @param fact - The condition to assert
 * @param msg - The message to log if assertion fails
 * @param loggerLevel - Optional logger level (defaults to error which will throw)
 * @param rest - Additional arguments to log
 */
export function invariant(
  fact: boolean,
  msg: string,
  loggerLevel: number = logger.LEVELS.error,
  ...rest: any[]
): asserts fact {
  if (!fact) {
    const error = new Error(`INVARIANT ${msg}`)
    error.stack = error.stack
      ?.split("\n")
      ?.filter(d => !/at invariant/.test(d))
      ?.join("\n")

    logger.log({
      title: "Invariant Violation",
      message: `${error.message}\n${rest.length ? "\nDetails:" + JSON.stringify(rest, null, 2) : ""}`,
      level: loggerLevel
    })

    if (loggerLevel === logger.LEVELS.error) {
      throw error
    }
  }
}
