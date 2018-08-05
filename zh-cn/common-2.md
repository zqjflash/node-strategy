# 第二节 ES6有哪些新特性

## No.1 const定义的Array中的元素能否被修改?如果可以,那const修饰对象的意义是?

其中的值可以被修改,const只是定义了变量在内存中占用的地址不能修改,而Array中的元素存在于堆上.
意义上,主要是保护引用不被修改(比如用Map等接口对引用的变化很敏感,使用const保护引用始终如一是有意义的),也适合用在immutable的场景.

## No.2 箭头函数与function函数的区别?

* 箭头函数用箭头操作符来定义函数,是一个块函数作用域;
* 箭头函数体内的this对象,就是定义时所在的对象,而不是使用时所在的对象;
* 箭头函数不可以当作构造函数,也就是说,不可以使用new命令,否则会抛出一个错误;

* function函数的this指向运行时所在的作用域.

## No.3 let与var、const的区别?

let:变量只能声明一次,还有一个好处就是当我们写代码比较多的时候可以避免在不知道的情况下重复声明变量.只会在对应的代码块内有效;适用场景:for循环的计数器
var:变量可以多次声明.存在变量提升
const:定义只读的常量,一旦声明,常量的值就不能改变,只声明不赋值就会报错.

## No.4 defineProperty, hasOwnProperty, propertyIsEnumerable都是什么用的?

* Object.defineProperty(obj, prop, descriptor); 用来给对象定义属性,三个参数:

obj:必需,要在其上添加或修改属性的对象.这可能是一个本机JavaScript对象或DOM对象或内置对象;
prop:必需,一个包含属性的名称的字符串;
其中descriptor包含对属性的设置,主要有value、writable, configurable, enumerable, set/get等.

示例代码:
```js
const someOne = {};
Object.defineProperty(someOne, "name", {
    value: "xxx",
    writable: false // 设定了writable属性为false,导致这个不可修改
});
console.log(someOne.name); // xxx
someOne.name = "yyy";
console.log(someOne.name); // xxx
```

* hasOwnProperty用于检查某一属性是不是存在对象本身,继承来的父对象属性不算;
* propertyIsEnumerable用来检测某一属性是否可遍历,也就是能不能用for...in循环来取到.

## No.5 ES6数组的新方法(map/reduce, forEach, filter)

* map:创建一个新数组,其结果是该数组中的每个元素都调用一个提供的函数后返回的结果
```js
var array1 = [1, 4, 9, 16];
const map1 = array1.map((x) => x * 2);
console.log(map1); // [2, 8, 18, 32]
```

* reduce:累加器和数组中的每个元素(从左到右)应用一个函数,将其减少为单个值.
```js
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
console.log(array1.reduce(reducer)); // 1 + 2 + 3 + 4
```

* forEach:对数组的每个元素执行一次提供的函数

```js
const array1 = ['a', 'b', 'c'];
array1.forEach((element) => {
    console.log(element);
});
```

* filter:创建一个新数组,其包含通过所提供函数过滤条件之后的结果元素
```js
const words = ['spray', 'limit' ,'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(word => word.length > 6);
console.log(result);
```

## No.6 如何用ES6实现一个js类?

```js
// 定义类
class Point {
    constructor(x, y) {
        //
    }
}
// 类的继承使用extends
class ColorPoint extends Point {

}
```

## No.7 模块化用什么表示?

模块功能主要由两个命令构成:export和import
export命令:用于规定模块的对外接口;
import命令:用于输入其他模块提供的功能;

## No.8 字符串模板如何实现?

使用反引号`标识,内部嵌入变量是${变量名}`

示例:
```js
let name = "Bob";
let time = "today";
let str = `Hello ${name}, how are you ${time}?`; // "Hello Bob, how are you today?"
```

## No.9 解构的作用是什么?

从数组或对象中提取值,对变量进行赋值.
示例:
let [a, b, c] = [1, 2, 3];

## No.10 扩展参数有哪些?

扩展参数也叫扩展运算符:三个点...
如果是一个数组,会转为用逗号分隔的参数序列.

示例代码:
```js
var middle = [3, 4];
var arr = [1, 2, ...middle, 5, 6];
console.log(arr);
```

## No.11 for...of的作用是什么?

不仅可以遍历数组或对象的值,也可以遍历Map和Set对象.

```js
let iterable = [10, 20, 30];
for (let value of iterable) {
    console.log(value);
}

let map = new Map([["a", 1], ["b", 2], ["c", 3]]);
for (let [key, value] of map) {
    console.log(value);
}

```

## No.12 generator有什么作用?

generator构造的函数是一个状态机,封装了多个内部状态
示例:
```js
function* a() {
    yield "hello";
}
a();
```

## No.13 Map/Set的作用

Map类似Object对象,不同的地方,在于Map的键可以是复杂结构,而Object只能是字符串结构.
Set:类似于数组,但成员的值都是唯一的,没有重复的值;

```js
const s = new Set();
[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));
for (let i of s) {
    console.log(i);
}
```

# 参考

### [ECMAScript 6入门 阮一峰](http://es6.ruanyifeng.com/)
