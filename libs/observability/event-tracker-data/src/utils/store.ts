import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@marketplace-web/browser/browser-storage-util'

import { PreparedTrackingEvent, EventTrackerStorage, EventTrackerType } from '../types'

const buildStorageConstruct = (): EventTrackerStorage => ({ pending: [], outgoing: [] })

class Store {
  namespace: string

  constructor(namespace: string) {
    this.namespace = namespace

    this.prepare()
  }

  prepare() {
    const storage: EventTrackerStorage = buildStorageConstruct()

    const currentData = this.events

    if (!currentData) {
      setLocalStorageItem(this.namespace, JSON.stringify(storage))
    }
  }

  get events(): EventTrackerStorage {
    const data = getLocalStorageItem(this.namespace)

    if (!data) {
      return buildStorageConstruct()
    }

    try {
      return JSON.parse(data)
    } catch (exception) {
      return buildStorageConstruct()
    }
  }

  add(event: PreparedTrackingEvent, type: EventTrackerType = 'pending') {
    const events = this.events.pending

    events.push(event)

    const data = {
      ...this.events,
      [type]: events,
    }

    setLocalStorageItem(this.namespace, JSON.stringify(data))
  }

  movePending() {
    const events = this.events.pending

    events.forEach(event => {
      this.add(event, 'outgoing')
    })
    this.clear('pending')
  }

  clear(type: EventTrackerType = 'pending') {
    const data = {
      ...this.events,
      [`${type}`]: [],
    }

    setLocalStorageItem(this.namespace, JSON.stringify(data))
  }
}

export default Store
