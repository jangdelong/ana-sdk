# 错误监控

![](https://cdn.nlark.com/yuque/0/2020/svg/98513/1589278360015-808c0016-365a-4feb-a081-c9a472d19a87.svg#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&originHeight=20&originWidth=164&size=0&status=done&style=none&width=164)<br />

<a name="errlock"></a>
# errlock

<br />随着项目的扩大，更多开发人员加入，让错误异常的产生变得可度量，可监控，错误监控越来越重要<br />

<a name="ecff77a8"></a>
# 使用

<br />errlock 必须在所有类库之前加载并初始化。<br />

```shell
# 安装
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
```


<a name="R0Ume"></a>
## 架构规划
<a name="kK19K"></a>
#### errlock   
错误监控核心 js-sdk，前期只支持web端监控，后期会支持小程序、nodejs<br />

<a name="4FSeC"></a>
#### console （近期开源）
前端错误展示项目，包括一些错误信息的归类，筛选<br />

<a name="Mq3VC"></a>
#### deja （暂未开源）
后端提供接口服务，报警等，提供api，使用 golang 语言编写，框架使用 gin，前期使用 mysql 作为数据存储层。<br />
<br />

<a name="Xwd1j"></a>
# 文档


<a name="908r3"></a>
#### 语法错误
不过语法错误在我们开发阶段就可以看到，应该不会顺利上到线上环境。<br />

<a name="P1ypu"></a>
#### try-catch
try-catch 只能捕获到同步的运行时错误，对语法和异步错误却无能为力，捕获不到。<br />

<a name="SV6TE"></a>
#### window.onerror
函数只有在返回 true 的时候，异常才不会向上抛出，否则即使是知道异常的发生控制台还是会显示<br />最好写在所有 JS 脚本的前面，否则有可能捕获不到错误；<br />无法捕获语法错误、静态资源异常、接口异常<br />可以 捕获iframe 的异常<br />

<a name="bqpj1"></a>
#### window.addEventListener
当一项资源（如图片或脚本）加载失败，加载资源的元素会触发一个 Event 接口的 error 事件，并执行该元素上的onerror() 处理函数。<br />这些 error 事件不会向上冒泡到 window ，不过（至少在 Firefox 中）能被单一的window.addEventListener 捕获。<br />不同浏览器下返回的 error 对象可能不同，需要注意兼容处理。<br />需要注意避免 addEventListener 重复监听。<br />

<a name="Bjf3R"></a>
#### Promise Catch
为了防止有漏掉的 Promise 异常
```javascript
window.addEventListener("unhandledrejection", function(e){
  console.log(e);
// 如果去掉控制台的异常显示，需要加上：
// e.preventDefault();
});
```


<a name="7b94ae2e"></a>
#### Script error
跨源资源共享机制( CORS )：我们为 script 标签添加 crossOrigin 属性。<br />服务器端需要设置：Access-Control-Allow-Origin
```javascript
const script = document.createElement('script');
script.crossOrigin = 'anonymous';
script.src = url;
document.body.appendChild(script);

// <script src="http://test/main.js" crossorigin></script>
```


