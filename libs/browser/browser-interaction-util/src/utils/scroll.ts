const serverSide = typeof window === 'undefined'

export const scrollToTop = (behavior?: 'smooth') => {
  if (serverSide) return
  window.scroll({ top: 0, left: 0, behavior })
}

export const scrollToElementById = (elementId: string, containerClass = 'site-content') => {
  if (serverSide) return

  const container = document.getElementsByClassName(containerClass)[0]
  const elementScrollTo = document.getElementById(elementId)

  if (!container || !elementScrollTo) return

  if (container instanceof HTMLElement) {
    window.scroll({
      top:
        elementScrollTo.getBoundingClientRect().top -
        container.getBoundingClientRect().top -
        container.offsetTop,
      behavior: 'smooth',
    })
  }
}
