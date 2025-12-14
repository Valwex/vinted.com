export async function getVanCreative(url: string, shouldForceError: boolean) {
  const isSandbox =
    typeof window !== 'undefined' &&
    (window.location.host.includes('sandbox') || window.location.host.includes('localhost'))

  const fullUrl = isSandbox && shouldForceError ? `${url}&triggerError` : url

  const response = await fetch(fullUrl)
  const text = await response.text()

  return { response, text }
}
