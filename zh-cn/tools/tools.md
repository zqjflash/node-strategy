# 第一节 构建与代码工具

## No.1 用什么工具保证一致的代码风格?为什么要这样?

Eslint, jsLint, JSCS这些工具可以帮助我们保证一致的代码风格,这个在团队协作时是非常重要的.这样团队成员才可以更快地修改代码,而不是每次去适应新的风格.

## No.2 什么是Stub?举例说明

桩代码(stub)就是在某些组件或模块中,模拟某些功能的代码,桩代码(stub)的作用是占位,让代码在测试过程中顺利运行.
示例代码,它实际的作用是写一个文件,但是这段代码并没有真正的做这件事:

```js
const fs = require("fs");
const writeFileStub = sinon.stub(fs, "writeFile", (path, data, cb) => {
    return cb(null);
});
expect(writeFileStub).to.be.called;
writeFileStub.restore();
```

## No.3 使用NPM包有哪些好处?

通过NPM,你可以安装和管理项目的依赖,并且能够指明依赖项的具体版本号,对于Node应用开发而言,你可以通过package.json文件来管理项目信息,配置脚本,以及指明项目依赖的具体版本.

## No.4 Yarn vs npm的特性差异

* 差异一:版本控制

yarn自带yarn.lock锁定文件记录,被确切安装上的模块的版本号;
npm需要开发者执行npm shrinkwrap命令生成npm-shrinkwrap.json文件;

* 差异二:并行安装

npm按照队列执行每个package串行执行;
yarn是同时执行所有任务,提高了性能;

## No.5 LiteHttp有哪些优点?

* 单线程:所有的方法都基于一个线程,绝不会跨线程;
* 灵活的架构:可以轻松的替换json自动化库;
* 轻量级:微小的开销;
* 多文件上传: 不需要额外的类库支持;
* 自动重定向:基于一定的次数,不会造成死循环;
* 禁用一种或多种网络:比如2G或3G.

