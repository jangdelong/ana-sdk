import { sendEvent } from './stat/index'
import { sendError, attachUser, catchBrowserError } from './browser/index'
import { reportUAInfo } from './browser/uaParse'
import { warn, error } from './helper'
import { config, resolveConfig } from './config'

function init (opts) {
  if (!opts.appId) {
    warn('init function need appId!')
  }

  // 初始化配置
  resolveConfig(opts)

  // 捕获错误
  if (config.isBrowser) {
    if (!window) {
      error('not in Browser')
      return
    }

    // 浏览器信息
    reportUAInfo()

    // 捕获错误
    catchBrowserError()
  }
}

export default {
  init,

  attachUser,

  // 打点
  stat: sendEvent,

  // 主动上报
  error: sendError
}
