const _toString = Object.prototype.toString

export function find (list, f) {
  return list.filter(f)[0]
}

export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function isPromise (val) {
  return val && typeof val.then === 'function'
}

export function assert (condition, msg) {
  if (!condition) throw new Error(`[errlock] ${msg}`)
}

export function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}

export function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

export function toNumber (val) {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

export function remove (arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

export function once (fn) {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}

export function log (...msg) {
  console.log(...msg)
}

export function warn (...msg) {
  console.warn(...msg)
}

export function error (...msg) {
  console.error(...msg)
}

export function isObject (what) {
  return typeof what === 'object' && what !== null
}

export function isError (value) {
  switch (Object.prototype.toString.call(value)) {
    case '[object Error]':
      return true
    case '[object Exception]':
      return true
    case '[object DOMException]':
      return true
    default:
      return value instanceof Error
  }
}

export function isErrorEvent (value) {
  return Object.prototype.toString.call(value) === '[object ErrorEvent]'
}

export function isDOMError (value) {
  return Object.prototype.toString.call(value) === '[object DOMError]'
}

export function isDOMException (value) {
  return Object.prototype.toString.call(value) === '[object DOMException]'
}

export function isUndefined (what) {
  return what === void 0
}

export function isFunction (what) {
  return typeof what === 'function'
}

export function isPlainObject (what) {
  return Object.prototype.toString.call(what) === '[object Object]'
}

export function isString (what) {
  return Object.prototype.toString.call(what) === '[object String]'
}

export function isArray (what) {
  return Object.prototype.toString.call(what) === '[object Array]'
}

export function isEmptyObject (what) {
  if (!isPlainObject(what)) return false

  for (const _ in what) {
    if (what.hasOwnProperty(_)) {
      return false
    }
  }
  return true
}

export function supportsErrorEvent () {
  try {
    new ErrorEvent('') // eslint-disable-line no-new
    return true
  } catch (e) {
    return false
  }
}

export function supportsDOMError () {
  try {
    new DOMError('') // eslint-disable-line no-new
    return true
  } catch (e) {
    return false
  }
}

export function supportsDOMException () {
  try {
    new DOMException('') // eslint-disable-line no-new
    return true
  } catch (e) {
    return false
  }
}

export function supportsFetch () {
  if (!('fetch' in window)) return false

  try {
    new Headers() // eslint-disable-line no-new
    new Request('') // eslint-disable-line no-new
    new Response() // eslint-disable-line no-new
    return true
  } catch (e) {
    return false
  }
}

export function supportsReferrerPolicy () {
  if (!supportsFetch()) return false

  try {
    // eslint-disable-next-line no-new
    new Request('pickleRick', {
      referrerPolicy: 'origin'
    })
    return true
  } catch (e) {
    return false
  }
}

export function supportsPromiseRejectionEvent () {
  return typeof PromiseRejectionEvent === 'function'
}

export function wrappedCallback (callback) {
  function dataCallback (data, original) {
    const normalizedData = callback(data) || data
    if (original) {
      return original(normalizedData) || normalizedData
    }
    return normalizedData
  }

  return dataCallback
}

export function each (obj, callback) {
  let i, j

  if (isUndefined(obj.length)) {
    for (i in obj) {
      if (hasKey(obj, i)) {
        // eslint-disable-next-line no-useless-call
        callback.call(null, i, obj[i])
      }
    }
  } else {
    j = obj.length
    if (j) {
      for (i = 0; i < j; i++) {
        // eslint-disable-next-line no-useless-call
        callback.call(null, i, obj[i])
      }
    }
  }
}

export function objectMerge (obj1, obj2) {
  if (!obj2) {
    return obj1
  }
  each(obj2, function (key, value) {
    obj1[key] = value
  })
  return obj1
}

export function objectFrozen (obj) {
  if (!Object.isFrozen) {
    return false
  }
  return Object.isFrozen(obj)
}

export function truncate (str, max) {
  if (typeof max !== 'number') {
    throw new Error('2nd argument to `truncate` function should be a number')
  }
  if (typeof str !== 'string' || max === 0) {
    return str
  }
  return str.length <= max ? str : str.substr(0, max) + '\u2026'
}

export function hasKey (object, key) {
  return Object.prototype.hasOwnProperty.call(object, key)
}

export function urlEncode (o) {
  const pairs = []
  each(o, function (key, value) {
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
  })
  return pairs.join('&')
}

export function parseUrl (url) {
  if (typeof url !== 'string') return {}
  const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/)

  // coerce to undefined values to empty string so we don't get 'undefined'
  const query = match[6] || ''
  const fragment = match[8] || ''
  return {
    protocol: match[2],
    host: match[4],
    path: match[5],
    relative: match[5] + query + fragment // everything minus origin
  }
}

export function uuid4 () {
  const crypto = window.crypto || window.msCrypto

  if (!isUndefined(crypto) && crypto.getRandomValues) {
    // Use window.crypto API if available
    // eslint-disable-next-line no-undef
    const arr = new Uint16Array(8)
    crypto.getRandomValues(arr)

    // set 4 in byte 7
    arr[3] = (arr[3] & 0xfff) | 0x4000
    // set 2 most significant bits of byte 9 to '10'
    arr[4] = (arr[4] & 0x3fff) | 0x8000

    const pad = function (num) {
      let v = num.toString(16)
      while (v.length < 4) {
        v = '0' + v
      }
      return v
    }

    return (
      pad(arr[0]) +
      pad(arr[1]) +
      pad(arr[2]) +
      pad(arr[3]) +
      pad(arr[4]) +
      pad(arr[5]) +
      pad(arr[6]) +
      pad(arr[7])
    )
  } else {
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

export function htmlTreeAsString (elem) {
  /* eslint no-extra-parens:0*/
  const MAX_TRAVERSE_HEIGHT = 5
  const MAX_OUTPUT_LEN = 80
  const out = []
  let height = 0
  let len = 0
  const separator = ' > '
  const sepLength = separator.length
  let nextStr

  while (elem && height++ < MAX_TRAVERSE_HEIGHT) {
    nextStr = htmlElementAsString(elem)
    // bail out if
    // - nextStr is the 'html' element
    // - the length of the string that would be created exceeds MAX_OUTPUT_LEN
    //   (ignore this limit if we are on the first iteration)
    if (
      nextStr === 'html' ||
      (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)
    ) {
      break
    }

    out.push(nextStr)

    len += nextStr.length
    elem = elem.parentNode
  }

  return out.reverse().join(separator)
}

export function htmlElementAsString (elem) {
  const out = []
  let classes
  let key
  let attr
  let i

  if (!elem || !elem.tagName) {
    return ''
  }

  out.push(elem.tagName.toLowerCase())
  if (elem.id) {
    out.push('#' + elem.id)
  }

  const className = elem.className
  if (className && isString(className)) {
    classes = className.split(/\s+/)
    for (i = 0; i < classes.length; i++) {
      out.push('.' + classes[i])
    }
  }
  const attrWhitelist = ['type', 'name', 'title', 'alt']
  for (i = 0; i < attrWhitelist.length; i++) {
    key = attrWhitelist[i]
    attr = elem.getAttribute(key)
    if (attr) {
      out.push('[' + key + '="' + attr + '"]')
    }
  }
  return out.join('')
}

export function isOnlyOneTruthy (a, b) {
  return !!(!!a ^ !!b)
}

export function isBothUndefined (a, b) {
  return isUndefined(a) && isUndefined(b)
}

export function safeJoin (input, delimiter) {
  if (!isArray(input)) return ''

  const output = []

  for (let i = 0; i < input.length; i++) {
    try {
      output.push(String(input[i]))
    } catch (e) {
      output.push('[value cannot be serialized]')
    }
  }

  return output.join(delimiter)
}

export function getStackTrace () {
  if (!Error || !Error.captureStackTrace) return ''
  const obj = {}
  Error.captureStackTrace(obj, getStackTrace)
  return obj.stack
}

export function getLineColNum (stack) {
  if (!stack) return {}

  const regUrl = /\(([^)]*)\)/
  const a = stack.split('\n')

  let last, fileUrl, b, lineNo, colNo

  // 最后一条堆栈信息
  if (a && a.length > 0) last = a.pop()

  const res = last.match(regUrl)

  // 第二条结果
  if (res && res.length >= 1) fileUrl = res[1]

  if (fileUrl) b = fileUrl.split(':')

  if (b && b.length > 2) {
    colNo = b.pop()
    lineNo = b.pop()
  }
  return { lineNo, colNo, fileUrl }
}
