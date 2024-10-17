export const html = (strings: TemplateStringsArray, ...values: any[]) => {
  let str = ""
  strings.forEach((string, i) => {
    str += string + (values[i] || "")
  })
  return str
}
