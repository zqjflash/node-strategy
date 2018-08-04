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

所谓作用域是指代码在运行时,各个变量、对象、函数的可访问性,作用域决定了你的代码在区域的可见性,.在js中时没有块级作用域,只有函数作用域.

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
