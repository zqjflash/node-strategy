# 第二节 JS常见错误及如何避免

> 下面开始深入探讨每个错误发生的情况,以便确定导致错误发生的原因以及如何避免.

## No.1 Uncaught TypeError: Cannot Read Property

这是JS开发人员最常遇到的错误,当你读取一个属性或调用一个为定义对象的方法时,Chrome中就会抛出以下错误.

```js
var obj;
obj.name; // Uncaught TypeError: Cannot read property 'name' of undefined at <anonymous>:2:5
```

## No.2 TypeError: 'undefined' Is Not an Object(evaluating...)

这是在Safari中读取属性或调用未定义对象上的方法时发生的错误,这与Chrome的上述错误基本相同,只是Safari使用不同的错误消息.

```js
var testArr = undefined;
if (testArr.length === 0) {
    console.log("Array is empty");
}
// TypeError: undefined is not an object (evaluating 'testArr.length')
```

## No.3 TypeError: Null Is Not an Object(evaluating...)

这是在Safari中读取属性或调用空对象上的方法时发生的错误.

```js
var testArr = null;
if (testArr.length === 0) {
    console.log("Array is empty");
}
// TypeError: null is not an object (evaluating 'testArr.length')
```

## No.4 (unknown): Script Error

当未捕获的JavaScript错误违背跨域原则时,就会发生脚本错误.通过window.onerror处理程序发出的错误,而不是try-catch中捕获到的错误

要获取真实的错误消息,需要执行以下操作:

```js
Access-Control-Allow-Origin *;
```

同时在脚本标签上设置crossorigin="anonymous"

## No.5 TypeError: Object Doesn't Support Property

当调用未定义的方法时,IE中会发生这样的错误.相当于在chrome "undefined" is not a function

```js
this.test();
// Object doesn't support property or method 'test'
```

常见解决方法:使用JS命名空间作为调用前缀.

## No.6 TypeError: 'undefined' Is Not a Function

当调用未定义的函数时,Chrome中就会发生这样的错误.

```js
function testFunc() {
    this.timer = setTimeout(function() {
        this.clearData();
    }, 0);
}
testFunc(); // TypeError: this.clearData is not a function
```

## No.7 Uncaught RangeError: Maximum Call Stack

chrome中当你调用一个不会终止的递归函数时.

```js
var arr = new Array(1);
function reduce(arr) {
    arr[0] = new Array(1);
    reduce(arr[0]);
}
reduce(arr);
// Uncaught RangeError: Maximum call stack size exceeded
```

## No.8 TypeError: Cannot Read Property 'length'

在chrome中发生的错误,因为读取了未定义长度属性的变量

```js
var testArr = ["test"];
function testFunc(testArr) {
    for (var i = 0; i < testArr.length; i++) {
        console.log(testArr[i]);
    }
}
testFunc();
// Uncaught TypeError: Cannot read property 'length' of undefined
```

## No.9 Uncaught TypeError: Cannot Set Property

当尝试访问为定义的变量时,总会返回undefined.我们也无法获取或设置undefined的任何属性.在这种情况下,应用程序将抛出"Uncaught TypeError cannot set property of undefined".

```js
var test = undefined;
test.name = "zhangsan";
// Uncaught TypeError: Cannot set property 'name' of undefined
```

## No.10 ReferenceError: Event Is Not Defined

尝试访问未定义的变量或当前范围之外的变量时会引发此错误.

```js
function testFunc() {
    var abc;
}
console.log(abc);
// Uncaught ReferenceError: abc is not defined
```

## 结论

很多null或undefined的错误是普遍存在的,一个类似于Typescript这样的好的静态类型检查系统,当设置为严格的编译选项时,能够帮助开发者避免这些错误.
