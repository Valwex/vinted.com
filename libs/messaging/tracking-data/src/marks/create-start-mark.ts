import SessionStorageStartMark from './storage/SessionStorageStartMark'

const createStartMark = (namespace: string, markName: string) =>
  new SessionStorageStartMark(namespace, markName)

export default createStartMark
