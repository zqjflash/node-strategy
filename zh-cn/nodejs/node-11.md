# 第十一节 高阶用法

## No.1 Node.js数据流向C++如何流向JavaScript?

下面以一个demo来演示C++如何流向JavaScript的基本类型.

```js
#include <node.h>
#include <v8.h>

using namespace v8;
void MyFunction(const v8::FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    args.GetReturnValue().Set(String::NewFromUtf8(isolate, "Hello World!"));
}
void Test(const v8::FunctionCallbackInfo<v8::Value>& args) {
    Isolate* isolate = args.GetIsolate();
    // Number类型的声明并赋值
    Local<Number> retval = v8::Number::New(isolate, 1000);
    // 返回给JavaScript调用时的返回值
    args.GetReturnValue().Set(obj);
}
void init(Local <Object> exports, Local<Object> module) {
    NODE_SET_METHOD(exports, "getTestValue", Test); // 定义getTestValue关联Test
}
NODE_MODULE(returnValue, init); // 将returnValue模块对外暴露,并且returnValue指向init方法
```

所有的addon都需要一个初始化的函数,如下面的代码:

```js
void Initialize(Local<Object> exports);
NODE_MODULE(module_name, Initialize);
```

Initialize是初始化的函数,module_name是编译后产生的二进制文件名,上述代码的模块名为returnValue.

上述代码通过node-gyp编译之后,可以通过下面方式调用:

创建一个test.js

```js
// returnValue.node 这个文件就是编译后产生的文件,通过NODE_MODULE(returnValue, init)
const returnValue = require("./build/Release/returnValue.node");
console.log(returnValue.getTestValue());
```

```js
$ node test.js
{
    arg1: 1000
}
```

## No.2 Node.js数据流向JavaScript如何流向C++?

与上面例子相反,下面demo展示C++调用JavaScript

```js
#include <node.h>
#include <v8.h>
#include <iostream>

using namespace v8;
using namespace std;

void GetArgument(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    // 参数长度判断
    if (args.length() < 2) {
        isolate->ThrowException(Exception::TypeErro(String::NewFromUtf8(isolate, "Wrong number of arguments")));
        return;
    }

    // 参数类型判断
    if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
        // 抛出错误
        isolate->ThrowException(Exception::TypeError(String::NewFromUtf8(isolate, "arguments must be number")));
    }

    // js Number 类型转换成v8 Number类型
    Local<Number> value1 = Local<Number>::Cast(args[0]);
    Local<Number> value2 = Local<Number>::Cast(args[1]);
    double value = value1->NumberValue() + value2->NumberValue();

    args.GetReturnValue().Set(value);
}

void Init(Local <Object> exports, Local <Object> module) {
    NODE_SET_METHOD(module, "exports", GetArgument);
}
NODE_MODULE(arguments, Init);
```

通过node-gyp编译后,可以通过如下的方式调用.

```js
const getArguments = require("./build/Release/arguments");
console.log(getArguments(2, 3));
```

```js
$ node test.js
5
```

注:由于Node.js不同的版本V8相关的API还没完全稳定,会出现方法不同,这是可以用NAN来帮我们做封装,在编译的时候就不需要关心版本问题,只需要引入相应的头文件即可.

引入头文件后,可以如下使用方式:

```js
v8::Local<v8::Primitive> Nan::Undefined()
v8::Local<v8::Primitive> Nan::Null
```

# 参考

## [Node.js 和 C++ 之间的类型转换](http://taobaofed.org/blog/2016/09/20/type-casts-between-node-and-cpp/)