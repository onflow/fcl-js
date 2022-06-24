import axios from "axios"
import * as logger from "@onflow/util-logger"

export const legacyHttpRequest = httpRequest =>
  httpRequest
    ? async ({baseURL: hostname, url: path, method, data: body}) => {
        //add warning if unsupported axios args are passed??
        logger.log.deprecate({
          pkg: "@onflow/transport-http",
          subject: "Passing httpRequest override through opts.httpRequest",
          message: "Please override axios instance using opts.axiosInstance.",
          transition: "",
        })

        return {
          data: await httpRequest({
            hostname,
            path,
            method,
            body,
          }),
        }
      }
    : null
