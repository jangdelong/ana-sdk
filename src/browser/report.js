import { logger } from '../debug'
import { config } from '../config'
const log = logger('report/ajax.js')

/**
 * https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest
 */
export function post (url, data) {
  const xhr = new XMLHttpRequest()
  xhr.open('post', url, true)
  xhr.setRequestHeader('content-type', 'application/json;charset=utf-8')
  xhr.setRequestHeader('Accept', 'application/json')
  xhr.withCredentials = true
  xhr.timeout = 20000

  xhr.onload = function () {
    const result = window.JSON.parse(xhr.responseText)
    log(result)
    if (result.status === 1) {
    }
  }

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const result = window.JSON.parse(xhr.responseText)
        log(result)
        if (result.status === 1) {
        }
      } else {
        log('ajax error')
      }
    }
  }

  xhr.send(window.JSON.stringify(data))
}

const entry = {}
export function imgReport (url, data) {
  if (!url || !data) {
    return
  }
  // @see http://jsperf.com/new-image-vs-createelement-img
  let image = document.createElement('img')

  const items = []
  for (const key in data) {
    if (data[key]) {
      items.push(key + '=' + encodeURIComponent(data[key]))
    }
  }

  const name = 'img_' + (+new Date())
  entry[name] = image
  image.onload = image.onerror = function () {
    entry[name] = image = image.onload = image.onerror = null
    delete entry[name]
  }
  image.src = url + (url.indexOf('?') < 0 ? '?' : '&') + items.join('&')
}

export function transformError (data) {
  data.path = window.location.href
  data.appid = config.appId
  data.uid = config.uid

  imgReport(config.imgUrl, data)
}

