const global = window
const defaultFunctionName = '<anonymous>'
const handlers = {}


export function fill (source: { [key: string]: any }, name: string, replacement: (...args: any[]) => any): void {
  if (!(name in source)) {
    return
  }

  const original = source[name] as () => any
  const wrapped = replacement(original) as any

  // Make sure it's a function first, as we need to attach an empty prototype for `defineProperties` to work
  // otherwise it'll throw "TypeError: Object.defineProperties called on non-object"
  // tslint:disable-next-line:strict-type-predicates
  if (typeof wrapped === 'function') {
    try {
      wrapped.prototype = wrapped.prototype || {}
      Object.defineProperties(wrapped, {
        __original__: {
          enumerable: false,
          value: original,
        },
      })
    } catch (_Oo) {
      // This can throw if multiple fill happens on a global object like XMLHttpRequest
      // Fixes https://github.com/getsentry/sentry-javascript/issues/2043
    }
  }

  source[name] = wrapped
}


export function getFunctionName (fn: unknown): string {
  try {
    if (!fn || typeof fn !== 'function') {
      return defaultFunctionName
    }
    return fn.name || defaultFunctionName
  } catch (e) {
    // Just accessing custom props in some Selenium environments
    // can cause a "Permission denied" exception (see raven-js#495).
    return defaultFunctionName
  }
}



function triggerHandlers (type: string, data: any): void {
  if (!type || !handlers[type]) {
    return
  }

  for (const handler of handlers[type] || []) {
    try {
      handler(data)
    } catch (e) {
      console.error(
        `Error while triggerHandlers.\nType: ${type}\nName: ${getFunctionName(
          handler
        )}\nError: ${e}`
      )
    }
  }
}


function instrumentConsole (): void {
  if (!('console' in global)) {
    return
  }

  ['debug', 'info', 'warn', 'error', 'log', 'assert'].forEach(function (level: string): void {
    if (!(level in global.console)) {
      return
    }

    fill(global.console, level, function (originalConsoleLevel: () => any): Function {
      return function (...args: any[]): void {
        triggerHandlers('console', { args, level })

        // this fails for some browsers. :(
        if (originalConsoleLevel) {
          Function.prototype.apply.call(originalConsoleLevel, global.console, args)
        }
      }
    })
  })
}

