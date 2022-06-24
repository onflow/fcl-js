import axios from "axios"
import * as logger from "@onflow/util-logger"

export const legacyHttpRequest = httpRequest =>
  httpRequest
    ? async ({baseURL: hostname, url: path, method, data: body, ...config}) => {
        if (Object.keys(config).length > 0) {
          logger.log({
            title: "Unsupported httpRequest arguments",
            message: `The depreacted legacy implementation of \`opts.httpRequest\` has been called with the following unsupported axios configuration keys: ${Object.keys(
              config
            ).join(", ")}
Some features of @onflow/transport-http may not be supported - find out more here: https://github.com/onflow/flow-js-sdk/blob/master/packages/transport-http/TRANSITIONS.md#0001-deprecate-opts-httprequest`,
            level: logger.LEVELS.warn,
          })
        }

        logger.log.deprecate({
          pkg: "@onflow/transport-http",
          subject: "Passing httpRequest override through opts.httpRequest",
          message: "Please override axios instance using opts.axiosInstance.",
          transition:
            "https://github.com/onflow/flow-js-sdk/blob/master/packages/transport-http/TRANSITIONS.md#0001-deprecate-opts-httprequest",
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
