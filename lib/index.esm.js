class ErrLock {
    constructor(options) {
        // 配置
        this.config = options;
        // 全局环境信息
        this.globalContext = {
            ua: window.navigator.userAgent,
        };
        // 存储最近用户的 5条记录
        this.dataHub = [];
        console.log(this);
    }
    _catchBrowserError() {
        console.log('--------------------------------');
    }
}
//# sourceMappingURL=sdk.js.map

const defaultOpts = {
    debug: true,
    enabled: true,
    server: 'https://www.errlock.com/',
    appId: 10086,
    secret: '24u9m15e2w',
    sampleRate: 1,
    ignoreErrors: [],
    env: 'dev',
    maxBreadcrumbs: 5,
    beforeSend: function (...args) {
        console.log('beforeSend', args);
    },
    beforeBreadcrumb: function (...args) {
        console.log('beforeBreadcrumb', args);
    },
};
function init(options) {
    if (!window._ERR_LOCK_) {
        const client = new ErrLock(Object.assign(defaultOpts, options));
        window._ERR_LOCK_ = client;
        return client;
    }
    else {
        return window._ERR_LOCK_;
    }
}

export { init };
