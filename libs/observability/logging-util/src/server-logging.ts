/* eslint-disable no-console */
import { Log } from './type'

// Server console logs are outputed and forwarded to kibana, next-logger provides automated structure
export const serverLog = {
  logMessage: (message, context = {}) => console.log(message, context),
  logWarning: (message, context = {}) => console.warn(message, context),
  logError: (error: unknown, context = {}) => console.error(error, context),
} satisfies Log

export const {
  logMessage: logServerMessage,
  logWarning: logServerWarning,
  logError: logServerError,
} = serverLog
