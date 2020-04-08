import { getLineColNum, isFunction } from '../helper'
import { transformError } from './report'
import { tag } from '../constant'

export function windowOnError () {
  const OriginWindowError = window.onerror
  window.onerror = function (msg, fileUrl, lineno,
    colno, error) {
    transformError({
      tag: tag.JS_ERROR,
      fileUrl,
      lineno,
      colno,
      msg,
      stack: error && error.stack || ''
    })

    if (OriginWindowError && isFunction(OriginWindowError)) {
      OriginWindowError && OriginWindowError.apply(window, arguments)
    }

    return true
  }
}

export function windowListenerError () {
  window.addEventListener('error', function (e) {
    e.preventDefault()

    if (e) {
      const target = e.target || e.srcElement
      const isElementTarget = target instanceof HTMLScriptElement || target instanceof HTMLLinkElement
      if (!isElementTarget) return

      // js css 资源加载错误
      const url = target.src || target.href
      transformError({
        tag: tag.LOAD_RES_ERROR,
        fileUrl: url,
        lineno: '',
        colno: '',
        msg: e.target.outerHTML,
        stack: ''
      })
    }
  }, true)
}

export function windowUnhandledRejectionError () {
  window.addEventListener('unhandledrejection', function (e) {
    e.preventDefault()
    if (e && e.reason && e.reason.stack) {
      const msg = e.reason.message
      const stack = e.reason.stack
      const { lineNo, colNo, fileUrl } = getLineColNum(stack)

      transformError({
        tag: tag.UNHANDLED_REJECTION_ERROR,
        fileUrl: fileUrl,
        lineno: lineNo,
        colno: colNo,
        msg: msg,
        stack: stack
      })
    }
  }, true)
}
