type LoadScriptProps = {
  id: string
  src: string
  isAsync?: boolean
  isDefer?: boolean
  crossOrigin?: string
  integrity?: string
  dataset?: Record<string, string>
}

export const loadScript = ({
  id,
  src,
  isAsync = true,
  isDefer = true,
  crossOrigin,
  integrity,
  dataset,
}: LoadScriptProps) => {
  if (document.getElementById(id)) return Promise.resolve()

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')

    script.id = id
    script.src = src
    script.type = 'text/javascript'
    script.async = isAsync
    script.defer = isDefer
    if (crossOrigin) script.crossOrigin = crossOrigin
    if (integrity) script.integrity = integrity
    script.onload = resolve
    script.onerror = reject

    if (dataset) {
      Object.keys(dataset).forEach(property => {
        script.dataset[property] = dataset[property]
      })
    }

    document.head.appendChild(script)
  })
}
