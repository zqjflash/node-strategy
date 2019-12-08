# 第五节 TypeScript

### TypeScript的好处是什么？

TS有标准的静态类型定义，好处如下：
* 杜绝手误导致的变量名写错；
* 自动完成：不需要记哪个变量有哪些属性，也不需要记完整的变量名。
* 重构支持；
* 类型可以一定程度上充当文档。

### TypeScript的不足

* 类型标注麻烦；
* 现阶段大部分静态类型语言的类型系统还不够强；
* eval和new Function()这种操作类型系统管不到；
* 需要编译，类型检查会增加编译时长，语法和类型系统复杂的化时间特别长，比如scala。


### void和undefined有什么区别？

void是JS中的一个运算符，在JS中判断是否是undefined，一般都这样写：

```js
function isUndefined(input) {
  return input === void 0;
}
```

undefined是术语、类型、值、属性，undefined可能会被重写。

### 什么是 never 类型？

never类型是TypeScript中的底层类型，可以赋值给任何类型，never可以是永远不返回的函数的返回值类型, 也可以是变量在类型收窄中不可能为真的类型.

### 下面代码会不会报错？怎么解决？

```js
const obj = {
  a: 1,
  b: 'string',
};
obj.c = null;
```

### readonly和const有什么区别？

最简单判断该用readonly还是const的方法是看要把它作为变量使用还是作为一个属性。作为变量使用const，作为属性使用readonly。

具体区别如下：
* const是一个编译期常量，readonly是一个运行时常量；
* const只能声明基元类型，枚举类型，字符串类型。readonly则无限制；
* const天生为静态数据，无需再添加static标识；
* readonly是运行时变量，只能赋值一次。特例是可以定义时赋值一次，构造函数中再赋值一次。
