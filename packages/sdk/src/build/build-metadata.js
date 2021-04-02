import {pipe, makeMeta} from "../interaction/interaction.js"

export function meta(data = {}) {
  return pipe([makeMeta(data)])
}
