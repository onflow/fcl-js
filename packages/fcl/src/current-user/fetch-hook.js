const METHODS = {
  "HTTP/POST": "POST",
  "HTTP/GET": "GET",
}

export const fetchHook = async (hook, body) => {
  const url = new URL(hook.endpoint)
  for (let [key, value] of Object.entries(hook.params || {})) {
    url.searchParams.append(key, value)
  }

  body = body ? JSON.stringify(body) : undefined

  return fetch(url, {
    method: METHODS[hook.method],
    headers: {
      "Content-Type": "application/json",
    },
    body,
  }).then(d => d.json())
}
