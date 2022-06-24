import axios from "axios"
import axiosRetry from "axios-retry"

const httpRequest = axios.create({
  timeout: 2500,
})

axiosRetry(httpRequest, {
  retries: 3,
})

httpRequest.interceptors.response.use(null, function (error) {
  // Include legacy HTTPRequestError properties
  error.name = "HTTP Request Error"
  error.statusCode = error.response.status
  error.errorMessage = error.response.data?.message

  return Promise.reject(error)
})

export {httpRequest}
