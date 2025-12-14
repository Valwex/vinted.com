export const scrollToTab = (tab: string, container: HTMLDivElement | null) => {
  if (!container) return

  const targetTab = container.querySelector(`#${tab}`) as HTMLElement
  if (!targetTab) return

  const isScrollable = container.scrollWidth > container.clientWidth
  if (!isScrollable) return

  const containerWidth = container.getBoundingClientRect().width
  const tabWidth = targetTab.getBoundingClientRect().width
  const offset = (containerWidth - tabWidth) / 2

  container.scrollTo({ left: targetTab.offsetLeft - offset })
}
