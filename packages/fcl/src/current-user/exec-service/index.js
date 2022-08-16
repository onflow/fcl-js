import {invariant} from "@onflow/util-invariant"
import {serviceRegistry} from "./plugins"

const execStrategy = async ({service, body, config, opts}) => {
  const strategy = serviceRegistry.getStrategy(service.method)
  return strategy({service, body, config, opts})
}

export async function execService({service, msg = {}, config = {}, opts = {}}) {
  msg.data = service.data

  try {
    const res = await execStrategy({
      service,
      body: msg,
      config,
      opts,
    })
    if (res.status === "REDIRECT") {
      invariant(
        service.type === res.data.type,
        "Cannot shift recursive service type in execService"
      )
      return await execService({
        service: res.data,
        msg,
        opts,
        config,
      })
    } else {
      return res
    }
  } catch (error) {
    console.error("Error on execService", error, {
      service,
      msg,
      config,
      opts,
    })
    throw error
  }
}
