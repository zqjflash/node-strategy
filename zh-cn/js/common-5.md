# 第五节 ES2019

## 可选择的catch绑定

> 在Node 10+支持

举个栗子，我们在写代码的时候经常会出现判断一个字符串是否是json，如果是json那么就 JSON.parse 一下，如果不是就不做处理，于是就有下面这种代码：

```js
let parseResult = someString;
try {
  parseResult = JSON.parse(parseResult);
} catch (unused) {

}
```

通过这个特性引入的语法可以允许省略 catch 绑定的入参和其周围的圆括号，例如：

```js
let parseResult = someString;
try {
  parseResult = JSON.parse(parseResult);
} catch { }
```

## Symbol 对象的描述字符串

> 在Node 11+支持

我们大概指定每个从 Symbol() 返回的 symbol 值都是唯一的，而且这个值也可以作为对象属性的标识符。
通常声明了一个 Symbol 对象，那么调用它的 toString 返回的是一个包裹了 Symbol 的字符串，例如：

```js
Symbol(123).toString();
// "Symbol(123)"
```

而且 Symbol 的原始值不能转换为字符串，必须先调用 toString 方法后再当做字符串使用：

```js
Symbol(123)+ "test";
// TypeError: Cannot convert a Symbol value to a string

Symbol(123).toString() + "test";
// "Symbol(123)test"
```

而新的特性可以通过调用Symbol的description属性来获取描述字符串，而且没有Symbol字符串包裹：

```js
Symbol(123).description
// "123"
Symbol(123) === Symbol(123)
// false
Symbol(123).description === Symbol(123).description
// true
Symbol(123).description + "test";
// "123test"
```

## Object.fromEntries

> Node 12+

通过 Object.fromEntries 可以把键值对列表转换为一个对象。

```js
const obj = Object.fromEntries([
    ["name", "test"],
    ["value", "testValue"]
]);
// Object { name: "test", value: "testValue" }
```

## 字符串空白符去除

> Node 10+

### 移除开头，左端的空格

```js
const str = "   Node 地下铁!   ";
str.trimStart();
str.trimLeft(); // 在之前 Node 版本就支持
// "Node 地下铁!   ";
```

### 移除结束，右端的空格

```js
const str = "   Node 地下铁!   ";
str.trimEnd();
str.trimRight(); // 在之前 Node 版本就支持
// "   Node 地下铁!";
```

## 数组拍平

> Node 11+

flat方法将数组所有元素与基于可配置的深度层级（默认为1）进行遍历到的子数组中的元素合并为一个新数组返回。

```js
const arr = ["N", ["o","d"], "e", ["地", "下"], "铁"];
arr.flat(); 
// ["N", "o", "d", "e", "地", "下", "铁"]

const arr2 = ["N", ["o",["d", ["e", ["地", ["下", ["铁"]]]]]]];
arr2.flat(6); 
// ["N", "o", "d", "e", "地", "下", "铁"]
```

flatMap方法可以传入一个用来处理每一个数据的方法，并且将所有的返回值进行拍平，但是只会拍平1层：

```js
const arr = ["Node", "", "地下铁"]

arr.map(s => s.split(""));
// [["N", "o", "d", "e"],[ ],["地", "下", "铁"]]

arr.flatMap(s => s.split(""));
// ["N", "o", "d", "e", "地", "下", "铁"]
```

## 更规范的JSON

> Node 12+

在JSON RFC第8.1节中要求使用 UTF-8 编码在各个生态闭环中进行数据交换，但是在之前的JSON中对于UTF8之外的字符能够进行识别返回，那么就导致了：

```js
JSON.stringify('𝌆') === JSON.stringify('\uD834\uDF06')
```

而所预期的 \uD834\uDF06 通过JSON序列化后应该是 \\uD834\\uDF06
