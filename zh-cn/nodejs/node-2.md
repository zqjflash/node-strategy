# 第二节 全局对象

## No.1 Node.js有哪些全局对象?

* 真正的全局对象:

  * Buffer
  * setInterval
  * setTimeout
  * clearInterval
  * clearTimeout
  * console
  * global
  * process

* 模块级别的全局对象:

  * __dirname
  * __filename
  * require()
  * module
  * exports

注:全局对象在使用的时候都不需要require

## No.2 process有哪些常用的方法?

process.stdin, process.stdout, process.stderr, process.on, process.env,
process.argv: 返回一个数组,由命令行执行脚本时的各个参数组成;
process.arch: 返回一个表示操作系统CPU架构的字符串;
process.platform: 标识Node.js进程运行其上的操作系统平台;
process.exit: 退出当前进程,接受一个参数,如果参数大于0,表示执行失败;如果等于0,表示执行成功;
