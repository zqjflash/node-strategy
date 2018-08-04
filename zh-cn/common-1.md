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



