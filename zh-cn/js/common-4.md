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

* 发布订阅模式

> 订阅者需要注册到发布者,发布者发布消息时,依次向订阅者发布消息.

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

* 事件监听器模式

事件监听过程如下:

1. 事件源通常会有很多事件类型,比如点击类型,加载类型,关闭类型等,此时,事件源就会添加这些个事件对应的事件监听器;
2. 事件监听器的作用就是:当事件源的某个事件被触发时,就会调用这个事件对应的事件监听器的处理事件的方法.

在JS中,这样的模式很常见:

```js
var button = document.getElementById("button"); // 事件源:button按钮标签
button.addEventListener("click", function(event) {

}); // 事件: click事件对应的button对象
// 事件监听器: 匿名的回调函数
```


## No.2 函数柯里化?

柯里化:是把接受多个参数的函数,变换成一个单一参数的函数(最初函数的第一个参数),并且返回接受余下的参数而且返回结果的新函数的技术.
柯里化有3个常见的作用:
* 参数复用
* 提前返回
* 延迟计算/运行;
实际上柯里化的部分应用常见于匿名函数中，函数式思维就是要尽量减少代码中的中间变量；

柯里化的设计原理:

每次调用该函数时,返回一个新函数,这个新函数实际上就是一个闭包,这个新函数把每次接收到的参数都存储起来,并且继续返回一个新函数,当发现某次调用的时候没有传入参数,就意味着要进行数据统计,从而把之前存储的数据一次性拿出来算,最后返回计算结果.

1. 参数复用-基本的柯里化函数示例代码:

```js
var currying = function(fn) {
  var args = [].slice.call(arguments, 1); // args指的是传入的参数
  return function() {
    var newArgs = args.concat([].slice.call(arguments)); // 传入的参数与已有的参数整合,便于处理
    return fn.apply(null, newArgs); // 这些参数由fn来处理
  }
};
var count = 0;
var cost = currying(function() {
    var allArgs = [].slice.call(arguments); // 获取所有函数的参数
    for (var i = 0; i < allArgs.length; i++) {
        count += allArgs[i];
    }
    return count;
},10);
cost(100);
console.log(cost(100)); // 求值并且输出220
```

这里的参数10在每次调用的时候都复用上

2. 提前返回-基本示例代码:

```js
var addEvent = (function() {
    if (window.addEventListener) {
        return function(el, sType, fn, capture) {
            el.addEventListener(sType, function(e) {
                fn.call(el, e);
            }, (capture));
        };
    } else if (window.attachEvent) {
        return function(el, sType, fn, capture) {
            el.attachEvent("on" + sType, function(e) {
                fn.call(el, e);
            });
        };
    }
})();
```

这段代码初始化addEvent执行时实现了部分应用,无须每次添加事件重新走一遍判断逻辑

3. 延迟计算,基于参数复用的例子加以改进:

```js
var currying = function(fn) {
  var args = [];
  return function() {
      if (arguments.length === 0) {
        return fn.apply(null, args); // 这些参数由fn来处理
      } else {
        // args = args.concat([].slice.call(arguments)); // 传入的参数与已有的参数整合,便于处理
        args = args.concat([...arguments]); // ES6写法
      }
  }
};
var count = 0;
var cost = currying(function() {
    var allArgs = [].slice.call(arguments); // 获取所有函数的参数
    for (var i = 0; i < allArgs.length; i++) {
        count += allArgs[i];
    }
});
cost(100);
cost(200);
cost(); // 这里才最终计算
console.log(count); // 求值并且输出300
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

## No.6 js寄生组合继承如何实现?

核心:对父类原型的复制,所以不包含父类的构造函数,也就不会调用两次父类的构造函数造成浪费;

```js
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
function inheritPrototype(subType, superType) {
    var prototype = object(superType.prototype); // 创建了父类原型的浅拷贝
    prototype.constructor = subType; // 修正原型的构造函数
    subType.prototype = prototype; // 将子类的原型替换为这个原型
}
function SuperType(name) {
    this.name = name;
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function() {
    alert(this.name);
};
function SubType(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function() {
    alert(this.age);
};
```

## No.7 如何实现一个EventBus?

```js
class EventBus {
    constructor() {
        this.eventList = new Map();
    }
    $emit(evName, ...args) {
        let fn = this.eventList.get(evName);
        if(!fn) {
            console.error(`'${evName}' is undefined`);
            return;
        }
        this.eventList.get(evName).apply(this, args);
    }
    $on(evName, fn) {
        // 防止相同事件重复监听
        if(this.eventList.get(evName)) {
            console.error(`duplicated event name : '${evName}'`);
            return;
        }
        this.eventList.set(evName, fn);
        return {
            remove: () => {
                this.eventList.delete(evName); // 提供delete事件
            }
        };
    }
}
var eventBus = new EventBus();
eventBus.$on("receive", function(params) {
    console.log(`${params}`);
});
eventBus.$emit("receive", "test"); // 打印出test
```

## No.8 JS的API设计原则都需要考虑哪些方面?

* 一、接口的流畅性

  1. 简化接口的易用性

  ```js
  function a(selector, color) {
      document.querySelectorAll(selector)[0].style.color = color;
  }
  a("#test", "red");
  ```

  2. 可阅读性

  ```js
  // 相对于上面的a函数,letSomeElementChangeColor语义化更强
  function letSomeElementChangeColor(selector, color) {
      document.querySelectorAll(selector, color);
  }
  ```

  3. 减少记忆成本

  ```js
  // 在意义不做大的变化前提下,缩减函数名称.使得它易读、易记、易用
  function setColor(selector, color) {
      ...
  }
  ```

  4. 可延伸性

  ```js
  // 链式写法,多参处理
  el.color("red").background("blue").fontSize("12px");
  ```

* 二、接口命名的一致性

> 尽量地保持代码风格和命名风格, setColor、setBackground、setFontSize、set....

* 三、参数的处理

  1. 参数的类型

  ```js
  // 判断参数的类型提高程序的稳定性
  function setColor(color) {
      if (typeof color !== "string") {
          return;
      }
  }
  ```

  2. 使用json方式传参

  ```js
  function fn(json) {
      // 为必须的参数设置默认值
      var default = extend({
          param: 'default',
          param1: 'default'
          ...
      },json);
  }
  ```

* 四、可扩展性

  1. 接口职责要保持单一性;
  2. this、apply、call、bind的灵活运用;
  
  ```js
  function sayHello() {
      alert(this.a);
  }
  obj.a = 1;
  sayHello.call||apply(obj); // 1
  ```

* apply、call、bind三者都是用来改变函数的this对象的指向；
* apply、call、bind三者第一个参数都是this要指向的对象，也就是想指定的上下文；
* apply、call、bind三者都可以利用后续参数传参数；
* bind是返回对应函数，便于稍后调用；apply、call则是立即调用；call是把参数按顺序传递进去，apply传入的参数是一个数组。


* 五、对错误的处理

  1. 预见错误:可以用类型检测typeof或者try...catch.
  2. 抛出错误,try...catch(ex) {console.warn(ex);}

* 六、可预见性:尽可能的考虑完善的边界条件,提升接口的健壮性

* 七、注释和文档的可读性

# 参考

### [JavaScript函数柯里化](https://zhuanlan.zhihu.com/p/31271179)
### [移动端touch click事件的理解+点透](https://www.jianshu.com/p/dc3bceb10dbb)
### [preventDefault、stopPropagation、return false之间的区别](https://www.cnblogs.com/dannyxie/p/5642727.html)
### [讲讲PWA](https://segmentfault.com/a/1190000012353473)
