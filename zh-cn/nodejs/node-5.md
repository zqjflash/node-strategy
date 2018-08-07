# 第五节 事件/异步

## No.1 promise中.then的第二个参数与.catch有什么区别?

promise.then()的第一个参数是状态从pendding转为resolve时的回调函数,第二个参数是状态从pendding转为reject的回调函数,只是一种状态处理;
而.catch是用于promise流程的异常处理.

另外关于同步与异步流程,以下一段代码进行分析执行结果:
```js
let doSth = new Promise((resolve, reject) => {
    console.log('hello');
    resolve();
});
doSth.then(() => {
    console.log('over');
});
// 结果是 hello over
```
注:Promise封装的代码肯定是同步的,然后then的执行是异步的.


