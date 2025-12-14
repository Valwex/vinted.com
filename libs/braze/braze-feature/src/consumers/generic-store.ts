import { noop } from 'lodash'

export type Listener = () => void

export interface Store<T> {
  subscribe: (listener: Listener) => () => void
  state: T
}

export default abstract class GenericStore<T> implements Store<T> {
  private internalState: T

  private listeners = new Set<Listener>()

  constructor(initialState: T) {
    this.internalState = initialState
  }

  public subscribe = (listener: Listener) => {
    this.listeners.add(listener)

    return () => {
      this.listeners.delete(listener)
    }
  }

  public set state(state: T) {
    this.internalState = state
    this.broadcast()
  }

  public get state() {
    return this.internalState
  }

  public broadcast() {
    this.listeners.forEach(listener => listener())
  }
}

export const createDummyStore = <T>(value: T): Store<T> => ({
  state: value,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  subscribe(_: unknown) {
    return noop
  },
})
