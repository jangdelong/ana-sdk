class ErrLock {

  private config: Record<string, any>

  private globalContext: any

  private dataHub: any

  public constructor (options) {
    // 配置
    this.config = options

    // 全局环境信息
    this.globalContext = {
      ua: window.navigator.userAgent,
    }

    // 存储最近用户的 5条记录
    this.dataHub = []

    console.log(this)
  }

  private _catchBrowserError (): void {
    console.log('--------------------------------')
  }

}

export default ErrLock



