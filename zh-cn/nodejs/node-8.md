# 第八节 网络

## No.1 Node.js的网络模块架构是什么样子的?

在Node.js的模块里面,与网络相关的模块有Net、DNS、HTTP、TLS/SSL、HTTPS、UDP/Datagram.
除此之外,还有v8底层相关的网络模块:tcp_wrap.cc、udp_wrap.cc、pipe_wrap.cc、stream_wrap.cc等;
在JavaScript层与C++层之间通过process.binding进行桥接相互通信,如下图示:

![node-network](/assets/node-network.png)

## No.2 Node.js是怎样支持https,tls的?

1. 实现流程主要包括以下步骤:

* openssl生成公钥私钥:生成私钥key文件在指定目录下,比如:/path/to/private.pem
* 通过私钥文件生成CSR证书的签名,比如:csr.pem
* 通过私钥文件和CSR证书的签名生成证书文件,比如:/path/to/file.crt

2. 服务器和客户端使用https替代http:

* 服务器使用require("https");
* 客户端使用https域名

3. 服务器加载公钥私钥证书:

* fs.readFileSync同步读取公钥私钥(private.pem)
* fs.readFileSync同步读取CSR证书(file.crt)
* 创建https服务,引入公钥私钥和CSR证书

## No.3 如何实现一个简单的HTTP服务器?

```js
const http = require(“http”); // 加载 http 模块
http.createServer((req, res) => {
    res.writeHead(200, {“Content-Type”: “text/html”}); // 200 代表状态成功
    res.write(‘<h1>我是标题</h1>’);
    res.end(); // 结束输出流
}).listen(3000); // 绑定 3000,查看效果
```

## No.4 cookie与session的区别?服务端如何清除cookie?

主要区别在于session存在服务端,cookie存在客户端,session比cookie更安全,而且cookie不一定一直能用(可能被浏览器关掉),服务端可以通过设置cookie的值为空并设置一个expires来清除存在客户端上的cookie.

cookie安全性设置
Secure: 指定cookie是否能通过https协议访问,防止网络传输过程中被窃取;
HttpOnly: 可以防止cross-site scripting访问;
使用Express框架的话,使用cookie-session的默认设置即可.

## No.5 HTTP协议中的POST、GET、PUT有什么区别?

|  methods  | CRUD |  幂等  |  缓存  |
| ------ | ------ | ------ | ------ |
| POST | Create | 非 | 非 |
| GET | Read | 是 | 是 |
| PUT | Update/Replace | 是 | 非 |

幂等性: 指一次或多次请求某一个资源应该具有同样的副作用;
POST是新建(create)资源,非幂等性,同一个请求如果重复POST会新建多个资源.PUT是Update/Replace,幂等,同一个PUT请求重复操作会得到同样的结果.

缓存性: Get请求能缓存,Post不能;
传输差异: Post通过request body来传输,Get请求都包含在URL;
传输大小: get传输会受URL的长度限制,POST则不影响;


## No.6 什么是跨域请求?如何允许跨域?

出于安全考虑,默认情况下使用XMLHttpRequest和Fetch发起HTTP请求必须遵守同源策略,即只能向相同host请求(host=hostname:port).向不同host的请求被称作跨域请求(cross-origin HTTP request).可以通过设置CORS headers即Access-Control-Allow-系列来允许跨域,以nginx.conf配置为例:

```js
location ~* ^/(?:v1|_) {
    if ($request_method = OPTIONS) { return 200 '';}
    header_filter_by_lua '
      ngx.header["Access-Control-Allow-Origin"] = ngx.var.http_origin; # 这样相当于允许所有来源了
      ngx.header["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS";
      ngx.header["Access-Control-Allow-Credentials"] = "true";
      ngx.header["Access-Control-Allow-Headers"] = "Content-Type";
    ';
    proxy_pass http://localhost:3001;
}
```

注:同源除了相同host也包括相同协议.所以即使host相同,从HTTP到HTTPS也属于跨域.

## No.7 Script error是什么错误?如何拿到更详细的信息?

由于同源性策略(CORS),如果你引用的js脚本所在的域与当前域不同,那么浏览器会把onError中的msg替换为Script error.要拿到详细错误的方法,除了配好Access-Control-Allow-Origin,还有在引用脚本的时候指定crossorigin,例如:

```js
<script src="http://another-domain.com/app.js" crossorigin="anonymous"></script>
```

## No.8 TCP/UDP的区别?TCP粘包是怎么回事,如何处理?UDP有粘包吗?

|    协议    |   连接性   |    双工性    |   可靠性   |   有序性   |   有界性   | 拥塞控制 | 传输速度 | 量级 | 头部大小 |
| ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ | ------ |
| TCP | 面向连接(Connection oriented) | 全双工(1:1) | 可靠(重传机制) | 有序(通过SYN排序) | 无,有粘包情况 | 有 | 慢 | 低 | 20~60字节 |
| UDP | 无连接(Connection less) | n:m | 不可靠(丢包后数据丢失) | 无序 | 有消息边界、无粘包 | 无 | 快 | 高 | 8字节 |

* TCP粘包是怎么回事?

在默认情况下,TCP连接会启用延迟传送算法(Nagle算法),在数据发送之前缓存他们.如果短时间有多个数据发送,会缓冲到一起作一次发送(缓冲大小见socket.bufferSize),这样可以减少IO消耗提高性能.

* 以连续调用send分别发送两段数据data1和data2,常见的粘包情况如下:

  * 先接收到data1的部分数据,然后接收到data1余下的部分以及data2的全部.
  * 先接收到了data1全部数据和data2的部分数据,然后接收到了data2的余下的数据.
  * 一次性接收到了data1和data2的全部数据.

* 对于处理粘包的问题,常见的解决方案有:

  * 多次发送之前间隔一个等待时间: 适用于交互频率特别低的场景;
  * 关闭Nagle算法: Node.js可以通过socke.setNoDelay()方法来关闭Nagle算法,让每一次send都步缓冲直接发送;
  * 进行封包/拆包: 即给每个数据包在发送之前,于其前/后放一些有特征的数据,然后收到数据的时候根据特征数据分割出来各个数据包.

## No.9 滑动窗口Window是否设置的越大越好?accept queue的队列长度backlog如何设置?

* window 设置:

TCP头里有一个Window字段,是接收端告诉发送端自己还有多少缓冲区可以接收数据的.发送端就可以根据接收端的处理能力来发送数据,从而避免接收端处理不过来.

类似木桶理论,一个木桶能装多少水,是由最短的那块木板决定的.一个TCP连接的window是由该连接中间一连串设备中window最小的那一个设备决定的.

* backlog设置:

accept queue:客户端与服务端确认连接之后等待的队列,队列的长度用backlog来控制;
如果backlog过小,在并发连接大的情况下容易导致accept queue装满之后断开连接.但是如果将这个队列设置的特别大,那假定连接数并发量是65525,以qps5000为例,处理完的耗时也需要13s.这段时间连接可能早已被nginx或者客户端断开,此时我们去accept这个socket时只会拿到一个broken pipe.backlog的长度默认是511.

## No.10 TIME_WAIT是什么情况?出现过多的TIME_WAIT可能是什么原因?

TIME_WAIT是连接的某一方(可能是服务端也可能是客户端)主动断开连接时,四次挥手等待被断开的一方是否收到最后一次挥手(ACK)的状态.如果在等待的时间中,再次收到第三次挥手(FIN)表示对方没收到最后一次挥手,这时要再ACK一次,这个等待的作用是避免出现连接混用的情况.

出现大量的TIME_WAIT比较常见的情况是,并发量大,服务器在短时间断开了大量连接.对应HTTP server的情况可能是没开启keepAlive.如果有开keepAlive,一般是等待客户端自己主动断开,那么TIME_WAIT就只存在客户端,而服务端则是CLOSE_WAIT的状态,如果服务端出现大量CLOSE_WAIT,意味着当前服务端建立的连接大面积的被断开,可能是目标服务集群重启之类.

## No.11 ECONNRESET是什么错误?如何复现这个错误?

Node.js提供的HttpServer默认设置了超时时间为2分钟,当一个请求的处理时间超过2分钟,HttpServer会自动将该请求的socket关闭掉,于是客户端便收到了ECONNRESET的错误信息.

## No.12 socket hang up是什么意思?可能在什么情况下出现?

hang up是挂断的意思,socket hang up也可以理解为socket被挂断.在Node.js中当你要response一个请求的时候,发现这个socket已经被“挂断”,就会报socket hang up错误.

看一下lib/_http_client.js源码片段:

```js
function socketCloseListener() {
    var socket = this;
    var req = socket._httpMessage;
    // ...
    if (req.res && req.res.readable) {
        // ...
    } else if (!req.res && !req.socket._hadError) {
        req.emit("error", createHangUpError()); // socket hang up
        req.socket._hadError = true;
    }
    // ...
}
```

典型的情况是用户使用浏览器,请求的时间有点长,然后用户简单的按了一下F5刷新页面.这个操作会让浏览器取消之前的请求,然后导致服务端throw了一个socket hang up.

## No.13 hosts文件是什么?什么叫DNS本地解析?

hosts文件是个没有扩展名的系统文件,其作用就是将网址域名与其对应的IP地址建立一个关联“数据库”,当用户在浏览器中输入一个需要登录的网址时,系统会首先自动从hosts文件中寻找对应的IP地址.

当我们访问一个域名时,实际上需要的是访问对应的IP地址,这时候,获取IP地址的方式,先是读取浏览器缓存,如果未命中->接着读取本地hosts文件,如果还是未命中->则向DNS服务器发送请求获取.在向DNS服务器获取IP地址之前的行为,叫做DNS本地解析.

## No.14 DNS模块中.lookup与.resolve的区别?

DNS服务主要基于UDP,Node.js实现的接口有两个方法:

.lookup:通过系统自带的DNS缓存(如/etc/hosts)
.lookup(hostname[,options], cb)

.resolve:通过系统配置的DNS服务器指定的记录(rrtype指定)
.resolve(hostname[,rrtype], cb)

当你要解析一个域名的ip时,通过.lookup查询直接调用getaddrinfo来获取地址,速度很快,但是如果本地的hosts文件被修改了,.lookup就会拿hosts文件中的地方,而.resolve依旧是外部正常的地址.

由于.lookup是同步的,所以如果由于什么不可控的原因导致getaddrinfo缓存或者阻塞是会影响整个Node.js进程的.

## No.15 http请求响应的工作流程是什么样的呢?

1. 客户端连接web服务器,与80端口建立一个tcp套接字;
2. 发送http请求通过tcp套接字,客户端向服务器发送一个文本的请求报文(请求行、请求头、空行、请求体)4部分组成;
3. 服务端接受请求并返回http响应体(状态行,响应头部,空行,响应数据);
4. 释放TCP连接:web服务器主动关闭tcp套接字,释放tcp连接,客户端被动关闭tcp套接字,释放tcp连接.

## No.16 https的加密流程是什么?

1. 证书签发(发送公钥、申请者信息等);
2. 协商算法(客户端产生随机数,发送SSL/TLS等信息,服务端产生随机数,回复SSL/TLS等信息);
3. 验证算法(用户浏览器信任证书);
4. 构建主密钥(客户端在CA公钥证书里面取公钥加密成随机数发送给服务端);
  * 客户端:使用三次随机数生成master secret
  * 服务端:使用三次随机数生成master secret
5. 构建会话密钥:客户端和服务端分别并行使用master secret构建会话密钥;
6. 对称加密交互:客户端使用ms加密信息,服务端使用ms解密.

## No.17 WS请求/响应的报文与http有什么特别之处?

请求报文差异:

```js
Upgrade: websocket
Connection: Upgrade
```

响应报文差异:

```js
HTTP/1.1 101 Switching Protocols 状态101表示切换协议成功
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrcsdfsdfsdfsdfd=
```

WS最常用的几个函数是:

* onopen: 用于建立连接后的回调;
* onmessage: 接收到服务端消息的回调;
* onclose: 关闭回调;
* send('xxx'): 发送数据.

## No.18 从浏览器访问之后全流程都包含哪些?

1. 从浏览器接收url到开启网络请求线程,进程与线程之间的关系;
2. 开启网络线程到发布一个完整的http请求:dns查询、tcp/ip请求、五层因特网协议栈;
3. 从服务器接收到请求,再到对应后台接收到请求:负载均衡、安全拦截、后台内部处理;
4. 后台和前台的http交互(http头部、响应码、报文结构、cookie、静态资源的cookie优化、编解码、gzip压缩);
5. http的缓存(http缓存头部、etag、cache-control);
6. 浏览器接收到http数据包后,进行解析流程,包括解析html(词法分析然后解析成dom树)->解析css生成规则树->合并成render树->然后layout->painting渲染->复合图层的合成->GPU绘制->外链资源的处理->loaded和domcontentloaded;
7. css的可视化格式模型(元素的渲染规则、包含块、控制框、BFC、IFC);
8. JS引擎解析过程(js的解释阶段、预处理阶段、执行阶段生成执行上下文、VO、作用域链、回收机制);
9. 跨域、web安全、hybrid模式;

## No.19 Node.js中如何实现http请求的同步处理?

解决方案:主要是通过net来实现,先通过net创建服务器,然后将请求保存在一个队列当中,最后从队列中慢慢的处理请求,就能够实现http的同步请求了.

示例代码:

```js
let watingQueue = []; // 保存请求的队列,每个元素都是一个socket
let curtSocket = null; // 当前处理的请求
let httpServer = http.createServer(function(req, res) {
    // 延迟1秒钟回复
    res.on("finish", function() {
        curtSocket = null;
        // 一个请求结束了,处理下一个请求
        dealRequest();
    });
});
// 建立一个tcp的服务器(http协议是建立在tcp协议上)
net.createServer(function(socket) {
    // 将请求压入队列
    enqueueSocket(socket);
    // 处理请求(如果现在正在处理请求,不做任何处理)
    dealRequest();
}).listen();
function dealRequest() {
    curtSocket = watingQueue.shift();
    httpServer.emit("connection", curtSocket);
}
```

## No.20 什么是RPC?

RPC远程过程调用协议,它是一种通过网络从远程计算机程序上请求服务,而不需要了解底层网络技术的协议.RPC协议假定某些传输协议的存在,如TCP或UDP,为通信程序之间携带信息数据,在OSI网络通信模型中,RPC跨域了传输层和应用层.

常见的RPC方式:

* Thrift:是一种接口描述语言和二进制通讯协议,它被用来定义和创建跨语言的服务.它被当作一个远程过程调用(RPC)框架来使用;

* HTTP: 使用HTTP协议来进行RPC调用也很常见的,相比TCP连接,通过HTTP的方式性能会差一些,但是在使用以及调试上会简单一些.近期比较有名的框架是gRPC,基于protocol buffers 3.0协议的.

* MQ: 使用消息队列来进行RPC调用,比较适合业务解耦/广播/限流等场景.

## No.21 什么是zlip?

在网络传输过程中,如果网速稳定的情况下,对数据进行压缩,压缩比率越大,那么传输的效率就越高,等同于速度越快,zlip模块提供了Gzip/GunZip,Deflate/Inflate和DeflateRaw/InflateRaw等压缩方法的类,这些类都属于可读写的Stream实例.


# 参考

## [Node.js网络通信模块浅析](https://segmentfault.com/a/1190000008908077)
