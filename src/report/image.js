// import { logger } from '../debug'
// const log = logger('report/image.js')

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
