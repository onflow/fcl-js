import axios from "axios"
import axiosRetry from "axios-retry"

const httpRequest = axios.create({
  baseURL: "",
  timeout: 2500,
})

axiosRetry(httpRequest, {
  retries: 3,
})

export {httpRequest}

class HTTPRequestError extends Error {
  constructor({
    transport,
    error,
    hostname,
    path,
    port,
    method,
    requestBody,
    responseBody,
    responseStatusText,
    reqOn,
    statusCode,
  }) {
    const msg = `
        HTTP Request Error: An error occurred when interacting with the Access API.
        ${transport ? `transport=${transport}` : ""}
        ${error ? `error=${error}` : ""}
        ${hostname ? `hostname=${hostname}` : ""}
        ${path ? `path=${path}` : ""}
        ${port ? `port=${port}` : ""}
        ${method ? `method=${method}` : ""}
        ${requestBody ? `requestBody=${JSON.stringify(requestBody)}` : ""}
        ${responseBody ? `responseBody=${JSON.stringify(responseBody)}` : ""}
        ${responseStatusText ? `responseStatusText=${responseStatusText}` : ""}
        ${reqOn ? `reqOn=${reqOn}` : ""}
        ${statusCode ? `statusCode=${statusCode}` : ""}
      `
    super(msg)
    this.name = "HTTP Request Error"
    this.statusCode = responseBody?.code ?? statusCode
    this.errorMessage = responseBody?.message
  }
}
