import { Attribute } from './create-end-mark'
import SessionStorageStartMark from './storage/SessionStorageStartMark'

function createMarkEventTracker(
  element: HTMLElement,
  namespace: string,
  onMarkTracked: (markName: string, duration: number) => void,
) {
  const observer = new MutationObserver(() => {
    element
      .querySelectorAll(`[${Attribute.EndMarkNamespace} ="${namespace}"]`)
      .forEach(endMarkElement => {
        const markName = endMarkElement.getAttribute(Attribute.EndMark)

        if (!markName) return

        const mark = SessionStorageStartMark.getMark(namespace, markName)

        if (!mark) return

        SessionStorageStartMark.removeMark(namespace, markName)

        onMarkTracked(markName, Date.now() - mark.timestamp)
      })
  })

  observer.observe(element, { subtree: true, childList: true })

  return () => observer.disconnect()
}

export default createMarkEventTracker
