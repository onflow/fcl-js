import {decodeResponse} from "./decode.js"
import {config} from "../config"

export async function decode(response) {
  const decodersFromConfig = await config().where(/^decoder\./)
  const decoders = Object.entries(decodersFromConfig).map(
    ([pattern, xform]) => {
      pattern = `/${pattern.replace(/^decoder\./, "")}$/`
      return [pattern, xform]
    }
  )

  return decodeResponse(response, Object.fromEntries(decoders))
}
