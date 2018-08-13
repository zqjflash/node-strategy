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

# 参考

## [Node.js网络通信模块浅析](https://segmentfault.com/a/1190000008908077)
