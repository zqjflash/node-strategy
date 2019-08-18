# 第五节 TypeScript

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

const效率高，但readonly更灵活。

具体区别如下：
* const是一个编译期常量，readonly是一个运行时常量；
* const只能声明基元类型，枚举类型，字符串类型。readonly则无限制；
* const天生为静态数据，无需再添加static标识；
* readonly是运行时变量，只能赋值一次。特例是可以定义时赋值一次，构造函数中再赋值一次。
