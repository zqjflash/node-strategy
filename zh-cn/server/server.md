# 第一节 服务器常见配置

## No.1 apache,nginx有什么区别?

一般说来服务器模型分为以下几种:

* 同步式的服务,一次只能处理一个请求,处理时别的请求都处于等待状态;
* 多线程的服务,如apche,对每个请求启动一个线程来处理,但线程的创建和销毁以及切换需要消耗CPU资源,因而并不如单线程服务高效;
* 基于事件的服务,如Node.js、Nginx,无需进行线程上下文切换、消耗CPU资源较少.

二者都是代理服务器,功能类似,apache应用简单,使用广泛,nginx在分布式,静态转发方面比较有优势.

* Nginx相对apache的优点:

  1. 轻量级抗并发: nginx处理请求是异步非阻塞的,采用epoll模型,在高并发下能保持低资源低消耗,达到高性能;
  2. 有着高度的模块化设计;
  3. 互动社区比较活跃.

* apache相对nginx的优点:

  1. 大而全,稳定性非常好;
  2. apache采用select模型

## No.2 如何使用request模块实现一个简单的http客户端?

```js
request({
    method: "POST", // 请求方法
    url: "http://xxx.com", //请求地址
    qs: {a: 123, b: 456}, // query 查询参数
    form: {c: 111, d: "zxxxx"}, // post body 参数
    headers: {
        "user-agent": "SuperID/Node.js", //请求头
    }
})
.then(ret => {
    // ret.headers 表示响应头
    // ret.statusCode 表示响应代码
    // ret.body 表示响应内容(Buffer)
})
.catch(err => console.log(err))
```

## No.3 为什么要使用代理服务器?

1. 提高访问速度

由于目标主机返回的数据会存放在代理服务器的硬盘中,因此下一次客户再访问相同的站点数据时,会直接从代理服务器的硬盘中读取,起到缓存的作用,尤其对于热门站点明显 提高请求速度;

2. 防火墙作用

由于所有的客户机请求都必须通过代理服务器访问远程站点,因此可在代理服务器上设限,过滤某些不安全信息.

3. 通过代理服务器访问被和谐的目标站点

互联网上有许多开发的代理服务器,客户机在访问受限时,可通过不受限的代理服务器访问目标站点.通俗说,我们使用的翻墙浏览器就是利用代理服务器.

## No.4 Node.js如何实现负载均衡?

> 当一台服务器的单位时间内的访问量越大时,服务器压力就越大,达到超过自身承受能力时,服务器就会崩溃.为了避免服务器崩溃,让用户有更好的体验,我们通过负载均衡的方式来分担服务器压力.

从架构上来说,Node.js一般都是搭配Nginx来实现负载均衡,从服务进程角度来说,Node.js自带Cluster也可以实现负载均衡,类似PM2进程管理工具也可以实现.

Nginx的负载均衡是用反向代理的原理来实现的.

常见的几种负载均衡方式:

1. 轮询(默认):每个请求按时间顺序逐一分配到不同的后端服务器,如果后端服务器down掉,自动剔除;

```js
upstream backserver {
    server 192.168.0.14;
    server 192.168.0.15;
}
```

2. 权重(weight):指定轮询机率,weight和访问比率成正比,用于后段服务器性能不均的情况,权重越高,被访问的概率越大

```js
upstream backserver {
    server 192.168.0.14 weight=3;
    server 192.168.0.15 weight=7;
}
```

3. 访问ip的hash结果分配:解决session的问题

```js
upstream backserver {
    ip_hash;
    server 192.168.0.14:88;
    server 192.168.0.15:80;
}
```

4. 短作业优先(fair): 按后端服务器的响应时间来分配请求,响应时间短的优先分配;

```js
upstream backserver {
    server server1;
    server server2;
    fair;
}
```

5. url_hash: 按访问url的hash结果来分配请求,使每个url定向到同一个后端服务器,后端服务器有缓存时比较有效.

```js
upstream backserver {
    server squid1: 3128;
    server squid2: 3128;
    hash $request_uri;
    hash_method crc32;
}
```

整个配置文件示例:

```js
worker_processes 4;
events {
    # 最大并发数
    worker_connections = 1024;
}
http {
    # 待选服务器列表
    upstream myproject {
        # ip_hash指令,将同一用户引入同一服务器
        ip_hash;
        server 125.219.42.4 fail_timeout=60s;
        server 172.31.2.183;
    }
    server {
        # 监听端口
        listen 80;
        # 根目录下
        location / {
            # 选择哪个服务器列表
            proxy_pass http://myproject;
        }
    }
}
```

