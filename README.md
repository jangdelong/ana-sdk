![Actions Release](https://github.com/nanzm/errlock/workflows/Actions%20Release/badge.svg?branch=master)
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

# 文档

不过语法错误在我们开发阶段就可以看到，应该不会顺利上到线上环境。

### try-catch
try-catch 只能捕获到同步的运行时错误，对语法和异步错误却无能为力，捕获不到。

### window.onerror
函数只有在返回 true 的时候，异常才不会向上抛出，否则即使是知道异常的发生控制台还是会显示
最好写在所有 JS 脚本的前面，否则有可能捕获不到错误；
无法捕获语法错误、静态资源异常、接口异常

可以 捕获iframe 的异常

### window.addEventListener
当一项资源（如图片或脚本）加载失败，加载资源的元素会触发一个 Event 接口的 error 事件，并执行该元素上的onerror() 处理函数。
这些 error 事件不会向上冒泡到 window ，不过（至少在 Firefox 中）能被单一的window.addEventListener 捕获。
不同浏览器下返回的 error 对象可能不同，需要注意兼容处理。
需要注意避免 addEventListener 重复监听。


### Promise Catch
为了防止有漏掉的 Promise 异常
```javascript
window.addEventListener("unhandledrejection", function(e){
  console.log(e);
// 如果去掉控制台的异常显示，需要加上：
// e.preventDefault();
});
```
#### Script error
跨源资源共享机制( CORS )：我们为 script 标签添加 crossOrigin 属性。
服务器端需要设置：Access-Control-Allow-Origin
```javascript
const script = document.createElement('script');
script.crossOrigin = 'anonymous';
script.src = url;
document.body.appendChild(script);

// <script src="http://test/main.js" crossorigin></script>
```

