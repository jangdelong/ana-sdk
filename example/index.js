var btn1 = document.getElementById('btn1')
btn1.onclick = function (e) {
  var student = { info: null }
  var name = student.info.name
  console.log(name)
}

var btn2 = document.getElementById('btn2')
btn2.onclick = function (e) {
  Promise.reject(new Error('not work reject'))
}

var btn3 = document.getElementById('btn3')
btn3.onclick = function (e) {
  console.error('错误', { test: 'a', age: 19 })
  console.error(new Error('error sj'))
}

var btn4 = document.getElementById('btn4')
btn4.onclick = function (e) {
  new Array(-1)(1.2).toFixed(21)
}

var btn5 = document.getElementById('btn5')
btn5.onclick = function (e) {
  console.log('--------------------------------')
  var ga = document.createElement('script')
  ga.type = 'text/javascript'
  ga.async = true
  ga.src = 'https://post/5bcdaed7e51d457a8254e1b7a.js'
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
}

var btn6 = document.getElementById('btn6')
btn6.onclick = function (e) {
  encodeURI('\uD800')
  encodeURIComponent('\uD800')
  decodeURI('%')
  decodeURIComponent('%')
}

var btn7 = document.getElementById('btn7')
btn7.onclick = function (e) {
  axios.get('https://www.nancode.cn/api/test/error', {}).catch(function (e) {

  })
}

var btn8 = document.getElementById('btn8')
btn8.onclick = function (e) {
  axios.get('https://www.nancode.cn/api/test/timeout', {
    timeout: 1800
  }).catch(function (e) {

  })
}
