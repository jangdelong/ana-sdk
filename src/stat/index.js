import { logger } from '../debug'
const log = logger('stat/index.js')

export function sendEvent (event, extraObj) {
  log(event, extraObj)
}

