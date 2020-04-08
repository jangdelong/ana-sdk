import { transformError } from './report'
import { tag } from '../constant'

export function windowAjaxError () {
  const protocol = window.location.protocol
  if (protocol === 'file:') return
  if (!window.XMLHttpRequest) return

  const xmlHttp = window.XMLHttpRequest
  const originSend = xmlHttp.prototype.send

  xmlHttp.prototype.send = function () {
    if (this['addEventListener']) {
      this['addEventListener']('error', _handleEvent('error'))
      this['addEventListener']('load', _handleEvent('load'))
      this['addEventListener']('abort', _handleEvent('abort'))
      this['addEventListener']('timeout', _handleEvent('timeout'))
    }
    return originSend.apply(this, arguments)
  }

  // 错误处理
  function _handleEvent (type) {
    return function (event) {
      if (event && event.currentTarget && event.currentTarget.status !== 200) {
        transformError({
          // msg: event.target.status + event.target.statusText,
          // desc: JSON.stringify({
          //   response: event.target.response,
          //   responseURL: event.target.responseURL,
          // }),
          // tag: 'ajax'

          tag: tag.AJAX_ERROR
          // fileUrl,
          // lineno,
          // colno,
          // msg,
          // stack: error && error.stack || ''
        })
      }
    }
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
        if (!res.ok) {
          transformError({
            tag: tag.FETCH_ERROR,
            msg: args[0],
            desc: JSON.stringify(res)
          })
        }
        return res
      })
      .catch(error => {
        transformError({
          tag: tag.FETCH_ERROR,
          msg: args[0],
          desc: JSON.stringify({
            message: error.message,
            stack: error.stack
          })
        })
        throw error
      })
  }
}
