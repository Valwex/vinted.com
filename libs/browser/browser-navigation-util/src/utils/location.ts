const serverSide = typeof window === 'undefined'

export const navigateToPage = (path: string) => {
  if (serverSide) return
  window.location.href = path
}

export const redirectToPage = (page: string) => {
  if (serverSide) return
  window.location.replace(page)
}

export const reloadPage = () => {
  if (serverSide) return
  window.location.reload()
}
