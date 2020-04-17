import Browser from 'bowser'
import { config } from '../config'
import { imgReport } from './report'

export function reportUAInfo () {
  const browser = Browser.getParser(window.navigator.userAgent)
  const res = browser.getResult()
  const ua = browser.getUA()
  console.log(res)
  console.log(ua)

  setTimeout(() => {
    imgReport(config.imgUrl, {
      uid: config.uid,
      b_ua: ua,
      b_result: JSON.stringify(res)
    })
  }, 900)
}

// 暴露 Browser sdk
export default Browser
