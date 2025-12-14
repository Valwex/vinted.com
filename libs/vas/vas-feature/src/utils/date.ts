import { MS_PER_SECOND } from '../constants/date'

export const getCurrentTimeInSeconds = () => Math.floor(new Date().getTime() / MS_PER_SECOND)
