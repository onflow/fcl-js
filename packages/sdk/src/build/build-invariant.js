import { Ok, Bad } from "../interaction/interaction.js"

export function invariant(...args) {
  if (args.length > 1) {
    const [predicate, message] = args
    return invariant((ix, { Ok, Bad }) => {
      return predicate ? Ok(ix) : Bad(ix, message)
    })
  }
  const [fn] = args
  return ix => fn(ix, {Ok, Bad})
}
