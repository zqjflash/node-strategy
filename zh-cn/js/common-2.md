# 第二节 ES6有哪些新特性

* 基本类型的扩展：
 * 数值扩展：多进制表示、是否有穷、是不是NaN、是不是整数、数字的上限和下限、是否是安全数、返回小数的整数部分、判断数字是正数、负数、0；立方根的计算、三角方法、对数方法。
 * 函数扩展：参数默认值、rest参数、扩展运算符（...arg）、箭头函数、this绑定、尾调用
 * 箭头函数：
* Proxy:
 * 拦截和监视外部对象的访问；最常见的就是get(读取)、set(修改)对象属性、has、deleteProperty、getOwnPropertyDescriptor、defineProperty、apply、construct、getPrototypeOf、setPrototypeOf、isExtensible、preventExtensions、ownKeys
 * 降低函数或类的复杂度；
 * 在复杂操作前对操作进行校验或对所需资源进行管理；如在set方法里增加类型的判断
* Reflect:
* Promise:
* class:
* 生成器函数：
* async/await：

## No.1 const定义的Array中的元素能否被修改?如果可以,那const修饰对象的意义是?

其中的值可以被修改,const只是定义了变量在内存中占用的地址不能修改,而Array中的元素存在于堆上.
意义上,主要是保护引用不被修改(比如用Map等接口对引用的变化很敏感,使用const保护引用始终如一是有意义的),也适合用在immutable的场景.

## No.2 箭头函数与function函数的区别?

* 箭头函数用箭头操作符来定义函数,是一个块函数作用域;
* 箭头函数体内的this对象,就是定义时所在的对象,而不是使用时所在的对象;
* 箭头函数不可以当作构造函数,也就是说,不可以使用new命令,否则会抛出一个错误;
* function函数的this指向运行时所在的作用域.

js中this指向调用的对象，函数定义时是不能确定的，函数调用的时候默认指向window，因为所有的全局变量最后都会变成window对象的属性。

ES6中this指向
箭头函数中this的指向就是定义时所在的作用域，也就是说箭头函数本身没有this，内部的this就是外层代码作用域中的this。

## No.3 let与var、const的区别?

* let:变量只能声明一次,还有一个好处就是当我们写代码比较多的时候可以避免在不知道的情况下重复声明变量.只会在对应的代码块内有效;适用场景:for循环的计数器;
* var:变量可以多次声明.存在变量提升;
* const:定义只读的常量,一旦声明,常量的值就不能改变,只声明不赋值就会报错.

## No.4 ES6对象的扩展有哪些?

1. assign方法有什么作用?

定义: 用于对象的合并,将源对象的所有可枚举属性复制到目标对象.
第一个参数是目标对象,如果目标对象与源对象有同名属性,则后面的属性覆盖前面的属性.
属性名为Symbol值的,也会被assign进来.
示例代码:

```js
const target = {a: 1, b: 1};
const source1 = {b: 2, c: 2};
const source2 = {c: 3, [Symbol('c')]: 'd'};
Object.assign(target, source1, source2); // {a: 1, b: 2, c: 3, Symbol(c): "d"}
```

2. defineProperty, hasOwnProperty, propertyIsEnumerable都是什么用的?

* Object.defineProperty(obj, prop, descriptor); 用来给对象定义属性,三个参数:

  * obj:必需,要在其上添加或修改属性的对象.这可能是一个本机JavaScript对象或DOM对象或内置对象;
  * prop:必需,一个包含属性的名称的字符串;
  * 其中descriptor包含对属性的设置,主要有value、writable, configurable, enumerable, set/get等.

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

* map: 让数组通过某种计算产生一个新数组
```js
var array1 = [1, 4, 9, 16];
const map1 = array1.map((x) => x * 2);
console.log(map1); // [2, 8, 18, 32]
```

* reduce: 让数组中的前项和后项做某种计算，并累积最终值
```js
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
console.log(array1.reduce(reducer)); // 1 + 2 + 3 + 4
```

* forEach:让数组中的每一项做一件事，没有返回值

```js
const array1 = ['a', 'b', 'c'];
array1.forEach((element) => {
    console.log(element);
});
```

* filter: 筛选出数组中符合条件的项，组成新数组
```js
const words = ['spray', 'limit' ,'elite', 'exuberant', 'destruction', 'present'];
const result = words.filter(word => word.length > 6);
console.log(result);
```

* every：检测数组中的每一项是否符合条件；全部符合才为true

```js
const result = arr.every((item, index) => {
    return item > 0;
})
```

* some：检测数组中是否有某些项符合条件，只要满足一个即为true

```js
const result = arr.some((item, index) => {
    return item > 1;
})
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

## No.12 JS实现异步的方式

* callback：回调函数是异步操作最基本的方法。
```js
ajax(url, () => {
    // 处理逻辑
})
```
* 发布订阅模式：publish/subscribe
```js
subscribe('done', f2);
publish('done');
```
* 生成器函数generator：
迭代器对象必须通过调用next()方法执行函数的第一个yield函数处，根据返回值的done属性决定是否继续迭代器是否迭代完毕；
generator构造的函数是一个状态机,封装了多个内部状态
示例:
```js
function* a() {
  yield 'hello harden';
  yield 'hello world'
}
let g = a(); // -->迭代器对象
g.next(); // --> {value: 'hello harden', done: false}
g.next(); // --> {value: 'hello world', done: true}
```
* Promise：最基础的使用方法解决了回调的层层嵌套的问题；
* async返回的是promise对象。generator需要手动调用next方法获取值，而async函数自动开启迭代，使得异步过程的写法和同步过程写法保持一致，co和thunk模块可以自动开启生成器的迭代。

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

## No.14 ES6模块与CommonJS模块的差异

1. CommonJS模块输出的是一个值的拷贝,ES6模块输出的是一个值的引用;
2. CommonJS模块是运行时加载,ES6模块是编译时输出接口;
3. ES6输入的模块变量,只是一个符号链接,所以这个变量是只读的,对它进行重新赋值就会报错.

## No.15 Object.keys()和Object.getOwnPropertyNames()的区别是什么?

* Object.keys()用于获取对象自身所有的可枚举的属性值,但不包括原型中的属性,然后返回一个由属性名组成的数组.

```js
// 遍历对象
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.demo = function() {}; // 原型属性
var person = new Person('zqjflash', 30);
// 不可枚举的方法
Object.defineProperty(person, "methodA", {
    enumerable: false,
    value: function() {}
});
Object.keys(person); // ["name", "age"]
```

* Object.getOwnPropertyNames()返回对象的所有自身属性的属性名(包括不可枚举的属性)组成的数组,但不会获取原型链上的属性.

```js
// 遍历对象
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.demo = function() {}; // 原型属性
var person = new Person('zqjflash', 30);
// 不可枚举的方法
Object.defineProperty(person, "methodA", {
    enumerable: false,
    value: function() {}
});
Object.getOwnPropertyNames(person); // ["name", "age", "methodA"]
```

## No.16 为什么修饰器不能用于函数?

修饰器是一个对类进行处理的函数,修饰器函数的第一个参数就是所要修饰的目标类.
修饰器只能用于类和类的方法,不能用于函数,因为存在函数提升.
如果一定要修饰函数,可以采用高阶函数的形式直接执行.

类的修饰代码示例:

```js
@testable
class MyTestableClass {
    // ...
}
function testable(target) {
    target.isTestable = true;
}
MyTestableClass.isTestable // true
```

## No.17 Proxy是什么?用于什么场景?

Proxy用于修改某些操作的默认行为,等同于在语言层面作出修改,属于一种“元编程”.
主要是在目标对象之前架设一层“拦截”, 外界对该对象的访问,都必须先通过这层拦截.因此提供了一种机制,可以对外界的访问进行过滤和改写.

```js
let obj = new Proxy({}, {
    get: function(target, key, receiver) {
        console.log(`getting ${key}!`);
        return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
        console.log(`setting ${key}!`);
        return Reflect.set(target, key, value, receiver);
    }
});
obj.count = 1; // setting count!
++obj.count; // getting count! setting count!
```

## No.18 Reflect对象的作用是什么?

* 将Object对象的一些明显属于语言内部的方法(比如Object.defineProperty)放到Reflect对象上;

* 修改某些Object方法的返回结果,让其变得更加合理.

```js
// 旧的写法
try {
    Object.defineProperty(target, property, attributes);
    // 成功的处理
} catch (e) {
    // 失败的处理
}

// 新的写法
if (Reflect.defineProperty(target, property, attributes)) {
    // 成功的处理
} else {
    // 失败的处理
}
```

## No.19 ArrayBuffer的作用是什么?

由三类对象组成.

1. ArrayBufer对象: 代表内存之中的一段二进制数据,可以通过"视图"进行操作;
2. TypedArray视图: 用来读写简单类型的二进制数据;
3. DataView视图: 用来读写复杂类型的二进制数据.

```js
const buffer = new ArrayBuffer(12);
const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0] = 2;

x1[0] // 2
```

## No.20 getOwnPropertyDescriptor作用是什么?

该方法会返回某个对象属性的描述对象(descriptor). ES7引入getOwnPropertyDescriptors方法,返回指定对象所有自身属性(非继承属性)的描述对象.

```js
const obj = {
    foo: 123,
    get bar() {return 'abc'}
};
Object.getOwnPropertyDescriptor(obj, 'bar');

// configurable: true
// enumerable: true
// get: ƒ bar()
// set: undefined
// __proto__: Object
```

# 参考

### [ECMAScript 6入门 阮一峰](http://es6.ruanyifeng.com/)
