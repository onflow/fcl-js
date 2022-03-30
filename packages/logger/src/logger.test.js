import {config} from "@onflow/sdk"
import {logger, LOGGER_LEVELS} from "./logger"

describe("LOGGER_LEVELS", () => {
  it("should return correct number for level", () => {
    expect(LOGGER_LEVELS.error).toEqual(1)
    expect(LOGGER_LEVELS.warn).toEqual(2)
    expect(LOGGER_LEVELS.log).toEqual(3)
    expect(LOGGER_LEVELS.info).toEqual(4)
    expect(LOGGER_LEVELS.debug).toEqual(5)
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

    await logger(...testArgs, 1)
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it("should call correct console method for level log", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    configRef.put(loggerLevelConfigKey, 0)

    await logger(...testArgs, 0)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation()
    configRef.put(loggerLevelConfigKey, LOGGER_LEVELS.error)

    await logger(...testArgs, LOGGER_LEVELS.error)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level warn", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation()
    configRef.put(loggerLevelConfigKey, LOGGER_LEVELS.warn)

    await logger(...testArgs, LOGGER_LEVELS.warn)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level log", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    configRef.put(loggerLevelConfigKey, LOGGER_LEVELS.log)

    await logger(...testArgs, LOGGER_LEVELS.log)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level info", async () => {
    const consoleSpy = jest.spyOn(console, "info").mockImplementation()
    configRef.put(loggerLevelConfigKey, LOGGER_LEVELS.info)

    await logger(...testArgs, LOGGER_LEVELS.info)
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level debug", async () => {
    const consoleSpy = jest.spyOn(console, "debug").mockImplementation()
    configRef.put(loggerLevelConfigKey, LOGGER_LEVELS.debug)

    await logger(...testArgs, LOGGER_LEVELS.debug)
    expect(consoleSpy).toHaveBeenCalled()
  })
})
