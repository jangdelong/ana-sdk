import { getLineColNum, getStackTrace, isError } from '../helper'
import { transformError } from './report'

export function windowConsole () {
  if (!window.console || !window.console.error) return

  const originConsoleError = window.console.error
  window.console.error = function () {
    const args = [].slice.call(arguments)

    const stackTrace = getStackTrace()
    const { lineNo, colNo } = getLineColNum(stackTrace)

    const msg = args.map((item) => {
      if (isError(item)) {
        return item.stack
      }
      return JSON.stringify(item)
    })

    transformError({
      tag: 'consoleError',
      fileUrl: '',
      lineno: lineNo,
      colno: colNo,
      msg: msg.join(','),
      desc: `console.log(${msg.join(',')})`
    })

    originConsoleError.apply(window, arguments)
  }
}
