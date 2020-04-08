import { transformError } from './report'

export function windowAjaxError () {
  const protocol = window.location.protocol
  if (protocol === 'file:') return
  if (!window.XMLHttpRequest) return

  const xmlHttp = window.XMLHttpRequest
  const originSend = xmlHttp.prototype.send

  // 错误处理
  const _handleEvent = function (type) {
    return function (event) {
      if (event && event.currentTarget && event.currentTarget.status !== 200) {
        transformError({
          // msg: event.target.status + event.target.statusText,
          // desc: JSON.stringify({
          //   response: event.target.response,
          //   responseURL: event.target.responseURL,
          // }),
          // tag: 'ajax'

          tag: 'ajaxRequest'
          // fileUrl,
          // lineno,
          // colno,
          // msg,
          // stack: error && error.stack || ''
        })
      }
    }
  }

  xmlHttp.prototype.send = function () {
    if (this['addEventListener']) {
      this['addEventListener']('error', _handleEvent('error'))
      this['addEventListener']('load', _handleEvent('load'))
      this['addEventListener']('abort', _handleEvent('abort'))
      this['addEventListener']('timeout', _handleEvent('timeout'))
    }
    return originSend.apply(this, arguments)
  }
}

export function windowFetchError () {
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
          transformError({
            msg: args[0],
            desc: JSON.stringify(res),
            tag: 'fetch'
          })
        }

        return res
      })
      .catch(error => {
        transformError({
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
