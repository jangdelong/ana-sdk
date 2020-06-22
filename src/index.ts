import Sdk from './sdk'
import {Options} from './type'

const defaultOpts = {
  debug: true,
  enabled: true,

  server: 'https://www.errlock.com/',
  appId: 10086,
  secret: '24u9m15e2w',

  sampleRate: 1,
  ignoreErrors: [],

  env: 'dev',
  maxBreadcrumbs: 5,

  beforeSend: function (...args) {
    console.log('beforeSend', args)
  },
  beforeBreadcrumb: function (...args) {
    console.log('beforeBreadcrumb', args)
  },
}

function init (options: Options) {
  if (!window._ERR_LOCK_) {
    const client = new Sdk(Object.assign(defaultOpts, options))
    window._ERR_LOCK_ = client
    return client
  } else {
    return window._ERR_LOCK_
  }
}

export {init}
