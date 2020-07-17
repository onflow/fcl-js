const ALPHABET = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ1234567890"
const NUMBER_OF_GROUPS = 4
const GROUP_LENGTH = 8

export const uid = () => {
  const getRandomFromAlphabet = () => {
    return ALPHABET.charAt(~~(Math.random() * ALPHABET.length))
  }

  let uid = ""

  for (var i = 1; i <= NUMBER_OF_GROUPS; i++) {
    for (var j = 1; j <= GROUP_LENGTH; j++) {
        uid += getRandomFromAlphabet()
    }
    if (i != NUMBER_OF_GROUPS) uid += "-"
  }

  return uid
}
