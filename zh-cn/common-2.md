# 第二节 ES6有哪些新特性

## No.1 const定义的Array中的元素能否被修改?如果可以,那const修饰对象的意义是?

其中的值可以被修改,const只是定义了变量在内存中占用的地址不能修改,而Array中的元素存在于堆上.
意义上,主要是保护引用不被修改(比如用Map等接口对引用的变化很敏感,使用const保护引用始终如一是有意义的),也适合用在immutable的场景.

## No.2 箭头函数与function函数的区别?

* 箭头函数体内的this对象,就是定义时所在的对象,而不是使用时所在的对象;
* 箭头函数不可以当作构造函数,也就是说,不可以使用new命令,否则会抛出一个错误;

* function函数的this指向运行时所在的作用域.

## No.3 let与var的区别?

let:变量只能声明一次,还有一个好处就是当我们写代码比较多的时候可以避免在不知道的情况下重复声明变量.
var:变量可以多次声明.

## No.4 defineProperty, hasOwnProperty, propertyIsEnumerable都是什么用的?

* Object.defineProperty(obj, prop, descriptor); 用来给对象定义属性,其中descriptor包含对属性的设置,主要有value、writable, configurable, enumerable, set/get等.
* hasOwnProperty用于检查某一属性是不是存在对象本身,继承来的父对象属性不算;
* propertyIsEnumerable用来检测某一属性是否可遍历,也就是能不能用for...in循环来取到.

# 参考

### [ECMAScript 6入门 阮一峰](http://es6.ruanyifeng.com/)
