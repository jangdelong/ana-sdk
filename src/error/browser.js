import { isFunction } from '../helper'
import { imgReport } from '../report/image'
import { config } from '../config'

// 主动捕获
export function sendError (err) {
  console.log(err)
}

export function catchBrowserError () {
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
  windowFetchError()
}

function windowConsole () {
  if (!window.console || !window.console.error) return

  const originConsoleError = window.console.error
  window.console.error = function () {
    const args = [].slice.call(arguments)

    formatError({
      msg: 'consoleError',
      desc: JSON.stringify(args.join(',')),
      tag: 'console.error'
    })

    originConsoleError && originConsoleError.apply(window, arguments)
  }
}

function windowOnError () {
  const OriginWindowError = window.onerror
  window.onerror = function (msg, url, line,
    col, error) {
    if (error && error.stack) {
      formatError({
        msg: msg,
        desc: error.stack,
        tag: 'js'
      })
    } else if (typeof msg === 'string') {
      const desc = JSON.stringify({
        resourceUrl: url,
        rowNum: line,
        colNum: col
      })
      formatError({
        msg: msg,
        desc: desc,
        tag: 'js'
      })
    }

    if (OriginWindowError && isFunction(OriginWindowError)) {
      OriginWindowError && OriginWindowError.apply(window, arguments)
    }

    return true
  }
}

function windowListenerError () {
  window.addEventListener('error', function (event) {
    event.preventDefault()
    if (event) {
      const target = event.target || event.srcElement
      const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement || target instanceof HTMLImageElement

      // js error不再处理
      if (!isElementTarget) return

      const url = target.src || target.href
      formatError({
        msg: target.nodeName,
        desc: url,
        tag: 'resource'
      })
    }
  }, true)
}

function windowUnhandledRejectionError () {
  window.addEventListener('unhandledrejection', function (event) {
    event.preventDefault()
    if (event) {
      const reason = event.reason
      formatError({
        msg: 'unhandledrejection',
        desc: reason,
        tag: 'promise'
      })
    }
  }, true)
}

function windowAjaxError () {
  const protocol = window.location.protocol
  if (protocol === 'file:') return

  // 处理XMLHttpRequest
  if (!window.XMLHttpRequest) {
    return
  }
  const xmlHttp = window.XMLHttpRequest

  const originSend = xmlHttp.prototype.send

  // 错误处理
  const _handleEvent = function (event) {
    if (event && event.currentTarget && event.currentTarget.status !== 200) {
      formatError({
        msg: event.target.responseURL,
        desc: JSON.stringify({
          response: event.target.response,
          responseURL: event.target.responseURL,
          status: event.target.status,
          statusText: event.target.statusText
        }),
        tag: 'ajax'
      })
    }
  }

  xmlHttp.prototype.send = function () {
    if (this['addEventListener']) {
      this['addEventListener']('error', _handleEvent)
      this['addEventListener']('load', _handleEvent)
      this['addEventListener']('abort', _handleEvent)
    } else {
      const originStateChange = this['onreadystatechange']
      this['onreadystatechange'] = function (event) {
        if (this.readyState === 4) {
          _handleEvent(event)
        }
        originStateChange && originStateChange.apply(this, arguments)
      }
    }
    return originSend.apply(this, arguments)
  }
}

function windowFetchError () {
  const protocol = window.location.protocol
  if (protocol === 'file:') return

  if (!window.fetch) return

  const originFetch = window.fetch
  window.fetch = function () {
    const args = [].slice.call(arguments)

    return originFetch.apply(this, args)
      .then(res => {
        // True if status is HTTP 2xx
        if (!res.ok) {
          formatError({
            msg: args[0],
            desc: JSON.stringify(res),
            tag: 'fetch'
          })
        }

        return res
      })
      .catch(error => {
        formatError({
          msg: args[0],
          desc: JSON.stringify({
            message: error.message,
            stack: error.stack
          }),
          tag: 'fetch'
        })
        throw error
      })
  }
}

function formatError (data) {
  const path = window.location.href
  data.path = path
  data.appid = config.appId
  data.uid = config.uid

  imgReport(config.imgUrl, data)
}

