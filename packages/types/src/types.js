const type = (label, asParam, asInjection) => ({
  label,
  asParam,
  asInjection,
})

export const Identity = type(
  "Identity",
  v => v,
  v => v
)
