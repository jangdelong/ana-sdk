import { sendEvent } from './stat/index'
import { sendError, catchBrowserError } from './error/browser'
import { warn } from './helper'
import { config, resolveConfig } from './config'

function init (opts) {
  if (!opts.appId) {
    warn('init function need appId!')
  }

  // 初始化配置
  resolveConfig(opts)

  // 捕获错误
  if (config.isBrowser) { catchBrowserError() }
}

export default {
  init,

  // 打点
  stat: sendEvent,

  // 主动上报
  error: sendError
}
