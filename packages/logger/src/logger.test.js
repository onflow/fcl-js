import {config} from "@onflow/sdk"
import * as logger from "./logger"

describe("logger.LEVELS", () => {
  it("should return correct number for level", () => {
    expect(logger.LEVELS.error).toEqual(1)
    expect(logger.LEVELS.warn).toEqual(2)
    expect(logger.LEVELS.log).toEqual(3)
    expect(logger.LEVELS.info).toEqual(4)
    expect(logger.LEVELS.debug).toEqual(5)
  })
})

describe("logger", () => {
  let configRef
  const loggerLevelConfigKey = "logger.level"
  const testArgs = ["test title", "test message"]

  beforeEach(() => {
    configRef = config()
  })

  it("should not fire logger if config level is less than log level", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    configRef.put(loggerLevelConfigKey, 0)

    await logger.log(...testArgs, 1)
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it("should call correct console method for level log", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    configRef.put(loggerLevelConfigKey, 0)

    await logger.log(...testArgs, 0)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation()
    configRef.put(loggerLevelConfigKey, logger.LEVELS.error)

    await logger.log(...testArgs, logger.LEVELS.error)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level warn", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation()
    configRef.put(loggerLevelConfigKey, logger.LEVELS.warn)

    await logger.log(...testArgs, logger.LEVELS.warn)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level log", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    configRef.put(loggerLevelConfigKey, logger.LEVELS.log)

    await logger.log(...testArgs, logger.LEVELS.log)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level info", async () => {
    const consoleSpy = jest.spyOn(console, "info").mockImplementation()
    configRef.put(loggerLevelConfigKey, logger.LEVELS.info)

    await logger.log(...testArgs, logger.LEVELS.info)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level debug", async () => {
    const consoleSpy = jest.spyOn(console, "debug").mockImplementation()
    configRef.put(loggerLevelConfigKey, logger.LEVELS.debug)

    await logger.log(...testArgs, logger.LEVELS.debug)
    expect(consoleSpy).toHaveBeenCalled()
  })
})