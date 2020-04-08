const pretendLatency = (ms = 10) =>
  new Promise(resolve => setTimeout(resolve, ms))

const genName = () => {
  return "bob the builder"
}

const genAvatar = acct => {
  return `https://avatars.onflow.org/avatar/${acct}.svg`
}

const genBio = () => {
  return "Can he fix it, yes he can."
}

const genHooks = () => {
  return {}
}

export const genUser = async acct => {
  await pretendLatency()
  return {
    acct,
    name: genName(),
    avatar: genAvatar(),
    bio: genBio(),
    hooks: genHooks(acct),
  }
}
