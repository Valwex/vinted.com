import { serverSide } from '@marketplace-web/environment/environment-util'

import { serverLog } from './server-logging'

import { Log } from './type'

const log = {
  logMessage: (...args) => window.apphealth?.captureMessage(...args),
  logWarning: (...args) => window.apphealth?.captureWarning(...args),
  logError: (...args) => window.apphealth?.captureError(...args),
} satisfies Log

export const logMessage = serverSide ? serverLog.logMessage : log.logMessage
export const logWarning = serverSide ? serverLog.logWarning : log.logWarning
export const logError = serverSide ? serverLog.logError : log.logError
