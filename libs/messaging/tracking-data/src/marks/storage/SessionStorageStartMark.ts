import { MarkData } from '../types'

class SessionStorageStartMark {
  public static getMark(namespace: string, markName: string) {
    try {
      const result = sessionStorage.getItem(
        SessionStorageStartMark.createStartMarkSessionStorageKey(namespace, markName),
      )

      if (result) return JSON.parse(result) as MarkData

      return null
    } catch {
      return null
    }
  }

  public static removeMark(namespace: string, markName: string) {
    try {
      sessionStorage.removeItem(
        SessionStorageStartMark.createStartMarkSessionStorageKey(namespace, markName),
      )

      return true
    } catch {
      return false
    }
  }

  private static createStartMarkSessionStorageKey(namespace: string, markName: string) {
    return `${namespace}.${markName}.start_mark`
  }

  private readonly data: MarkData = { timestamp: Date.now() }

  private readonly sessionStorageKey: string

  public constructor(namespace: string, markName: string) {
    this.sessionStorageKey = SessionStorageStartMark.createStartMarkSessionStorageKey(
      namespace,
      markName,
    )
  }

  public store() {
    try {
      sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(this.data))

      return true
    } catch {
      return false
    }
  }
}

export default SessionStorageStartMark
