# 第一节 基础问题

## 类型判断

判断JS中数据类型的几种方法: typeof、instanceof、constructor、prototype、比较运算符等;

## No.1 JS基本类型的语法比较

* {} == {} 比较结果为false
* [1] == [1] 比较结果为false
* null == null 比较结果为true
* undefined == null 比较结果为true
* undefined === null 比较结果为false

注: == 表示值相等; === 表示值和类型都要一致;

能力扩展:指针与引用的区别?
指针是一个实体,需要分配内存空间. 引用只是变量的别名,不需要分配内存空间.


## No.2 js中什么类型是引用传递,什么类型是值传递?如何将值类型的变量以引用的方式传递呢?

js中对象类型是引用传递,基本数据类型是值传递.
引用类型包括:object、Array、RegExp、Date、Function等;
基本类型包括:undefined、null、string、number、boolean、symbol

如果要将值类型的变量以引用的方式传递,就需要包装成引用类型,示例代码:

```js
const obj = {x: 1};
function foo(o) {
    o.x = 3;
}
foo(obj);
console.log(obj.x);
```
执行结果obj.x值为3

## No.3 如何编写一个json对象的拷贝函数?

根据深拷贝的启发,不拷贝引用对象,拷贝一个字符串会开辟一个新的存储地址,这样就切断了引用对象的指针联系.示例代码:

```js
const test = {
    a: "xxxx",
    b: "yyyy",
    c: [
        {d: "div", e: "element"},
        {v: "video"}
    ]
};
const test1 = JSON.parse(JSON.stringify(test)); // 先序列化为字符串再反序列化为对象
console.log(test);
console.log(test1);
test.c[0].d="dom"; // 改变test的c属性的对象d属性值
console.log(test); // test的d属性值为dom
console.log(test1); // test1的d属性值保持为div不变
```

## No.4 JS中不同类型以及不同环境下变量的内存都是何时释放?

* 引用类型: 在没有引用之后,通过V8的GC自动回收;
* 值类型:如果处于闭包的情况下,要等闭包没有引用才会被GC回收;
        非闭包的情况下等待v8的新生代(new space)切换的时候回收.
* 浏览器环境:只有当页面关闭时,全局作用域下的变量才会被销毁(保守GC)
* V8引擎:GC策略采用分代GC,新生代使用Scavenge算法进行回收,旧分代使用标记和精简GC.当堆超过阀值,启动GC.

扩展1:下面代码是否会使V8内存爆掉?

```js
let arr = [];
while (true) {
    arr.push(1);
}
```
执行最后的结果:内存爆掉,提示错误allocation failure GC in old space requested

扩展2:数组里面push空元素结果是什么?

```js
let arr = [];
while (true) {
    arr.push();
}
```
执行最后的结果:while(true)一直死循环下去,空元素不占用内存空间

扩展3:如果push的是Buffer情况结果会如何?

```js
let arr = [];
while (true) {
    arr.push(new Buffer(1000));
}
```
执行结果:最后系统的内存爆掉,因为Buffer申请的是堆外的内存空间

扩展4:闭包引发的内存泄露,问题示例代码:

```js
function out() {
    const bigData = new Buffer(100);
    inner = function() {
        void bigData;
    }
}
```
这个示例inner直接挂载在了root上,从而导致内存泄露(因为bigData不会释放)

进阶扩展: 所有JS对象都是通过V8堆来分配的,存活时间较短的对象放在新生代,存活时间较长的对象放在老生代.内存回收策略上,新生代使用Scavenge算法进行回收,该算法实现中主要采用cheney算法.老生代使用标记-清除(Mark-Sweep)和标记-紧缩(Mark-Compact)来回收内存.

## No.5 AMD、CMD、UMD、CommonJS四者的区别?

AMD是RequireJS推出的,是异步加载模块,也就是提前执行依赖;
CMD是seajs推崇的规范,依赖就近,用的时候再require;
CommonJS加载的模块是同步的,它推崇一个单独文件就是一个模块;
UMD是AMD+CommonJS的组合,解决跨平台;

## No.6 JS作用域是什么?

所谓作用域是指代码在运行时,各个变量、对象、函数的可访问性,作用域决定了你的代码在区域的可见性
大多数语言里面都是块作用域,以{}进行限定,而js却是函数作用域,就是一个变量在全函数里有效,比如有个变量p1在函数最后一行定义,第一行也有效,但是值是undefined.

变量提升示例:

```js
var globalVar = 'global var';
function test() {
    alert(globalVar); // undefined 因为globalVar在本函数内被重定义里,导致全局失效,这里使用函数内的变量值,可是此时还没定义
    var globalVar = "overrided var"; // globalVar在本函数内被重定义
    alert(globalVar); // overrided var
}
alert(globalVar); // global var 使用全局变量
```


## No.7 常用js类定义的方法有哪些?

主要有构造函数原型和对象创建两种方法.原型法是通用的老方法,对象创建是ES5推荐使用的方法,目前来看,原型法更普遍.
* 使用构造函数原型定义类的代码实现:

```js
function Person() {
    this.name = "xxx";
}
Person.prototype.sayName = function() {
    alert(this.name);
};
const person = new Person();
person.sayName();
```

* 对象创建的方式定义类的示例代码:

```js
const Person = {
    name: "xxx",
    sayName: function() {
        alert(this.name);
    }
};
const person = Object.create(Person);
person.sayName();
```

## No.8 js类继承的方法有哪些?

主要包括:原型链法、属性复制法和构造器应用法.另外,由于每个对象可以是一个类,这些方法也可以用于对象类的继承.

* 第一种:原型链法

```js
function Animal() {
    this.name = 'animal';
}
Animal.prototype.sayName = function() {
    alert(this.name);
};
function Person() {}
Person.prototype = Animal.prototype; // Person继承自Animal
Person.prototype.constructor = 'Person'; // 更新构造函数为Person
```

* 属性复制法

```js
function Animal() {
    this.name = 'animal';
}
Animal.prototype.sayName = function() {
    alert(this.name);
};
function Person() {}
// 复制Animal的所有属性到Person
for (var prop in Animal.prototype) {
    Person.prototype[prop] = Animal.prototype[prop];
}
Person.prototype.constructor = 'Person'; // 更新构造函数为Person
```

* 构造器应用法

```js
function Animal() {
    this.name = "animal";
}
Animal.prototype.sayName = function() {
    alert(this.name);
};
function Person() {
    Animal.call(this); // apply, call, bind方法都可以,只是有细微区别
}
```

## No.9 js多重继承的实现方法是怎么样的?

就是类继承里面的属性复制法来实现,因为当所有父类的prototype属性被复制后,子类自然拥有类似行为和属性.

## No.10 js里面的this指的是什么?

this指的是对象本身,而不是构造函数.

```js
function Person() {}
Person.prototype.sayName = function() {
    alert(this.name);
}
var person1 = new Person();
person1.name = "xxx";
person1.sayName(); // xxx
```

## No.11 caller、callee和arguments分别是什么?

caller,callee之间的关系就像是employer和employee之间的关系,就是调用与被调用的关系,二者返回的都是函数对象引用,arguments是函数的所有参数列表,它是一个类数组的变量.

```js
function parent(param1, param2, param3) {
    child(param1, param2, param3);
}
function child() {
    console.log(arguments); // {"0": "xxx", "1": "yyy", "2": "zzz"}
    console.log(arguments.callee); // [Function: child]
    console.log(child.caller); // [Function: parent]
}
parent("xxx", "yyy", "zzz");
```

## No.12 arguments有哪些方法可以转成类数组?

* 第一种: Array.prototype.slice.call(arguments)
* 第二种: [].slice.call(arguments)
* 第三种: 使用ES5 Array.from(arguments)
* 第四种: 使用ES6扩展运算符, [...arguments]

## No.13 什么是闭包,闭包有哪些用处?

闭包就是作用域的范围,因为js是函数作用域,所以函数就是闭包,全局函数的作用域范围就是全局,无须讨论,更多的应用其实是在内嵌函数,这就会涉及到内嵌作用域,或者叫作用域链.说到内嵌,其实就是父子引用关系(父函数包含子函数,子函数因为函数作用域又引用父函数),如果引用不结束,就会一直占用内存,引起内存泄露.

通常闭包的使用场景是实现数据的私有化
es6的class可以将class内部的方法移到外部去定义,达到私有的目的

```js
class Widget {
    foo(baz) {
        bar.call(this, baz);
    }
}
function bar(baz) {
    return this.snaf = baz;
}
```

es6的symbol可以实现私有属性,就是利用symbol类型的属性不能通过点操作符访问的特性.
示例代码:

```js
var Person = (function() {
    var nameSymbol = Symbol('name');
    function Person(name) {
        this[nameSymbol] = name;
    }
    Person.prototype.getName = function() {
        return this[nameSymbol];
    };
    return Person;
})();
var p = new Person('xxx');
console.log(Object.getOwnPropertyNames(p));
```

## No.14 如何实现防抖和节流呢?

防抖实现思路:将目标方法包装在setTimeout里面,然后这个方法是一个事件回调函数,如果这个回调一直执行,那么这些动作就一直不执行.
示例代码:

```js
function debounce(func, delay) {
    var timeout;
    return function(e) {
        clearTimeout(timeout); // 这里就是保证回调一直执行,setTimeout里面的就不执行
        var context = this.args = arguments;
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, delay); // 等到用户不在触发debounce,那么setTimeout就自然执行里面的方法
    }
}
```

节流实现思路:控制单位时间内执行的次数,每次需要保存上次执行的时间点与定时器.
```js
function throttle(fn, threshhold) {
    var timeout;
    var start = new Date; // 事件触发时间点
    var threshhold = threshhold || 160; // 控制单位时间
    return function() {
        var context = this.args = arguments;
        var curr = new Date() - 0; // 时间触发结束点
        clearTimeout(timeout); // 总是干掉事件回调
        if (curr - start >= threshhold) {
            fn.apply(context, argus); // 只执行一部分方法,这些方法是在某个时间段内执行一次.
            start = curr; // 以当次结束点作为下次的开始点
        } else {
            timeout = setTimeout(function() {
                fn.apply(context, args);
            }, threshold);
        }
    }
}
```

## No.15 JS深拷贝与浅拷贝分别如何实现?

深拷贝和浅拷贝只针对像Object、Array这样的复杂对象的.浅拷贝只拷贝一层对象的属性,而深拷贝则递归拷贝了所有层级.

* 浅拷贝示例代码:

```js
var obj = {a: 1, arr: [2, 3]};
var shallowObj = shallowCopy(obj);
function shallowCopy(src) {
    var dst = {};
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) {
            dst[prop] = src[prop];
        }
    }
    return dst;
}
shallowObj.arr[1] = 5;
obj.arr[1] // 5 因为浅拷贝会导致obj.arr和shallowObj.arr指向同一块内存地址
```

* 深拷贝示例代码:
```js
var obj = {a: 1, arr: [2, 3]};
Object.cloneObj=function (targetObj,sourceObj) {
    var names=Object.getOwnPropertyNames(sourceObj);
    for(var i=0;i<names.length;i++){
        var desc=Object.getOwnPropertyDescriptor(sourceObj,names[i]);
        if(typeof(desc.value)==="object" && desc.value){
            var obj={};
            Object.defineProperty(targetObj,names[i],{
                enumerable:desc.enumerable,
                configurable:desc.configurable,
                writable:desc.writable,
                value:obj
            });
            Object.cloneObj(desc.value,obj);
        }else{
            Object.defineProperty(targetObj,names[i],desc);
        }
    }
    return targetObj;
};
var deepObj = Object.cloneObj({}, obj);
deepObj.arr[1] = 5;
obj.arr[1] // 3,递归复制到新对象,所以修改目标对象的值不影响原对象的值
```

## No.16 js字符串相关的常用方法有哪些?

indexOf/lastIndexOf/charAt, split/match/test, slice/substring/substr, toLowerCase/toUpperCase.

## No.17 链式调用

思路:利用类的原型方法返回实例对象,也可以使用静态方法实现.

* 原型方法实现:
```js
function Person() {
}
Person.prototype.setName = function(name) {
    this.name = name;
    return this;
};
Person.prototype.getName = function() {
    return this.name;
};
var pp = new Person();
console.log(pp.setName("xxx").getName());
```

* 静态方法实现

```js
function Person(name) {
    var _name = name;
    this.setName = function(name) {
        _name = name;
        return this;
    };
    this.getName = function(callback) {
        callback.call(this, _name);
        return this;
    };
}
var pp = new Person('yyy');
pp.getName(console.log).setName("zzz").getName(console.log);
```

# 参考

### [函数防抖与节流](https://mp.weixin.qq.com/s/xMCna_VtoOev0K5uK1J0aQ)
### [javascript中的深拷贝和浅拷贝](https://www.zhihu.com/question/23031215)


