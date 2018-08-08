const util = require("util");
const EventEmitter = require("events").EventEmitter;
function MyEmitter() {
    EventEmitter.call(this); // 定义一个类并实现call调用;
}
util.inherits(MyEmitter, EventEmitter); // 继承EventEmitter;
const emitter3 = new MyEmitter();
emitter3.on("newListener", function(name, listener) {
    console.log("新事件的名字:", name);
    console.log("新事件的代码:", listener);
    setTimeout(function() {
        console.log("我是自定义延时处理机制");
    }, 1000);
});
emitter3.on("hello", function() {
    console.log("hello node");
});