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

## No.9 滑动窗口是否设置的越大越好?

TCP头里有一个Window字段,是接收端告诉发送端自己还有多少缓冲区可以接收数据的.发送端就可以根据接收端的处理能力来发送数据,从而避免接收端处理不过来.

类似木桶理论,一个木桶能装多少水,是由最短的那块木板决定的.一个TCP连接的window是由该连接中间一连串设备中window最小的那一个设备决定的.

## No.10 TIME_WAIT是什么情况?出现过多的TIME_WAIT可能是什么原因?

TIME_WAIT是连接的某一方(可能是服务端也可能是客户端)主动断开连接时,四次挥手等待被断开的一方是否收到最后一次挥手(ACK)的状态.如果在等待的时间中,再次收到第三次挥手(FIN)表示对方没收到最后一次挥手,这时要再ACK一次,这个等待的作用是避免出现连接混用的情况.

出现大量的TIME_WAIT比较常见的情况是,并发量大,服务器在短时间断开了大量连接.对应HTTP server的情况可能是没开启keepAlive.如果有开keepAlive,一般是等待客户端自己主动断开,那么TIME_WAIT就只存在客户端,而服务端则是CLOSE_WAIT的状态,如果服务端出现大量CLOSE_WAIT,意味着当前服务端建立的连接大面积的被断开,可能是目标服务集群重启之类.

## No.11 ECONNRESET是什么错误?如何复现这个错误?

Node.js提供的HttpServer默认设置了超时时间为2分钟,当一个请求的处理时间超过2分钟,HttpServer会自动将该请求的socket关闭掉,于是客户端便收到了ECONNRESET的错误信息.

# 参考

## [Node.js网络通信模块浅析](https://segmentfault.com/a/1190000008908077)
