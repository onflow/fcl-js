import * as logger from "./util-logger"

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
  const testArgs = {
    title: "test title",
    message: "test message",
  }

  beforeEach(() => {
    delete process.env.LOGGER_LEVEL
  })

  it("should not fire logger if config level is less than log level", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    process.env.LOGGER_LEVEL = "0"

    await logger.log({...testArgs, level: 1})
    expect(consoleSpy).not.toHaveBeenCalled()
  })

  it("should fire logger if config level is less than log level and always is true", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation()
    process.env.LOGGER_LEVEL = "0"

    await logger.log({...testArgs, level: 2, always: true})
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level log", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    process.env.LOGGER_LEVEL = "0"

    await logger.log({...testArgs, level: 0})
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level error", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation()
    process.env.LOGGER_LEVEL = logger.LEVELS.error.toString()

    await logger.log({...testArgs, level: logger.LEVELS.error})
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level warn", async () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation()
    process.env.LOGGER_LEVEL = logger.LEVELS.warn.toString()

    await logger.log({...testArgs, level: logger.LEVELS.warn})
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level log", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation()
    process.env.LOGGER_LEVEL = logger.LEVELS.log.toString()

    await logger.log({...testArgs, level: logger.LEVELS.log})
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level info", async () => {
    const consoleSpy = jest.spyOn(console, "info").mockImplementation()
    process.env.LOGGER_LEVEL = logger.LEVELS.info.toString()

    await logger.log({...testArgs, level: logger.LEVELS.info})
    expect(consoleSpy).toHaveBeenCalled()
  })

  it("should call correct console method for level debug", async () => {
    const consoleSpy = jest.spyOn(console, "debug").mockImplementation()
    process.env.LOGGER_LEVEL = logger.LEVELS.debug.toString()

    await logger.log({...testArgs, level: logger.LEVELS.debug})
    expect(consoleSpy).toHaveBeenCalled()
  })
})
