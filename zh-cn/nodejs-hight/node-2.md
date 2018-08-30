# 第二节 node-eyes进程管理工具核心设计

> 为了让Node.js应用很好的运行在TMA框架中,node-eyes将作为启动器来启动应用,同时打通TMA框架与Node.js间的差异,并提供生产环境所需的服务特性.

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
* worker_id: 发送给特定的子进程,其中worker_id为进程顺序ID(process.env.WORKER_ID),所有消息均会通过主进程中转,在大消息量主进程易成为性能瓶颈.

## 二、核心代码逻辑设计

### 2.1 入口/bin/node-eyes如何设计?

```js
/**
 * 解析配置文件:启动脚本中的-c后面跟随的文件
 * 其中可以指定worker进程数量
 */
const parseConfig = function(script, file) {
    // ...
    // 在配置文件中读取client.asyncthread的数值
    // 在配置文件中读取server.instances的数值,优先级更高
    // ...
};

/**
 * 使用commander来解析命令行参数
 */
commander.version(pkg.version)...

/**
 * 在start.sh的启动命令中,对启动文件的解析
 * 如果第二个参数是文件,则直接指定为启动文件
 * 如果第二个参数是文件夹,通过package.json执行文件入口
 */
if (scriptStat.isFile() && path.extname(commander.args[0]).toLowerCase() ===".js") {
    entryPoint = path.resolve(commander.args[0]);
} else if (scriptStat.isDirectory()) {
    // 在package.json中查找nodeEye.main
    // 在package.json查找scripts.start
    // 在package.json中查找main
}

/**
 * 真正的执行入口
 */
CLI.start(entryPoint, commander);
```

### 2.2 CLI.js都需要哪些核心逻辑?

```js
/**
 * 初始化Node-PM2组件
 */
const initComponent = (args, opts) => {
    reportVersion(); // 上报服务版本
    report.keepAlive(); // 上报心跳
    // 初始化Admin进程服务,用于下发和接收命令
    // 初始化上报服务
}
/**
 * 启动入口
 */
exports.start = (script, opts) => {
    // 获取worker进程的设置参数
    // 根据读取配置文件来设置常量
    // 初始化日志
    // 将所有启动日志打印至node-eyes.log中
    // 读取package.json中依赖的模块
    /**
     * CPU初始化之后,获取机器的CPU信息
     */
    bindEvents(); // 绑定cluster事件,这里的事件监听主要用于日志打印和上报使用,并对接Node运营平台
    God.prepare(args); // 初始化集群
    initComponent(args, opts); // 初始化组件
    startWorker(opts); // 启动worker进程.实际上由God模块来启动
    notify.report.info("restart"); // 上报
};
```

### 2.3 CLI.js中如何通过God.js模块来管理进程?

```js
const setCluster = (args, execArgv) => {
    // 设置执行worker进程的执行文件
    const setting = {
        exec: path.resolve(path.dirname(module.filename), "ProcessContainer.js") // 设置执行worker进程的执行文件
    };
    // 监听worker进程的退出,并尝试再启动一个worker进程
    // 在10s内连续重启2次还失败则杀死全部进程,在Node运营管理平台显示进程重启异常
    // 监听worker进程的通信消息,worker进程的通信仍然是通过cluster事件来实现的
    // 通知所有子进程,不同的worker进程进行通信
    // worker进程给master进程上报心跳
    /**
     * 设置对僵死进程的监控
     */
    // Linux 提供了这样一个参数min_free_kbytes，用来确定系统开始回收内存的阀值，控制系统的空闲内存。值越高，内核越早开始回收内存，空闲内存越高。设定这个参数时请小心，因为该值过低和过高都有问题。
    // min_free_kbytes 太低可防止系统重新利用内存。这可导致系统挂起并让 OOM 杀死多个进程。
    // 但将这个参数值设定太高（占系统总内存的 5-10%）会让您的系统很快会内存不足。Linux 的设计是使用所有可用 RAM 缓存文件系统数据。
    // 设定高 min_free_kbytes 值的结果是在该系统中花费太多时间重新利用内存。
    // 通知master进程对应的僵死进程
};
```

### 2.4 God模块如何使用ProcessContainer来管理业务进程?

在上面的God模块中,fork出来的worker进程并不是直接运行业务代码的入口文件,而是通过ProcessContainer.js来对业务代码的执行入口文件做进一步的封装.包括:日志打印、给master进程上报心跳,给Node运营平台下发命令,上报网络情况和流量情况到Node运营平台(暂且称特性监控)

ProgressContainer.js最后调用方法:

```js
require('module')._load(exec_script, null, true); // 执行业务代码的入口文件
```
