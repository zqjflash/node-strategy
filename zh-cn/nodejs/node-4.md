# 第四节 util模块

## No.1 HTTP 如何通过 GET 方法(URL)传递 let arr = [1, 2, 3, 4]给服务器?

* 客户端地址栏输入这样的格式: https://your.host/api/?arr[0]=1&arr[1]=2&arr[2]=3&arr[3]=4

* 服务端Node.js可以使用qs库解析url传过来的数组格式参数, qs库是querystring的增强版本,最重要的特性就是支持内嵌对象和数组.

```js
const qs = request("qs");
let str = qs.stringify({arr});
let str2 = decodeURI(str);
console.log(qs.parse((str2));
```

## No.2 util.inherits继承是如何实现的?

本质上是使用ES6的setPrototype的方法,让子类构造函数的原型对象指向父类构造函数的原型对象
查看一下lib/util.js源码:

util.inherits经历过ES5到ES6继承的过渡:

* ES5继承实现:

```js
exports.inherits = function(ctor, superCtor) {
    // 一些参数的合法性判断...
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};
```

* ES6继承实现:
```js
exports.inherits = function(ctor, superCtor) {
    ...
    ctor.super_ = superCtor; // 将父类的构造函数赋值给子类的ctor.super_,在使用中可以通过该属性方便调用到父类的构造函数.
    Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
}
```

ES6继承与ES5继承的对比:

* 相同点:本质上ES6的继承是ES5继承到语法糖;
* 不同点:
  * ES6继承中子类到构造函数到原型链指向父类到构造函数,ES5中使用到是构造函数复制,没有原型链指向;
  * ES6子类实例的构建,基于父类实例,ES5中不是.

## No.3 如何递归获取某个文件夹下所有的文件名?

* 方式一:使用fs和path模块来处理

```js
const fs = require('fs');
const path = require('path');
function traversal(dir) {
    let res = [];
    for (let item of fs.readdirSync(dir)) {
        let filepath = path.join(dir, item);
        try {
            let fd = fs.openSync(filepath, 'r');
            let flag = fs.fstatSync(fd).isDirectory();
            fs.close(fd);
            if (flag) {
                res.push(...travelsal(filepath));
            } else {
                res.push(filepath);
            }
        } catch (err) {
            if (err.code === 'ENOENT' && !!fs.readlinkSync(filepath)) {
                res.push(filepath);
            } else {
                console.error('err', err);
            }
        }
    }
    return res.map((file) => path.basename(file));
}
console.log(traversal('.'));

```

* 方式二: 使用glob模块实现,相对就简便很多

```js
const glob = require("glob");
glob("**/*.js", (err, files) => {
    if (err) {
        throw new Error(err);
    }
    files.map((filename) => {
        console.log('Here you are:', filename);
    });
});
```



