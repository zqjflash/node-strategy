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

