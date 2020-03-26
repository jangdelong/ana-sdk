export const config = {
  url: 'https://nancode.cn/stat/error',
  imgUrl: 'https://nancode.cn/go/sys/info',
  appId: '',
  isBrowser: true
}

export function extend (cfg) {
  Object.assign(config, cfg)
}
