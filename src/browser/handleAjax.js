import { transformError } from './report'
import { tag } from '../constant'

export function windowAjaxError () {
  const protocol = window.location.protocol
  if (protocol === 'file:') return
  if (!window.XMLHttpRequest) return

  const xmlHttp = window.XMLHttpRequest
  const originSend = xmlHttp.prototype.send
  const originOpen = xmlHttp.prototype.open

  const attr = {}

  xmlHttp.prototype.open = function () {
    // 记录参数
    const args = [].slice.call(arguments)
    attr.duration = new Date().getTime()
    attr.method = args[0]
    attr.apiUrl = args[1]

    return originOpen.apply(this, arguments)
  }

  xmlHttp.prototype.send = function () {
    // 记录参数
    const args = [].slice.call(arguments)
    attr.sendData = args[0]

    if (this['addEventListener']) {
      this.addEventListener('error', _handleEvent('error'))
      this.addEventListener('load', _handleEvent('load'))
      this.addEventListener('timeout', _handleEvent('timeout'))
      this.addEventListener('readystatechange', () => {
        if (this.readyState === 4) {
          // 记录参数
          attr.duration = new Date().getTime() - attr.duration
        }
      })
    }
    return originSend.apply(this, arguments)
  }

  // 错误处理
  function _handleEvent (type) {
    return function (e) {
      if (this.readyState === 4 && this.status !== 200 && this.status !== 304) {
        const status = e.target.status
        const statusText = e.target.statusText
        const responseURL = e.target.responseURL
        const response = e.target.response

        // 当一个XMLHttpRequest请求完成的时候会触发load 事件。
        if (type === 'load') {
          transformError({
            tag: tag.AJAX_ERROR,
            msg: `event:${type.toUpperCase()} ${responseURL} ${status}`,
            stack: JSON.stringify({
              statusText: statusText,
              apiUrl: responseURL,
              response: response
            })
          })
          return
        }

        // 当请求遇到错误时，将触发error 事件。
        let msg = `event:${type.toUpperCase()} ${attr.apiUrl} `
        if (type === 'timeout') {
          msg += attr.duration + 'ms'
        }

        transformError({
          tag: tag.AJAX_ERROR,
          msg: msg,
          stack: JSON.stringify({
            statusText: type,
            apiUrl: attr.apiUrl,
            method: attr.method,
            sendData: attr.sendData
          })
        })
      }
    }
  }
}
