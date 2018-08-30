## 0. 前言

为了让Node.js应用很好的运行在TMA框架中,node-eyes将作为启动器来启动应用,同时打通TMA框架与Node.js间的差异,并提供生产环境所需的服务特性.

## 一、功能设计

### 1.1 主要功能

* 内置负载均衡(通过cluster模块实现);
* 异常退出的监控与管理;
* 日志搜集与处理;
* 支持TMA运营平台的管理命令;
* 支持HTTP(s)服务监控上报(在TMA平台上运行)
* 支持服务用量上报(在TMA平台上运行)

### 1.2 安装与用法

* 安装

```js
npm install node-eyes -g
```

由于node-eyes是一个CLI程序,所以一般需要使用-g参数来安装;

* 用法

```js
node-eyes index.js [options]
```

* index.js: 为程序的入口脚本;
* [options]可选配置.

* 常见的启动方式:

  * 直接运行入口index.js入口文件; $ node-eyes index.js
  * 以TMA服务的配置文件来启动; $ node-eyes index.js --config TMA.Video.conf
  * 启动并命名应用为TMA.Video; $ node-eyes index.js --name TMA.Video
  * 定义日志输出路径; $ node-eyes index.js --log ./logs/
  * 传递子进程node的启动参数; $ node-eyes index.js --node-args="--debug=9001"
  * 定义子进程数量: $ node-eyes index.js -i 8

### 1.3 入口点

node-eyes启动时传入的第二个参数用来指定服务脚本执行的入口点文件,其中:

* 可以直接传入脚本文件用于执行,如: index.js
* 也可以传入脚本文件所在的目录,如: ./

当传入的为目录时,入口点根据如下顺序进行确认:

1. 目录中存在package.json文件,则:

  1. 查找nodeEyes.main;
  2. 查找script.start(此配置需要以node开头才可识别)
  3. 查找main

2. 查找目录中是否存在: server.js、app.js、start.js、index.js

只要其中的一项匹配则作为入口点文件来执行,就不再往下匹配.

### 1.4 选项

* -c, --config: 指定服务的配置文件,配置文件将会自动读入作为基础配置;
* -n, --name: 可在此指定服务名.如未配置,则使用脚本的文件名;
* -l, --log: 指定输出的日志文件根目录,如未配置,则所有日志输出采用stdout/stderr输出;
* -i, --instances: 启动子进程的数量,未配置(或配置为auto|0),启动的子进程数量等于CPU物理核心个数;配置为max,启动的子进程数量等于CPU个数.

如果node-eyes是由TMANode启动,会自动读取TMA配置文件文件中的tma.application.client.asyncthread配置,另外也可以通过TMA运营平台->编辑服务->异步线程数进行调整.

* --env: 设置服务启动时的环境变量,这里传入json格式数据, {\"NODE_ENV\":\"production\"},请注意,当作为命令行参数传递时,双引号需要进行转义双引号;如果是TMA平台配置该参数,优先读取

* --http-address: 设定服务脚本执行所需的ip:port,在脚本中可以使用环境变量HTTP_IP、HTTP_PORT进行获取,如果是由TMA平台启动的服务,这里的值为动态分配的ip和port.

* --script-args: 设置服务脚本执行所需传入的参数,如: $ node-eyes index.js --script-args="--use='https'" 等同于 $ node index.js --use="https"

* --node-args: 设置子进程所需的启动参数,例如:$ node-eyes index.js --node-args="--debug=9001 --trace-deprecation"等同于 $ node --debug=9001 --trace-deprecation index.js

* --run-as-user,--run-as-group: 指定子进程运行的用户(组), 可通过此对服务脚本进行降权执行,如未配置权限等同于node-eyes启动用户(组)

* --max-memory-restart: 指定服务所能使用到的最大内存,如果达到最大限制,将会抛出异常并退出.同时这类异常也会纳入整体的异常进行处理.

* --graceful-shutdown: 正常情况下,node-eyes在停止服务时会通过worker.disconnect()通知服务,让服务释放资源并退出.在这里可以设置超时时间,如果服务在给定的时间后仍然没有退出,node-eyes则会强制kill掉进程.超时时间默认为8秒.如果node-eyes是由TMANode启动的,自动读取配置文件的deactivating-timeout

* --exception-max,--exception-time: 如果服务出现异常退出,并在一段时间内(--exception-time)异常退出的次数没有超过最大值(--exception-max).node-eyes将会自动拉起新的服务,否则node-eyes与服务也将异常退出.经验值设置:--exception-time默认值为10s,--exception-max默认值为2次.

* --keepalive-time: 如果node-eyes在一段时间(--keepalive-time)内未收到子进程发送的心跳,则判定此子进程为僵尸进程(zombie process),将会直接kill,并作为异常进行处理.默认值为5s.

* --applog-max-files,--applog-max-size,--applog-level: 指定服务默认的滚动日志大小(--applog-max-size)、总数(--applog-max-file)与日志级别(--applog-level).服务的启动时会创建两份主(滚动)日志:app.serverName.log: 启动服务的stdout/stderr/console,app.serverName_eyes.log: node-eyes的状态信息

* --TMA-node,--TMA-local: 如果node-eyes是由TMANode启动,则需要指定TMA的RPC连接参数(--TMA-node)与本地被调的启动参数(--TMA-local).此设置也可以通过TMA配置文件(--TMA-config)进行指定.node-eyes会在服务启动时向TMANode上报服务的版本,并在服务运行过程中发送心跳包. 与此同时,node-eyes本地启动的(被调)服务也将从TMANode中接收下发的消息(shutdown/message),并进行响应.

* --TMA-monitor: 如果服务在TMA平台上运行,node-eyes会自动向TMAStat上报服务的监控(用量)信息.默认值为on,设置为off可关闭自动上报功能.

* --TMA-monitor-http-threshold: 如果服务的HTTP(s)返回码大于此阀值则此次请求将作为异常访问进行上报.默认response.statusCode >= 400则为异常访问.设置为off可关闭此特性.

* --TMA-monitor-http-seppath: HTTP(s)服务在上报时是否需要区分不同路径.默认为区分路径,其中url.pathname的部分会作为服务的接口名进行上报.如果您的服务拥有非常多(大基数)的pathname(如RESTful),可设置成为off.

* --TMA-monitor-http-socketerr: 默认情况下,HTTP(s)服务在进行上报时会将Socket异常进行上报.可设置成为off.

* --long-stack,--long-stack-filter-usercode: 开启此特性后,会在异常产生时自动附加异步调用堆栈,帮助快速定位异步调用问题.此特性要求Node.js版本大于v8.2.x,并且会造成性能损耗.

### 1.5 配置

node-eyes支持多种配置方式进行启动:

* 命令行参数进行指定;

```js
node-eyes index.js --run-as-user=user_00
```

* 在服务脚本的package.json中指定;

```js
{
    "nodeEyes": {
        "runAsUser": "user_00"
    }
}
```

* 在TMA服务的配置文件中指定.

```js
<TMA>
    <application>
        <server>
            run-as-user=user_00
        </server>
    </application>
<TMA>
```

其中:

* 在package.json或TMA配置文件中指定的值,会覆盖掉命令行参数中所指定的配置项;
* 可以通过驼峰式写法将配置参数声明在package.json中nodeEyes的配置;
* 在TMA服务的配置文件中以配置参数原型直接进行声明.

### 1.6 消息与事件

> 一般情况下,业务代码无需处理进程消息与事件,但如果想处理(响应):进程退出、TMA管理命令,则需要进行处理.

* process.on('disconnect', function): 默认情况下node-eyes会对该事件进行处理,但如果用户代码监听了该事件则node-eyes将不再进行处理.请注意,在处理完该事件后,请一定显示调用process.exit()以确保进程可以正常退出.

* process.on('message', object): 一旦node-eyes收到了来自于TAMNode的管理命令(或来自业务脚本的消息),将会通过进程消息发送给(特定的)业务脚本.传送的消息object的格式为:

```js
{
    cmd: String,
    data: String|Object
}
```

支持的消息cmd有:

* TMA.viewstatus: 查看服务状态
* TMA.setloglevel: 设置日志等级
* TMA.loadconfig: PUSH配置文件
* TMA.connection: 查看当前链接情况
* TMA自定义命令;
* process.msg: [all|worker_id] 跨进程通讯

node-eyes会TMA自定义命令进行切分,命令中第一个空格前的字符作为cmd,而后续的部分则作为data.

* process.send(object): 发送命令给主进程以便主进程执行特定的操作.传递的消息object的格式与收到的消息格式相同.

```js
cmd = process.msg:[all|worker_id]
```

通过此命令,可以将自定义消息发送给参数指定的子进程.

* all:发送给所有子进程(包括自己);
* worker_id: 发送给特定的子进程,其中worker_id为进程顺序ID(process.env.WORKER_ID),所有消息均会通过主进程中转,在大消息量主进程易成为性能瓶颈

### 1.7 日志

node-eyes会将服务的输出(stdout|stderr管道以及console模块的输出)重定向到指定的文件(当使用-l --log参数启动时)或者管道.日志的输出由winston-tma模块实现,其输出的日志格式为:日期 时间|PID|日志级别|文件名:行号|内容

服务脚本可以通过node自带的console模块输出不同级别的日志.

```js
console.info=INFO
console.log=DEBUG
console.warn=WARN
console.error=ERROR
```

也可通过服务的stdout|stderr管道输出.

```js
process.stdout=INFO
process.stderr=ERROR
```

日志级别的优先级为: `INFO < DEBUG < WARN < ERROR < NONE`, 默认的日志级别为DEBUG.

### 1.8 环境变量

node-eyes通过环境变量向服务脚本提供所需的变量:

* process.env.IP: HTTP(s)可监听的IP;
* process.env.PORT: HTTP(s)可监听的端口;
* process.env.WORKER_ID: 进程顺序ID(例如启动4个进程,第一个为0,第二个为1,以此类推),重新启动的进程仍然使用之前的ID.

如果服务是由TMANode启动,还支持如下变量:

* process.env.TMA_CONFIG: 启动服务所使用的TMA配置文件所在的绝对路径;
* process.env.TMA_MONITOR: 是否开启监控(特性)上报(统计).

注:环境变量全为String类型.

### 1.9 监控与用量上报

如果服务在是TMA平台运行的,node-eyes会自动向stat上报服务的监控信息.

* 监控信息: 监控信息的上报与启动的服务及其调用者有关(可在TMA平台->服务监控查看):

  * HTTP(s): 服务端response.statusCode >= 0为失败,所有的请求超时为0;

* 用量信息: 无论启动的服务是什么类型,用量信息总是上报(可通过TMA平台->特性监控查看)

  * memoryUsage: 内存用量,将会上报rss、heapUsed、heapTotal这三个用量(单位为字节);
  * cpuUsage: CPU用量,将会上报CPU使用率,数据汇总为逻辑单核(单位为百分比);
  * eventloopLag: 事件循环滞后(V8消息队列延迟),每隔2秒采样(单位为毫秒);
  * libuv: I/O用量,将会上报activeHandles、activeRequests这两个用量.

所有的用量信息的统计策略均为Avg、Max、Min.

### 1.10 无损操作

如果服务在TMA平台上运行,每次无损重启或发布时:

* 设置流量状态为无流量(包括路由和第三方流量);
* 等待调用方获取配置;
* 执行对应操作(重启或发布);
* 恢复流量状态.

注:如果大量节点同时进行无损操作,会同时屏蔽这些节点流量,可能会造成服务不稳定.建议采用无损分批重启.

### 1.11 预热

在无损操作的服务启动过程中,可以选择是否需要进行预热:

1. 服务启动后每秒检查是否所有子进程都监听了端口(所有子进程状态均为ONLINE);
2. 如果超过预热超时时间,且并非所有子进程都监听了端口,则无损操作流程失败并通知用户(邮件通知).

在任何情况下,完成所有初始化操作后再监听(listen)端口.

## 二、核心代码逻辑设计

### 2.0 node-eyes架构

> node-eyes在启动(也就是执行cluster.fork)服务脚本时,并不会直接载入对应脚本,而是载入node-eyes/ProcessContainer.js来对服务脚本进行包装,之后再调用系统的require载入执行脚本.

![node-eyes-god](/assets/node-eyes-god.png)