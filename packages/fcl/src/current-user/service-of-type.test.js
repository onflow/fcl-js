import {serviceOfType} from "./service-of-type"

describe("service-of-type", () => {
  it("should choose the most recent version of a service", () => {
    const services = [
      {
        type: "authn",
        f_vsn: "1.0.0",
      },
      {
        type: "authn",
        f_vsn: "2.0.0",
      },
    ]

    const service = serviceOfType(services, "authn")

    expect(service).toEqual({
      type: "authn",
      f_vsn: "2.0.0",
    })
  })

  it("should return null if no service of type exists", () => {
    const services = [
      {
        type: "authn",
        f_vsn: "1.0.0",
      },
      {
        type: "authn",
        f_vsn: "2.0.0",
      },
    ]

    const service = serviceOfType(services, "non-existent")

    expect(service).toBe(null)
  })
})
