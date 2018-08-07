# 第三节 模块机制

## No.1 Node.js两个js文件互相require,是否会死循环?双方是否可以导出变量?如何从设计上避免这种问题?

不会出现死循环,
从缓存角度分析:Node.js在模块第一次加载时会把结果进行cache,下一次载入时直接从缓存中获取,切断两个js文件的互相引用.
从执行顺序角度分析:先执行的导出空对象,后执行的可以导出对方的变量值,通过导出工厂函数让对方从函数取比较好避免这种问题.

* moduleA.js示例代码:
```js
var moduleB = require('./moduleB');
console.log(moduleB);
module.export = {a: 1};
```
* moduleB.js示例代码:
```js
var moduleA = require('./moduleA');
console.log(moduleA);
module.export = {b: 2};
```

执行node moduleA.js
打印结果:
```js
{}
{b: 2}
```

分析原因: 模块A导出的只是var module = {exports: {}}, 启动moduleA.js时,还没执行完exports就是{},所以在moduleB开头拿到的就是{}.

注: exports只是module.exports的一个引用.

## No.2 如果a.js require b.js,那么在b中定义的全局变量b='xxx'能否在a中直接打印出来?

在a.js中可以打印出来xxx,主要是Node.js在每个.js文件外层包装了一个自执行.

等同于如下两段代码:
```js
// b.js
(function(exports, require, module, __filename, __dirname) {
    b = "xxx";
})();
// a.js
(function(exports, require, module, __filename, __dirname){
    console.logt(b); // xxx
})();
```

## No.3 如何在不重启node进程的情况下热更新一个js/json文件?这个问题本身是否有问题?

对客户端而言:热更新意味着不用换包,当然也包含着md5校验/差异更新等复杂问题;
对服务端而言:热更新意味着不用重启,这样可用性较高;

在Node.js热更新基本思路:
* 监视文件/目录改动:使用path.resolve来定位文件
* 清空require.cache中的模块缓存并重新require,示例代码:
```js
Object.keys(require.cache).forEach(function(cachePath) {
    if (cachePath.startsWith(filePath)) {
        delete require.cache[cachePath];
    }
});
```
* 用新模块覆盖旧模块
```js
Object.assign(target, newModule);
```
要注意一个问题,如果是热更新代码,单纯清除require中的cache,要避免多地部署造成跨地调用旧的缓存文件.
如果是热更新JSON之类的配置文件,更新require的cache可以实现
不过热更新的方法还是有挺多其它的解决方案,比如分布式缓存、zookeeper之类的服务.既可以减少发布配置的频次,又可以做到可视化的运营.

* 另外加载 JS/JSON 主要有两种方式
第一种是利用node内置的require(‘data.json’)直接得到js对象 第二种是使用fs.open读入文件内容,然后用JSON.parse(content)转换成js对象.
二者的区别是require机制情况下,如果多个模块都加载了同一个json文件,那么其中一个改变了js对象,其他的也会跟着改变;而fs.open可以随意改变加载后的js变量,各模块互不影响.

## No.4 为什么 Node.js 不给每一个.js 文件以独立的上下文来避免作用域被污染?

每个单独的.js文件并不意味着单独的上下文,
至于说不给每个js以独立的上下文来避免作用域污染,本质上还是由于Node.js在.js文件中污染了全局的作用域一样能影响到其他的地方.
不过目前Node.js将VM的接口暴露了出来,可以自己创建一个新的js上下文,这样在执行外部代码的时候,通过创建新的上下文沙盒(sandbox)可以避免上下文被污染.

```js
'use strict';
const vm = require('vm');
let code = 
`(function(require) {
    const http = require('http');
    http.createServer((request, response) => {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('Hello World\\n');
    }).listen(8124);
    console.log('Server running at http://127.0.0.1:8124/');
})`;
vm.runInThisContext(code)(require);
```

## No.5 为什么npm包以全局方式安装,依然提示not found?

环境变量没有配置正确,检查一下npm的安装目录的bin目录是否已添加到环境变量.



