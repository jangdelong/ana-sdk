import { uuid4 } from './helper'

export const config = {
  url: 'https://nancode.cn/api/stat/error',
  imgUrl: 'https://nancode.cn/img/stat/error',
  appId: '',
  isBrowser: true,
  uid: ''
}

export function resolveConfig (cfg) {
  cfg.uid = genUid()

  // 合并
  Object.assign(config, cfg)
}

function genUid () {
  let uid = localStorage.getItem('errlock_uid')
  if (uid) {
    return uid
  }

  uid = uuid4()
  localStorage.setItem('errlock_uid', uid)
  return uid
}
