
![Actions Release](![Actions Release](https://github.com/nanzm/errlock/workflows/Actions%20Release/badge.svg?branch=master))
# errlock 

随着项目的扩大，更多开发人员加入，让错误异常的产生变得可度量，可监控，错误监控越来越重要

# todo
- 错误监控 主动上报
- 侵入式打点

# 使用

### Getting Started
errlock 必须在所有类库之前加载并初始化。

### Install
```shell script
npm i errlock

```
```javascript
import errlock from "errlock"

errlock.init({
  url:'',
  appId: '1231',
  isCatchBrowserError: false
})

errlock.error(new Error('error test'))

errlock.stat('web-click', {})
```

# 参考文档



