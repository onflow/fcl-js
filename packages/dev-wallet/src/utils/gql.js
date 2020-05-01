const getLabelFromQuery = query => {
  return query
    .split("\n")
    .filter(d => /mutation|query/.test(d))
    .map(d => /[mutation|query] (\w+)[\(\{\s]/.exec(d)[1])[0]
}

const label = query => {
  const label = getLabelFromQuery(query)
  return label ? `?__${label.toLowerCase()}` : ""
}

export const gql = ([query]) => async (variables = {}) => {
  return fetch(`/graphql${label(query)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then(d => d.json())
}
