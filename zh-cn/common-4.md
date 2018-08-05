# 第四节 JS高级进阶

## No.1 js常见的设计模式(单例、工厂、代理、观察者)的实现方式是怎样的?

* 单例:任意对象都是单例,无需特别处理

```js
const obj = {name: 'xxx', age: 30};
```

* 工厂:就是同样形式参数返回不同的实例

```js
function Person() {this.name = 'Persion';}
function Animal() {this.name = 'Animal1';}
function Factory() {}
Factory.prototype.getInstance = function(className) {
    return eval("new " + className + "()");
};
const factory = new Factory();
const obj1 = factory.getInstance("Person");
const obj2 = factory.getInstance("Animal");
console.log(obj1.name); // 'Person1'
console.log(obj2.name); // 'Animal1'
```

* 代理:就是新建个类调用老类的接口,包装一下

```js
function Person() {}
Person.prototype.sayName = function() {console.log("xxx");}
Person.prototype.sayAge = function() {console.log(30);}
function PersonProxy() {
    this.person = new Person();
    var that = this;
    this.callMethod = function(functionName) {
        console.log("before proxy:", functionName);
        that.person[functionName](); // 代理
        console.log("after proxy:", functionName);
    };
}
var pp = new PersonProxy();
pp.callMethod('sayName'); // 代理调用Person的方法sayName()
pp.callMethod('sayAge'); // 代理调用Person的方法sayAge()
```

* 观察者:就是事件模式,比如按钮的onclick这样的应用

// 创建发布者
```js
function Publisher() {
    this.listeners = [];
}
Publisher.prototype = {
    "addListener": function(listener) {
        this.listeners.push(listener);
    },
    "removeListener": function(listener) {
        delete this.listeners[listener];
    },
    "notify": function(obj) {
        for (var i = 0; i < this.listeners.length; i++) {
            var listener = this.listeners[i];
            if (typeof listener !== "undefined") {
                listener.process(obj);
            }
        }
    }
};

// 创建订阅者
function Subscriber() {}
Subscriber.prototype = {
    "process": function(obj) {
        console.log(obj);
    }
};

var publisher = new Publisher();
publisher.addListener(new Subscriber());
publisher.addListener(new Subscriber());
publisher.notify({name: 'xxx', age: 30}); // 发布一个对象到所有订阅者
publisher.notify('2 subscribers will both perform process'); // 发布一个字符串到所有订阅者
```

## No.2 函数柯里化?

柯里化:是把接受多个参数的函数,变换成一个单一参数的函数,并且返回接受余下的参数而且返回结果的新函数的技术.
基本的柯里化函数示例代码:

```js
var currying = function(fn) {
  var args = [];
  return function() {
    if (arguments.length === 0) {
      return fn.apply(this, args); // 没传参数时，调用这个函数
    } else {
      [].push.apply(args, arguments); // 传入了参数，把参数保存下来
      return arguments.callee; // 返回这个函数的引用
    }
  }
}
var cost = (function() {
    var money = 0;
    return function() {
        for (var i = 0; i < arguments.length; i++) {
            money += arguments[i];
        }
        return money;
    }
})();
var cost = currying(cost);
cost(100); // 传入了参数,不真正求值
cost(200); // 传入了参数,不真正求值
cost(300); // 传入了参数,不真正求值
console.log(cost()); // 求值并且输出600
```

## No.3 移动端的touch click事件的理解以及点透问题处理

当用户在点击屏幕的时候,系统会触发touch事件和click事件,touch事件优先处理,经过捕获处理,冒泡一系列流程处理完成后,才会去触发click事件.
在touch事件里面,调用e.preventDefault()就可以阻止本次点击系统触发的click事件,即本次相关的click都不会执行.
解决示例代码:
```js
dom.addEventListener("touchstart", function(e) {
    e.preventDefault();
});
```

点透发生的理由:当手指触摸到屏幕的时候,系统生成两个事件,一个是touch,一个是click,touch先于click执行,click有延迟200~300ms
解决示例代码:
```js
dom.addEventListener('touchend', function(e) {
    e.preventDefault();
});
```

## No.4 preventDefault()、stopPropagation()、return false之间的区别?

每次调用return false时候,实际上做了三个事情:
event.preventDefault();
event.stopPropagation();
停止回调函数执行并立即返回.

preventDefault事件阻止父节点继续处理事件

stopPropagation()停止事件冒泡

## No.5 service worker如何实现离线缓存?

SW介于服务器和网页之间的拦截器,能够拦截进出的HTTP请求,从而完全控制你的网站.

主要的特点:
* 在页面中注册安装成功后,运行于浏览器后台,不受页面刷新的影响;
* 网站必须使用HTTPS
* 可以控制打开的作用域范围下所有的页面请求
* 单独的作用域范围,单独的运行环境和执行线程
* 不能操作页面的DOM,但可以通过事件机制来处理
* 事件驱动型服务线程

执行流程:
* 调用register()函数时,SW开始下载;
* 在注册过程中,浏览器会下载、解析并执行SW;
* 一旦SW成功执行,install事件就会激活;
* 安装完成之后,SW便会激活,并控制在其范围内的一切.

# 参考

### [JavaScript函数柯里化](https://zhuanlan.zhihu.com/p/31271179)
### [移动端touch click事件的理解+点透](https://www.jianshu.com/p/dc3bceb10dbb)
### [preventDefault、stopPropagation、return false之间的区别](https://www.cnblogs.com/dannyxie/p/5642727.html)
### [讲讲PWA](https://segmentfault.com/a/1190000012353473)
