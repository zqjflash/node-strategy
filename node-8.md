# 第八节 网络

## No.1 Node.js的网络模块架构是什么样子的?

在Node.js的模块里面,与网络相关的模块有Net、DNS、HTTP、TLS/SSL、HTTPS、UDP/Datagram.
除此之外,还有v8底层相关的网络模块:tcp_wrap.cc、udp_wrap.cc、pipe_wrap.cc、stream_wrap.cc等;
在JavaScript层与C++层之间通过process.binding进行桥接相互通信,如下图示:

![node-network](/assets/node-network.png)

# 参考

## [Node.js网络通信模块浅析](https://segmentfault.com/a/1190000008908077)
