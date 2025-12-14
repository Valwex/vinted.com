export const toNextJsParams = (
  searchParams: URLSearchParams,
): Record<string, string | Array<string> | undefined> => {
  const params = {}

  searchParams.forEach((value, key) => {
    if (params[key]) {
      if (!Array.isArray(params[key])) {
        params[key] = [params[key]]
      }

      params[key].push(value)
    } else {
      params[key] = value
    }
  })

  return params
}
