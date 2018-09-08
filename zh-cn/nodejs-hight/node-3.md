# 第三节 node使用protobuf协议

## 一. protobuf是什么?

protobuf是Google提供的一种数据序列化协议,它是一种轻便高效的结构化数据存储格式,可以用于结构化数据序列化,很适合做数据存储或RPC数据交换格式.

## 二. Node为什么要用protobuf?

作为JS开发者,友好的数据序列化协议JSON.但是许多中后台都是基于protobuf定制的数据序列化协议,作为Node开发者,跟C++或Java编写的后台服务接口打交道是不可避免的,因此有必要掌握protobuf协议.

## 三. 为什么类protobuf的二进制协议通信更好?

1. 二进制协议对操作系统来说更容易解析,解析速度上远超过http这类应用层协议;
2. 有tcp和udp两种选择,在一些场合下,udp传输效率更高;
3. 在后台开发中,后台与后台的通信一般都是基于二进制协议,甚至一些app和服务端通信也选择二进制协议.但是由于web前端的存在,后台往往需要特定开发维护一套http接口,如果web也使用二进制协议,可以洁身许多后台开发的成本.

注: 在大厂,最重要的就是优化效率、节省成本,因此二进制协议要优于http这样的协议.

## 四、Node.js使用protobuf协议

### 4.1 选择支持protobuf的npm模块

* [protobuf.js](https://github.com/dcodeIO/ProtoBuf.js)
* Google protobuf.js
* protocol-buffers

根据star数和文档完善程度两方面考虑, 选择protobuf.js.

```js
npm install protobufjs -g
pbjs --version
```

### 4.2 演示案例

程序设计: 两部分组成,第一部分是Writer,第二部分是Reader.
Writer: 负责将一些结构化的数据写入一个磁盘文件; Reader则负责从该磁盘文件中读取结构化数据并打印到屏幕上.

### 创建一个结构化数据

* 准备一个结构化数据,包含两个基本数据:id为一个整数类型的数据, str为一个字符串;
* 编写一个.proto文件,在protobuf术语中,结构化数据被称为Message.proto文件非常类似Java或C语言的数据定义;
* .proto文件命名有讲究:包名.消息名.proto,下面文件命名为tma.video.proto


```js
package tma;
message video
{
    required int32   id = 1; // ID
    required string  str = 2; // str
    optional int32   opt = 3; // 可选字段
}
```

解释说明上面这个结构化数据:

* package为tma,消息体为video,该消息体有三个成员.该消息体有三个成员,类型为int32的id,类型为string的str,以及一个可选的类型为int32的opt,1、2、3几个数字是三个字段的唯一标识符,这些标识符用来在消息的二进制格式中识别各个字段,一旦确定就不能再更改.

### 编译.proto文件

可以使用protobuf.js提供的命令行工具来编译.proto文件

用户:

```js
$ pbjs <filename> [options] [> outFile]
```

options选项说明:

```js
--target, -t 指定生成特定文件格式: amd|commonjs|js|json|proto
```

```js
$ pbjs ./tma.video.proto -t proto3 > ./tma.video.js
```

编译之后符合commonjs规范的tma.video.js文件

```js
syntax = "proto3";
package tma;
message video {

    int32 id = 1;
    string str = 2;
    int32 opt = 3;
}
```

### 编写Writer

```js
const ProtoBuf = require("protobufjs");
const fs = require("fs");

ProtoBuf.load("./tma.video.js", (err, root) => {
    let video = root.lookupType("tma.video");

    let payload = {
        "id": 12,
        "str": "video"
    };
    
    let errMsg = video.verify(payload);
    if (errMsg) {
        throw Error(errMsg);
    }
    
    // 创建数据
    let videoMsg = video.create(payload);
    let buffer = video.encode(videoMsg).finish(); // 编码成buffer
    console.log(buffer); // <Buffer 08 0c 12 05 76 69 64 65 6f>
    fs.writeFile('./test.log', buffer, (err) => {
        if (!err) {
            console.log('done!');
        }
    });
});
```

### 编写Reader

```js
const ProtoBuf = require("protobufjs");
const fs = require("fs");
ProtoBuf.load("./tma.video.js", (err, root) => {
    let video = root.lookupType("tma.video");
    let buffer = fs.readFile('./test.log', (err, data) => {
        if (!err) {
            console.log(data); // 看看Node里的Buffer格式:<Buffer 08 0c 12 05 76 69 64 65 6f>
            let message = video.decode(data); // 解码buffer
            console.log(message); // video { id: 12, str: 'video' }
        }
    });
});
```

### 运行结果: 

* 由于没有在Writer中给可选字段opt赋值,因此Reader没有相应值.

### 4.3 客户端调服务端的示例

> 使用protobuf实现网络的数据交换.

### 创建一个.proto文件,命名:tma.shop.proto

```js
package tma;
message shop {
    message shopReq {
        required string name = 1;
    }
    message shopRsp {
        required int32 retCode = 1;
        optional string reply = 2;
    }
}
```

### 编译.proto文件(如果是动态编译,此步省略)

```js
$ pbjs ./tma.shop.proto -t proto3 > ./tma.shop.js
```

### 编写客户端服务

一般情况下,使用Protobuf都会先写好.proto文件,再用Protobuf编译器生成目标语言所需要的源代码文件.
在某些情况下,可能无法预先知道.proto文件,需要动态处理一些未知的.proto文件.比如一个通用的消息转发中间件,它不可能预知需要处理怎样的消息.这需要动态编译.proto文件,并使用当中的Message.

这里使用protobuf动态编译的特性,在代码中直接读取proto文件,动态生成我们需要的commonjs模块.

* client.js

```js
const dgram = require('dgram');
const ProtoBuf = require("protobufjs");
const PORT = 11222;
const HOST = "127.0.0.1";
const shop = ProtoBuf.loadSync("./tma.shop.proto");
const shopMsg = shop.lookupType("tma.shop");

const shopReq = shop.lookupType("tma.shop.shopReq");
const shopRsp = shop.lookupType("tma.shop.shopRsp");

let payload = {
    name: "zqjflash"
};
let errMsg = shopReq.verify(payload);
if (errMsg) {
    throw Error(errMsg);
}
const req = shopReq.create(payload);
const reqBuffer = shopReq.encode(req).finish(); // 编码成buffer

const socket = dgram.createSocket({
    type: 'udp4',
    fd: 8080
}, (err, message) => {
    if (err) {
        console.log(err);
    }
    console.log(message);
});

socket.send(reqBuffer, 0, reqBuffer.length, PORT, HOST, (err, bytes) => {
    if (err) {
        throw err;
    }
    console.log('UDP message send to ' + HOST + ':' + PORT);
});

socket.on("message", (msg, rinfo) => {
    console.log("[UDP-CLIENT] Received message: " + shopRsp.decode(msg).reply + " from " + rinfo.address + ":" + rinfo.port);
    console.log(shopRsp.decode(msg));
    socket.close();
});

socket.on("close", () => {
    console.log("socket closed.");
});

socket.on("error", (err) => {
    socket.close();
    console.log("socket err");
    console.log(err);
});
```

* 服务端:server.js

```js
const PORT = 11222;
const HOST = "127.0.0.1";
const ProtoBuf = require("protobufjs");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
```

