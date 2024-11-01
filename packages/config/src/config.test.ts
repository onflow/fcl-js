import {config, clearConfig} from "./config"

const idle = () => new Promise(resolve => setTimeout(resolve, 0))

describe("config()", () => {
  beforeEach(async () => {
    clearConfig()
  })

  describe("crud methods", () => {
    beforeEach(async () => {
      config({
        "config.test.init": "rawr",
      })

      config()
        .put("config.test.t", "t")
        .put("config.test.z", "z")
        .put("config.test.foo.bar", "bar")
        .put("config.test.foo.baz", "baz")
        .put("config.test.wat.bar", "foo")
    })

    test("get", async () => {
      expect(await config().get("config.test.foo.bar")).toBe("bar")
      expect(await config().get("config.test.init")).toBe("rawr")
    })

    test("get with fallback", async () => {
      expect(await config().get("config.test.not.a.thing", "fallback")).toBe(
        "fallback"
      )
    })

    test("update", async () => {
      config().update("config.test.t", (v: number) => v + v)
      expect(await config().get("config.test.t")).toBe("tt")
    })

    test("delete", async () => {
      config().delete("config.test.z")
      expect(await config().get("config.test.z")).toBe(undefined)
    })

    test("where", async () => {
      expect(await config().where(/^config.test.foo/)).toEqual({
        "config.test.foo.bar": "bar",
        "config.test.foo.baz": "baz",
      })
    })

    test("subscribe", async () => {
      const fn1 = jest.fn()
      const unsub = config().subscribe(fn1)
      await idle()

      config().put("config.test.y", "y").put("config.test.x", "x")

      await idle()
      unsub()
      await idle()

      config().update("config.test.y", (v: number) => v + v)

      await idle()

      expect(fn1).toHaveBeenCalledTimes(3)
    })

    test("all", async () => {
      expect(await config().all()).toEqual({
        "config.test.foo.bar": "bar",
        "config.test.foo.baz": "baz",
        "config.test.init": "rawr",
        "config.test.t": "t",
        "config.test.wat.bar": "foo",
        "config.test.z": "z",
      })
    })
  })

  test("empty", async () => {
    clearConfig()
    await idle()
    expect(await config().all()).toEqual({})
  })

  describe("sans ()", () => {
    test("config(data)", async () => {
      const data = {
        foo: "bar",
        baz: "buz",
      }

      config(data)

      expect(await config.all()).toEqual(data)
    })

    test("config.put config.get", async () => {
      config.put("foo", "bar")
      expect(await config.get("foo")).toBe("bar")
    })
  })

  describe("overload", () => {
    test("overload", async () => {
      const PRE = {
        yes: "yes",
        foo: "bar",
        bar: "baz",
      }

      const POST = {
        foo: "bar!!",
        bar: "baz!!",
        omg: "omg!!",
      }

      config(PRE)
      expect(await config.all()).toEqual(PRE)
      const ret = await config.overload(POST, async () => {
        expect(await config.all()).toEqual({...PRE, ...POST})
        return "WOOT WOOT"
      })
      expect(ret).toBe("WOOT WOOT")
      expect(await config.all()).toEqual(PRE)
    })
  })

  describe("first", () => {
    const A = "A",
      B = null,
      C = 0,
      D = {}
    const FALLBACK = "FALLBACK"

    beforeEach(() => config({A: A, B: B, C: C, D: D}))
    afterEach(clearConfig)

    const examples: ([any, string[]] | [any])[] = [
      [FALLBACK],
      [A, ["A"]],
      [FALLBACK, ["B"]],
      [C, ["C"]],
      [D, ["D"]],
      [A, ["MISSING", "A"]],
      [FALLBACK, ["MISSING", "B"]],
    ]

    for (const [i, [want, from]] of examples.entries()) {
      test(`Example ${i}: ${from} -> ${want}`, async () => {
        expect(await config.first(from, FALLBACK)).toBe(want)
      })
    }
  })

  describe("load method", () => {
    describe("with a set network", () => {
      beforeEach(() => {
        // Just picked a random network. Behavior might differ based on network selection at a future date.
        config().put("flow.network", "emulator")
      })

      describe("flow.json v1", () => {
        let flowJSON

        describe("without aliases", () => {
          beforeEach(async () => {
            flowJSON = {
              accounts: {
                "emulator-account": {
                  fromFile: "./emulator.private.json",
                },
              },
              contracts: {
                HelloWorld: {
                  source: "./cadence/contracts/HelloWorld.cdc",
                  aliases: {
                    emulator: "0x1",
                    testnet: "0x01",
                    mainnet: "0x001",
                  },
                },
                SecondLife: {
                  aliases: {
                    testnet: "0x02",
                    mainnet: "0x002",
                  },
                },
              },
              deployments: {
                emulator: {
                  "emulator-account": ["HelloWorld"],
                },
              },
              networks: {
                emulator: "127.0.0.1:3569",
              },
            }
          })

          describe("with single config loaded", () => {
            beforeEach(async () => {
              await config().load({flowJSON})
              await idle()
            })

            test("should load the contract location wrt the currently set network", async () => {
              await expect(config().get("0xHelloWorld")).resolves.toBe("0x1")
              await expect(
                config().get("system.contracts.HelloWorld")
              ).resolves.toBe("0x1")
            })

            test("should not set a contract if it does not have an alias", async () => {
              await expect(
                config().get("0xSecondLife")
              ).resolves.toBeUndefined()
              await expect(
                config().get("system.contracts.SecondLife")
              ).resolves.toBeUndefined()
            })
          })

          describe("with an array of configs loaded", () => {
            beforeEach(async () => {
              const secondFlowJSON = {
                accounts: {},
                contracts: {
                  ThirdContract: {
                    aliases: {
                      emulator: "0x3",
                      testnet: "0x03",
                      mainnet: "0x003",
                    },
                  },
                },
                deployments: {},
                networks: {},
              }

              await config().load({flowJSON: [flowJSON, secondFlowJSON]})
              await idle()
            })

            test("should load the contract locations from the secondFlowJSON", async () => {
              await expect(config().get("0xThirdContract")).resolves.toBe("0x3")
              await expect(
                config().get("system.contracts.ThirdContract")
              ).resolves.toBe("0x3")
            })
          })
        })
        describe("without contract aliases", () => {
          beforeEach(async () => {
            flowJSON = {
              networks: {
                emulator: "127.0.0.1:3569",
              },
              accounts: {
                default: {
                  address: "f8d6e0586b0a20c7",
                  key: "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646",
                },
              },
              contracts: {
                HelloWorld: "./cadence/contracts/HelloWorld.cdc",
              },
              deployments: {
                emulator: {
                  default: ["HelloWorld"],
                },
              },
            }
            await config().load({flowJSON})
            await idle()
          })

          test("should resolve to the default address through the deployment link", async () => {
            await expect(config().get("0xHelloWorld")).resolves.toBe(
              "f8d6e0586b0a20c7"
            )
            await expect(
              config().get("system.contracts.HelloWorld")
            ).resolves.toBe("f8d6e0586b0a20c7")
          })
        })

        describe("with both contract aliases and deployments", () => {
          beforeEach(async () => {
            flowJSON = {
              networks: {
                emulator: "127.0.0.1:3569",
              },
              accounts: {
                default: {
                  address: "f8d6e0586b0a20c7",
                  key: "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646",
                },
              },
              contracts: {
                HelloWorld: {
                  source: "./cadence/contracts/HelloWorld.cdc",
                  aliases: {
                    emulator: "0x1",
                  },
                },
              },
              deployments: {
                emulator: {
                  default: ["HelloWorld"],
                },
              },
            }
            await config().load({flowJSON})
            await idle()
          })

          test("should return the alias, not the deployment address", async () => {
            await expect(config().get("0xHelloWorld")).resolves.toBe("0x1")
            await expect(
              config().get("system.contracts.HelloWorld")
            ).resolves.toBe("0x1")
          })
        })

        describe("with dependencies aliases", () => {
          beforeEach(async () => {
            flowJSON = {
              networks: {
                emulator: "127.0.0.1:3569",
              },
              accounts: {
                default: {
                  address: "f8d6e0586b0a20c7",
                  key: "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646",
                },
              },
              dependencies: {
                FlowToken: {
                  source: "mainnet://1654653399040a61.FlowToken",
                  hash: "7e2bb5acf84ddcd8ad4a9ddb1e3595c8148ac0a711551e27aa7231db51b2d7ce",
                  aliases: {
                    emulator: "0x1",
                    mainnet: "1654653399040a61",
                    testnet: "7e60df042a9c0868",
                  },
                },
              },
            }
            await config().load({flowJSON})
            await idle()
          })

          test("should return the alias", async () => {
            await expect(config().get("0xFlowToken")).resolves.toBe("0x1")
            await expect(
              config().get("system.contracts.FlowToken")
            ).resolves.toBe("0x1")
          })
        })

        describe("with dependencies aliases and contract aliases", () => {
          beforeEach(async () => {
            flowJSON = {
              networks: {
                emulator: "127.0.0.1:3569",
              },
              accounts: {
                default: {
                  address: "f8d6e0586b0a20c7",
                  key: "ba68d45a5acaa52f3cacf4ad3a64d9523e0ce0ae3addb1ee6805385b380b7646",
                },
              },
              contracts: {
                FlowToken: {
                  source: "./cadence/contracts/FlowToken.cdc",
                  aliases: {
                    emulator: "0x1",
                  },
                },
              },
              dependencies: {
                FlowToken: {
                  source: "mainnet://1654653399040a61.FlowToken",
                  hash: "7e2bb5acf84ddcd8ad4a9ddb1e3595c8148ac0a711551e27aa7231db51b2d7ce",
                  aliases: {
                    emulator: "0x2",
                    mainnet: "1654653399040a61",
                    testnet: "7e60df042a9c0868",
                  },
                },
              },
            }
            await config().load({flowJSON})
            await idle()
          })

          test("should return the dependencies alias, not the contract alias", async () => {
            await expect(config().get("0xFlowToken")).resolves.toBe("0x2")
            await expect(
              config().get("system.contracts.FlowToken")
            ).resolves.toBe("0x2")
          })
        })
      })
    })
  })

  describe("without a network set", () => {
    test("should throw an error", async () => {
      await expect(() => config().load({flowJSON: {}})).rejects.toThrowError()
    })
  })
})
