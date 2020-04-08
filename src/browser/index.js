import { windowAjaxError } from './handleAjax'
import { windowConsole } from './handleConsole'
import { windowListenerError, windowOnError, windowUnhandledRejectionError } from './handleError'

// 主动捕获
export function sendError (err) {
  console.log(err)
}

export function catchBrowserError () {
  try {
    // console.error
    windowConsole()

    // 只能监听到js执行的错误，无法监听资源加载的错误
    windowOnError()

    // 可以监听到js执行的错误，和资源加载的错误
    windowListenerError()

    // promise
    windowUnhandledRejectionError()

    // 数据请求
    windowAjaxError()
  } catch (e) {
    console.error(e)
  }
}

export function attachUser (user) {
  console.warn('attachUser', user)
}
