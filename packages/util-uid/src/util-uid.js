const DEFAULT_ALPHABET = "aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYxX123456789"
const DEFAULT_NUMBER_OF_GROUPS = 4
const DEFAULT_GROUP_LENGTH = 8

export const uid = ({
  alphabet = DEFAULT_ALPHABET,
  numberOfGroups = DEFAULT_NUMBER_OF_GROUPS,
  groupLength = DEFAULT_GROUP_LENGTH
} = {}) => {
  const getRandomFromAlphabet = () => {
    return alphabet.charAt(~~(Math.random() * alphabet.length))
  }

  let uid = ""

  for (var i = 1; i <= numberOfGroups; i++) {
    for (var j = 1; j <= groupLength; j++) {
        uid += getRandomFromAlphabet()
    }
    if (i != numberOfGroups) uid += "-"
  }

  return uid
}
