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






# 参考

## [Node.js网络通信模块浅析](https://segmentfault.com/a/1190000008908077)
