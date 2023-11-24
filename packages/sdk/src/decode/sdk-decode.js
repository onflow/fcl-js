import {config} from "@onflow/config"
import {makeDecodeResponse} from "./decode"
import {makeDecodeStream} from "./decode-stream"

export async function decode(response) {
  const decodersFromConfig = await config().where(/^decoder\./)
  const decoders = Object.entries(decodersFromConfig).map(
    ([pattern, xform]) => {
      pattern = `/${pattern.replace(/^decoder\./, "")}$/`
      return [pattern, xform]
    }
  )

  const decodeResponse = makeDecodeResponse(
    decodeStream,
    Object.fromEntries(decoders)
  )
  const decodeStream = makeDecodeStream(decodeResponse)

  return decodeResponse(response)
}
